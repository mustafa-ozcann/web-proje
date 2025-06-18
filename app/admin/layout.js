'use client';

import Sidebar from '@/components/sidebar';

export default function AdminLayout({ children }) {
    return (
        <div className="flex min-h-screen">
            <div className="w-64 bg-white shadow-lg">
                <Sidebar />
            </div>
            <div className="flex-1 bg-gray-50">
                <div className="p-8">
                    {children}
                </div>
            </div>
        </div>
    );
}
