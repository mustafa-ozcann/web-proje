'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Still loading
        
        if (!session || session.user.role !== 'ADMIN') {
            router.push('/');
            return;
        }

        // Admin ana sayfası yerine direkt blog onayları sayfasına yönlendir
        router.push('/admin/posts');
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Yükleniyor...</div>
            </div>
        );
    }

    return null;
}
