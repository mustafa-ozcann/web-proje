import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';
import prisma from '../../../../lib/prisma';

// Bekleyen blog yazılarını getir
export async function GET(request) {
    try {
        const session = await getServerSession(options);
        
        // Admin kontrolü
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'PENDING';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where: {
                    status: status
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.post.count({
                where: {
                    status: status
                }
            })
        ]);

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Blog listesi getirme hatası:', error);
        return NextResponse.json({ error: 'Blog yazıları yüklenirken bir hata oluştu' }, { status: 500 });
    }
}

// Blog durumunu güncelle (onay/red)
export async function PUT(request) {
    try {
        const session = await getServerSession(options);
        
        // Admin kontrolü
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const { postId, status } = await request.json();

        if (!postId || !status) {
            return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 });
        }

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 });
        }

        const updatedPost = await prisma.post.update({
            where: { id: postId },
            data: { status },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        return NextResponse.json(updatedPost);
    } catch (error) {
        console.error('Blog güncelleme hatası:', error);
        return NextResponse.json({ error: 'Blog yazısı güncellenirken bir hata oluştu' }, { status: 500 });
    }
}
