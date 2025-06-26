'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Register API'sine POST isteği gönder
            const res = await fetch('/api/user/register', {
                method: 'POST',
                body: JSON.stringify(form), // Form verisini JSON'a çevir
                headers: { 'Content-Type': 'application/json' }, // JSON content type belirt
            });

            // Kayıt başarılıysa login sayfasına yönlendir
            if (res.ok) {
                router.push('/login');
            } else {
                const data = await res.json();
                setError(data.error || 'Bir hata oluştu');
            }
        } catch (err) {
            setError('Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen vintage-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center animate-fadeInUp">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-[#2c2c2c] mb-2">
                        Katılın
                    </h1>
                    <p className="text-[#6b6b6b]">
                        Vintage Blog topluluğuna katılın ve fikirlerinizi paylaşın
                    </p>
                </div>

                {/* Register Form */}
                <div className="paper-texture rounded-2xl vintage-shadow p-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                Ad Soyad
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Adınız ve soyadınız"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="vintage-input w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                E-posta Adresi
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="E-posta adresiniz"
                                value={form.email}
                                onChange={handleChange}
                                required
                                className="vintage-input w-full"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                Şifre
                            </label>
                            <input
                                type="password"
                                name="password"
                                placeholder="Güçlü bir şifre oluşturun"
                                value={form.password}
                                onChange={handleChange}
                                required
                                className="vintage-input w-full"
                            />
                            <p className="text-xs text-[#6b6b6b] mt-2">
                                En az 6 karakter kullanmanızı öneririz
                            </p>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full vintage-btn text-lg py-4 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <div className="flex items-center justify-center space-x-3">
                                {loading && (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                <span>{loading ? 'Hesap oluşturuluyor...' : 'Hesap Oluştur'}</span>
                            </div>
                        </button>
                    </form>
                    
                    <div className="mt-8 text-center">
                        <p className="text-[#6b6b6b]">
                            Zaten hesabınız var mı?{' '}
                            <Link
                                href="/login"
                                className="font-semibold text-[#8b7355] hover:text-[#6d5a43] transition-colors duration-300"
                            >
                                Giriş yapın
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Benefits Section */}
                <div className="paper-texture rounded-2xl vintage-shadow p-6 animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                    <h3 className="text-lg font-semibold text-[#2c2c2c] mb-4 text-center">
                        Neden Vintage Blog?
                    </h3>
                    <div className="space-y-3 text-sm text-[#6b6b6b]">
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-[#8b7355]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </div>
                            <span>Sınırsız blog yazısı paylaşın</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-[#8b7355]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <span>Toplulukla etkileşime geçin</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-[#8b7355]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                </svg>
                            </div>
                            <span>Kategorilerde organize edin</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-[#8b7355]/20 rounded-lg flex items-center justify-center">
                                <svg className="w-4 h-4 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <span>Güvenli ve reklamsız deneyim</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center animate-fadeInUp" style={{animationDelay: '0.6s'}}>
                    <p className="text-xs text-[#6b6b6b]">
                        Kayıt olarak{' '}
                        <a href="#" className="text-[#8b7355] hover:text-[#6d5a43] transition-colors">kullanım şartlarını</a>{' '}
                        ve{' '}
                        <a href="#" className="text-[#8b7355] hover:text-[#6d5a43] transition-colors">gizlilik politikasını</a>{' '}
                        kabul etmiş olursunuz.
                    </p>
                </div>
            </div>
        </div>
    );
}
