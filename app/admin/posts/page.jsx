'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('PENDING');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const { data: session } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (!session || session.user.role !== 'ADMIN') {
            router.push('/');
            return;
        }

        fetchPosts();
    }, [session, status, page]);

    const fetchPosts = async () => {
        try {
            const response = await fetch(`/api/admin/post?status=${status}&page=${page}&limit=10`);
            if (!response.ok) throw new Error('Blog yazıları yüklenemedi');
            const data = await response.json();
            setPosts(data.posts);
            setPagination(data.pagination);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (postId, newStatus) => {
        try {
            const response = await fetch('/api/admin/post', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId, status: newStatus }),
            });

            if (!response.ok) throw new Error('Durum güncellenemedi');
            
            // Blog listesini yenile
            fetchPosts();
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div className="p-4">Yükleniyor...</div>;
    if (error) return <div className="p-4 text-red-500">Hata: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Blog Yazıları Yönetimi</h1>
                <select
                    value={status}
                    onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(1);
                    }}
                    className="border rounded-lg px-4 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="PENDING">Bekleyenler</option>
                    <option value="APPROVED">Onaylananlar</option>
                    <option value="REJECTED">Reddedilenler</option>
                </select>
            </div>

            <div className="overflow-x-auto bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b">
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Başlık</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yazar</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Durum</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {posts.map((post) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{post.title}</td>
                                <td className="px-6 py-4">{post.author.name}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        post.status === 'APPROVED' 
                                            ? 'bg-green-100 text-green-800'
                                            : post.status === 'REJECTED'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                    }`}>
                                        {post.status === 'APPROVED' ? 'Onaylandı' : 
                                         post.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                </td>
                                <td className="px-6 py-4 space-x-2">
                                    {post.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(post.id, 'APPROVED')}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                                            >
                                                Onayla
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(post.id, 'REJECTED')}
                                                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                                            >
                                                Reddet
                                            </button>
                                        </>
                                    )}
                                    <button
                                        onClick={() => router.push(`/blog/${post.id}`)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
                                    >
                                        Görüntüle
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {pagination && (
                <div className="mt-4 flex justify-center space-x-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className={`px-4 py-2 rounded ${
                            page === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm'
                        }`}
                    >
                        Önceki
                    </button>
                    <span className="px-4 py-2 bg-white shadow-sm rounded">
                        Sayfa {page} / {pagination.totalPages}
                    </span>
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.totalPages}
                        className={`px-4 py-2 rounded ${
                            page === pagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-blue-600 hover:bg-blue-50 shadow-sm'
                        }`}
                    >
                        Sonraki
                    </button>
                </div>
            )}
        </div>
    );
} 