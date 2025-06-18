'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Header() {
    const [user, setUser] = useState(null);
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const getUserFromCookie = () => {
            try {
                const cookies = document.cookie.split(';');
                const userCookie = cookies.find(cookie => cookie.trim().startsWith('user='));

                if (userCookie) {
                    // URL-encoded değeri decode et
                    const encodedValue = userCookie.split('=')[1];
                    if (encodedValue) {
                        const decodedValue = decodeURIComponent(encodedValue);
                        const userData = JSON.parse(decodedValue);
                        setUser(userData);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error parsing user cookie:', error);
                setUser(null);
            }
        };

        getUserFromCookie();

        // Cookie değişikliklerini dinle
        const checkCookieInterval = setInterval(getUserFromCookie, 1000);

        return () => clearInterval(checkCookieInterval);
    }, []);

    const handleLogout = () => {
        document.cookie = 'user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setUser(null);
        router.push('/');
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center">
                        <span className="text-2xl font-bold text-indigo-600">Bloger</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="flex items-center space-x-4">
                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <Link
                                        href="/admin"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Admin Panel
                                    </Link>
                                ) : (
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                                >
                                    Çıkış Yap
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
                                >
                                    Kayıt Ol
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
