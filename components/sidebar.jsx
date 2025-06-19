'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function Sidebar() {
    const pathname = usePathname();

    const isActive = (path) => {
        return pathname === path;
    };

    return (
        <div className="fixed left-0 top-0 w-64 bg-gray-900 min-h-screen text-white p-6 shadow-lg z-50">
            <h2 className="text-2xl font-bold mb-8 text-blue-400">Admin Panel</h2>
            <nav>
                <ul className="space-y-4">

                    <li>
                        <Link 
                            href="/admin/users" 
                            className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                                isActive('/admin/users') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                            </svg>
                            <span>Kullanıcılar</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/admin/posts" 
                            className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                                isActive('/admin/posts') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <span>Blog Onayı</span>
                        </Link>
                    </li>
                    <li>
                        <Link 
                            href="/admin/categories" 
                            className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                                isActive('/admin/categories') 
                                    ? 'bg-blue-600 text-white' 
                                    : 'hover:bg-gray-800'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                            </svg>
                            <span>Kategoriler</span>
                        </Link>
                    </li>
                    <li className="pt-6">
                        <button 
                            onClick={() => signOut({ callbackUrl: '/login' })}
                            className="flex items-center space-x-2 p-2 rounded-lg text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors w-full"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                            </svg>
                            <span>Çıkış Yap</span>
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
