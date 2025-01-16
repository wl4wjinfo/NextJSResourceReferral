'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, MessageSquare, Home, Map } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex justify-around items-center">
          <Link href="/dashboard" className={`flex flex-col items-center ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-500'}`}>
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </Link>
          
          <Link href="/events" className={`flex flex-col items-center ${isActive('/events') ? 'text-blue-600' : 'text-gray-500'}`}>
            <Calendar size={24} />
            <span className="text-xs mt-1">Events</span>
          </Link>
          
          <Link href="/messages" className={`flex flex-col items-center ${isActive('/messages') ? 'text-blue-600' : 'text-gray-500'}`}>
            <MessageSquare size={24} />
            <span className="text-xs mt-1">Messages</span>
          </Link>
          
          <Link href="/map" className={`flex flex-col items-center ${isActive('/map') ? 'text-blue-600' : 'text-gray-500'}`}>
            <Map size={24} />
            <span className="text-xs mt-1">Map</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
