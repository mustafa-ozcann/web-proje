'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminCategories() {
    const { data: session } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: ''
    });

    useEffect(() => {
        if (!session) {
            router.push('/login');
            return;
        }

        if (session.user?.role !== 'ADMIN') {
            router.push('/');
            return;
        }

        fetchCategories();
    }, [session]);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/categories');
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Kategoriler yüklenirken bir hata oluştu');
            }

            setCategories(data.categories);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!formData.name.trim()) {
            setError('Kategori adı gerekli');
            return;
        }

        try {
            const url = editingCategory 
                ? `/api/admin/categories/${editingCategory.id}`
                : '/api/admin/categories';
            
            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: formData.name }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'İşlem başarısız');
            }

            setSuccessMessage(editingCategory ? 'Kategori güncellendi' : 'Kategori oluşturuldu');
            setFormData({ name: '' });
            setShowAddForm(false);
            setEditingCategory(null);
            fetchCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({ name: category.name });
        setShowAddForm(true);
    };

    const handleDelete = async (categoryId) => {
        if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/categories/${categoryId}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Kategori silinirken hata oluştu');
            }

            setSuccessMessage('Kategori silindi');
            fetchCategories();
        } catch (err) {
            setError(err.message);
        }
    };

    const resetForm = () => {
        setFormData({ name: '' });
        setShowAddForm(false);
        setEditingCategory(null);
        setError('');
        setSuccessMessage('');
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6">
                <div className="text-center">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Yeni Kategori
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    {successMessage}
                </div>
            )}

            {/* Kategori Ekleme/Düzenleme Formu */}
            {showAddForm && (
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Kategori Adı
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Kategori adını girin"
                                required
                            />
                        </div>
                        <div className="flex space-x-4">
                            <button
                                type="submit"
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                            >
                                {editingCategory ? 'Güncelle' : 'Ekle'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors"
                            >
                                İptal
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Kategori Listesi */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori Adı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Blog Sayısı
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Oluşturulma Tarihi
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                İşlemler
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {categories.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                    Henüz kategori bulunmuyor
                                </td>
                            </tr>
                        ) : (
                            categories.map((category) => (
                                <tr key={category.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {category.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {category._count.posts} blog
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(category.createdAt).toLocaleDateString('tr-TR')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Sil
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
} 