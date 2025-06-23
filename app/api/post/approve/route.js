import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '../../auth/[...nextauth]/options';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        // Session kontrolü 
        if (!session) {
            return NextResponse.json({ error: 'Oturum bulunamadı' }, { status: 401 });
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
