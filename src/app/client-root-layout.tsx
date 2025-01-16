'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

export default function ClientRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const publicRoutes = ['/', '/signin', '/signup', '/forgot-password'];
  const fullScreenRoutes = ['/map']; // Routes that should be full screen without header/footer
  
  const isPublicRoute = publicRoutes.includes(pathname || '');
  const isFullScreenRoute = fullScreenRoutes.includes(pathname || '');

  if (isPublicRoute || isFullScreenRoute) {
    return (
      <main className={`min-h-screen ${isFullScreenRoute ? 'h-screen' : ''}`}>
        {children}
      </main>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen pt-16 pb-20">
        {children}
      </main>
      <Footer />
    </>
  );
}
