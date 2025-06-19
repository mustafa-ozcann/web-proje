'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || session.user.role !== 'ADMIN') {
            router.push('/');
            return;
        }
    }, [session]);

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Paneli</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Hızlı İstatistikler</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Toplam Blog</span>
                            <span className="text-2xl font-bold">-</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Bekleyen Blog</span>
                            <span className="text-2xl font-bold text-yellow-500">-</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Toplam Kullanıcı</span>
                            <span className="text-2xl font-bold">-</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Son İşlemler</h2>
                    <div className="space-y-2">
                        <p className="text-gray-600">Henüz işlem yok</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Hızlı Bağlantılar</h2>
                    <div className="space-y-2">
                        <button 
                            onClick={() => router.push('/admin/posts')}
                            className="w-full text-left px-4 py-2 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                            Blog Onayları
                        </button>
                        <button 
                            onClick={() => router.push('/admin/users')}
                            className="w-full text-left px-4 py-2 rounded bg-green-50 text-green-600 hover:bg-green-100"
                        >
                            Kullanıcı Yönetimi
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
