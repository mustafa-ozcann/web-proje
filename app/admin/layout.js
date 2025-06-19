'use client';

import Sidebar from '@/components/sidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <main className="flex-1 p-8 ml-64">
                {children}
            </main>
        </div>
    );
}
