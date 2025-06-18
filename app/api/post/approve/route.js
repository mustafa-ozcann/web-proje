import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        // Admin kontrolü
        const userCookie = cookies().get('user');
        if (!userCookie) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const user = JSON.parse(userCookie.value);
        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Bu işlem için yetkiniz yok' }, { status: 403 });
        }

        const body = await request.json();
        const { postId, status } = body;

        if (!postId || !status) {
            return NextResponse.json({ error: 'Post ID ve durum zorunludur' }, { status: 400 });
        }

        if (!['APPROVED', 'REJECTED'].includes(status)) {
            return NextResponse.json({ error: 'Geçersiz durum' }, { status: 400 });
        }

        const post = await prisma.post.update({
            where: {
                id: postId,
            },
            data: {
                status,
            },
        });

        return NextResponse.json({
            message: `Blog yazısı ${status === 'APPROVED' ? 'onaylandı' : 'reddedildi'}`,
            post
        });
    } catch (error) {
        console.error('Blog onaylama hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
