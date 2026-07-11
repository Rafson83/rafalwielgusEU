import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { RowDataPacket } from 'mysql2';

// GET /api/projects - pobierz listę projektów
export async function GET() {
  try {
    // Automatycznie sprawdzamy i tworzymy tabelę projects, jeśli nie istnieje
    await db.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        link VARCHAR(255),
        techStack VARCHAR(255) NOT NULL,
        imageUrl VARCHAR(255),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    const [rows] = await db.query<RowDataPacket[]>('SELECT * FROM projects ORDER BY createdAt DESC');
    return NextResponse.json(rows);
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

    await db.query(
      'INSERT INTO projects (name, description, link, techStack, imageUrl) VALUES (?, ?, ?, ?, ?)',
      [name, description, link || null, techStack, imageUrl || null]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
