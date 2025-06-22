import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '../../auth/[...nextauth]/options';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session) {
            return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
        }

        const body = await request.json();
        const { title, content, imageUrl, categoryId } = body;

        if (!title || !content || !categoryId) {
            return NextResponse.json({ error: 'Başlık, içerik ve kategori zorunludur' }, { status: 400 });
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                imageUrl: imageUrl || null,
                authorId: session.user.id,
                status: 'PENDING',
                categoryId: categoryId,
            },
        });

        return NextResponse.json({
            message: 'Blog yazısı başarıyla oluşturuldu',
            post
        });
    } catch (error) {
        console.error('Blog oluşturma hatası:', error);
        return NextResponse.json({ 
            error: 'Blog oluşturulurken bir hata oluştu'
        }, { status: 500 });
    }
}
