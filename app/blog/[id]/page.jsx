'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function BlogDetail() {
    const params = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`/api/post/${params.id}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Blog yazısı bulunamadı');
                }

                setPost(data.post);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [params.id]);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
                        <div className="h-4 bg-gray-200 rounded"></div>
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

    if (!post) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center text-gray-500">
                    Blog yazısı bulunamadı
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-lg mb-8"
                />
            )}

            <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

            <div className="flex items-center text-gray-500 mb-8">
                <span>Yazar: {post.author.name}</span>
                <span className="mx-2">•</span>
                <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
            </div>

            <div className="prose max-w-none">
                {post.content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4">
                        {paragraph}
                    </p>
                ))}
            </div>
        </div>
    );
}