'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function BlogDetail() {
    const params = useParams();
    const router = useRouter();
    const { data: session } = useSession();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showMessageForm, setShowMessageForm] = useState(false);
    const [message, setMessage] = useState('');
    const [sendingMessage, setSendingMessage] = useState(false);
    const [messageError, setMessageError] = useState('');
    const [needRelogin, setNeedRelogin] = useState(false);
    const [messageSent, setMessageSent] = useState(false);

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

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!session) {
            router.push('/login');
            return;
        }

        if (!message.trim()) {
            setMessageError('Mesaj boş olamaz');
            return;
        }

        try {
            setSendingMessage(true);
            setMessageError('');
            setNeedRelogin(false);

            const response = await fetch('/api/message/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientId: post.author.id,
                    content: message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Özel hata handling'i
                if (data.needRelogin) {
                    setMessageError(data.error);
                    setNeedRelogin(true);
                } else {
                    throw new Error(data.error || 'Mesaj gönderilemedi');
                }
                return;
            }

            setMessage('');
            setShowMessageForm(false);
            setMessageSent(true);
            setTimeout(() => setMessageSent(false), 3000);
        } catch (err) {
            setMessageError(err.message);
        } finally {
            setSendingMessage(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="animate-pulse flex gap-8">
                    <div className="flex-1">
                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-4 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                    <div className="w-80">
                        <div className="h-40 bg-gray-200 rounded mb-4"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center text-gray-500">
                    Blog yazısı bulunamadı
                </div>
            </div>
        );
    }

    // Yazar bilgilerini güvenli bir şekilde al
    const author = post.author || {};
    const postCount = author._count?.posts || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex gap-8">
                    {/* Ana içerik - Sol taraf */}
                    <div className="flex-1">
                        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-80 object-cover"
                                />
                            ) : (
                                <div className="h-80 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 flex items-center justify-center">
                                    <div className="text-white text-center p-6">
                                        <svg className="w-20 h-20 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="font-semibold opacity-90 text-xl">Blog Yazısı</p>
                                    </div>
                                </div>
                            )}

                            <div className="p-8">
                                {post.category && (
                                    <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-4 font-medium">
                                        {post.category.name}
                                    </span>
                                )}

                                <h1 className="text-4xl font-bold mb-8 text-gray-800">{post.title}</h1>

                                <div className="prose max-w-none text-gray-700 leading-relaxed">
                                    {post.content.split('\n').map((paragraph, index) => (
                                        <p key={index} className="mb-6 text-lg">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </article>
                    </div>

                {/* Yazar bilgileri - Sağ taraf */}
                <div className="w-80">
                    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
                        <div className="text-center mb-4">
                            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold mx-auto mb-4">
                                {author.name ? author.name.charAt(0) : '?'}
                            </div>
                            <Link 
                                href={`/profile/${author.id}`}
                                className="text-xl font-semibold hover:text-blue-600 block"
                            >
                                {author.name || 'İsimsiz Yazar'}
                            </Link>
                            <div className="text-gray-500 text-sm mt-1">
                                {postCount} blog yazısı
                            </div>
                        </div>

                        {author.bio && (
                            <p className="text-gray-600 text-sm mb-4 text-center">
                                {author.bio}
                            </p>
                        )}

                        <div className="border-t pt-4">
                            <div className="text-gray-500 text-sm mb-2">
                                Yayınlanma tarihi:
                                <br />
                                {new Date(post.createdAt).toLocaleDateString('tr-TR')}
                            </div>
                        </div>

                        {session && session.user.id !== author.id && (
                            <div className="mt-4">
                                {!showMessageForm && !messageSent && (
                                    <button
                                        onClick={() => setShowMessageForm(true)}
                                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                                    >
                                        Mesaj Gönder
                                    </button>
                                )}

                                {showMessageForm && (
                                    <form onSubmit={handleSendMessage} className="space-y-3">
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Mesajınızı yazın..."
                                            className="w-full p-2 border rounded-md resize-none h-24"
                                            disabled={sendingMessage}
                                        />
                                        {messageError && (
                                            <div className="text-red-500 text-sm">
                                                {messageError}
                                                {needRelogin && (
                                                    <button 
                                                        onClick={() => router.push('/login')}
                                                        className="block mt-2 text-blue-500 underline text-sm hover:text-blue-700"
                                                    >
                                                        Tekrar Giriş Yap
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                type="submit"
                                                disabled={sendingMessage}
                                                className="flex-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                                            >
                                                {sendingMessage ? 'Gönderiliyor...' : 'Gönder'}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setShowMessageForm(false)}
                                                disabled={sendingMessage}
                                                className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    </form>
                                )}

                                {messageSent && (
                                    <div className="bg-green-100 text-green-700 p-3 rounded-md text-center">
                                        Mesajınız gönderildi!
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                </div>
            </div>
        </div>
    );
}