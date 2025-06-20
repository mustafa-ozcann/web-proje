import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma';

// Kategorileri listele (herkese açık)
export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: {
                name: 'asc'
            },
            include: {
                _count: {
                    select: {
                        posts: {
                            where: {
                                status: 'APPROVED',
                                published: true
                            }
                        }
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