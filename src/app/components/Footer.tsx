'use client';

import { Home, Search, Calendar, MessageSquare, User } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-4 shadow-lg animate-slideUp">
      <nav className="container mx-auto">
        <ul className="flex justify-around">
          <li>
            <Link href="/" className="flex flex-col items-center hover:text-gray-300 transition-colors duration-200">
              <Home size={24} />
              <span className="text-xs mt-1">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/map" className="flex flex-col items-center hover:text-gray-300 transition-colors duration-200">
              <Search size={24} />
              <span className="text-xs mt-1">Find</span>
            </Link>
          </li>
          <li>
            <Link href="/appointments" className="flex flex-col items-center hover:text-gray-300 transition-colors duration-200">
              <Calendar size={24} />
              <span className="text-xs mt-1">Calendar</span>
            </Link>
          </li>
          <li>
            <Link href="/messages" className="flex flex-col items-center hover:text-gray-300 transition-colors duration-200">
              <MessageSquare size={24} />
              <span className="text-xs mt-1">Messages</span>
            </Link>
          </li>
          <li>
            <Link href="/profile" className="flex flex-col items-center hover:text-gray-300 transition-colors duration-200">
              <User size={24} />
              <span className="text-xs mt-1">Profile</span>
            </Link>
          </li>
        </ul>
      </nav>
    </footer>
  );
}
