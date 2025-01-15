'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import womanLeadingLogo from '../assets/WOMAN LEADING.zip - 3.png';
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
    <main className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-black animate-gradient-x">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0.8),transparent_60%)] animate-pulse"></div>
        <div className="absolute inset-0">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-black/20"
              style={{
                transform: `translateX(${i * 100}%)`,
                animation: `wave ${6 + i * 2}s infinite ease-in-out ${i * 2}s`,
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen text-white px-4">
        <div className="w-full max-w-[90vw] md:max-w-md flex flex-col items-center">
          <h1 className="text-2xl md:text-4xl font-bold text-healthcare-800 text-center mb-6 md:mb-8">
            Women Leading for Wellness and Justice
          </h1>
          
          <div className="relative w-48 h-48 md:w-64 md:h-64 mb-6 md:mb-8">
            <Image
              src={womanLeadingLogo}
              alt="Women Leading Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h2 className="text-lg md:text-2xl text-healthcare-600 text-center max-w-[90vw] md:max-w-2xl mb-8">
            North Carolina Sandhills Resource Referral Application
          </h2>

          {/* Loading Animation Container */}
          <div className="relative mt-8 flex flex-col items-center">
            {/* Glowing Torch */}
            <div className="mb-4">
              <FaFire size={48} className="torch-flicker" />
            </div>

            {/* Loading Text */}
            <p className="text-healthcare-600 text-sm animate-pulse">
              Loading resources...
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
