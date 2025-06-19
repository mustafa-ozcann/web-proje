'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError('');
                
                const response = await fetch('/api/post/list');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Blog yazıları yüklenirken bir hata oluştu');
                }

                setPosts(data.posts || []);
            } catch (err) {
                console.error('Blog listesi hatası:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Hata! </strong>
                    <span className="block sm:inline">{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Blog Yazıları</h1>
                <Link
                    href="/blog/create"
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    Yeni Blog Yazısı
                </Link>
            </div>

            {posts.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                    <p className="text-xl">Henüz blog yazısı bulunmuyor</p>
                    <p className="mt-2">İlk blog yazısını oluşturmak için "Yeni Blog Yazısı" butonuna tıklayın.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <Link
                            key={post.id}
                            href={`/blog/${post.id}`}
                            className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            {post.imageUrl && (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {post.content}
                                </p>
                                <div className="flex items-center text-sm text-gray-500">
                                    <span>{post.author?.name || 'Anonim'}</span>
                                    <span className="mx-2">•</span>
                                    <span>
                                        {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
} 