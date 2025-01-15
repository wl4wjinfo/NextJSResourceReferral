'use client';

import { usePathname } from 'next/navigation';
import PageWrapper from './components/PageWrapper';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const publicRoutes = ['/', '/signin', '/signup', '/forgot-password'];
  const isPublicRoute = publicRoutes.includes(pathname || '');

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return (
    <PageWrapper>
      <main className="flex-1 relative">
        {children}
      </main>
    </PageWrapper>
  );
}
