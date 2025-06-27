'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Home() {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get('category');
    
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data = await response.json();
                if (response.ok) {
                    setCategories(data.categories);
                }
            } catch (error) {
                console.error('Kategoriler yüklenirken hata:', error);
            }
        };

        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError('');
                
                const url = categoryId 
                    ? `/api/post/list?categoryId=${categoryId}`
                    : '/api/post/list';
                
                const response = await fetch(url);
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
    }, [categoryId]);

    if (loading) {
        return (
            <div className="vintage-bg min-h-screen">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-48 bg-[#8b7355]/10 rounded-2xl mb-4"></div>
                                <div className="h-6 bg-[#8b7355]/10 rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-[#8b7355]/10 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="vintage-bg min-h-screen">
                <div className="max-w-7xl mx-auto p-6">
                    <div className="paper-texture border border-red-200 text-red-700 px-6 py-4 rounded-2xl vintage-shadow" role="alert">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <div>
                                <strong className="font-bold">Hata! </strong>
                                <span className="block sm:inline">{error}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const selectedCategory = categories.find(cat => cat.id === categoryId);

    return (
        <div className="min-h-screen vintage-bg">
            {/* Hero Section - Minimalist Vintage */}
            <div className="relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 py-20">
                    <div className="text-center space-y-8">
                        <div className="space-y-4 animate-fadeInUp">
                            {selectedCategory ? (
                                <>
                                    <p className="text-lg text-[#8b7355] font-medium">
                                        {selectedCategory.name} Kategorisi
                                    </p>
                                    <h1 className="text-4xl md:text-6xl font-bold text-[#2c2c2c] leading-tight">
                                        İlham Veren
                                        <span className="block text-[#8b7355]">Yazılar</span>
                                    </h1>
                                </>
                            ) : (
                                <h1 className="text-4xl md:text-6xl font-bold text-[#2c2c2c] leading-tight">
                                    TBT Blog
                                    <span className="block text-lg md:text-xl font-normal text-[#6b6b6b] mt-4">
                                        Minimalist tasarım, maksimum etki
                                    </span>
                                </h1>
                            )}
                        </div>
                        
                        <div className="animate-fadeInUp">
                            <Link
                                href="/blog/create"
                                className="inline-flex items-center gap-3 vintage-btn text-lg px-8 py-4 rounded-xl"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Yeni Yazı Paylaş
                            </Link>
                        </div>
                    </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute top-20 left-10 w-32 h-32 bg-[#8b7355]/10 rounded-full blur-2xl animate-gentleFloat"></div>
                <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#7d8471]/10 rounded-full blur-2xl animate-gentleFloat" style={{animationDelay: '1s'}}></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pb-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Ana İçerik */}
                    <div className="flex-1">
                        {posts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="paper-texture rounded-3xl p-12 vintage-shadow animate-fadeInUp">
                                    <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-2xl flex items-center justify-center">
                                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#2c2c2c] mb-4">
                                        {selectedCategory 
                                            ? `${selectedCategory.name} kategorisinde henüz yazı yok`
                                            : 'İlk yazıyı sen paylaş!'
                                        }
                                    </h3>
                                    <p className="text-[#6b6b6b] mb-8 leading-relaxed">
                                        Topluluğa katkıda bulunmak için ilk adımı at. Fikirlerini paylaş, ilham ver.
                                    </p>
                                    <Link
                                        href="/blog/create"
                                        className="vintage-btn-outline"
                                    >
                                        Yazı Oluştur
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                {posts.map((post, index) => (
                                    <article
                                        key={post.id}
                                        className="paper-texture rounded-2xl overflow-hidden vintage-shadow hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-fadeInUp group"
                                        style={{animationDelay: `${index * 0.1}s`}}
                                    >
                                        <Link href={`/blog/${post.id}`} className="block">
                                            <div className={`flex flex-col ${index === 0 ? 'md:flex-row' : 'lg:flex-row'} gap-0`}>
                                                {/* Image Section */}
                                                <div className={`${index === 0 ? 'md:w-1/2' : 'lg:w-1/3'} relative overflow-hidden`}>
                                                    {post.imageUrl ? (
                                                        <div className="relative w-full h-64 lg:h-full min-h-[16rem] overflow-hidden">
                                                            <img
                                                                src={post.imageUrl}
                                                                alt={post.title}
                                                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                                onError={(e) => {
                                                                    e.target.parentElement.innerHTML = `
                                                                        <div class="w-full h-full bg-gradient-to-br from-[#8b7355] to-[#7d8471] flex items-center justify-center">
                                                                            <div class="text-white text-center p-6">
                                                                                <svg class="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                                </svg>
                                                                                <p class="font-semibold opacity-90">Blog Yazısı</p>
                                                                            </div>
                                                                        </div>
                                                                    `;
                                                                }}
                                                            />
                                                        </div>
                                                    ) : (
                                                        <div className="w-full h-64 lg:h-full min-h-[16rem] bg-gradient-to-br from-[#8b7355] to-[#7d8471] flex items-center justify-center">
                                                            <div className="text-white text-center p-6">
                                                                <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                                <p className="font-semibold opacity-90">Blog Yazısı</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                                
                                                {/* Content Section */}
                                                <div className={`${index === 0 ? 'md:w-1/2' : 'lg:w-2/3'} p-8`}>
                                                    {post.category && (
                                                        <span className="inline-block bg-[#8b7355]/10 text-[#8b7355] text-sm px-4 py-2 rounded-full mb-4 font-medium">
                                                            {post.category.name}
                                                        </span>
                                                    )}
                                                    
                                                    <h2 className={`font-bold text-[#2c2c2c] mb-4 group-hover:text-[#8b7355] transition-colors line-clamp-2 ${
                                                        index === 0 ? 'text-3xl' : 'text-2xl'
                                                    }`}>
                                                        {post.title}
                                                    </h2>
                                                    
                                                    <p className="text-[#6b6b6b] mb-6 line-clamp-3 leading-relaxed">
                                                        {post.content.substring(0, index === 0 ? 200 : 150)}...
                                                    </p>
                                                    
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center text-white font-bold">
                                                                {(post.author?.name || 'A').charAt(0).toUpperCase()}
                                                            </div>
                                                            <div>
                                                                <p className="font-semibold text-[#2c2c2c]">{post.author?.name || 'Anonim'}</p>
                                                                <p className="text-sm text-[#6b6b6b]">
                                                                    {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        
                                                        <div className="flex items-center gap-2 text-[#8b7355] font-semibold group-hover:gap-3 transition-all">
                                                            <span className="text-sm">Devamını Oku</span>
                                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Sidebar - Kategoriler */}
                    <div className="lg:w-80">
                        <div className="sticky top-28">
                            <div className="paper-texture rounded-2xl vintage-shadow p-8 border border-[#8b7355]/10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#2c2c2c]">Kategoriler</h3>
                                </div>
                                
                                <div className="space-y-3">
                                    <Link
                                        href="/"
                                        className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                            !categoryId 
                                                ? 'vintage-accent-bg text-white vintage-shadow' 
                                                : 'hover:bg-[#8b7355]/5 text-[#6b6b6b] hover:text-[#8b7355]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${!categoryId ? 'bg-white' : 'bg-[#8b7355]'}`}></div>
                                            <span className="font-medium">Tüm Yazılar</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            !categoryId ? 'bg-white/20' : 'bg-[#8b7355]/10'
                                        }`}>
                                            {posts.length}
                                        </span>
                                    </Link>
                                    
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/?category=${category.id}`}
                                            className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                                categoryId === category.id 
                                                    ? 'vintage-accent-bg text-white vintage-shadow' 
                                                    : 'hover:bg-[#8b7355]/5 text-[#6b6b6b] hover:text-[#8b7355]'
                                            }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={`w-3 h-3 rounded-full ${
                                                    categoryId === category.id ? 'bg-white' : 'bg-[#8b7355]'
                                                }`}></div>
                                                <span className="font-medium">{category.name}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 