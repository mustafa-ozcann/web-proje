'use client';

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Messages() {
    const { data: session } = useSession();
    const router = useRouter();
    const [conversations, setConversations] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }

        fetchConversations();
    }, [session]);

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
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Mesajlar</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="flex gap-6 h-[calc(100vh-200px)]">
                {/* Sol Taraf - Konuşmalar Listesi */}
                <div className="w-1/3 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                    <div className="p-4 border-b">
                        <h2 className="text-lg font-semibold">Konuşmalar</h2>
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
                                            {conv.user.name.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline">
                                                <h3 className="text-sm font-medium truncate">
                                                    {conv.user.name}
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
                                    {selectedUser.name.charAt(0)}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{selectedUser.name}</h2>
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
    );
}