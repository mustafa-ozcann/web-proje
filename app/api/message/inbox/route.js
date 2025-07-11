import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '../../../../lib/prisma';

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        // Belirli bir kullanıcıyla olan mesajları getir
        if (userId) {
            const messages = await prisma.message.findMany({
                where: {
                    OR: [
                        {
                            senderId: session.user.id,
                            recipientId: userId
                        },
                        {
                            senderId: userId,
                            recipientId: session.user.id
                        }
                    ]
                },
                orderBy: {
                    createdAt: 'asc'
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

            return NextResponse.json({ messages });
        }

        // Tüm konuşmaları getir
        const sentMessages = await prisma.message.findMany({
            where: {
                senderId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                recipient: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        const receivedMessages = await prisma.message.findMany({
            where: {
                recipientId: session.user.id
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Konuşmaları birleştir ve düzenle
        const conversationMap = new Map();

        // Gönderilen mesajlardan konuşmaları oluştur/güncelle
        sentMessages.forEach(message => {
            const userId = message.recipientId;
            const existing = conversationMap.get(userId);
            if (!existing || existing.lastMessage.createdAt < message.createdAt) {
                conversationMap.set(userId, {
                    user: message.recipient,
                    lastMessage: message
                });
            }
        });

        // Alınan mesajlardan konuşmaları oluştur/güncelle
        receivedMessages.forEach(message => {
            const userId = message.senderId;
            const existing = conversationMap.get(userId);
            if (!existing || existing.lastMessage.createdAt < message.createdAt) {
                conversationMap.set(userId, {
                    user: message.sender,
                    lastMessage: message
                });
            }
        });

        // Map'i diziye çevir ve son mesaj tarihine göre sırala
        const conversations = Array.from(conversationMap.values())
            .sort((a, b) => b.lastMessage.createdAt.getTime() - a.lastMessage.createdAt.getTime());

        return NextResponse.json({ conversations });
    } catch (error) {
        console.error('Mesaj listesi getirme hatası:', error);
        return NextResponse.json({ error: 'Mesajlar alınamadı' }, { status: 500 });
    }
}
