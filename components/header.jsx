'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Header() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Profil güncellemelerini dinle
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === 'visible' && session) {
                await updateSession();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [session, updateSession]);

    return (
        <header className="bg-white shadow-md">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo ve Ana Menü */}
                    <div className="flex items-center">
                        <Link href="/" className="text-2xl font-bold text-blue-600">
                            Blog
                        </Link>
                        <nav className="hidden md:ml-8 md:flex space-x-4">
                            <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                                Ana Sayfa
                            </Link>
                            <Link href="/blog/create" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md">
                                Blog Yaz
                            </Link>
                        </nav>
                    </div>

                    {/* Kullanıcı Menüsü */}
                    <div className="flex items-center space-x-4">
                        {session ? (
                            <>
                                {/* Mesajlar İkonu */}
                                <Link 
                                    href="/messages" 
                                    className="text-gray-700 hover:text-blue-600 p-2 rounded-full hover:bg-gray-100"
                                    title="Mesajlar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </Link>

                                {/* Profil Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
                                    >
                                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                            {session.user.name ? session.user.name.charAt(0) : '?'}
                                        </div>
                                        <span className="hidden md:inline">{session.user.name}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                                            <Link
                                                href="/dashboard"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsDropdownOpen(false)}
                                            >
                                                Profilim
                                            </Link>
                                            {session.user.role === 'ADMIN' && (
                                                <Link
                                                    href="/admin"
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    onClick={() => setIsDropdownOpen(false)}
                                                >
                                                    Admin Paneli
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    signOut({ redirect: true, callbackUrl: '/' });
                                                }}
                                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Çıkış Yap
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-4">
                                <Link
                                    href="/login"
                                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
