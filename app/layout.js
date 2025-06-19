import { Inter } from 'next/font/google';
import './globals.css';
import ClientHeaderWrapper from '@/components/ClientHeaderWrapper';
import AuthProvider from '@/components/AuthProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Bloger',
  description: 'Modern blog platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ClientHeaderWrapper />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
