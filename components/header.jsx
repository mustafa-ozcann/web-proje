'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
    const { data: session } = useSession();
    const pathname = usePathname();
    const router = useRouter();

    const isAdmin = session?.user?.role?.toLowerCase() === 'admin';

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
                        {session ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium ${
                                        pathname === '/dashboard' ? 'text-indigo-600' : ''
                                    }`}
                                >
                                    Dashboard
                                </Link>

                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium ${
                                            pathname.startsWith('/admin') ? 'text-indigo-600' : ''
                                        }`}
                                    >
                                        Admin Panel
                                    </Link>
                                )}

                                <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-600">
                                        {session.user.name}
                                        {isAdmin && (
                                            <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                                                Admin
                                            </span>
                                        )}
                                    </span>
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700"
                                    >
                                        Çıkış Yap
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className={`text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium ${
                                        pathname === '/login' ? 'text-indigo-600' : ''
                                    }`}
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
