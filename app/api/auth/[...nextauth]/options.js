import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import prisma from '../../../../lib/prisma';

export const options = {
    // Authentication provider'ları tanımla
    providers: [
        CredentialsProvider({
            id: 'credentials', // Provider'ın benzersiz ID'si
            name: 'Credentials', // Provider'ın görünen adı
            
            // Giriş formunda gösterilecek alanları tanımla
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Şifre", type: "password" }
            },
            
            
            async authorize(credentials, req) {
                try {
                    // Giriş bilgilerinin tam olduğunu kontrol et
                    if (!credentials?.email || !credentials?.password) {
                        console.log('Credentials eksik:', { email: !!credentials?.email, password: !!credentials?.password });
                        return null;
                    }

                    // Email'i normalize et (küçük harfe çevir)
                    const email = credentials.email.toLowerCase();
                    console.log('Kullanıcı aranıyor:', email);

                    // Veritabanından kullanıcıyı bul
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

                    // Kullanıcı bulunamazsa null döndür (giriş başarısız)
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
                    return null; // Hata durumunda giriş başarısız
                }
            }
        })
    ],
    
    // Özel sayfa yönlendirmeleri
    pages: {
        signIn: '/login', // Giriş sayfası yolu
        error: '/login', // Hata durumunda yönlendirilecek sayfa
    },
    
    // NextAuth callback'leri - lifecycle eventleri için
    callbacks: {
        /**
         * JWT token oluşturulduğunda/güncellendiğinde çalışır
         * @param {Object} param - Token, user ve diğer bilgiler
         * @returns {Object} - Güncellenmiş token
         */
        async jwt({ token, user, account, profile, trigger }) {
            // İlk giriş sırasında user bilgilerini token'a ekle
            if (trigger === "signIn" && user) {
                console.log('JWT callback - signIn:', { user });
                token.id = user.id;
                token.role = user.role;
            }

            // Sayfa tekrar görünür olduğunda kullanıcı bilgilerini güncelle
            // Bu, başka bir sekmede rol değişikliği olduğunda güncel bilgileri almak için
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
                        token.role = updatedUser.role; // Rol bilgisini güncelle
                    }
                } catch (error) {
                    console.error('Kullanıcı bilgileri güncellenirken hata:', error);
                }
            }

            return token;
        },
        
        /**
         * Session nesnesi oluşturulduğunda çalışır
         * Client-side'da erişilebilen session objesini hazırlar
         * @param {Object} param - Session ve token bilgileri
         * @returns {Object} - Client'a gönderilecek session objesi
         */
        async session({ session, token }) {
            console.log('Session callback:', { token });
            // Token'daki bilgileri session'a ekle
            if (token) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        }
    },
    
    // Session konfigürasyonu
    session: {
        strategy: 'jwt', // JWT tabanlı session kullan (veritabanı session'ı yerine)
        maxAge: 30 * 24 * 60 * 60, // Session süresi: 30 gün (saniye cinsinden)
    },
    
    // JWT şifreleme için secret key (environment variable'dan al)
    secret: process.env.NEXTAUTH_SECRET,
    
    // Debug modu - geliştirme sırasında detaylı loglar için
    debug: true
}; 