'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function UserProfile() {
    const { id } = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchUserProfile();
            fetchUserPosts();
        }
    }, [id]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`/api/user/profile?id=${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Kullanıcı bilgileri alınamadı');
            }

            setUser(data.user);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await fetch(`/api/post/list?authorId=${id}&status=APPROVED`);
            const data = await response.json();

            if (response.ok) {
                setPosts(data.posts || []);
            }
        } catch (err) {
            console.error('Kullanıcı yazıları alınamadı:', err);
        }
    };

    const handleSendMessage = () => {
        router.push(`/messages?userId=${id}`);
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-32 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-4">
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-600">Kullanıcı bulunamadı</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-4xl mx-auto p-6">
                {/* Kullanıcı Bilgileri */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                {user.name || 'İsimsiz Kullanıcı'}
                            </h1>
                            <p className="text-gray-600">{user.email}</p>
                            {user.bio && (
                                <p className="text-gray-700 mt-2">{user.bio}</p>
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                                Üyelik: {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                            </p>
                        </div>
                    </div>
                    
                    {session && session.user.id !== user.id && (
                        <div className="flex space-x-2">
                            <button
                                onClick={handleSendMessage}
                                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                Mesaj Gönder
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Kullanıcının Blog Yazıları */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-4">Blog Yazıları ({posts.length})</h2>
                
                {posts.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Henüz yayınlanmış blog yazısı bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2">
                        {posts.map((post) => (
                            <div key={post.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                {post.imageUrl && (
                                    <img 
                                        src={post.imageUrl} 
                                        alt={post.title}
                                        className="w-full h-48 object-cover rounded-lg mb-3"
                                    />
                                )}
                                <h3 className="text-lg font-semibold mb-2">
                                    <Link 
                                        href={`/blog/${post.id}`}
                                        className="hover:text-blue-600 transition-colors"
                                    >
                                        {post.title}
                                    </Link>
                                </h3>
                                <p className="text-gray-600 text-sm mb-2 line-clamp-3">
                                    {post.content.substring(0, 150)}...
                                </p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                        {post.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {/* Geri Dön Butonu */}
            <div className="mt-6">
                <button
                    onClick={() => router.back()}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    Geri Dön
                </button>
            </div>
            </div>
        </div>
    );
} 