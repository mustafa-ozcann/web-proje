'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Toast from '../../../components/Toast';

export default function CreateBlog() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        imageUrl: '',
        categoryId: '',
    });
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

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

    if (status === 'loading') {
        return (
            <div className="vintage-bg min-h-screen">
                <div className="max-w-4xl mx-auto p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#8b7355]/10 rounded w-1/3 mb-8"></div>
                        <div className="paper-texture rounded-2xl p-8">
                            <div className="space-y-6">
                                {[1,2,3,4].map(i => (
                                    <div key={i}>
                                        <div className="h-4 bg-[#8b7355]/10 rounded w-1/4 mb-2"></div>
                                        <div className="h-12 bg-[#8b7355]/10 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/post/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Blog oluşturulurken bir hata oluştu');
            }

            // Başarı bildirimi göster
            setToastMessage('Blog yazınız başarıyla oluşturuldu ve admin onayına gönderildi! Onaylandıktan sonra TBT Blog\'da yayınlanacaktır.');
            setToastType('success');
            setShowToast(true);

            // Form'u sıfırla
            setFormData({
                title: '',
                content: '',
                imageUrl: '',
                categoryId: '',
            });

            // 3 saniye sonra ana sayfaya yönlendir
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen vintage-bg overflow-x-hidden">
            <div className="max-w-4xl mx-auto p-6">
                {/* Header */}
                <div className="text-center mb-12 animate-fadeInUp">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-[#2c2c2c] mb-4">
                        Yeni Blog Yazısı
                    </h1>
                    <p className="text-[#6b6b6b] text-lg max-w-2xl mx-auto">
                        Fikirlerinizi paylaşın, topluluğa ilham verin. Yazınız admin onayından sonra yayınlanacaktır.
                    </p>
                </div>

                <div className="paper-texture rounded-2xl vintage-shadow p-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
                            <div className="flex items-center space-x-3">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="font-medium">{error}</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-w-0">
                            {/* Sol Kolon */}
                            <div className="space-y-6 min-w-0">
                                <div>
                                    <label htmlFor="title" className="block text-sm font-semibold text-[#2c2c2c] mb-3">
                                        Başlık *
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="vintage-input w-full text-lg"
                                        placeholder="Yazınızın başlığını girin"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoryId" className="block text-sm font-semibold text-[#2c2c2c] mb-3">
                                        Kategori
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        className="vintage-input w-full"
                                    >
                                        <option value="">Kategori seçin (opsiyonel)</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                    <p className="text-xs text-[#6b6b6b] mt-2">
                                        Yazınızı uygun kategoriye yerleştirin
                                    </p>
                                </div>

                                <div>
                                    <label htmlFor="imageUrl" className="block text-sm font-semibold text-[#2c2c2c] mb-3">
                                        Görsel URL
                                    </label>
                                    <input
                                        type="url"
                                        id="imageUrl"
                                        name="imageUrl"
                                        value={formData.imageUrl}
                                        onChange={handleChange}
                                        className="vintage-input w-full"
                                        placeholder="https://example.com/image.jpg"
                                    />
                                    <p className="text-xs text-[#6b6b6b] mt-2">
                                        Yazınızı destekleyecek bir görsel URL'si ekleyin (opsiyonel)
                                    </p>
                                </div>
                            </div>

                            {/* Sağ Kolon - Preview */}
                            <div className="bg-[#8b7355]/5 rounded-xl p-6 border border-[#8b7355]/10 overflow-hidden">
                                <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Önizleme
                                </h3>
                                
                                <div className="space-y-4 min-w-0">
                                    {formData.imageUrl && (
                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                            <img 
                                                src={formData.imageUrl} 
                                                alt="Önizleme" 
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="min-w-0">
                                        <h4 className={`font-bold text-[#2c2c2c] break-words ${formData.title ? '' : 'text-gray-400'}`}>
                                            {formData.title || 'Yazı başlığı buraya gelecek'}
                                        </h4>
                                        
                                        {formData.categoryId && (
                                            <span className="inline-block bg-[#8b7355]/10 text-[#8b7355] text-xs px-2 py-1 rounded-full mt-2">
                                                {categories.find(cat => cat.id === formData.categoryId)?.name}
                                            </span>
                                        )}
                                    </div>
                                    
                                    <div className="min-w-0">
                                        <p className={`text-sm break-words overflow-hidden ${formData.content ? 'text-[#6b6b6b]' : 'text-gray-400'}`}>
                                            {formData.content.substring(0, 150) + (formData.content.length > 150 ? '...' : '') || 'İçerik önizlemesi buraya gelecek'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* İçerik Alanı */}
                        <div>
                            <label htmlFor="content" className="block text-sm font-semibold text-[#2c2c2c] mb-3">
                                İçerik *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                required
                                rows="12"
                                className="vintage-input w-full resize-none"
                                placeholder="Yazınızın içeriğini buraya yazın. Düşüncelerinizi özgürce paylaşın..."
                            />
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-xs text-[#6b6b6b]">
                                    Minimum 50 karakter öneriyoruz
                                </p>
                                <span className={`text-xs ${formData.content.length < 50 ? 'text-red-500' : 'text-[#8b7355]'}`}>
                                    {formData.content.length} karakter
                                </span>
                            </div>
                        </div>

                        {/* Gönder Butonu */}
                        <div className="flex justify-end pt-6 border-t border-[#8b7355]/10">
                            <button
                                type="submit"
                                disabled={loading || formData.content.length < 50}
                                className={`vintage-btn text-lg px-12 py-4 ${
                                    loading || formData.content.length < 50 
                                        ? 'opacity-50 cursor-not-allowed' 
                                        : ''
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {loading && (
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                    )}
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    <span>{loading ? 'Gönderiliyor...' : 'Yazıyı Gönder'}</span>
                                </div>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Yardım Kartı */}
                <div className="paper-texture rounded-2xl vintage-shadow p-6 mt-8 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                    <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Yazı İpuçları
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#6b6b6b]">
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 flex-shrink-0"></div>
                            <span>Başlığınızı dikkat çekici ve açıklayıcı yapın</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 flex-shrink-0"></div>
                            <span>İçeriğinizi paragraflar halinde düzenleyin</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 flex-shrink-0"></div>
                            <span>Görsel eklemek yazınızı daha çekici yapar</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-[#8b7355] rounded-full mt-2 flex-shrink-0"></div>
                            <span>Kategori seçimi keşfedilebilirliği artırır</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <Toast
                message={toastMessage}
                type={toastType}
                isVisible={showToast}
                onHide={() => setShowToast(false)}
                duration={3000}
            />
        </div>
    );
}