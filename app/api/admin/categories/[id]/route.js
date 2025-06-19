import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kategoriyi güncelle
export async function PUT(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            );
        }

        const { id } = params;
        const { name } = await request.json();

        if (!name || name.trim() === '') {
            return NextResponse.json(
                { error: 'Kategori adı gerekli' },
                { status: 400 }
            );
        }

        // Kategori var mı kontrol et
        const existingCategory = await prisma.category.findUnique({
            where: { id }
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: 'Kategori bulunamadı' },
                { status: 404 }
            );
        }

        // Aynı isimde başka kategori var mı kontrol et
        const duplicateCategory = await prisma.category.findFirst({
            where: { 
                name: name.trim(),
                NOT: { id }
            }
        });

        if (duplicateCategory) {
            return NextResponse.json(
                { error: 'Bu kategori adı zaten kullanılıyor' },
                { status: 400 }
            );
        }

        const category = await prisma.category.update({
            where: { id },
            data: { name: name.trim() }
        });

        return NextResponse.json({ category });
    } catch (error) {
        console.error('Kategori güncelleme hatası:', error);
        return NextResponse.json(
            { error: 'Kategori güncellenirken bir hata oluştu' },
            { status: 500 }
        );
    }
}

// Kategoriyi sil
export async function DELETE(request, { params }) {
    try {
        const session = await getServerSession(authOptions);
        
        if (!session || session.user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Yetkisiz erişim' },
                { status: 401 }
            );
        }

        const { id } = params;

        // Kategori var mı kontrol et
        const existingCategory = await prisma.category.findUnique({
            where: { id },
            include: {
                posts: true
            }
        });

        if (!existingCategory) {
            return NextResponse.json(
                { error: 'Kategori bulunamadı' },
                { status: 404 }
            );
        }

        // Bu kategoriye ait blog yazısı var mı kontrol et
        if (existingCategory.posts.length > 0) {
            return NextResponse.json(
                { error: 'Bu kategoriye ait blog yazıları var, önce onları silin veya başka kategoriye taşıyın' },
                { status: 400 }
            );
        }

        await prisma.category.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Kategori başarıyla silindi' });
    } catch (error) {
        console.error('Kategori silme hatası:', error);
        return NextResponse.json(
            { error: 'Kategori silinirken bir hata oluştu' },
            { status: 500 }
        );
    }
} 