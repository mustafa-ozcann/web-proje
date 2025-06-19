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

    const selectedCategory = categories.find(cat => cat.id === categoryId);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="relative max-w-7xl mx-auto px-6 py-16">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                            {selectedCategory ? (
                                <>
                                    <span className="block text-xl md:text-2xl font-normal text-blue-100 mb-2">
                                        {selectedCategory.name} Kategorisi
                                    </span>
                                    İlham Veren Yazılar
                                </>
                            ) : (
                                <>
                                    Teknoloji ve 
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400"> İnovasyon</span>
                                    <span className="block text-xl md:text-2xl font-normal text-blue-100 mt-2">
                                        Güncel teknoloji trendleri ve derinlemesine analizler
                                    </span>
                                </>
                            )}
                        </h1>
                        <Link
                            href="/blog/create"
                            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-50 transition-all duration-300 hover:scale-105 shadow-lg"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Yeni Yazı Paylaş
                        </Link>
                    </div>
                </div>
                
                {/* Animated background elements */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -top-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Ana İçerik */}
                    <div className="flex-1">
                        {posts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                                    {selectedCategory 
                                        ? `${selectedCategory.name} kategorisinde henüz yazı yok`
                                        : 'İlk yazıyı sen paylaş!'
                                    }
                                </h3>
                                <p className="text-gray-600 mb-8">Topluluğa katkıda bulunmak için ilk adımı at.</p>
                                <Link
                                    href="/blog/create"
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                                >
                                    Yazı Oluştur
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {posts.map((post, index) => (
                                    <article
                                        key={post.id}
                                        className={`group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                                            index === 0 ? 'md:col-span-2' : ''
                                        }`}
                                    >
                                        <Link href={`/blog/${post.id}`} className="block">
                                            {post.imageUrl ? (
                                                <div className="relative overflow-hidden">
                                                    <img
                                                        src={post.imageUrl}
                                                        alt={post.title}
                                                        className={`w-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                                                            index === 0 ? 'h-64' : 'h-48'
                                                        }`}
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                </div>
                                            ) : (
                                                <div className={`bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 ${
                                                    index === 0 ? 'h-64' : 'h-48'
                                                } flex items-center justify-center`}>
                                                    <div className="text-white text-center p-6">
                                                        <svg className="w-16 h-16 mx-auto mb-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <p className="font-semibold opacity-90">Blog Yazısı</p>
                                                    </div>
                                                </div>
                                            )}
                                            
                                            <div className="p-6">
                                                {post.category && (
                                                    <span className="inline-block bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm px-3 py-1 rounded-full mb-3 font-medium">
                                                        {post.category.name}
                                                    </span>
                                                )}
                                                
                                                <h2 className={`font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 ${
                                                    index === 0 ? 'text-2xl' : 'text-xl'
                                                }`}>
                                                    {post.title}
                                                </h2>
                                                
                                                <p className="text-gray-600 mb-4 line-clamp-3">
                                                    {post.content.substring(0, index === 0 ? 200 : 120)}...
                                                </p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                            {(post.author?.name || 'A').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{post.author?.name || 'Anonim'}</p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(post.createdAt).toLocaleDateString('tr-TR', {
                                                                    day: 'numeric',
                                                                    month: 'long',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-2 text-blue-600 font-semibold group-hover:gap-3 transition-all">
                                                        <span className="text-sm">Oku</span>
                                                        <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
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
                        <div className="sticky top-8">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800">Kategoriler</h3>
                                </div>
                                
                                <div className="space-y-2">
                                    <Link
                                        href="/"
                                        className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                            !categoryId 
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                                                : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full ${!categoryId ? 'bg-white' : 'bg-blue-400'}`}></div>
                                            <span className="font-medium">Tüm Yazılar</span>
                                        </div>
                                    </Link>
                                    
                                    {categories.map((category) => (
                                        <Link
                                            key={category.id}
                                            href={`/?category=${category.id}`}
                                            className={`group flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                                                categoryId === category.id 
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                                                    : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${
                                                    categoryId === category.id ? 'bg-white' : 'bg-blue-400'
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