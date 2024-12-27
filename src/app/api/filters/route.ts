import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handle POST request
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, filter } = body;

    const savedFilter = await prisma.filter.create({
      data: {
        name,
        conditions: JSON.stringify(filter),
      },
    });

    return NextResponse.json(savedFilter);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to save filter' },
      { status: 500 }
    );
  }
}

// Handle GET request
export async function GET() {
  try {
    const filters = await prisma.filter.findMany();
    return NextResponse.json(filters);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch filters' },
      { status: 500 }
    );
  }
}
