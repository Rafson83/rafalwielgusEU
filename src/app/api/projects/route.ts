import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/projects - pobierz listę projektów
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST /api/projects - dodaj nowy projekt
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, link, techStack, imageUrl } = body;

    if (!name || !description || !techStack) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        name,
        description,
        link,
        techStack,
        imageUrl,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
