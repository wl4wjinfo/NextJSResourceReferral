import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientRootLayout from './client-root-layout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Healthcare Referrals',
  description: 'Find and manage healthcare resources and referrals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRootLayout>
          {children}
        </ClientRootLayout>
      </body>
    </html>
  );
}
