import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const categoryId = searchParams.get('categoryId');
        const authorId = searchParams.get('authorId');
        const userId = searchParams.get('userId');
        const status = searchParams.get('status');

        // Filtre koşullarını oluştur
        const where = {};
        
        if (categoryId) {
            where.categoryId = categoryId;
        }
        
        if (authorId) {
            where.authorId = authorId;
        }
        
        if (userId) {
            where.authorId = userId;
        }
        
        if (status) {
            where.status = status;
        } else {
            // Varsayılan olarak sadece onaylanmış blogları göster
            where.status = 'APPROVED';
        }

        const posts = await prisma.post.findMany({
            where,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                category: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        return NextResponse.json({ posts });
    } catch (error) {
        console.error('Blog listeleme hatası:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
