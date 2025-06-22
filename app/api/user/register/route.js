import bcryptjs from 'bcryptjs';
import { NextResponse } from 'next/server'; 
import { cookies } from 'next/headers'; 
import prisma from '../../../../lib/prisma'; 


/**
 * @param {Request} request 
 * @returns {NextResponse} 
 */
export async function POST(request) {
    try {
        // İstek gövdesinden JSON verisini çıkar
        const body = await request.json();
        const { name, email, password } = body;

        console.log('Kayıt isteği alındı:', { name, email });

        if (!name || !email || !password) {
            console.log('Eksik alanlar:', { name: !!name, email: !!email, password: !!password });
            return NextResponse.json({ error: 'Tüm alanlar zorunludur' }, { status: 400 });
        }

        // Bu email ile daha önce kayıt olmuş kullanıcı var mı kontrol et
        const existingUser = await prisma.user.findUnique({ 
            where: { 
                email: email.toLowerCase()
            } 
        });

        // Eğer bu email ile kullanıcı varsa hata döndür
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

        // Kullanıcı bilgilerini HTTP cookie'sine kaydet (otomatik login için)
        cookies().set('user', encodeURIComponent(JSON.stringify(userData)), {
            path: '/', 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'lax', 
            httpOnly: true 
        });

        // Başarılı kayıt response'unu döndür
        return NextResponse.json({
            message: 'Kayıt başarılı',
            user: {
                ...userData,
                email: user.email,
            }
        });
    } catch (error) {
        // Herhangi bir hata durumunda logla ve generic error döndür
        console.error('Kayıt hatası:', error.message);
        console.error('Hata detayı:', error.stack);
        return NextResponse.json({ 
            error: 'Sunucu hatası',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        }, { status: 500 });
    }
}
