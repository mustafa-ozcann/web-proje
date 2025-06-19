import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kategorileri listele
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            );
        }

        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        });

        return NextResponse.json({ categories });
    } catch (error) {
        console.error('Kategori listesi hatası:', error);
        return NextResponse.json(
            { error: 'Kategoriler yüklenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}

// Yeni kategori oluştur
export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            );
        }

        const { name } = await request.json();

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Kategori adı gerekli' },
                { status: 400 }
            );
        }

        // Aynı isimde kategori var mı kontrol et
        const existingCategory = await prisma.category.findUnique({
            where: { name: name.trim() }
        });

        if (existingCategory) {
            return NextResponse.json(
                { error: 'Bu kategori zaten mevcut' },
                { status: 400 }
            );
        }

        const category = await prisma.category.create({
            data: {
                name: name.trim()
            }
        });

        return NextResponse.json({ category }, { status: 201 });
    } catch (error) {
        console.error('Kategori oluşturma hatası:', error);
        return NextResponse.json(
            { error: 'Kategori oluşturulurken bir hata oluştu' },
            { status: 500 }
        );
    }
} 