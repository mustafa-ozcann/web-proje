'use client';

import Sidebar from '@/components/sidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="min-h-screen vintage-bg">
            <Sidebar />
            <div className="ml-72">
                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
