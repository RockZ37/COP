import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { 
  sendWelcomeEmail, 
  sendEventReminder, 
  sendDonationReceipt, 
  sendGroupAnnouncement 
} from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { type, ...params } = data;
    
    if (!type) {
      return NextResponse.json(
        { error: 'Email type is required' },
        { status: 400 }
      );
    }
    
    let result = false;
    
    switch (type) {
      case 'welcome': {
        // Send welcome email to a new member
        const { memberId } = params;
        
        if (!memberId) {
          return NextResponse.json(
            { error: 'Member ID is required' },
            { status: 400 }
          );
        }
        
        const member = await prisma.member.findUnique({
          where: { id: memberId },
        });
        
        if (!member) {
          return NextResponse.json(
            { error: 'Member not found' },
            { status: 404 }
          );
        }
        
        result = await sendWelcomeEmail(member.name, member.email);
        break;
      }
      
      case 'event_reminder': {
        // Send event reminder to attendees
        const { eventId } = params;
        
        if (!eventId) {
          return NextResponse.json(
            { error: 'Event ID is required' },
            { status: 400 }
          );
        }
        
        const event = await prisma.event.findUnique({
          where: { id: eventId },
          include: {
            attendees: {
              include: {
                member: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
        
        if (!event) {
          return NextResponse.json(
            { error: 'Event not found' },
            { status: 404 }
          );
        }
        
        const attendees = event.attendees.map(attendee => ({
          name: attendee.member.name,
          email: attendee.member.email,
        }));
        
        result = await sendEventReminder(
          event.title,
          event.startTime,
          event.location || 'TBD',
          attendees
        );
        break;
      }
      
      case 'donation_receipt': {
        // Send donation receipt
        const { donationId } = params;
        
        if (!donationId) {
          return NextResponse.json(
            { error: 'Donation ID is required' },
            { status: 400 }
          );
        }
        
        const donation = await prisma.donation.findUnique({
          where: { id: donationId },
          include: {
            member: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        });
        
        if (!donation) {
          return NextResponse.json(
            { error: 'Donation not found' },
            { status: 404 }
          );
        }
        
        if (!donation.member) {
          return NextResponse.json(
            { error: 'Donation has no associated member' },
            { status: 400 }
          );
        }
        
        result = await sendDonationReceipt(
          donation.member.name,
          donation.member.email,
          donation.amount,
          donation.type,
          donation.date
        );
        break;
      }
      
      case 'group_announcement': {
        // Send announcement to group members
        const { groupId, announcement } = params;
        
        if (!groupId || !announcement) {
          return NextResponse.json(
            { error: 'Group ID and announcement are required' },
            { status: 400 }
          );
        }
        
        const group = await prisma.group.findUnique({
          where: { id: groupId },
          include: {
            members: {
              include: {
                member: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        });
        
        if (!group) {
          return NextResponse.json(
            { error: 'Group not found' },
            { status: 404 }
          );
        }
        
        const members = group.members.map(membership => ({
          name: membership.member.name,
          email: membership.member.email,
        }));
        
        result = await sendGroupAnnouncement(
          group.name,
          announcement,
          members
        );
        break;
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        );
    }
    
    if (result) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
