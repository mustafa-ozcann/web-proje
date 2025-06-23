import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '../../auth/[...nextauth]/options';

const prisma = new PrismaClient();

// Tüm kullanıcıları getir
export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Session kontrolü 
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
        }

        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Kullanıcı listesi getirme hatası:', error);
        return NextResponse.json({ error: 'Kullanıcılar yüklenirken bir hata oluştu' }, { status: 500 });
    }
}

// Kullanıcı rolünü güncelle
export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Session kontrolü 
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
        }

        const { userId, newRole } = await request.json();

        if (!userId || !newRole) {
            return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 });
        }

        // Admin kendi rolünü değiştirmeye çalışıyorsa engelle
        if (userId === session.user.id) {
            return NextResponse.json({ error: 'Kendi rolünüzü değiştiremezsiniz' }, { status: 403 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role: newRole },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Kullanıcı güncelleme hatası:', error);
        return NextResponse.json({ error: 'Kullanıcı güncellenirken bir hata oluştu' }, { status: 500 });
    }
}

// Kullanıcı silme
export async function DELETE(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Session kontrolü 
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        if (!userId) {
            return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
        }

        // Admin kendini silmeye çalışıyorsa engelle
        if (userId === session.user.id) {
            return NextResponse.json({ error: 'Kendi hesabınızı silemezsiniz' }, { status: 403 });
        }

        await prisma.user.delete({
            where: { id: userId }
        });

        return NextResponse.json({ message: 'Kullanıcı başarıyla silindi' });
    } catch (error) {
        console.error('Kullanıcı silme hatası:', error);
        return NextResponse.json({ error: 'Kullanıcı silinirken bir hata oluştu' }, { status: 500 });
    }
}
