'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '▦' },
  { label: 'My Test Library', href: '/tests', icon: '📚' },
  { label: 'Analytics & Reports', href: '/performance', icon: '📊' },
  { label: 'Bookmarks & Doubts', href: '/bookmarks', icon: '🔖' },
  { label: 'Profile & Billing', href: '/profile', icon: '👤' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant z-50 flex flex-col justify-between shadow-sm">
      {/* Logo */}
      <div className="flex flex-col">
        <div className="h-16 px-space-lg flex items-center gap-space-xs border-b border-outline-variant">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-on-primary font-display font-bold text-sm">T</span>
          </div>
          <span className="font-display font-bold text-headline-md text-on-surface">TestPrep</span>
        </div>

        {/* Nav links */}
        <nav className="px-space-sm pt-space-md flex flex-col gap-space-2xs">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-label-lg transition-colors ${
                  isActive
                    ? 'bg-surface-container text-primary font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="text-[18px]">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom */}
      <div className="p-space-sm">
        <button className="w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-xl text-label-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors">
          <span>⬡</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
