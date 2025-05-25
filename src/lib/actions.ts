'use server';

import { revalidatePath } from 'next/cache';
import prisma from '@/lib/db';
import { sendWelcomeEmail, sendDonationReceipt } from '@/lib/email';

// Member actions
export async function createMember(formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const joinDate = formData.get('joinDate') as string;
    const role = formData.get('role') as string;

    // Validate required fields
    if (!name || !email) {
      return { error: 'Name and email are required' };
    }

    // Check if email already exists
    const existingMember = await prisma.member.findUnique({
      where: { email },
    });

    if (existingMember) {
      return { error: 'A member with this email already exists' };
    }

    // Create new member
    const member = await prisma.member.create({
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        joinDate: joinDate ? new Date(joinDate) : new Date(),
        role: role || 'member',
      },
    });

    // Send welcome email
    await sendWelcomeEmail(name, email);

    revalidatePath('/members');
    return { success: true, member };
  } catch (error) {
    console.error('Error creating member:', error);
    return { error: 'Failed to create member' };
  }
}

export async function updateMember(id: string, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;
    const dateOfBirth = formData.get('dateOfBirth') as string;
    const joinDate = formData.get('joinDate') as string;
    const role = formData.get('role') as string;
    const isActive = formData.get('isActive') as string;

    // Validate required fields
    if (!name || !email) {
      return { error: 'Name and email are required' };
    }

    // Check if email already exists for another member
    const existingMember = await prisma.member.findUnique({
      where: { email },
    });

    if (existingMember && existingMember.id !== id) {
      return { error: 'A member with this email already exists' };
    }

    // Update member
    const member = await prisma.member.update({
      where: { id },
      data: {
        name,
        email,
        phone: phone || null,
        address: address || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        joinDate: joinDate ? new Date(joinDate) : new Date(),
        role: role || 'member',
        isActive: isActive === 'true',
      },
    });

    revalidatePath(`/members/${id}`);
    revalidatePath('/members');
    return { success: true, member };
  } catch (error) {
    console.error('Error updating member:', error);
    return { error: 'Failed to update member' };
  }
}

// Event actions
export async function createEvent(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const startTime = formData.get('startTime') as string;
    const endTime = formData.get('endTime') as string;
    const location = formData.get('location') as string;
    const type = formData.get('type') as string;
    const isRecurring = formData.get('isRecurring') as string;
    const recurringPattern = formData.get('recurringPattern') as string;

    // Validate required fields
    if (!title || !startTime || !type) {
      return { error: 'Title, start time, and type are required' };
    }

    // Create new event
    const event = await prisma.event.create({
      data: {
        title,
        description: description || null,
        startTime: new Date(startTime),
        endTime: endTime ? new Date(endTime) : null,
        location: location || null,
        type,
        isRecurring: isRecurring === 'true',
        recurringPattern: recurringPattern !== 'none' ? recurringPattern : null,
      },
    });

    revalidatePath('/events');
    revalidatePath('/calendar');
    return { success: true, event };
  } catch (error) {
    console.error('Error creating event:', error);
    return { error: 'Failed to create event' };
  }
}

// Donation actions
export async function createDonation(formData: FormData) {
  try {
    const amount = formData.get('amount') as string;
    const date = formData.get('date') as string;
    const type = formData.get('type') as string;
    const memberId = formData.get('memberId') as string;
    const notes = formData.get('notes') as string;

    // Validate required fields
    if (!amount || !date || !type) {
      return { error: 'Amount, date, and type are required' };
    }

    // Create new donation
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(amount),
        date: new Date(date),
        type,
        notes: notes || null,
        memberId: memberId !== 'anonymous' ? memberId : null,
      },
    });

    // Send receipt if member is specified
    if (memberId && memberId !== 'anonymous') {
      const member = await prisma.member.findUnique({
        where: { id: memberId },
      });

      if (member) {
        await sendDonationReceipt(
          member.name,
          member.email,
          parseFloat(amount),
          type,
          new Date(date)
        );
      }
    }

    revalidatePath('/donations');
    return { success: true, donation };
  } catch (error) {
    console.error('Error creating donation:', error);
    return { error: 'Failed to create donation' };
  }
}

// Attendance actions
export async function recordAttendance(formData: FormData) {
  try {
    const date = formData.get('date') as string;
    const serviceType = formData.get('serviceType') as string;
    const memberIds = formData.getAll('memberIds') as string[];

    // Validate required fields
    if (!date || !serviceType || !memberIds.length) {
      return { error: 'Date, service type, and at least one member are required' };
    }

    // Create attendance records for each member
    const attendanceDate = new Date(date);
    const attendanceRecords = await Promise.all(
      memberIds.map(async (memberId) => {
        // Check if record already exists
        const existingRecord = await prisma.attendance.findFirst({
          where: {
            memberId,
            date: attendanceDate,
            serviceType,
          },
        });

        if (existingRecord) {
          return existingRecord;
        }

        // Create new record
        return prisma.attendance.create({
          data: {
            memberId,
            date: attendanceDate,
            serviceType,
          },
        });
      })
    );

    revalidatePath('/attendance');
    return { success: true, count: attendanceRecords.length };
  } catch (error) {
    console.error('Error recording attendance:', error);
    return { error: 'Failed to record attendance' };
  }
}

// Announcement actions
export async function createAnnouncement(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;
    const startDate = formData.get('startDate') as string;
    const endDate = formData.get('endDate') as string;
    const isPublished = formData.get('isPublished') as string;

    // Validate required fields
    if (!title || !content || !startDate) {
      return { error: 'Title, content, and start date are required' };
    }

    // Create new announcement
    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isPublished: isPublished === 'true',
      },
    });

    revalidatePath('/announcements');
    revalidatePath('/');
    return { success: true, announcement };
  } catch (error) {
    console.error('Error creating announcement:', error);
    return { error: 'Failed to create announcement' };
  }
}
