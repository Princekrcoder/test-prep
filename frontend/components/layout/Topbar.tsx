'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/query/auth';

export function Topbar() {
  const { data: user } = useAuth();

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  return (
    <header className="fixed top-0 left-64 right-0 h-16 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-outline-variant/60 z-40 flex items-center justify-between px-6">
      {/* Search Bar + Target Exam Tag */}
      <div className="flex items-center gap-4 flex-1 max-w-2xl">
        <div className="relative w-full max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search mock tests, quizzes, subjects..."
            aria-label="Search"
            className="w-full h-10 pl-10 pr-4 bg-surface-container-low/70 rounded-xl text-on-surface text-sm placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/25 focus:bg-surface-container-lowest transition-all"
          />
        </div>

        {user?.profile?.goal && (
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary-container text-on-secondary-fixed text-xs font-semibold whitespace-nowrap">
            <span className="material-symbols-outlined text-[16px] text-primary">flag</span>
            <span>
              {user.profile.goal === 'SERVICE_COMPANY'
                ? 'Target: Service Companies'
                : user.profile.goal === 'GOVERNMENT'
                ? 'Target: Government Exams'
                : 'Target: All Exams'}
            </span>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          className="relative w-10 h-10 rounded-xl bg-surface-container-low hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors"
          type="button"
          aria-label="Notifications"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
        </button>

        {/* User Profile Chip */}
        <Link
          href="/profile"
          className="flex items-center gap-2.5 pl-1.5 py-1 pr-3 rounded-full bg-surface-container-low hover:bg-surface-container transition-colors group"
        >
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="w-8 h-8 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0">
              <span className="text-xs font-bold">{initials}</span>
            </div>
          )}
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-bold text-on-surface leading-none group-hover:text-primary transition-colors">
              {user?.name ?? 'Loading…'}
            </span>
            <span className="text-[10px] text-on-surface-variant leading-none mt-0.5 capitalize">
              {user?.planTier?.toLowerCase() ?? ''} plan
            </span>
          </div>
        </Link>
      </div>
    </header>
  );
}