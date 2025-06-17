import Sidebar from '../../components/sidebar';

export default function AdminPage() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="p-6 w-full">
                <h1 className="text-2xl font-bold">Admin Ana Sayfa</h1>
                <p>Hoş geldiniz! Buradan kullanıcı ve yazı yönetimi yapabilirsiniz.</p>
            </div>
        </div>
    );
}
