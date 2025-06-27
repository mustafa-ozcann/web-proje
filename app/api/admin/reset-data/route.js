import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options as authOptions } from '@/app/api/auth/[...nextauth]/options';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Bu işlem için admin yetkisi gerekli' }, { status: 403 });
        }

        // Seed.js'deki kullanıcıların email'leri
        const seedUserEmails = ['admin@example.com', 'test@example.com'];

        // Seed kullanıcılarının ID'lerini al
        const seedUsers = await prisma.user.findMany({
            where: {
                email: {
                    in: seedUserEmails
                }
            },
            select: {
                id: true
            }
        });

        const seedUserIds = seedUsers.map(user => user.id);

        // Transaction ile tüm verileri sıfırla
        await prisma.$transaction(async (tx) => {
            // Mesajları sil
            await tx.message.deleteMany({});

            // Blog yazılarını sil (seed kullanıcıları dışındaki)
            await tx.post.deleteMany({
                where: {
                    authorId: {
                        notIn: seedUserIds
                    }
                }
            });

            // Seed kullanıcıları dışındaki kullanıcıları sil
            await tx.user.deleteMany({
                where: {
                    id: {
                        notIn: seedUserIds
                    }
                }
            });

            // Kategoriler dışındaki tüm veriler silindiği için kategorileri koruyabilirz
            // Eğer kategorileri de sıfırlamak istiyorsanız:
            // await tx.category.deleteMany({});
            
            console.log('Veriler başarıyla sıfırlandı');
        });

        return NextResponse.json({ 
            success: true, 
            message: 'Veriler başarıyla sıfırlandı. Seed kullanıcıları ve kategoriler korundu.' 
        });

    } catch (error) {
        console.error('Veri sıfırlama hatası:', error);
        return NextResponse.json(
            { error: 'Veriler sıfırlanırken bir hata oluştu: ' + error.message },
            { status: 500 }
        );
    }
} 