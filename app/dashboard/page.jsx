'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

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
            
            // Header'daki ismi güncellemek için visibilitychange event'ini tetikle
            const event = new Event('visibilitychange');
            document.dispatchEvent(event);

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
        return <div className="p-6">Yükleniyor...</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sol Taraf - Profil Bilgileri */}
                    <div className="md:w-1/3">
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                        <div className="text-center mb-6">
                            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-semibold mx-auto mb-4">
                                {user?.name?.charAt(0) || '?'}
                            </div>
                            <h2 className="text-2xl font-bold">{user?.name}</h2>
                            <p className="text-gray-600">{user?.email}</p>
                            {user?.bio && (
                                <p className="mt-2 text-gray-700">{user.bio}</p>
                            )}
                        </div>

                        {!showEditForm && (
                            <button
                                onClick={() => setShowEditForm(true)}
                                className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Profili Düzenle
                            </button>
                        )}
                    </div>
                </div>

                {/* Sağ Taraf - Form veya Blog Yazıları */}
                <div className="md:w-2/3">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {updateMessage && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                            {updateMessage}
                        </div>
                    )}

                    {showEditForm ? (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Profil Bilgilerini Düzenle</h2>
                                <button
                                    onClick={() => setShowEditForm(false)}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Ad Soyad
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        E-posta
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Biyografi
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border rounded-md h-24 resize-none"
                                        placeholder="Kendinizden bahsedin..."
                                    />
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h3 className="text-lg font-medium mb-4">Şifre Değiştir</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mevcut Şifre
                                            </label>
                                            <input
                                                type="password"
                                                name="currentPassword"
                                                value={formData.currentPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Yeni Şifre
                                            </label>
                                            <input
                                                type="password"
                                                name="newPassword"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Yeni Şifre (Tekrar)
                                            </label>
                                            <input
                                                type="password"
                                                name="confirmPassword"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                className="w-full px-3 py-2 border rounded-md"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowEditForm(false)}
                                        className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                    >
                                        Değişiklikleri Kaydet
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Blog Yazılarım</h2>
                            {posts.length === 0 ? (
                                <p className="text-gray-500">Henüz blog yazınız bulunmuyor.</p>
                            ) : (
                                <div className="space-y-4">
                                    {posts.map(post => (
                                        <div key={post.id} className="border rounded-lg p-4">
                                            <h3 className="text-lg font-medium mb-2">{post.title}</h3>
                                            <div className="flex items-center text-sm text-gray-500 mb-2">
                                                <span>{new Date(post.createdAt).toLocaleDateString('tr-TR')}</span>
                                                <span className="mx-2">•</span>
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    post.status === 'APPROVED' 
                                                        ? 'bg-green-100 text-green-800'
                                                        : post.status === 'PENDING'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {post.status === 'APPROVED' 
                                                        ? 'Onaylandı'
                                                        : post.status === 'PENDING'
                                                        ? 'Onay Bekliyor'
                                                        : 'Reddedildi'}
                                                </span>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => router.push(`/blog/${post.id}`)}
                                                    className="text-blue-500 hover:text-blue-600"
                                                >
                                                    Görüntüle
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