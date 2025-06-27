'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const { data: session, update: updateSession } = useSession();
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [updateMessage, setUpdateMessage] = useState('');

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }

        fetchUserData();
        fetchUserPosts();
    }, [session]);

    const fetchUserData = async () => {
        try {
            const response = await fetch('/api/user/profile');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Kullanıcı bilgileri alınamadı');
            }

            setUser(data);
            setFormData(prev => ({
                ...prev,
                name: data.name,
                email: data.email,
                bio: data.bio || ''
            }));
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchUserPosts = async () => {
        try {
            const response = await fetch('/api/post/list?userId=' + session.user.id);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Blog yazıları alınamadı');
            }

            setPosts(data.posts);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdateMessage('');

        // Şifre değişikliği kontrolü
        if (formData.newPassword || formData.confirmPassword || formData.currentPassword) {
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Yeni şifreler eşleşmiyor');
                return;
            }
            if (!formData.currentPassword) {
                setError('Mevcut şifrenizi girmelisiniz');
                return;
            }
        }

        try {
            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Profil güncellenemedi');
            }

            setUpdateMessage('Profil başarıyla güncellendi');
            await updateSession();
            
            // Header'daki ismi güncellemek için custom event tetikle
            const profileUpdateEvent = new CustomEvent('userProfileUpdated', {
                detail: data
            });
            document.dispatchEvent(profileUpdateEvent);

            // Şifre alanlarını temizle
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            // Formu kapat
            setShowEditForm(false);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="vintage-bg min-h-screen">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#8b7355]/10 rounded w-1/4 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="paper-texture rounded-2xl p-6">
                                <div className="w-24 h-24 bg-[#8b7355]/10 rounded-full mx-auto mb-4"></div>
                                <div className="h-6 bg-[#8b7355]/10 rounded mb-2"></div>
                                <div className="h-4 bg-[#8b7355]/10 rounded w-3/4 mx-auto"></div>
                            </div>
                            <div className="md:col-span-2 space-y-4">
                                {[1,2,3].map(i => (
                                    <div key={i} className="paper-texture rounded-2xl p-6">
                                        <div className="h-6 bg-[#8b7355]/10 rounded mb-4"></div>
                                        <div className="h-4 bg-[#8b7355]/10 rounded w-1/2"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen vintage-bg">
            <div className="max-w-6xl mx-auto p-6">
                {/* Header */}
                <div className="mb-12 animate-fadeInUp">
                    <h1 className="text-4xl font-bold text-[#2c2c2c] mb-4">
                        Profilim
                    </h1>
                    <p className="text-[#6b6b6b] text-lg">
                        Hesap bilgilerinizi düzenleyin ve yazılarınızı yönetin
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sol Taraf - Profil Bilgileri */}
                    <div className="lg:col-span-1">
                        <div className="paper-texture rounded-2xl vintage-shadow p-8 animate-fadeInUp">
                            <div className="text-center mb-8">
                                <div className="w-32 h-32 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-2xl flex items-center justify-center text-white text-4xl font-bold mx-auto mb-6 shadow-lg">
                                    {user?.name?.charAt(0).toUpperCase() || '?'}
                                </div>
                                <h2 className="text-2xl font-bold text-[#2c2c2c] mb-2">{user?.name}</h2>
                                <p className="text-[#6b6b6b] mb-4">{user?.email}</p>
                                {user?.bio && (
                                    <div className="bg-[#8b7355]/5 rounded-xl p-4 mb-6">
                                        <p className="text-[#2c2c2c] leading-relaxed italic">"{user.bio}"</p>
                                    </div>
                                )}
                                
                                {/* İstatistikler */}
                                <div className="grid grid-cols-1 gap-4 mb-6">
                                    <div className="bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl p-4 text-white">
                                        <div className="text-2xl font-bold">{posts.length}</div>
                                        <div className="text-sm opacity-90">Blog Yazısı</div>
                                    </div>
                                </div>
                            </div>

                            {!showEditForm && (
                                <button
                                    onClick={() => setShowEditForm(true)}
                                    className="vintage-btn w-full"
                                >
                                    Profili Düzenle
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Sağ Taraf - Form veya Blog Yazıları */}
                    <div className="lg:col-span-2">
                        {error && (
                            <div className="paper-texture border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-6 animate-fadeInUp">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span>{error}</span>
                                </div>
                            </div>
                        )}

                        {updateMessage && (
                            <div className="paper-texture border border-green-200 text-green-700 px-6 py-4 rounded-2xl mb-6 animate-fadeInUp">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>{updateMessage}</span>
                                </div>
                            </div>
                        )}

                        {showEditForm ? (
                            <div className="paper-texture rounded-2xl vintage-shadow p-8 animate-fadeInUp">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold text-[#2c2c2c]">Profil Bilgilerini Düzenle</h2>
                                    <button
                                        onClick={() => setShowEditForm(false)}
                                        className="text-[#6b6b6b] hover:text-[#8b7355] p-2 rounded-lg hover:bg-[#8b7355]/5 transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                            Ad Soyad
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="vintage-input w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                            E-posta
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="vintage-input w-full"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                            Biyografi
                                        </label>
                                        <textarea
                                            name="bio"
                                            value={formData.bio}
                                            onChange={handleInputChange}
                                            className="vintage-input w-full h-32 resize-none"
                                            placeholder="Kendinizden bahsedin..."
                                        />
                                    </div>

                                    <div className="border-t border-[#8b7355]/10 pt-6 mt-6">
                                        <h3 className="text-lg font-semibold text-[#2c2c2c] mb-6">Şifre Değiştir</h3>
                                        
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                                    Mevcut Şifre
                                                </label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleInputChange}
                                                    className="vintage-input w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                                    Yeni Şifre
                                                </label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleInputChange}
                                                    className="vintage-input w-full"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                                    Yeni Şifre (Tekrar)
                                                </label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    className="vintage-input w-full"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end space-x-4 pt-6">
                                        <button
                                            type="button"
                                            onClick={() => setShowEditForm(false)}
                                            className="vintage-btn-outline"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            className="vintage-btn"
                                        >
                                            Değişiklikleri Kaydet
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div className="paper-texture rounded-2xl vintage-shadow p-8 animate-fadeInUp">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-bold text-[#2c2c2c]">Blog Yazılarım</h2>
                                    <Link 
                                        href="/blog/create"
                                        className="vintage-btn-outline text-sm"
                                    >
                                        Yeni Yazı
                                    </Link>
                                </div>
                                
                                {posts.length === 0 ? (
                                    <div className="text-center py-16">
                                        <div className="w-20 h-20 mx-auto mb-6 bg-[#8b7355]/10 rounded-2xl flex items-center justify-center">
                                            <svg className="w-10 h-10 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-[#2c2c2c] mb-2">
                                            Henüz blog yazınız bulunmuyor
                                        </h3>
                                        <p className="text-[#6b6b6b] mb-6">
                                            İlk yazınızı oluşturmaya ne dersiniz?
                                        </p>
                                        <Link
                                            href="/blog/create"
                                            className="vintage-btn"
                                        >
                                            İlk Yazımı Oluştur
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {posts.map((post, index) => (
                                            <div 
                                                key={post.id} 
                                                className="border border-[#8b7355]/10 rounded-xl p-6 hover:bg-[#8b7355]/5 transition-all duration-300 animate-fadeInUp"
                                                style={{animationDelay: `${index * 0.1}s`}}
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <h3 className="text-lg font-semibold text-[#2c2c2c] hover:text-[#8b7355] transition-colors line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <span className={`ml-4 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                                        post.status === 'APPROVED' 
                                                            ? 'bg-green-100 text-green-700'
                                                            : post.status === 'PENDING'
                                                            ? 'bg-yellow-100 text-yellow-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }`}>
                                                        {post.status === 'APPROVED' 
                                                            ? 'Onaylandı'
                                                            : post.status === 'PENDING'
                                                            ? 'Onay Bekliyor'
                                                            : 'Reddedildi'}
                                                    </span>
                                                </div>
                                                
                                                <p className="text-[#6b6b6b] mb-4 line-clamp-2">
                                                    {post.content.substring(0, 150)}...
                                                </p>
                                                
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center text-sm text-[#6b6b6b] space-x-4">
                                                        <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                                        {post.category && (
                                                            <span className="bg-[#8b7355]/10 text-[#8b7355] px-2 py-1 rounded-full text-xs">
                                                                {post.category.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <button
                                                        onClick={() => router.push(`/blog/${post.id}`)}
                                                        className="text-[#8b7355] hover:text-[#6d5a43] font-medium text-sm flex items-center gap-1 transition-colors"
                                                    >
                                                        Görüntüle
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}