// app/api/user/login/route.js
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        console.log('Giriş isteği alındı:', { email });

        if (!email || !password) {
            console.log('Eksik alanlar:', { email: !!email, password: !!password });
            return NextResponse.json({ error: 'E-posta ve şifre zorunludur' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ 
            where: { 
                email: email.toLowerCase() 
            } 
        });

        if (!user) {
            console.log('Kullanıcı bulunamadı:', email);
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        console.log('Kullanıcı bulundu, şifre kontrolü yapılıyor');
        const isValid = await bcryptjs.compare(password, user.password);

        if (!isValid) {
            console.log('Şifre hatalı');
            return NextResponse.json({ error: 'Şifre hatalı' }, { status: 401 });
        }

        console.log('Giriş başarılı:', user.id);

        const userData = {
            id: user.id,
            name: user.name,
            role: user.role,
        };

        // Set the user cookie with proper encoding
        const response = NextResponse.json({
            message: 'Giriş başarılı',
            user: {
                ...userData,
                email: user.email,
            },
        });

        response.cookies.set('user', JSON.stringify(userData), {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            httpOnly: true
        });

        return response;
    } catch (error) {
        console.error('Giriş hatası:', error.message);
        console.error('Hata detayı:', error.stack);
        return NextResponse.json({ 
            error: 'Sunucu hatası',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, { status: 500 });
    }
}
