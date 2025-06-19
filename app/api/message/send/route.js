import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';

// Prisma istemcisini global olarak oluştur
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export async function POST(request) {
    try {
        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const { recipientId, content } = await request.json();

        if (!recipientId || !content) {
            return NextResponse.json({ error: 'Eksik parametreler' }, { status: 400 });
        }

        // Alıcının var olduğunu kontrol et
        const recipient = await prisma.user.findUnique({
            where: { id: recipientId }
        });

        if (!recipient) {
            return NextResponse.json({ error: 'Alıcı bulunamadı' }, { status: 404 });
        }

        // Kendine mesaj göndermeyi engelle
        if (recipientId === session.user.id) {
            return NextResponse.json({ error: 'Kendinize mesaj gönderemezsiniz' }, { status: 400 });
        }

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

        return NextResponse.json({ message });
    } catch (error) {
        console.error('Mesaj gönderme hatası:', error);
        return NextResponse.json({ error: 'Mesaj gönderilemedi' }, { status: 500 });
    }
}
