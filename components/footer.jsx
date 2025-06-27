"use client";
import React from 'react'
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();
    if (pathname.startsWith("/admin")) return null;
    
    return (
        <footer className="paper-texture border-t-2 border-[#8b7355]/10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    {/* Logo ve Açıklama */}
                    <div className="space-y-4">
                        <h3 className="text-2xl font-bold text-[#8b7355]">TBT Blog</h3>
                        <p className="text-[#6b6b6b] text-sm leading-relaxed">
                            Minimalist tasarım anlayışı ile sizlere ilham verici içerikler sunuyoruz. 
                            TBT Blog'da modern teknoloji ve kaliteli içeriğin buluştuğu platformumuzda siz de yerinizi alın.
                        </p>
                        <div className="flex justify-center md:justify-start space-x-4">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                                </svg>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                                </svg>
                            </div>
                            <div className="w-8 h-8 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-lg flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 cursor-pointer">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Hızlı Linkler */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[#2c2c2c]">Hızlı Linkler</h4>
                        <div className="space-y-3">
                            <a href="/" className="block text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300 text-sm">Ana Sayfa</a>
                            <a href="/blog/create" className="block text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300 text-sm">Yazı Oluştur</a>
                            <a href="/dashboard" className="block text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300 text-sm">Profil</a>
                            <a href="/messages" className="block text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300 text-sm">Mesajlar</a>
                        </div>
                    </div>

                    {/* İletişim Bilgileri */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-[#2c2c2c]">İletişim</h4>
                        <div className="space-y-3">
                            <div className="flex items-center justify-center md:justify-start space-x-3">
                                <div className="w-6 h-6 bg-[#8b7355]/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <a href="mailto:contact@mustafa-ozcan.com" className="text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300 text-sm">
                                    contact@mustafa-ozcan.com
                                </a>
                            </div>
                            <div className="flex items-center justify-center md:justify-start space-x-3">
                                <div className="w-6 h-6 bg-[#8b7355]/20 rounded-lg flex items-center justify-center">
                                    <svg className="w-4 h-4 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span className="text-[#6b6b6b] text-sm">İstanbul, Türkiye</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Alt Kısım */}
                <div className="border-t border-[#8b7355]/10 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-center md:text-left">
                            <p className="text-[#6b6b6b] text-sm">
                                © 2024 TBT Blog. Tüm hakları saklıdır.
                            </p>
                            <p className="text-[#8b7355] text-xs mt-1 font-medium">
                                Tasarım: <span className="hover:text-[#6d5a43] transition-colors cursor-pointer">Mustafa Özcan</span>
                            </p>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm">
                            <a href="#" className="text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300">Gizlilik Politikası</a>
                            <a href="#" className="text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300">Kullanım Şartları</a>
                            <a href="#" className="text-[#6b6b6b] hover:text-[#8b7355] transition-colors duration-300">Yardım</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}