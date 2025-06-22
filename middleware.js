import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const { pathname } = req.nextUrl;

        // Admin dizinine erişim kontrolü - sadece ADMIN rolü olanlar girebilir
        if (pathname.startsWith('/admin')) {
            if (!token || token.role !== 'ADMIN') {
                // ADMIN rolü yoksa ana sayfaya yönlendir
                return NextResponse.redirect(new URL('/', req.url));
            }
        }

        // Dashboard dizinine erişim - giriş yapmış herkes girebilir
        if (pathname.startsWith('/dashboard')) {
            if (!token) {
                return NextResponse.redirect(new URL('/login', req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // Token varsa ve admin path'i için role kontrolü burada da yapılabilir
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                
                // Admin dizini için ADMIN rolü gerekli
                if (pathname.startsWith('/admin')) {
                    return !!token && token.role === 'ADMIN';
                }
                
                // Diğer korumalı alanlar için sadece token kontrolü
                return !!token;
            }
        }
    }
);

export const config = {
    matcher: ['/admin/:path*', '/dashboard/:path*']
}; 