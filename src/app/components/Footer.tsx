import Link from 'next/link';
import { Home, Search, Calendar, MessageSquare, User } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
      <nav className="max-w-screen-xl mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link 
            href="/dashboard" 
            className="flex flex-col items-center gap-1.5 px-4 py-1 text-gray-600 hover:text-healthcare-600 transition-colors"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs font-medium">Home</span>
          </Link>

          <Link 
            href="/map" 
            className="flex flex-col items-center gap-1.5 px-4 py-1 text-healthcare-600 hover:text-healthcare-700 transition-colors"
          >
            <Search className="w-6 h-6" />
            <span className="text-xs font-medium">Search</span>
          </Link>

          <Link 
            href="/calendar" 
            className="flex flex-col items-center gap-1.5 px-4 py-1 text-gray-600 hover:text-healthcare-600 transition-colors"
          >
            <Calendar className="w-6 h-6" />
            <span className="text-xs font-medium">Calendar</span>
          </Link>

          <Link 
            href="/messages" 
            className="flex flex-col items-center gap-1.5 px-4 py-1 text-gray-600 hover:text-healthcare-600 transition-colors"
          >
            <MessageSquare className="w-6 h-6" />
            <span className="text-xs font-medium">Messages</span>
          </Link>

          <Link 
            href="/profile" 
            className="flex flex-col items-center gap-1.5 px-4 py-1 text-gray-600 hover:text-healthcare-600 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </footer>
  );
}
