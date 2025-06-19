import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// PrismaClient singleton implementation
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'APPROVED';

        const posts = await prisma.post.findMany({
            where: {
                status: status,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Blog listeleme hatası:', error);

        return NextResponse.json({
            error: 'Blog yazıları yüklenirken bir hata oluştu',
            details: error.message
        }, { status: 500 });
    }
}
