import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(request, { params }) {
    try {
        // Next.js 15'te params await edilmeli
        const { id } = await params;
        
        const post = await prisma.post.findUnique({
            where: {
                id: id,
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