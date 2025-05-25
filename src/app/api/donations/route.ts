import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        member: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
    
    return NextResponse.json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.amount || !data.date || !data.type) {
      return NextResponse.json(
        { error: 'Amount, date, and type are required' },
        { status: 400 }
      );
    }
    
    // Create new donation
    const donation = await prisma.donation.create({
      data: {
        amount: parseFloat(data.amount),
        date: new Date(data.date),
        type: data.type,
        notes: data.notes || null,
        memberId: data.memberId !== 'anonymous' ? data.memberId : null,
      },
    });
    
    return NextResponse.json(donation, { status: 201 });
  } catch (error) {
    console.error('Error creating donation:', error);
    return NextResponse.json(
      { error: 'Failed to create donation' },
      { status: 500 }
    );
  }
}
