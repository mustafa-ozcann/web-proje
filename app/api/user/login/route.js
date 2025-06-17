// app/api/user/login/route.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function POST(request) {
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

    // Oturum bilgisini (örneğin: kullanıcıyı frontend'de session olarak saklayacaksan)
    // response ile birlikte dönüyoruz
    return NextResponse.json({
        message: 'Giriş başarılı',
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });


}
cookies().set('user', encodeURIComponent(JSON.stringify({
    id: user.id,
    name: user.name,
    role: user.role,
})), { path: '/' });

return NextResponse.json({
    message: 'Giriş başarılı',
    user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    },
});
