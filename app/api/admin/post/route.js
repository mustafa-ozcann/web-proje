import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '../../auth/[...nextauth]/options';
import prisma from '../../../../lib/prisma';

// Bekleyen blog yazılarını getir
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Session kontrolü 
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'ALL';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Where koşulunu oluştur
        const where = status === 'ALL' ? {} : { status: status };

        const [posts, total] = await Promise.all([
            prisma.post.findMany({
                where,
                include: {
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true
                        }
                    },
                    category: {
                        select: {
                            id: true,
                            name: true
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
                where
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
        const session = await getServerSession(authOptions);
        
        // Session kontrolü 
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
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

// Blog onayı hatası
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Session kontrolü
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
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
        console.error('Blog onayı hatası:', error);
        return NextResponse.json({ error: 'Bir hata oluştu' }, { status: 500 });
    }
}

// Blog yazısını sil
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Session kontrolü 
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
        }

        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: 'Blog ID gerekli' }, { status: 400 });
        }

        // Blog yazısının var olup olmadığını kontrol et
        const existingPost = await prisma.post.findUnique({
            where: { id: postId }
        });

        if (!existingPost) {
            return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
        }

        // Blog yazısını sil
        await prisma.post.delete({
            where: { id: postId }
        });

        return NextResponse.json({ message: 'Blog yazısı başarıyla silindi' });
    } catch (error) {
        console.error('Blog silme hatası:', error);
        return NextResponse.json({ error: 'Blog silinirken bir hata oluştu' }, { status: 500 });
    }
}
