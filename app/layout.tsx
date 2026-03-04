import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/lib/context';
import { AdminLayout } from '@/components/admin-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FinanceAdmin - Financial Management System',
  description: 'Admin panel for financial tracking across branches, banks, and categories',
  openGraph: {
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    images: [
      {
        url: 'https://bolt.new/static/og_default.png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AppProvider>
          <AdminLayout>{children}</AdminLayout>
        </AppProvider>
      </body>
    </html>
  );
}
