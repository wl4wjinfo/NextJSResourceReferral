'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaFire } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => {
      router.push('/signin');
    }, 10000);

    return () => clearTimeout(timer);
  }, [router]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="w-32 h-32 relative">
            <Image
              src="/images/woman-leading.png"
              alt="Women Leading Logo"
              width={128}
              height={128}
              className="object-contain"
              priority
            />
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900">
            Women Leading Resources
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl">
            Connecting women with the resources they need to succeed
          </p>
          
          <div className="flex gap-4">
            <Link
              href="/signin"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
