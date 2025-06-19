import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

// Prisma istemcisini global olarak oluştur
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export const options = {
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Şifre", type: "password" }
            },
            async authorize(credentials, req) {
                try {
                    if (!credentials?.email || !credentials?.password) {
                        console.log('Credentials eksik:', { email: !!credentials?.email, password: !!credentials?.password });
                        return null;
                    }

                    const email = credentials.email.toLowerCase();
                    console.log('Kullanıcı aranıyor:', email);

                    const user = await prisma.user.findUnique({
                        where: { email },
                        select: {
                            id: true,
                            email: true,
                            password: true,
                            name: true,
                            role: true
                        }
                    });

                    if (!user) {
                        console.log('Kullanıcı bulunamadı:', email);
                        return null;
                    }

                    console.log('Kullanıcı bulundu, şifre kontrolü yapılıyor');
                    const isPasswordValid = await bcryptjs.compare(
                        credentials.password,
                        user.password
                    );

                    console.log('Şifre kontrolü:', isPasswordValid ? 'Başarılı' : 'Başarısız');

                    if (!isPasswordValid) {
                        console.log('Şifre hatalı');
                        return null;
                    }

                    console.log('Giriş başarılı:', { id: user.id, email: user.email, role: user.role });
                    return {
                        id: user.id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    };
                } catch (error) {
                    console.error('Auth hatası:', error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/login',
        error: '/login',
    },
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === "signIn" && user) {
                console.log('JWT callback - signIn:', { user });
                token.id = user.id;
                token.role = user.role;
            }

            // Sayfa görünür olduğunda kullanıcı bilgilerini güncelle
            if (trigger === "visibilityChange") {
                try {
                    const updatedUser = await prisma.user.findUnique({
                        where: { id: token.id },
                        select: {
                            id: true,
                            email: true,
                            name: true,
                            role: true
                        }
                    });
                    
                    if (updatedUser) {
                        console.log('Kullanıcı bilgileri güncellendi:', updatedUser);
                        token.role = updatedUser.role;
                    }
                } catch (error) {
                    console.error('Kullanıcı bilgileri güncellenirken hata:', error);
                }
            }

            return token;
        },
        async session({ session, token }) {
            console.log('Session callback:', { token });
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 gün
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: true
}; 