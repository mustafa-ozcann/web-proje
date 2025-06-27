'use client';

import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', isVisible, onHide, duration = 3000 }) {
    const [isShowing, setIsShowing] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsShowing(true);
            const timer = setTimeout(() => {
                setIsShowing(false);
                setTimeout(onHide, 300);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [isVisible, duration, onHide]);

    if (!isVisible && !isShowing) return null;

    const icons = {
        success: (
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        ),
        error: (
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        ),
        warning: (
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
        ),
        info: (
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
        )
    };

    const borderColors = {
        success: 'border-green-200',
        error: 'border-red-200',
        warning: 'border-yellow-200',
        info: 'border-blue-200'
    };

    const textColors = {
        success: 'text-green-800',
        error: 'text-red-800',
        warning: 'text-yellow-800',
        info: 'text-blue-800'
    };

    const bgColors = {
        success: 'bg-green-50',
        error: 'bg-red-50',
        warning: 'bg-yellow-50',
        info: 'bg-blue-50'
    };

    return (
        <div className={`fixed top-6 right-6 z-50 transition-all duration-500 ${
            isShowing ? 'transform translate-x-0 opacity-100 scale-100' : 'transform translate-x-full opacity-0 scale-95'
        }`}>
            <div className={`
                paper-texture vintage-shadow-lg rounded-2xl border-2 p-6 min-w-[350px] max-w-md
                ${borderColors[type]} ${bgColors[type]}
                animate-fadeInUp
            `}>
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        {icons[type]}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <h4 className={`font-bold text-lg mb-1 ${textColors[type]}`}>
                                    {type === 'success' ? 'Başarılı!' : 
                                     type === 'error' ? 'Hata!' :
                                     type === 'warning' ? 'Uyarı!' : 'Bilgi'}
                                </h4>
                                <p className={`text-sm leading-relaxed break-words ${textColors[type]} opacity-90`}>
                                    {message}
                                </p>
                                {type === 'success' && (
                                    <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        <span>İşlem tamamlandı</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setIsShowing(false);
                                    setTimeout(onHide, 300);
                                }}
                                className={`ml-2 p-2 rounded-lg hover:bg-white/50 transition-all duration-300 ${textColors[type]} opacity-70 hover:opacity-100`}
                                title="Kapat"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-4 w-full bg-white/30 rounded-full h-1 overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${
                            type === 'success' ? 'bg-green-500' :
                            type === 'error' ? 'bg-red-500' :
                            type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}
                        style={{
                            animation: `shrink ${duration}ms linear forwards`
                        }}
                    ></div>
                </div>
            </div>
            
            <style jsx>{`
                @keyframes shrink {
                    from { width: 100%; }
                    to { width: 0%; }
                }
            `}</style>
        </div>
    );
} 