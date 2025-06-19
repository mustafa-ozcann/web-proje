'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || session.user.role !== 'ADMIN') {
            router.push('/');
            return;
        }

        fetchUsers();
    }, [session]);

    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/admin/users');
            if (!response.ok) throw new Error('Kullanıcılar yüklenemedi');
            const data = await response.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        // Kendi rolünü değiştirmeye çalışıyorsa engelle
        if (userId === session.user.id) {
            setError('Kendi rolünüzü değiştiremezsiniz');
            return;
        }

        try {
            const response = await fetch('/api/admin/users', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, newRole }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Rol güncellenemedi');
            }
            
            // Kullanıcı listesini yenile
            await fetchUsers();

            // Oturumu zorla güncelle
            const event = new Event('visibilitychange');
            document.dispatchEvent(event);
            
            // Sayfayı yenile
            router.refresh();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-4">Yükleniyor...</div>;
    if (error) return (
        <div className="p-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Hata: {error}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İsim</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog Sayısı</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        user.role === 'ADMIN' 
                                            ? 'bg-purple-100 text-purple-800' 
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{user._count.posts}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        disabled={user.id === session.user.id}
                                        className="border rounded px-3 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    >
                                        <option value="USER">Kullanıcı</option>
                                        <option value="ADMIN">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 