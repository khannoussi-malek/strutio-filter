import { NextResponse } from 'next/server';
import {
  buildPrismaQuery,
  deserializeFilter,
} from '../../../utils/filterUtils';
import prisma from '../../../lib/prisma';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const filter = searchParams.get('filter');

  try {
    const filterGroup = filter ? deserializeFilter(filter) : null;
    const builds = await prisma.build.findMany({
      where: filterGroup ? buildPrismaQuery(filterGroup) : undefined,
      include: {
        attributes: {
          include: {
            attribute: true,
          },
        },
      },
    });

    return NextResponse.json(builds);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch builds' },
      { status: 500 }
    );
  }
}

export async function POST(req:Request) {
  try {
    const body = await req.json();
    const { name, description, attributes } = body;

    if (!name || !Array.isArray(attributes)) {
      return new Response(
        JSON.stringify({
          error: '"name" and "attributes" are required.',
        }),
        { status: 400 }
      );
    }

    const newBuild = await prisma.build.create({
      data: {
        name,
        description: description || '',
        attributes: {
          create: attributes.map((attr) => ({
            attributeId: attr.attributeId,
            value: attr.value,
          })),
        },
      },
      include: {
        attributes: true,
      },
    });

    return new Response(JSON.stringify(newBuild), { status: 201 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while creating the build.',
      }),
      { status: 500 }
    );
  }
}
