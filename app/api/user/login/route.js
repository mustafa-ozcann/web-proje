// app/api/user/login/route.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: 'E-posta ve şifre zorunludur' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Şifre hatalı' }, { status: 401 });
        }

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
            sameSite: 'lax'
        });

        return response;
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
