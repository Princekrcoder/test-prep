'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, useLogout } from '@/lib/query/auth';

const navItems = [
  { label: 'Dashboard',         href: '/dashboard',    icon: 'dashboard' },
  { label: 'My Test Library',   href: '/tests',         icon: 'menu_book' },
  { label: 'Analytics & Reports', href: '/performance', icon: 'bar_chart' },
  { label: 'Bookmarks & Doubts', href: '/bookmarks',   icon: 'bookmark' },
  { label: 'Profile & Billing', href: '/profile',      icon: 'person' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: user } = useAuth();
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/60 z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.03)] select-none">
      {/* Logo & Navigation */}
      <div className="flex flex-col">
        {/* App Logo */}
        <div className="h-16 px-6 flex items-center gap-3 border-b border-outline-variant/50">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white shadow-sm shadow-primary/20">
            <span className="material-symbols-outlined text-[22px]">school</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
            TestPrep
          </span>
        </div>

        {/* Nav links */}
        <nav className="px-3 pt-4 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/dashboard' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary shadow-sm shadow-primary/25'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`material-symbols-outlined text-[20px] ${
                    isActive ? 'text-white' : 'text-on-surface-variant'
                  }`}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom: User info + Plan + Logout */}
      <div className="p-3 flex flex-col gap-2">
        {/* User avatar + name */}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5">
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-on-primary text-xs font-bold">
                  {user.name?.charAt(0)?.toUpperCase() ?? 'U'}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface truncate">{user.name}</p>
              <p className="text-xs text-on-surface-variant truncate capitalize">
                {user.planTier?.toLowerCase()} plan
              </p>
            </div>
          </div>
        )}

        {/* Plan badge */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-surface-container-low to-surface-container border border-outline-variant/40">
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined material-symbols-fill text-primary text-[18px]">
              verified
            </span>
            <span className="text-xs font-bold text-on-surface capitalize">
              {user?.planTier?.toLowerCase() ?? 'Free'} Plan
            </span>
          </div>
          {user?.planTier === 'FREE' ? (
            <Link href="/pricing" className="text-[11px] text-primary font-semibold hover:underline">
              Upgrade to Pro →
            </Link>
          ) : (
            <p className="text-[11px] text-on-surface-variant font-medium">
              {user?.planExpiresAt
                ? `Valid till ${new Date(user.planExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`
                : 'Active'}
            </p>
          )}
        </div>

        {/* Logout button — calls API to clear session */}
        <button
          onClick={handleLogout}
          disabled={logout.isPending}
          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-error-container hover:text-error transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Sign out"
        >
          {logout.isPending ? (
            <>
              <span className="w-5 h-5 border-2 border-on-surface-variant/30 border-t-on-surface-variant rounded-full animate-spin" />
              <span>Signing out…</span>
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]">logout</span>
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}