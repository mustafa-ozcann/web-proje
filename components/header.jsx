import Link from 'next/link';

export default function Header() {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null;

    return (
        <div className="w-full bg-blue-600 p-4 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">Blog Uygulaması</h1>
            <div className="space-x-4">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/profile">Profil</Link>
                <button onClick={() => {
                    localStorage.removeItem('user');
                    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                    window.location.href = '/login';
                }}>
                    Çıkış Yap
                </button>
            </div>
        </div>
    );
}
