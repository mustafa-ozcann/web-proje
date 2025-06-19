import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { options } from '@/app/api/auth/[...nextauth]/options';
import bcryptjs from 'bcryptjs';
import prisma from '../../../../lib/prisma';

// Kullanıcı bilgilerini getir
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('id');

        // Eğer ID parametresi yoksa, session'dan kendi ID'yi al
        if (!userId) {
            const session = await getServerSession(options);
            
            if (!session) {
                return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 });
            }

            // Kendi profil bilgilerini getir
            const user = await prisma.user.findUnique({
                where: {
                    id: session.user.id,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    bio: true,
                    createdAt: true,
                    updatedAt: true,
                    role: true,
                },
            });

            if (!user) {
                return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
            }

            return NextResponse.json(user);
        }

        // ID parametresi varsa, o kullanıcının profil bilgilerini getir (herkese açık)
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
                role: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        return NextResponse.json({
            user,
            success: true,
        });
    } catch (error) {
        console.error('User profile API Error:', error);
        return NextResponse.json(
            { 
                error: error.message, 
                success: false 
            },
            { status: 500 }
        );
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
