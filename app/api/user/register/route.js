import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            return NextResponse.json({ error: 'Bu email ile kayıtlı bir kullanıcı var' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });

        const userData = {
            id: user.id,
            name: user.name,
            role: user.role,
        };

        // Set the user cookie after registration
        cookies().set('user', encodeURIComponent(JSON.stringify(userData)), {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return NextResponse.json({
            message: 'Kayıt başarılı',
            user: {
                ...userData,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
    }
}
