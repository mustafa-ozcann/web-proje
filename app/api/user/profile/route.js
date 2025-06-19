import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import bcryptjs from 'bcryptjs';

// Prisma istemcisini global olarak oluştur
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Kullanıcı bilgilerini getir
export async function GET(request) {
    try {
        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                role: true,
                _count: {
                    select: {
                        posts: true
                    }
                }
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error('Profil bilgileri getirme hatası:', error);
        return NextResponse.json({ error: 'Profil bilgileri alınırken bir hata oluştu' }, { status: 500 });
    }
}

// Kullanıcı bilgilerini güncelle
export async function PUT(request) {
    try {
        const session = await getServerSession(options);

        if (!session) {
            return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
        }

        const data = await request.json();
        const { name, email, currentPassword, newPassword, bio } = data;

        // Kullanıcıyı kontrol et
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                email: true,
                password: true
            }
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        // Email değişikliği varsa, yeni email'in başka bir kullanıcı tarafından kullanılmadığından emin ol
        if (email !== user.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser) {
                return NextResponse.json({ error: 'Bu e-posta adresi zaten kullanımda' }, { status: 400 });
            }
        }

        // Güncellenecek verileri hazırla
        const updateData = {
            name,
            email,
            bio: bio || null
        };

        // Şifre değişikliği varsa kontrol et ve güncelle
        if (currentPassword && newPassword) {
            const isPasswordValid = await bcryptjs.compare(currentPassword, user.password);

            if (!isPasswordValid) {
                return NextResponse.json({ error: 'Mevcut şifre hatalı' }, { status: 400 });
            }

            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            updateData.password = hashedPassword;
        }

        // Kullanıcıyı güncelle
        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                role: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Profil güncelleme hatası:', error);
        return NextResponse.json({ error: 'Profil güncellenirken bir hata oluştu' }, { status: 500 });
    }
}
