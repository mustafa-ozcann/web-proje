import React from 'react'

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-gray-50 via-blue-50 to-indigo-50 border-t border-gray-200 py-6">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left">
                        <p className="text-gray-600 text-sm">
                            © 2024 Blog Platformu. Tüm hakları saklıdır.
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                            Geliştirici: <span className="font-medium text-gray-700">Mustafa Özcan</span>
                        </p>
                    </div>
                    
                    <div className="text-center md:text-right">
                        <p className="text-gray-600 text-sm">
                            İletişim: <a href="mailto:contact@mustafa-ozcan.com" className="text-blue-600 hover:text-blue-800 transition-colors">contact@mustafa-ozcan.com</a>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}