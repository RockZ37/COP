import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        startTime: 'asc',
      },
    });
    
    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.startTime || !data.type) {
      return NextResponse.json(
        { error: 'Title, start time, and type are required' },
        { status: 400 }
      );
    }
    
    // Create new event
    const event = await prisma.event.create({
      data: {
        title: data.title,
        description: data.description || null,
        startTime: new Date(data.startTime),
        endTime: data.endTime ? new Date(data.endTime) : null,
        location: data.location || null,
        type: data.type,
        isRecurring: data.isRecurring === 'true' || data.isRecurring === true,
        recurringPattern: data.recurringPattern !== 'none' ? data.recurringPattern : null,
      },
    });
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
