'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Giriş denemesi:', { email: form.email });
            
            // NextAuth'un signIn fonksiyonunu çağır
            const result = await signIn('credentials', {
                email: form.email.toLowerCase(), // Email'i normalize et
                password: form.password,
                redirect: false, 
                callbackUrl: '/dashboard' 
            });

            console.log('Giriş sonucu:', result);

            if (!result?.ok) {
                setError(
                    result?.error === 'CredentialsSignin'
                        ? 'Email veya şifre hatalı' 
                        : 'Giriş yapılırken bir hata oluştu' 
                );
                return;
            }

            if (result.url) {
                router.push(result.url); 
            } else {
                router.push('/dashboard'); 
            }
            router.refresh(); 
        } catch (err) {
            console.error('Login error:', err);
            setError('Bir hata oluştu, lütfen tekrar deneyin');
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h2 className="text-4xl font-bold text-[#2c2c2c] mb-2">
                        Hoş Geldiniz
                    </h2>
                    <p className="text-[#6b6b6b]">
                        Hesabınıza giriş yaparak devam edin
                    </p>
                </div>

                {/* Login Form */}
                <div className="paper-texture rounded-2xl vintage-shadow p-8 animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                            <div className="flex items-center space-x-3">
                                <svg className="w-5 h-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        </div>
                    )}
                    
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                E-posta Adresi
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="vintage-input w-full"
                                placeholder="E-posta adresinizi girin"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-semibold text-[#2c2c2c] mb-2">
                                Şifre
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="vintage-input w-full"
                                placeholder="Şifrenizi girin"
                            />
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
                                <span>{loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}</span>
                            </div>
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-[#6b6b6b]">
                            Henüz hesabınız yok mu?{' '}
                            <Link
                                href="/register"
                                className="font-semibold text-[#8b7355] hover:text-[#6d5a43] transition-colors duration-300"
                            >
                                Kayıt olun
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="text-center animate-fadeInUp" style={{animationDelay: '0.4s'}}>
                    <p className="text-xs text-[#6b6b6b]">
                        © 2024 Vintage Blog. Giriş yaparak{' '}
                        <a href="#" className="text-[#8b7355] hover:text-[#6d5a43] transition-colors">kullanım şartlarını</a>{' '}
                        kabul etmiş olursunuz.
                    </p>
                </div>
            </div>
        </div>
    );
}
