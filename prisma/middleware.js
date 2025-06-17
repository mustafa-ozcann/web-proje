import { NextResponse } from 'next/server';

export function middleware(req) {
    if (req.nextUrl.pathname.startsWith('/admin')) {
        const user = req.cookies.get('user')?.value;

        if (!user) {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        try {
            const userObj = JSON.parse(decodeURIComponent(user));
            if (userObj.role !== 'ADMIN') {
                return NextResponse.redirect(new URL('/dashboard', req.url));
            }
        } catch {
            return NextResponse.redirect(new URL('/login', req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
