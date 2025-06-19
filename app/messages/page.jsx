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
            <div className="max-w-6xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Mesajlar</h1>
                    <p className="text-gray-600">Diğer kullanıcılarla sohbet edin</p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <div className="flex gap-6 h-[calc(100vh-250px)]">
                    {/* Sol Taraf - Konuşmalar Listesi */}
                    <div className="w-1/3 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b relative">
                        <h2 className="text-lg font-semibold">Konuşmalar</h2>
                        <div className="mt-2">
                            <input
                                type="text"
                                placeholder="Kullanıcı ara..."
                                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onChange={async (e) => {
                                    const searchTerm = e.target.value.trim();
                                    if (searchTerm && searchTerm.length >= 2) {
                                        try {
                                            const res = await fetch(`/api/user/search?q=${encodeURIComponent(searchTerm)}`);
                                            const data = await res.json();
                                            console.log('Kullanıcı arama API response:', data);
                                            
                                            if (res.ok && data.success && data.users && Array.isArray(data.users)) {
                                                // conversations dizisindeki user id'leri ile eşleşenleri çıkar
                                                const filteredUsers = data.users.filter(user =>
                                                    !conversations.some(conv => conv.user.id === user.id)
                                                );
                                                setSearchResults(filteredUsers);
                                            } else {
                                                console.error('Arama sonucu geçersiz:', data);
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
                            {searchResults && searchResults.length > 0 && (
                                <div className="absolute left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                                    {searchResults.map(user => (
                                        <button
                                            key={user.id}
                                            className="w-full p-2 text-left hover:bg-gray-50 flex items-center space-x-3"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setSearchResults([]);
                                            }}
                                        >
                                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                                {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="font-medium">{user.name || 'İsimsiz Kullanıcı'}</span>
                                                {user.email && (
                                                    <div className="text-xs text-gray-500">{user.email}</div>
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
                            <div className="p-4 text-gray-500 text-center">
                                Henüz bir konuşmanız yok
                            </div>
                        ) : (
                            <div className="divide-y">
                                {conversations.map((conv) => (
                                    <button
                                        key={conv.user.id}
                                        onClick={() => setSelectedUser(conv.user)}
                                        className={`w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                                            selectedUser?.id === conv.user.id ? 'bg-blue-50' : ''
                                        }`}
                                    >
                                        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                            {(conv.user.name || conv.user.email || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-medium truncate">
                                                    {conv.user.name || 'İsimsiz Kullanıcı'}
                                                </h3>
                                                {conv.lastMessage && (
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                            {conv.lastMessage && (
                                                <p className="text-sm text-gray-500 truncate">
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
                <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                    {selectedUser ? (
                        <>
                            {/* Mesajlaşma Başlığı */}
                            <div className="p-4 border-b flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                    {(selectedUser.name || selectedUser.email || 'U').charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{selectedUser.name || 'İsimsiz Kullanıcı'}</h2>
                                    <Link
                                        href={`/profile/${selectedUser.id}`}
                                        className="text-sm text-blue-500 hover:text-blue-600"
                                    >
                                        Profili Görüntüle
                                    </Link>
                                </div>
                            </div>

                            {/* Mesajlar */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.senderId === session.user.id ? 'justify-end' : 'justify-start'
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[70%] rounded-lg p-3 ${
                                                message.senderId === session.user.id
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-100'
                                            }`}
                                        >
                                            <p className="text-sm">{message.content}</p>
                                            <span className="text-xs opacity-75 mt-1 block">
                                                {new Date(message.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Mesaj Gönderme Formu */}
                            <div className="p-4 border-t">
                                <form onSubmit={handleSendMessage} className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Mesajınızı yazın..."
                                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:border-blue-500"
                                        disabled={sending}
                                    />
                                    <button
                                        type="submit"
                                        disabled={sending || !newMessage.trim()}
                                        className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600 disabled:bg-blue-300 transition-colors"
                                    >
                                        {sending ? 'Gönderiliyor...' : 'Gönder'}
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            Mesajlaşmak için bir konuşma seçin
                        </div>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
}