import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        // Kullanıcı kontrolü
        const userCookie = cookies().get('user');
        if (!userCookie) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const user = JSON.parse(userCookie.value);
        const body = await request.json();
        const { title, content, imageUrl } = body;

        if (!title || !content) {
            return NextResponse.json({ error: 'Başlık ve içerik zorunludur' }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl,
                authorId: user.id,
                status: 'PENDING', // PENDING, APPROVED, REJECTED
            },
        });

        return NextResponse.json({
            message: 'Blog yazısı başarıyla oluşturuldu',
            post
        });
    } catch (error) {
        console.error('Blog oluşturma hatası:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
