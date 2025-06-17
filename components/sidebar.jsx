import Link from 'next/link';

export default function Sidebar() {
    return (
        <div className="w-64 bg-gray-800 min-h-screen text-white p-4">
            <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
            <ul className="space-y-4">
                <li><Link href="/admin">Ana Sayfa</Link></li>
                <li><Link href="/admin/users">Kullanıcılar</Link></li>
                <li><Link href="/admin/posts">Blog Onayı</Link></li>
                <li><button onClick={() => {
                    localStorage.removeItem('user');
                    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                    window.location.href = '/login';
                }} className="text-red-300 hover:text-red-500">Çıkış Yap</button></li>
            </ul>
        </div>
    );
}
