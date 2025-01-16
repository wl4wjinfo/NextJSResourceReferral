import Image from 'next/image';
import Link from 'next/link';
import { Settings, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Image
                src="/images/woman-leading.png"
                alt="Woman Leading"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-xl font-semibold">Women Leading</span>
          </Link>

          {/* Navigation Icons */}
          <div className="flex items-center gap-4">
            <Link href="/notifications">
              <Bell className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
            <Link href="/settings">
              <Settings className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
