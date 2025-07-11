import { Inter } from 'next/font/google';
import './globals.css';
import ClientHeaderWrapper from '@/components/ClientHeaderWrapper';
import AuthProvider from '@/components/AuthProvider';
import Footer from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'TBT Blog',
  description: 'Modern blog platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ClientHeaderWrapper />
          {children}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
