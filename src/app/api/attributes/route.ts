import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Handle GET request
export async function GET() {
  try {
    const attributes = await prisma.attribute.findMany();
    return NextResponse.json(attributes);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch attributes' },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, type } = body;

    const attribute = await prisma.attribute.create({
      data: { name, type },
    });

    return NextResponse.json(attribute);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create attribute' },
      { status: 500 }
    );
  }
}
