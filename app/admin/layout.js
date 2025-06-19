'use client';

import Sidebar from '@/components/sidebar';
import Header from '@/components/header';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar className="fixed left-0 top-0 h-full z-30" />
            <div className="flex-1 ml-64">
                <Header className="sticky top-0 z-20 bg-white shadow-sm" />
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
