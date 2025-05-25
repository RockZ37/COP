import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const active = searchParams.get('active');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');

    // Build the query
    const query: any = {};

    // Filter by active status if specified
    if (active === 'true') {
      query.isActive = true;
    } else if (active === 'false') {
      query.isActive = false;
    }

    // Search by name or email if specified
    if (search) {
      query.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
      ];
    }

    // Get members
    const members = await prisma.member.findMany({
      where: query,
      orderBy: {
        name: 'asc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch members' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingMember = await prisma.member.findUnique({
      where: {
        email: data.email,
      },
    });

    if (existingMember) {
      return NextResponse.json(
        { error: 'A member with this email already exists' },
        { status: 400 }
      );
    }

    // Create new member
    const member = await prisma.member.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        address: data.address || null,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        joinDate: data.joinDate ? new Date(data.joinDate) : new Date(),
        role: data.role || 'member',
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Error creating member:', error);
    return NextResponse.json(
      { error: 'Failed to create member' },
      { status: 500 }
    );
  }
}
