import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const { recipientId, content } = await request.json();

        console.log('Mesaj gönderme isteği:', {
            senderId: session.user.id,
            recipientId,
            content: content?.substring(0, 50) + '...'
        });

        if (!recipientId || !content) {
            return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 });
        }

        // Gönderici kullanıcısının var olduğunu kontrol et
        const sender = await prisma.user.findUnique({
            where: { id: session.user.id }
        });

        if (!sender) {
            console.error('Gönderici bulunamadı:', session.user.id);
            return NextResponse.json({ 
                error: 'Oturum bilgileriniz güncel değil. Lütfen çıkış yapıp tekrar giriş yapın.',
                needRelogin: true 
            }, { status: 404 });
        }

        // Alıcının var olduğunu kontrol et
        const recipient = await prisma.user.findUnique({
            where: { id: recipientId }
        });

        if (!recipient) {
            console.error('Alıcı bulunamadı:', recipientId);
            return NextResponse.json({ error: 'Alıcı bulunamadı' }, { status: 404 });
        }

        // Kendine mesaj göndermeyi engelle
        if (recipientId === session.user.id) {
            return NextResponse.json({ error: 'Kendinize mesaj gönderemezsiniz' }, { status: 400 });
        }

        console.log('Kullanıcılar doğrulandı, mesaj oluşturuluyor...');

        // Mesajı oluştur
        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                recipientId
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        });

        console.log('Mesaj başarıyla oluşturuldu:', message.id);

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Mesaj gönderme hatası:', error);
        console.error('Hata detayları:', {
            code: error.code,
            meta: error.meta,
            message: error.message
        });
        return NextResponse.json({ error: 'Mesaj gönderilemedi: ' + error.message }, { status: 500 });
    }
}
