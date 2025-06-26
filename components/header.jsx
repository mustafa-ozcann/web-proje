'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

export default function Header() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    // Dropdown dışı tıklama kontrolü
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <header className="paper-texture border-b-2 border-[#8b7355]/10 sticky top-0 z-50 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo ve Ana Menü */}
                    <div className="flex items-center">
                        <Link href="/" className="text-3xl font-bold text-[#8b7355] hover:text-[#6d5a43] transition-colors duration-300">
                            <span className="relative">
                                Vintage Blog
                                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-[#8b7355] to-[#7d8471] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                            </span>
                        </Link>
                        <nav className="hidden md:ml-12 md:flex items-center space-x-8">
                            <Link 
                                href="/" 
                                className="text-[#6b6b6b] hover:text-[#8b7355] px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#8b7355]/5 font-medium"
                            >
                                Ana Sayfa
                            </Link>
                            <Link 
                                href="/blog/create" 
                                className="text-[#6b6b6b] hover:text-[#8b7355] px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#8b7355]/5 font-medium"
                            >
                                Yazı Oluştur
                            </Link>
                        </nav>
                    </div>

                    {/* Kullanıcı Menüsü */}
                    <div className="flex items-center space-x-6">
                        {session ? (
                            <>
                                {/* Mesajlar İkonu */}
                                <Link 
                                    href="/messages" 
                                    className="relative group p-3 rounded-full hover:bg-[#8b7355]/10 transition-all duration-300"
                                    title="Mesajlar"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6b6b6b] group-hover:text-[#8b7355] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                </Link>

                                {/* Profil Dropdown - Özel Tasarım */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center space-x-3 text-[#6b6b6b] hover:text-[#8b7355] focus:outline-none group transition-all duration-300"
                                    >
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                                                <span className="text-lg font-semibold">
                                                    {session.user.name ? session.user.name.charAt(0).toUpperCase() : '?'}
                                                </span>
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#7d8471] rounded-full border-2 border-white flex items-center justify-center">
                                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex flex-col items-start">
                                            <span className="font-medium text-[#2c2c2c]">{session.user.name}</span>
                                            <span className="text-xs text-[#6b6b6b]">Çevrimiçi</span>
                                        </div>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>

                                    {/* Özel Dropdown Menü */}
                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-4 w-80 z-20 animate-fadeInUp">
                                            <div className="paper-texture rounded-2xl vintage-shadow-lg overflow-hidden border border-[#8b7355]/10">
                                                {/* Header */}
                                                <div className="bg-gradient-to-r from-[#8b7355] to-[#7d8471] p-6 text-white">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                                            <span className="text-2xl font-bold">
                                                                {session.user.name ? session.user.name.charAt(0).toUpperCase() : '?'}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <h3 className="text-lg font-semibold">{session.user.name}</h3>
                                                            <p className="text-white/80 text-sm">{session.user.email}</p>
                                                            {session.user.role === 'ADMIN' && (
                                                                <span className="inline-block bg-white/20 text-xs px-2 py-1 rounded-full mt-1 backdrop-blur-sm">
                                                                    Yönetici
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Menu Items */}
                                                <div className="p-4 space-y-2">
                                                    <Link
                                                        href="/dashboard"
                                                        className="flex items-center space-x-3 p-4 rounded-xl hover:bg-[#8b7355]/5 transition-all duration-300 group"
                                                        onClick={() => setIsDropdownOpen(false)}
                                                    >
                                                        <div className="w-10 h-10 bg-gradient-to-br from-[#8b7355]/10 to-[#7d8471]/10 rounded-lg flex items-center justify-center group-hover:from-[#8b7355]/20 group-hover:to-[#7d8471]/20 transition-all duration-300">
                                                            <svg className="w-5 h-5 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-[#2c2c2c] group-hover:text-[#8b7355] transition-colors">Profilim</p>
                                                            <p className="text-xs text-[#6b6b6b]">Profil ayarları ve bilgileri</p>
                                                        </div>
                                                        <svg className="w-4 h-4 text-[#6b6b6b] group-hover:text-[#8b7355] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </Link>

                                                    {session.user.role === 'ADMIN' && (
                                                        <Link
                                                            href="/admin"
                                                            className="flex items-center space-x-3 p-4 rounded-xl hover:bg-[#8b7355]/5 transition-all duration-300 group"
                                                            onClick={() => setIsDropdownOpen(false)}
                                                        >
                                                            <div className="w-10 h-10 bg-gradient-to-br from-[#7d8471]/10 to-[#8b7355]/10 rounded-lg flex items-center justify-center group-hover:from-[#7d8471]/20 group-hover:to-[#8b7355]/20 transition-all duration-300">
                                                                <svg className="w-5 h-5 text-[#7d8471]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                </svg>
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-[#2c2c2c] group-hover:text-[#7d8471] transition-colors">Admin Paneli</p>
                                                                <p className="text-xs text-[#6b6b6b]">Sistem yönetimi</p>
                                                            </div>
                                                            <svg className="w-4 h-4 text-[#6b6b6b] group-hover:text-[#7d8471] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </Link>
                                                    )}

                                                    <hr className="border-[#8b7355]/10 my-3" />

                                                    <button
                                                        onClick={() => {
                                                            setIsDropdownOpen(false);
                                                            signOut({ redirect: true, callbackUrl: '/' });
                                                        }}
                                                        className="flex items-center space-x-3 p-4 rounded-xl hover:bg-red-50 transition-all duration-300 group w-full text-left"
                                                    >
                                                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-all duration-300">
                                                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                            </svg>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="font-medium text-red-600 group-hover:text-red-700 transition-colors">Çıkış Yap</p>
                                                            <p className="text-xs text-red-400">Güvenli çıkış</p>
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-[#6b6b6b] hover:text-[#8b7355] px-4 py-2 rounded-lg transition-all duration-300 hover:bg-[#8b7355]/5 font-medium"
                                >
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="vintage-btn text-sm"
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
