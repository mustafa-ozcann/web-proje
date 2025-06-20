import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '../../../../lib/prisma';

export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        console.log('Kayıt isteği alındı:', { name, email });

        if (!name || !email || !password) {
            console.log('Eksik alanlar:', { name: !!name, email: !!email, password: !!password });
            return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ 
            where: { 
                email: email.toLowerCase() 
            } 
        });

        if (existingUser) {
            console.log('Mevcut kullanıcı bulundu:', email);
            return NextResponse.json({ error: 'Bu email ile kayıtlı bir kullanıcı var' }, { status: 409 });
        }

        const hashedPassword = await bcryptjs.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email: email.toLowerCase(),
                password: hashedPassword,
                role: 'USER',
            },
        });

        console.log('Kullanıcı oluşturuldu:', user.id);

        const userData = {
            id: user.id,
            name: user.name,
            role: user.role,
        };

        // Set the user cookie after registration
        cookies().set('user', encodeURIComponent(JSON.stringify(userData)), {
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            httpOnly: true
        });

        return NextResponse.json({
            message: 'Kayıt başarılı',
            user: {
                ...userData,
                email: user.email,
            }
        });
    } catch (error) {
        console.error('Kayıt hatası:', error.message);
        console.error('Hata detayı:', error.stack);
        return NextResponse.json({ 
            error: 'Sunucu hatası',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, { status: 500 });
    }
}
