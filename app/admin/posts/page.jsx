'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [status, setStatus] = useState('ALL');
    const [page, setPage] = useState(1);
    const [pagination, setPagination] = useState(null);
    const [isResetting, setIsResetting] = useState(false);
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

    const handleDeletePost = async (postId) => {
        if (!confirm('Bu blog yazısını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
            return;
        }

        try {
            const response = await fetch('/api/admin/post', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ postId }),
            });

            if (!response.ok) throw new Error('Blog silinemedi');
            
            // Blog listesini yenile
            fetchPosts();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResetData = async () => {
        const confirmMessage = `
        ⚠️ DİKKAT: Bu işlem geri alınamaz!
        
        Aşağıdaki veriler silinecek:
        • Seed kullanıcıları dışındaki tüm kullanıcılar
        • Seed kullanıcıları dışındaki tüm blog yazıları  
        • Tüm mesajlar
        
        Korunacak veriler:
        • admin@example.com ve test@example.com kullanıcıları
        • Kategoriler
        
        Bu işlemi yapmak istediğinizden emin misiniz?`.trim();

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            setIsResetting(true);
            const response = await fetch('/api/admin/reset-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Veriler sıfırlanırken hata oluştu');
            }

            alert('✅ Veriler başarıyla sıfırlandı!');
            // Blog listesini yenile
            fetchPosts();
        } catch (err) {
            setError(err.message);
            alert('❌ Hata: ' + err.message);
        } finally {
            setIsResetting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-[#8b7355]/10 rounded w-1/3 mb-8"></div>
                    <div className="paper-texture rounded-2xl p-8">
                        <div className="space-y-4">
                            {[1,2,3,4,5].map(i => (
                                <div key={`loading-skeleton-${i}`} className="h-16 bg-[#8b7355]/10 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="paper-texture rounded-2xl vintage-shadow p-8">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">Hata Oluştu</h3>
                    <p className="text-[#6b6b6b] mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="vintage-btn"
                    >
                        Tekrar Dene
                    </button>
                </div>
            </div>
        );
    }

    const statusOptions = [
        { value: 'ALL', label: 'Tümü', count: pagination?.totalPosts },
        { value: 'PENDING', label: 'Bekleyenler', color: 'yellow' },
        { value: 'APPROVED', label: 'Onaylananlar', color: 'green' },
        { value: 'REJECTED', label: 'Reddedilenler', color: 'red' }
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold text-[#2c2c2c] mb-2">Blog Yönetimi</h1>
                    <p className="text-[#6b6b6b]">Blog yazılarını onaylayın, reddedin veya silin</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    <div className="flex items-center space-x-4">
                        {statusOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => {
                                    setStatus(option.value);
                                    setPage(1);
                                }}
                                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                    status === option.value
                                        ? 'vintage-accent-bg text-white vintage-shadow'
                                        : 'paper-texture hover:bg-[#8b7355]/5 text-[#6b6b6b] hover:text-[#8b7355]'
                                }`}
                            >
                                {option.label}
                                {option.count && status === 'ALL' && (
                                    <span className="ml-2 text-xs opacity-75">({option.count})</span>
                                )}
                            </button>
                        ))}
                    </div>
                    
                    <button
                        onClick={handleResetData}
                        disabled={isResetting}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 border-2 flex items-center space-x-2 ${
                            isResetting
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300'
                        }`}
                        title="Seed kullanıcıları dışındaki tüm verileri siler"
                    >
                        {isResetting ? (
                            <>
                                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span>Sıfırlanıyor...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span>Verileri Sıfırla</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Posts Grid */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="paper-texture rounded-2xl vintage-shadow p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 bg-[#8b7355]/10 rounded-2xl flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-[#2c2c2c] mb-2">
                            Blog bulunamadı
                        </h3>
                        <p className="text-[#6b6b6b]">
                            Seçilen durumda henüz blog yazısı bulunmuyor.
                        </p>
                    </div>
                ) : (
                    posts.map((post, index) => (
                        <div
                            key={post.id}
                            className="paper-texture rounded-2xl vintage-shadow p-6 hover:shadow-lg transition-all duration-300 animate-fadeInUp"
                            style={{animationDelay: `${index * 0.1}s`}}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                            post.status === 'APPROVED' 
                                                ? 'bg-green-100 text-green-700'
                                                : post.status === 'REJECTED'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>
                                            {post.status === 'APPROVED' ? 'Onaylandı' : 
                                             post.status === 'REJECTED' ? 'Reddedildi' : 'Bekliyor'}
                                        </span>
                                        
                                        {post.category && (
                                            <span className="px-3 py-1 bg-[#8b7355]/10 text-[#8b7355] rounded-full text-xs font-medium">
                                                {post.category.name}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <h3 className="text-xl font-bold text-[#2c2c2c] mb-2 line-clamp-2">
                                        {post.title}
                                    </h3>
                                    
                                    <p className="text-[#6b6b6b] mb-4 line-clamp-3 leading-relaxed">
                                        {post.content.substring(0, 200)}...
                                    </p>
                                    
                                    <div className="flex items-center space-x-4 text-sm text-[#6b6b6b]">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                                {post.author.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="font-medium">{post.author.name}</span>
                                        </div>
                                        <span>•</span>
                                        <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col space-y-2 ml-6">
                                    {post.status === 'PENDING' && (
                                        <>
                                            <button
                                                onClick={() => handleStatusChange(post.id, 'APPROVED')}
                                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span>Onayla</span>
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(post.id, 'REJECTED')}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center space-x-2"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                                <span>Reddet</span>
                                            </button>
                                        </>
                                    )}
                                    
                                    <button
                                        onClick={() => router.push(`/blog/${post.id}`)}
                                        className="px-4 py-2 bg-[#8b7355] text-white rounded-lg hover:bg-[#6d5a43] transition-colors text-sm font-medium flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                        <span>Görüntüle</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => handleDeletePost(post.id)}
                                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center space-x-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        <span>Sil</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            page === 1
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'vintage-btn-outline hover:bg-[#8b7355] hover:text-white'
                        }`}
                    >
                        <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>Önceki</span>
                        </div>
                    </button>
                    
                    <div className="flex items-center space-x-2">
                        {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                            const pageNumber = Math.max(1, Math.min(page - 2 + i, pagination.totalPages - 4 + i));
                            return (
                                <button
                                    key={`page-${pageNumber}-${i}`}
                                    onClick={() => setPage(pageNumber)}
                                    className={`w-12 h-12 rounded-xl font-medium transition-all duration-300 ${
                                        page === pageNumber
                                            ? 'vintage-accent-bg text-white vintage-shadow'
                                            : 'paper-texture hover:bg-[#8b7355]/5 text-[#6b6b6b] hover:text-[#8b7355]'
                                    }`}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}
                    </div>
                    
                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.totalPages}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                            page === pagination.totalPages
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'vintage-btn-outline hover:bg-[#8b7355] hover:text-white'
                        }`}
                    >
                        <div className="flex items-center space-x-2">
                            <span>Sonraki</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
} 