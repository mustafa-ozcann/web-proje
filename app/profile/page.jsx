'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Still loading
        
        if (!session) {
            router.push('/login');
            return;
        }

        // Kullanıcının kendi profil sayfasına yönlendir
        router.push(`/profile/${session.user.id}`);
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center">Yükleniyor...</div>
            </div>
        );
    }

    return null;
}