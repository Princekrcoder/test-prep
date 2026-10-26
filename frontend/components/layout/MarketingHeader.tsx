'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, useLogout } from '@/lib/query/auth';

interface MarketingHeaderProps {
  currentPath?: string;
}

export function MarketingHeader({ currentPath = '/' }: MarketingHeaderProps) {
  const router = useRouter();
  const { data: user } = useAuth();
  const { mutate: logout } = useLogout();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/exams?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/exams');
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Exams', href: '/exams' },
    { name: 'Mock Tests', href: '/mock-tests', hasBadge: 'LIVE' },
    { name: 'Previous Year Papers', href: '/previous-year-papers' },
    { name: 'Study Material', href: '/study-material' },
    { name: 'Pricing', href: '/pricing' },
  ];

  return (
    <>
      {/* ─── 1. Ultra-Sleek Top Announcement Ribbon ─────────────────── */}
      <div className="relative z-50 bg-[#090d16] text-white border-b border-white/[0.08] overflow-hidden">
        {/* Subtle radial ambient light glow in ribbon */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.18),transparent)] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between text-xs relative">
          {/* Left: Live Status & Companies */}
          <div className="flex items-center gap-2.5 overflow-hidden">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-300 font-semibold text-[10px] tracking-wider uppercase shadow-[0_0_12px_rgba(59,130,246,0.25)] shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse" />
              Live Now
            </span>
            <span className="text-slate-400 hidden sm:inline text-xs font-normal">|</span>
            <p className="text-slate-200 text-xs font-medium truncate">
              <span className="text-slate-300 font-semibold">Service Placement Hub:</span>{' '}
              <span className="text-slate-200">TCS NQT, Infosys, Accenture, Wipro &amp; Cognizant Mocks Active</span>
            </p>
          </div>

          {/* Right: Govt Notice & CTA */}
          <div className="flex items-center gap-3 shrink-0 pl-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
              Govt Mocks Soon
            </span>
            <span className="hidden md:inline text-white/10">•</span>
            <Link
              href="/mock-tests"
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-300 hover:text-white transition-colors group"
            >
              <span>Take Free Mock</span>
              <span className="material-symbols-outlined text-[14px] group-hover:translate-x-0.5 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Luxury Sticky Header ───────────────────────────── */}
      <header className="sticky top-0 left-0 w-full z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/70 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-all">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-[70px] flex items-center justify-between gap-2.5">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <Link href="/" className="flex items-center gap-2.5 group">
              {/* Premium Gradient Logo Icon */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-blue-500/25 ring-1 ring-white/30 group-hover:scale-105 group-hover:shadow-blue-500/40 transition-all duration-300">
                <span className="material-symbols-outlined text-[23px] text-white">school</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <span className="font-headline-lg text-[21px] font-extrabold tracking-[-0.03em] text-slate-900 leading-tight">
                    Test<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Prep</span>
                  </span>
                </div>
                <span className="text-[10.5px] font-semibold tracking-[0.02em] text-slate-500 leading-none mt-0.5">
                  Practice Today, Perform Tomorrow
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive =
                  currentPath === link.href ||
                  (link.href !== '/' && currentPath.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative px-2.5 lg:px-3 py-1.5 rounded-xl text-[14px] font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                      isActive
                        ? 'text-blue-700 font-bold bg-blue-50/80 shadow-[0_1px_2px_rgba(37,99,235,0.06)] ring-1 ring-blue-500/15'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70'
                    }`}
                  >
                    <span>{link.name}</span>
                    {link.hasBadge && (
                      <span className="px-1.5 py-0.2 text-[9px] font-extrabold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        {link.hasBadge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Controls: Search, Notifications, Auth */}
          <div className="flex items-center gap-2 lg:gap-2.5 shrink-0">
            {/* Search Input Bar (Command Bar style) */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center relative w-36 xl:w-44 2xl:w-52 group">
              <span className="material-symbols-outlined absolute left-2.5 text-slate-400 group-focus-within:text-blue-600 text-[17px] pointer-events-none transition-colors">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tests..."
                className="w-full pl-8 pr-7 py-1.5 rounded-full bg-slate-100/70 hover:bg-slate-100 focus:bg-white text-slate-800 text-[13px] placeholder:text-slate-400 focus:outline-none border border-slate-200/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 shadow-[0_1px_2px_rgba(0,0,0,0.02)] transition-all"
              />
              <span className="absolute right-2.5 text-[9.5px] font-semibold text-slate-400 bg-white border border-slate-200 rounded px-1.5 py-0.2 shadow-[0_1px_1px_rgba(0,0,0,0.04)] pointer-events-none">
                /
              </span>
            </form>

            {/* Notification Bell */}
            <Link
              href="/dashboard"
              aria-label="Notifications"
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 border border-slate-200/70 transition-all relative shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </Link>

            {/* Hairline Divider */}
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block shrink-0" />

            {/* User Profile / Auth Action */}
            {user ? (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1.5 py-1 pr-3 rounded-full bg-slate-100/80 hover:bg-slate-100 border border-slate-200/80 transition-all cursor-pointer shadow-sm"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <span className="material-symbols-outlined text-[16px]">person</span>
                  </div>
                  <span className="hidden sm:inline text-[13px] text-slate-800 font-semibold max-w-[110px] truncate">
                    {user.name || 'Student'}
                  </span>
                  <span className="material-symbols-outlined text-slate-500 text-[16px]">
                    {userMenuOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-60 bg-white rounded-2xl shadow-xl ring-1 ring-slate-900/10 py-2 z-50 divide-y divide-slate-100"
                    >
                      <div className="px-4 py-2.5">
                        <p className="text-[13px] font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-blue-600">dashboard</span>
                          Student Dashboard
                        </Link>
                        <Link
                          href="/tests"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-blue-600">menu_book</span>
                          My Test Library
                        </Link>
                        <Link
                          href="/performance"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-blue-600">insights</span>
                          Analytics &amp; Scorecard
                        </Link>
                        <Link
                          href="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-[13px] text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px] text-blue-600">manage_accounts</span>
                          Account Profile
                        </Link>
                      </div>
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => {
                            setUserMenuOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                        >
                          <span className="material-symbols-outlined text-[18px]">logout</span>
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                {/* Sign In Link - strictly single line (whitespace-nowrap) */}
                <Link
                  href="/login"
                  className="whitespace-nowrap px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50/60 rounded-xl transition-all duration-150"
                >
                  Sign In
                </Link>

                {/* Get Started Luxury Gradient CTA */}
                <Link
                  href="/login"
                  className="whitespace-nowrap px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 bg-[length:200%_auto] hover:bg-right text-white text-sm font-semibold shadow-[0_2px_10px_rgba(37,99,235,0.28)] hover:shadow-[0_4px_16px_rgba(37,99,235,0.38)] active:scale-[0.98] transition-all duration-300 flex items-center gap-1.5 group"
                >
                  <span>Get Started</span>
                  <span className="material-symbols-outlined text-[17px] group-hover:translate-x-0.5 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              className="xl:hidden w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200/70 border border-slate-200/70 flex items-center justify-center text-slate-700 transition-colors shrink-0"
            >
              <span className="material-symbols-outlined text-[22px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>

        {/* ─── 3. Mobile Navigation Sheet ───────────────────────────── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="xl:hidden border-t border-slate-200/80 bg-white/98 backdrop-blur-xl px-4 py-3 shadow-xl overflow-hidden"
            >
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => {
                  const isActive =
                    currentPath === link.href ||
                    (link.href !== '/' && currentPath.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`px-3 py-2.5 rounded-xl text-[14px] font-medium flex items-center justify-between transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 font-semibold border border-blue-200/50'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{link.name}</span>
                      {link.hasBadge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-full bg-emerald-100 text-emerald-700 uppercase">
                          {link.hasBadge}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <div className="border-t border-slate-100 my-2 pt-2 flex flex-col gap-1">
                  <Link
                    href="/sample-report"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <span className="material-symbols-outlined text-[18px] text-blue-600">insights</span>
                    AI Scorecard Demo
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <span className="material-symbols-outlined text-[18px] text-blue-600">info</span>
                    About Our Pedagogy
                  </Link>
                  <Link
                    href="/support"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-xl text-[13px] font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                  >
                    <span className="material-symbols-outlined text-[18px] text-blue-600">support_agent</span>
                    Help &amp; Support Desk
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
