import Link from 'next/link';
import { Home, Search, Calendar, MessageSquare, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
      <div className="max-w-md mx-auto flex justify-between items-center">
        <Link 
          href="/dashboard" 
          className="flex flex-col items-center gap-1"
        >
          <Home size={24} className={isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'} />
          <span className={`text-xs ${isActive('/dashboard') ? 'text-blue-600' : 'text-gray-600'}`}>Home</span>
        </Link>
        <Link 
          href="/search" 
          className="flex flex-col items-center gap-1"
        >
          <Search size={24} className={isActive('/search') ? 'text-blue-600' : 'text-gray-600'} />
          <span className={`text-xs ${isActive('/search') ? 'text-blue-600' : 'text-gray-600'}`}>Search</span>
        </Link>
        <Link 
          href="/calendar" 
          className="flex flex-col items-center gap-1"
        >
          <Calendar size={24} className={isActive('/calendar') ? 'text-blue-600' : 'text-gray-600'} />
          <span className={`text-xs ${isActive('/calendar') ? 'text-blue-600' : 'text-gray-600'}`}>Calendar</span>
        </Link>
        <Link 
          href="/messages" 
          className="flex flex-col items-center gap-1"
        >
          <MessageSquare size={24} className={isActive('/messages') ? 'text-blue-600' : 'text-gray-600'} />
          <span className={`text-xs ${isActive('/messages') ? 'text-blue-600' : 'text-gray-600'}`}>Message</span>
        </Link>
        <Link 
          href="/profile" 
          className="flex flex-col items-center gap-1"
        >
          <User size={24} className={isActive('/profile') ? 'text-blue-600' : 'text-gray-600'} />
          <span className={`text-xs ${isActive('/profile') ? 'text-blue-600' : 'text-gray-600'}`}>Profile</span>
        </Link>
      </div>
    </nav>
  );
}
