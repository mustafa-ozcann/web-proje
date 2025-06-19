import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '../../auth/[...nextauth]/options';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const session = await getServerSession(options);
        
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

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
                authorId: session.user.id,
                status: 'PENDING', // PENDING, APPROVED, REJECTED
            },
        });

        return NextResponse.json({
            message: 'Blog yazısı başarıyla oluşturuldu',
            post
        });
    } catch (error) {
        console.error('Blog oluşturma hatası:', error);
        return NextResponse.json({ error: 'Blog oluşturulurken bir hata oluştu' }, { status: 500 });
    }
}
