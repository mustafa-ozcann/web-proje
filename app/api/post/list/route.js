import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'APPROVED';
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 10;
        const skip = (page - 1) * limit;

        // Önce veritabanı bağlantısını test edelim
        await prisma.$connect();

        const posts = await prisma.post.findMany({
            where: {
                status: status,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip,
            take: limit,
        });

        const total = await prisma.post.count({
            where: {
                status: status,
            },
        });

        // İşlem bittikten sonra bağlantıyı kapat
        await prisma.$disconnect();

        return NextResponse.json({
            posts,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Blog listeleme hatası:', error);

        // Prisma bağlantısını kapatmayı dene
        try {
            await prisma.$disconnect();
        } catch (e) {
            console.error('Prisma bağlantısı kapatılırken hata:', e);
        }

        return NextResponse.json({
            error: 'Blog yazıları yüklenirken bir hata oluştu',
            details: error.message
        }, { status: 500 });
    }
}
