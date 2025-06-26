'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function Messages() {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const [searchResults, setSearchResults] = useState([]);

    // URL'den userId parametresini kontrol et
    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }

        fetchConversations();
        
        // URL'de userId varsa o kullanıcıyı getir ve seç
        const userId = searchParams.get('userId');
        if (userId) {
            fetchUserById(userId);
        }
    }, [session, searchParams]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
        }
    }, [selectedUser]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchConversations = async () => {
        try {
            const response = await fetch('/api/message/inbox');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Mesajlar alınamadı');
            }

            setConversations(data.conversations);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    const fetchMessages = async (userId) => {
        try {
            const response = await fetch(`/api/message/inbox?userId=${userId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Mesajlar alınamadı');
            }

            setMessages(data.messages);
        } catch (err) {
            setError(err.message);
        }
    };

    const fetchUserById = async (userId) => {
        try {
            const response = await fetch(`/api/user/profile?id=${userId}`);
            const data = await response.json();

            if (response.ok && data.success) {
                setSelectedUser(data.user);
            }
        } catch (err) {
            console.error('Kullanıcı bilgileri alınamadı:', err);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!newMessage.trim() || !selectedUser) return;

        try {
            setSending(true);
            const response = await fetch('/api/message/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipientId: selectedUser.id,
                    content: newMessage,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Mesaj gönderilemedi');
            }

            setNewMessage('');
            // Mesajları ve konuşmaları güncelle
            fetchMessages(selectedUser.id);
            fetchConversations();
        } catch (err) {
            setError(err.message);
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen vintage-bg">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-[#8b7355]/10 rounded w-1/4 mb-8"></div>
                        <div className="paper-texture rounded-2xl p-8">
                            <div className="grid grid-cols-3 gap-6 h-96">
                                <div className="space-y-4">
                                    {[1,2,3,4].map(i => (
                                        <div key={i} className="h-16 bg-[#8b7355]/10 rounded-xl"></div>
                                    ))}
                                </div>
                                <div className="col-span-2 h-full bg-[#8b7355]/10 rounded-xl"></div>
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
                <div className="text-center mb-12 animate-fadeInUp">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold text-[#2c2c2c] mb-4">Mesajlar</h1>
                    <p className="text-[#6b6b6b] text-lg">Toplulukla iletişim halinde kalın</p>
                </div>

                {error && (
                    <div className="paper-texture border border-red-200 text-red-700 px-6 py-4 rounded-2xl mb-8 animate-fadeInUp">
                        <div className="flex items-center space-x-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="font-medium">{error}</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-300px)] animate-fadeInUp" style={{animationDelay: '0.2s'}}>
                    {/* Sol Taraf - Konuşmalar Listesi */}
                    <div className="lg:col-span-1 paper-texture rounded-2xl vintage-shadow overflow-hidden flex flex-col">
                        <div className="p-6 border-b border-[#8b7355]/10 relative">
                            <h2 className="text-xl font-bold text-[#2c2c2c] mb-4">Konuşmalar</h2>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Kullanıcı ara..."
                                    className="vintage-input w-full pl-10"
                                    onChange={async (e) => {
                                        const searchTerm = e.target.value.trim();
                                        if (searchTerm && searchTerm.length >= 2) {
                                            try {
                                                const res = await fetch(`/api/user/search?q=${encodeURIComponent(searchTerm)}`);
                                                const data = await res.json();
                                                
                                                if (res.ok && data.success && data.users && Array.isArray(data.users)) {
                                                    // conversations dizisindeki user id'leri ile eşleşenleri çıkar
                                                    const filteredUsers = data.users.filter(user =>
                                                        !conversations.some(conv => conv.user.id === user.id)
                                                    );
                                                    setSearchResults(filteredUsers);
                                                } else {
                                                    setSearchResults([]);
                                                }
                                            } catch (error) {
                                                console.error('Kullanıcı arama hatası:', error);
                                                setSearchResults([]);
                                            }
                                        } else {
                                            setSearchResults([]);
                                        }
                                    }}
                                />
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                
                                {searchResults && searchResults.length > 0 && (
                                    <div className="absolute left-0 right-0 top-full mt-2 paper-texture rounded-xl vintage-shadow z-10 max-h-48 overflow-y-auto border border-[#8b7355]/10">
                                        {searchResults.map(user => (
                                            <button
                                                key={user.id}
                                                className="w-full p-4 text-left hover:bg-[#8b7355]/5 flex items-center space-x-3 transition-colors first:rounded-t-xl last:rounded-b-xl"
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setSearchResults([]);
                                                }}
                                            >
                                                <div className="w-10 h-10 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center text-white font-bold">
                                                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-[#2c2c2c]">{user.name || 'İsimsiz Kullanıcı'}</p>
                                                    {user.email && (
                                                        <p className="text-xs text-[#6b6b6b]">{user.email}</p>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto">
                            {conversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 bg-[#8b7355]/10 rounded-2xl flex items-center justify-center">
                                        <svg className="w-8 h-8 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">Henüz mesajınız yok</h3>
                                    <p className="text-[#6b6b6b] text-sm">Yeni kullanıcılar bulun ve sohbet etmeye başlayın</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-[#8b7355]/10">
                                    {conversations.map((conv) => (
                                        <button
                                            key={conv.user.id}
                                            onClick={() => setSelectedUser(conv.user)}
                                            className={`w-full p-4 text-left hover:bg-[#8b7355]/5 flex items-center space-x-4 transition-all duration-300 ${
                                                selectedUser?.id === conv.user.id ? 'bg-[#8b7355]/10' : ''
                                            }`}
                                        >
                                            <div className="relative">
                                                <div className="w-12 h-12 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center text-white font-bold">
                                                    {(conv.user.name || conv.user.email || 'U').charAt(0).toUpperCase()}
                                                </div>
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h3 className="font-semibold text-[#2c2c2c] truncate">
                                                        {conv.user.name || 'İsimsiz Kullanıcı'}
                                                    </h3>
                                                    {conv.lastMessage && (
                                                        <span className="text-xs text-[#6b6b6b]">
                                                            {new Date(conv.lastMessage.createdAt).toLocaleDateString('tr-TR')}
                                                        </span>
                                                    )}
                                                </div>
                                                {conv.lastMessage && (
                                                    <p className="text-sm text-[#6b6b6b] truncate">
                                                        {conv.lastMessage.content}
                                                    </p>
                                                )}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sağ Taraf - Mesajlaşma Alanı */}
                    <div className="lg:col-span-2 paper-texture rounded-2xl vintage-shadow overflow-hidden flex flex-col">
                        {selectedUser ? (
                            <>
                                {/* Mesajlaşma Başlığı */}
                                <div className="p-6 border-b border-[#8b7355]/10 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="relative">
                                            <div className="w-14 h-14 bg-gradient-to-br from-[#8b7355] to-[#7d8471] rounded-xl flex items-center justify-center text-white font-bold text-lg">
                                                {(selectedUser.name || selectedUser.email || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white"></div>
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-bold text-[#2c2c2c]">{selectedUser.name || 'İsimsiz Kullanıcı'}</h2>
                                            <Link
                                                href={`/profile/${selectedUser.id}`}
                                                className="text-sm text-[#8b7355] hover:text-[#6d5a43] transition-colors flex items-center space-x-1"
                                            >
                                                <span>Profili Görüntüle</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center space-x-3">
                                        <button className="p-2 hover:bg-[#8b7355]/5 rounded-lg transition-colors">
                                            <svg className="w-5 h-5 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Mesajlar */}
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-[#8b7355]/5 to-transparent">
                                    {messages.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 mx-auto mb-4 bg-[#8b7355]/10 rounded-2xl flex items-center justify-center">
                                                <svg className="w-8 h-8 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-lg font-semibold text-[#2c2c2c] mb-2">Henüz mesaj yok</h3>
                                            <p className="text-[#6b6b6b]">İlk mesajı göndererek sohbeti başlatın</p>
                                        </div>
                                    ) : (
                                        messages.map((message) => (
                                            <div
                                                key={message.id}
                                                className={`flex ${
                                                    message.senderId === session.user.id ? 'justify-end' : 'justify-start'
                                                }`}
                                            >
                                                <div
                                                    className={`max-w-[70%] rounded-2xl p-4 ${
                                                        message.senderId === session.user.id
                                                            ? 'vintage-accent-bg text-white'
                                                            : 'paper-texture border border-[#8b7355]/10'
                                                    }`}
                                                >
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                    <span className={`text-xs mt-2 block ${
                                                        message.senderId === session.user.id 
                                                            ? 'text-white/80' 
                                                            : 'text-[#6b6b6b]'
                                                    }`}>
                                                        {new Date(message.createdAt).toLocaleTimeString('tr-TR')}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Mesaj Gönderme Formu */}
                                <div className="p-6 border-t border-[#8b7355]/10">
                                    <form onSubmit={handleSendMessage} className="flex space-x-4">
                                        <div className="flex-1 relative">
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                placeholder="Mesajınızı yazın..."
                                                className="vintage-input w-full pl-4 pr-12"
                                                disabled={sending}
                                            />
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <svg className="w-5 h-5 text-[#6b6b6b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16l5.81-5.28a2 2 0 012.38 0L21 20V4a2 2 0 00-2-2H9a2 2 0 00-2 2z" />
                                                </svg>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className={`vintage-btn px-6 py-3 flex items-center space-x-2 ${
                                                sending || !newMessage.trim() ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            {sending ? (
                                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                </svg>
                                            )}
                                            <span>{sending ? 'Gönderiliyor...' : 'Gönder'}</span>
                                        </button>
                                    </form>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-24 h-24 mx-auto mb-6 bg-[#8b7355]/10 rounded-2xl flex items-center justify-center">
                                        <svg className="w-12 h-12 text-[#8b7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#2c2c2c] mb-2">Mesajlaşmaya Başlayın</h3>
                                    <p className="text-[#6b6b6b] max-w-md">
                                        Sol panelden bir konuşma seçin veya yeni kullanıcı arayarak sohbete başlayın
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}