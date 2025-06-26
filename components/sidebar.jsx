'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path) => {
        return pathname === path;
    };

    const menuItems = [
        {
            path: '/admin/users',
            label: 'Kullanıcılar',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
            )
        },
        {
            path: '/admin/posts',
            label: 'Blog Onayı',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            )
        },
        {
            path: '/admin/categories',
            label: 'Kategoriler',
            icon: (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
            )
        }
    ];

    return (
        <div className="fixed left-0 top-0 w-72 paper-texture min-h-screen border-r-2 border-[#8b7355]/10 shadow-lg z-50">
            {/* Header */}
            <div className="p-8 border-b border-[#8b7355]/10">
                <Link href="/" className="flex items-center space-x-3 mb-2">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#2c2c2c]">Admin Panel</h2>
                        <p className="text-sm text-[#6b6b6b]">Vintage Blog</p>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="p-6">
                <div className="space-y-3">
                    <p className="text-xs font-semibold text-[#6b6b6b] uppercase tracking-wider mb-4">
                        Yönetim
                    </p>
                    
                    {menuItems.map((item) => (
                        <Link 
                            key={item.path}
                            href={item.path} 
                            className={`group flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                                isActive(item.path) 
                                    ? 'vintage-accent-bg text-white vintage-shadow' 
                                    : 'hover:bg-[#8b7355]/5 text-[#6b6b6b] hover:text-[#8b7355]'
                            }`}
                        >
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                                isActive(item.path)
                                    ? 'bg-white/20'
                                    : 'bg-[#8b7355]/10 group-hover:bg-[#8b7355]/20'
                            }`}>
                                {item.icon}
                            </div>
                            <div className="flex-1">
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {isActive(item.path) && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12 p-6 bg-[#8b7355]/5 rounded-xl border border-[#8b7355]/10">
                    <h3 className="text-sm font-semibold text-[#2c2c2c] mb-4">Hızlı Erişim</h3>
                    <div className="space-y-3">
                        <Link 
                            href="/"
                            className="flex items-center space-x-3 text-sm text-[#6b6b6b] hover:text-[#8b7355] transition-colors group"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span>Ana Sayfa</span>
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </Link>
                        <Link 
                            href="/blog/create"
                            className="flex items-center space-x-3 text-sm text-[#6b6b6b] hover:text-[#8b7355] transition-colors group"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            <span>Yazı Oluştur</span>
                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-[#8b7355]/10">
                <button 
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="flex items-center space-x-3 p-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-300 w-full group"
                >
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center group-hover:bg-red-100 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </div>
                    <div className="flex-1 text-left">
                        <span className="font-medium">Çıkış Yap</span>
                        <p className="text-xs text-red-400">Güvenli çıkış</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
