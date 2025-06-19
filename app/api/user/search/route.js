import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    console.log('Search API called with query:', q);

    if (!q || q.trim() === '') {
      return NextResponse.json({ users: [], success: true });
    }

    // SQLite için case-insensitive arama - raw SQL kullanıyoruz
    const searchTerm = `%${q.toLowerCase()}%`;
    
    const users = await prisma.$queryRaw`
      SELECT id, name, email 
      FROM User 
      WHERE (LOWER(name) LIKE ${searchTerm} OR LOWER(email) LIKE ${searchTerm})
      AND name IS NOT NULL
      LIMIT 10
    `;

    console.log('Search results:', users);

    return NextResponse.json({
      users,
      success: true,
      count: users.length,
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { 
        error: error.message, 
        users: [], 
        success: false 
      },
      { status: 500 }
    );
  }
} 