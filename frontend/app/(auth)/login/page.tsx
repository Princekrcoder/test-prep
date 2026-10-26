'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Show error from OAuth redirect (e.g. ?error=access_denied)
  useEffect(() => {
    const oauthError = searchParams.get('error');
    if (oauthError === 'access_denied') setError('Google sign-in was cancelled.');
    else if (oauthError === 'state_mismatch') setError('Security check failed. Please try again.');
    else if (oauthError) setError('Sign-in failed. Please try again.');
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error?.message ?? 'Sign-in failed. Please try again.');
        return;
      }

      // Redirect based on onboarding status
      if (json.data?.onboardingRequired) {
        router.push('/onboarding');
      } else {
        const next = searchParams.get('next');
        router.push(next && next.startsWith('/') ? next : '/dashboard');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const FEATURES = [
    { icon: 'bolt', text: 'Real-pattern mock tests for TCS, Infosys & more' },
    { icon: 'insights', text: 'AI-powered performance diagnostics' },
    { icon: 'workspace_premium', text: 'All-India rank benchmarking' },
    { icon: 'history_edu', text: 'Previous year papers with solutions' },
  ];

  const STATS = [
    { value: '10K+', label: 'Active Students' },
    { value: '500+', label: 'Mock Tests' },
    { value: '95%', label: 'Success Rate' },
  ];

  return (
    <div className="min-h-screen flex bg-surface">
      {/* ─── LEFT: Brand Panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[52%] xl:w-[55%] relative flex-col justify-between p-12 overflow-hidden bg-[#090d16]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_-10%_-10%,rgba(30,96,243,0.35),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_110%_110%,rgba(0,97,65,0.2),transparent)] pointer-events-none" />
        <div className="absolute top-0 right-0 w-[480px] h-[480px] rounded-full bg-blue-600/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined material-symbols-fill text-white text-[22px]">school</span>
          </div>
          <div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-jakarta)' }}>TestPrep</span>
            <p className="text-blue-300/70 text-xs font-medium -mt-0.5">Practice Today, Perform Tomorrow</p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-300 text-xs font-semibold tracking-wide">Service-Based Placement Mocks &bull; Live Now</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
              Your Placement<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">Journey Starts Here</span>
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-sm">
              Join thousands of students preparing for TCS NQT, Infosys, Accenture, Wipro &amp; more with real exam patterns.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {FEATURES.map((f) => (
              <div key={f.icon} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined material-symbols-fill text-blue-400 text-[18px]">{f.icon}</span>
                </div>
                <span className="text-slate-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-6 pt-2 border-t border-white/[0.08]">
            {STATS.map((s, i) => (
              <div key={s.label} className={`flex flex-col ${i > 0 ? 'pl-6 border-l border-white/[0.08]' : ''}`}>
                <span className="text-2xl font-extrabold text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>{s.value}</span>
                <span className="text-slate-500 text-xs mt-0.5">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shrink-0">P</div>
            <div>
              <p className="text-slate-300 text-sm leading-relaxed">&ldquo;Cleared TCS NQT in first attempt. The mock tests here are identical to the real exam pattern.&rdquo;</p>
              <p className="text-slate-500 text-xs mt-1.5 font-medium">Priya S. &mdash; TCS NQT 2025 Qualifier</p>
            </div>
          </div>
        </div>
      </div>

      {/* ─── RIGHT: Auth Form Panel ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 sm:px-12 bg-surface min-h-screen">
        <div className="flex lg:hidden items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined material-symbols-fill text-on-primary text-[20px]">school</span>
          </div>
          <span className="text-on-surface font-bold text-lg" style={{ fontFamily: 'var(--font-jakarta)' }}>TestPrep</span>
        </div>

        <div className="w-full max-w-[420px]">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>Welcome back</h2>
            <p className="text-on-surface-variant text-sm mt-1">Sign in to continue your preparation journey.</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-error-container border border-error/30">
              <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">error</span>
              <p className="text-on-error-container text-sm">{error}</p>
            </div>
          )}

          {/* Google OAuth */}
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:border-outline hover:shadow-sm transition-all duration-200 text-on-surface font-semibold text-sm group"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
            <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors text-[18px] ml-auto">arrow_forward</span>
          </a>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-outline-variant" />
            <span className="text-on-surface-variant text-xs font-medium">or sign in with email</span>
            <div className="flex-1 h-px bg-outline-variant" />
          </div>

          <form onSubmit={handleEmailLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-on-surface text-sm font-semibold">Email address</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">mail</span>
                <input
                  id="login-email" type="email" autoComplete="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-on-surface text-sm font-semibold">Password</label>
                <Link href="/forgot-password" className="text-primary text-xs font-medium hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">lock</span>
                <input
                  id="login-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors">
                  <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Signing in&hellip;</>
              ) : (
                <>Sign In<span className="material-symbols-outlined text-[18px]">arrow_forward</span></>
              )}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-on-surface-variant text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-primary font-semibold hover:underline">Create one free</Link>
            </p>
            <p className="text-xs text-on-surface-variant/70">
              By signing in you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>{' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <div className="mt-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-on-surface-variant text-sm hover:text-on-surface transition-colors group">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}