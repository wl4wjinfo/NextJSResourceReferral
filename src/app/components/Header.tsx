'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-healthcare-700 text-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="logo-glow">
              <span className="text-2xl font-bold text-white">
                HealthRef
              </span>
            </Link>
          </div>
          <div className="flex space-x-8">
            <Link
              href="/"
              className={`text-healthcare-100 hover:text-white transition-colors ${
                pathname === '/' ? 'text-white' : ''
              }`}
            >
              Home
            </Link>
            <Link
              href="/map"
              className={`text-healthcare-100 hover:text-white transition-colors ${
                pathname === '/map' ? 'text-white' : ''
              }`}
            >
              Map
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
