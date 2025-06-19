import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

// Prisma istemcisini global olarak oluştur
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function GET(request, { params }) {
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: params.id,
                status: 'APPROVED',
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        bio: true,
                        _count: {
                            select: {
                                posts: true
                            }
                        }
                    },
                },
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({ post });
    } catch (error) {
        console.error('Blog detay hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
} 