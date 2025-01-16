import Image from 'next/image';
import Link from 'next/link';
import { Settings, Bell } from 'lucide-react';
import WomanLeadingImage from '@/assets/WOMAN LEADING.zip - 3.png';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b z-50 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10">
              <Image
                src={WomanLeadingImage}
                alt="Woman Leading"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-healthcare-900">Women Leading</h1>
              <p className="text-xs text-gray-600">Resource Search</p>
            </div>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button
              className="p-2 text-gray-600 hover:text-healthcare-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6" />
            </button>
            <button
              className="p-2 text-gray-600 hover:text-healthcare-600 transition-colors"
              aria-label="Settings"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
