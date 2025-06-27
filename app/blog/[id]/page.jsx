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

    // Paylaşım fonksiyonları
    const shareOnTwitter = () => {
        const text = `${post.title} - ${window.location.href}`;
        const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const shareOnFacebook = () => {
        const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const shareOnWhatsApp = () => {
        const text = `${post.title} - ${window.location.href}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(whatsappUrl, '_blank');
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            // Başarı mesajı gösterebiliriz
            alert('Link kopyalandı!');
        } catch (err) {
            console.error('Link kopyalanamadı:', err);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen vintage-bg">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#8b7355]/10 rounded w-1/4 mb-8"></div>
                        <div className="paper-texture rounded-2xl p-8">
                            <div className="flex gap-8">
                                <div className="flex-1 space-y-6">
                                    <div className="h-80 bg-[#8b7355]/10 rounded-2xl"></div>
                                    <div className="space-y-4">
                                        <div className="h-8 bg-[#8b7355]/10 rounded w-3/4"></div>
                                        <div className="h-4 bg-[#8b7355]/10 rounded"></div>
                                        <div className="h-4 bg-[#8b7355]/10 rounded"></div>
                                        <div className="h-4 bg-[#8b7355]/10 rounded w-5/6"></div>
                                    </div>
                                </div>
                                <div className="w-80 space-y-4">
                                    <div className="h-40 bg-[#8b7355]/10 rounded-2xl"></div>
                                    <div className="h-20 bg-[#8b7355]/10 rounded-xl"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen vintage-bg">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="paper-texture rounded-2xl vintage-shadow p-8 text-center animate-fadeInUp">
                        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#2c2c2c] mb-4">Blog Bulunamadı</h2>
                        <p className="text-[#6b6b6b] mb-8">{error}</p>
                        <Link href="/" className="vintage-btn">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen vintage-bg">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="paper-texture rounded-2xl vintage-shadow p-8 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-[#8b7355]/10 rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-[#2c2c2c] mb-4">İçerik Bulunamadı</h2>
                        <p className="text-[#6b6b6b] mb-8">Aradığınız blog yazısı mevcut değil.</p>
                        <Link href="/" className="vintage-btn">
                            Ana Sayfaya Dön
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Yazar bilgilerini güvenli bir şekilde al
    const author = post.author || {};
    const postCount = author._count?.posts || 0;

    return (
        <div className="min-h-screen vintage-bg">
            <div className="max-w-6xl mx-auto p-6">
                {/* Navigation Breadcrumb */}
                <nav className="mb-8 animate-fadeInUp">
                    <div className="flex items-center space-x-2 text-sm text-[#6b6b6b]">
                        <Link href="/" className="hover:text-[#8b7355] transition-colors">Ana Sayfa</Link>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        {post.category && (
                            <>
                                <Link href={`/?category=${post.category.id}`} className="hover:text-[#8b7355] transition-colors">
                                    {post.category.name}
                                </Link>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </>
                        )}
                        <span className="text-[#8b7355] font-medium truncate max-w-xs">{post.title}</span>
                    </div>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Ana içerik */}
                    <div className="lg:col-span-3">
                        <article className="paper-texture rounded-2xl vintage-shadow overflow-hidden animate-fadeInUp" style={{animationDelay: '0.1s'}}>
                            {/* Hero Image */}
                            {post.imageUrl ? (
                                <div className="relative h-96 overflow-hidden">
                                    <img
                                        src={post.imageUrl}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.parentElement.innerHTML = `
                                                <div class="h-96 bg-gradient-to-br from-[#8b7355] to-[#7d8471] flex items-center justify-center">
                                                    <div class="text-white text-center p-8">
                                                        <svg class="w-20 h-20 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p class="font-semibold text-xl">Blog Yazısı</p>
                                                    </div>
                                                </div>
                                            `;
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                            ) : (
                                <div className="h-96 bg-gradient-to-br from-[#8b7355] to-[#7d8471] flex items-center justify-center">
                                    <div className="text-white text-center p-8">
                                        <svg className="w-20 h-20 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <p className="font-semibold text-xl opacity-90">Blog Yazısı</p>
                                    </div>
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8 lg:p-12">
                                {/* Meta Information */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center space-x-4">
                                        {post.category && (
                                            <span className="inline-block bg-[#8b7355]/10 text-[#8b7355] text-sm px-4 py-2 rounded-full font-medium">
                                                {post.category.name}
                                            </span>
                                        )}
                                        <div className="text-sm text-[#6b6b6b]">
                                            {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric'
                                            })}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            onClick={copyToClipboard}
                                            className="p-2 hover:bg-[#8b7355]/5 rounded-lg transition-colors" 
                                            title="Linki Kopyala"
                                        >
                                            <svg className="w-5 h-5 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Title */}
                                <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-[#2c2c2c] leading-tight">
                                    {post.title}
                                </h1>

                                {/* Author Info */}
                                <div className="flex items-center space-x-4 mb-12 p-6 bg-[#8b7355]/5 rounded-xl border border-[#8b7355]/10">
                                    <div className="w-16 h-16 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center text-white text-xl font-bold">
                                        {author.name ? author.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <div className="flex-1">
                                        <Link 
                                            href={`/profile/${author.id}`}
                                            className="text-xl font-bold text-[#2c2c2c] hover:text-[#8b7355] transition-colors block"
                                        >
                                            {author.name || 'İsimsiz Yazar'}
                                        </Link>
                                        <p className="text-[#6b6b6b]">{postCount} yazı • {new Date(post.createdAt).toLocaleDateString('tr-TR')}</p>
                                        {author.bio && (
                                            <p className="text-[#6b6b6b] text-sm mt-1 italic">"{author.bio}"</p>
                                        )}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="prose max-w-none text-[#2c2c2c] leading-relaxed">
                                    {post.content.split('\n').map((paragraph, index) => (
                                        paragraph.trim() && (
                                            <p key={index} className="mb-6 text-lg leading-relaxed">
                                                {paragraph}
                                            </p>
                                        )
                                    ))}
                                </div>

                                {/* Tags */}
                                <div className="mt-12 pt-8 border-t border-[#8b7355]/10">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <span className="text-sm font-semibold text-[#6b6b6b]">Etiketler:</span>
                                            {post.category && (
                                                <span className="bg-[#8b7355]/10 text-[#8b7355] px-3 py-1 rounded-full text-sm">
                                                    #{post.category.name}
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-sm text-[#6b6b6b]">
                                            {post.content.split(' ').length} kelime • {Math.ceil(post.content.split(' ').length / 200)} dk okuma
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Yazar Kartı */}
                            <div className="paper-texture rounded-2xl vintage-shadow p-6 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                                        {author.name ? author.name.charAt(0).toUpperCase() : '?'}
                                    </div>
                                    <Link 
                                        href={`/profile/${author.id}`}
                                        className="text-xl font-bold text-[#2c2c2c] hover:text-[#8b7355] transition-colors block mb-2"
                                    >
                                        {author.name || 'İsimsiz Yazar'}
                                    </Link>
                                    <div className="text-[#6b6b6b] text-sm mb-4">
                                        {postCount} blog yazısı
                                    </div>
                                    {author.bio && (
                                        <p className="text-[#6b6b6b] text-sm mb-6 italic leading-relaxed">
                                            "{author.bio}"
                                        </p>
                                    )}
                                </div>

                                {/* Mesaj Gönderme */}
                                {session && session.user.id !== author.id && (
                                    <div className="space-y-4">
                                        {!showMessageForm && !messageSent && (
                                            <button
                                                onClick={() => setShowMessageForm(true)}
                                                className="w-full vintage-btn flex items-center justify-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                                </svg>
                                                <span>Mesaj Gönder</span>
                                            </button>
                                        )}

                                        {showMessageForm && (
                                            <form onSubmit={handleSendMessage} className="space-y-4">
                                                <textarea
                                                    value={message}
                                                    onChange={(e) => setMessage(e.target.value)}
                                                    placeholder="Yazara mesajınızı yazın..."
                                                    className="vintage-input w-full h-24 resize-none"
                                                    disabled={sendingMessage}
                                                />
                                                {messageError && (
                                                    <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                                        {messageError}
                                                        {needRelogin && (
                                                            <button 
                                                                onClick={() => router.push('/login')}
                                                                className="block mt-2 text-[#8b7355] underline hover:text-[#6d5a43]"
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
                                                        className={`flex-1 vintage-btn ${sendingMessage ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                    >
                                                        {sendingMessage ? 'Gönderiliyor...' : 'Gönder'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowMessageForm(false)}
                                                        disabled={sendingMessage}
                                                        className="flex-1 vintage-btn-outline"
                                                    >
                                                        İptal
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        {messageSent && (
                                            <div className="bg-green-100 text-green-700 p-4 rounded-xl text-center">
                                                <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <p className="font-medium">Mesajınız gönderildi!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* İlgili Yazılar */}
                            <div className="paper-texture rounded-2xl vintage-shadow p-6 animate-fadeInUp" style={{animationDelay: '0.3s'}}>
                                <h3 className="text-lg font-bold text-[#2c2c2c] mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                    </svg>
                                    Diğer Yazılar
                                </h3>
                                <div className="space-y-3">
                                    <Link href="/" className="block p-3 hover:bg-[#8b7355]/5 rounded-lg transition-colors">
                                        <h4 className="font-medium text-[#2c2c2c] text-sm mb-1 line-clamp-2">
                                            Bu yazarın diğer yazılarını keşfedin
                                        </h4>
                                        <p className="text-xs text-[#6b6b6b]">Ana sayfaya git</p>
                                    </Link>
                                </div>
                            </div>

                            {/* Paylaş */}
                            <div className="paper-texture rounded-2xl vintage-shadow p-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                                <h3 className="text-lg font-bold text-[#2c2c2c] mb-4">Bu Yazıyı Paylaş</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={shareOnTwitter}
                                        className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                        </svg>
                                        <span className="text-xs">Twitter</span>
                                    </button>
                                    <button 
                                        onClick={shareOnFacebook}
                                        className="flex items-center justify-center space-x-2 p-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                        </svg>
                                        <span className="text-xs">Facebook</span>
                                    </button>
                                    <button 
                                        onClick={shareOnWhatsApp}
                                        className="flex items-center justify-center space-x-2 p-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                                        </svg>
                                        <span className="text-xs">WhatsApp</span>
                                    </button>
                                    <button 
                                        onClick={copyToClipboard}
                                        className="flex items-center justify-center space-x-2 p-3 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                        </svg>
                                        <span className="text-xs">Kopyala</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}