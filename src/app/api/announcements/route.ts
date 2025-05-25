import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: {
        startDate: 'desc',
      },
      where: {
        isPublished: true,
        OR: [
          { endDate: null },
          { endDate: { gte: new Date() } },
        ],
      },
    });
    
    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.content || !data.startDate) {
      return NextResponse.json(
        { error: 'Title, content, and start date are required' },
        { status: 400 }
      );
    }
    
    // Create new announcement
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        content: data.content,
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        isPublished: data.isPublished === 'true' || data.isPublished === true,
      },
    });
    
    return NextResponse.json(announcement, { status: 201 });
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
      { status: 500 }
    );
  }
}
