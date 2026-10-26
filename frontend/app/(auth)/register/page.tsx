'use client';

import Link from 'next/link';
import { useState } from 'react'; import { useRouter } from 'next/navigation';

const GOALS = [
  { id: 'tcs', label: 'TCS NQT', icon: 'code' },
  { id: 'infosys', label: 'Infosys', icon: 'terminal' },
  { id: 'accenture', label: 'Accenture', icon: 'psychology' },
  { id: 'wipro', label: 'Wipro', icon: 'devices' },
  { id: 'cognizant', label: 'Cognizant', icon: 'memory' },
  { id: 'other', label: 'Other', icon: 'more_horiz' },
];

const COURSES = [
  'B.Tech / B.E.',
  'B.Sc',
  'BCA',
  'MCA',
  'M.Tech / M.E.',
  'MBA',
  'Other',
];

const BATCH_YEARS = Array.from({ length: 7 }, (_, i) => (2024 + i).toString());

export default function RegisterPage() {
  const [step, setStep] = useState<1 | 2>(1);

  // Personal Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [college, setCollege] = useState('');
  const [course, setCourse] = useState('');
  const [batchYear, setBatchYear] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Step 2
  const [selectedGoal, setSelectedGoal] = useState('tcs');
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const passwordsMatch = password === confirmPassword;
  const passwordStrength = password.length >= 8 ? (password.match(/[A-Z]/) && password.match(/[0-9]/) ? 'strong' : 'medium') : password.length > 0 ? 'weak' : null;

  const strengthColor = { strong: 'bg-emerald-500', medium: 'bg-amber-400', weak: 'bg-red-500' };
  const strengthWidth = { strong: 'w-full', medium: 'w-2/3', weak: 'w-1/3' };
  const strengthLabel = { strong: 'Strong', medium: 'Medium', weak: 'Weak' };

  const step1Valid =
    name.trim() &&
    email.trim() &&
    password &&
    confirmPassword &&
    passwordsMatch;

  const inputClass =
    'w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all';

  const selectClass =
    'w-full pl-10 pr-4 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all appearance-none cursor-pointer';

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordsMatch) return;
    setStep(2);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          mobile: mobile || undefined,
          college: college || undefined,
          course: course || undefined,
          graduationYear: batchYear ? parseInt(batchYear) : undefined,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json?.error?.message ?? 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      // Registration successful — go to onboarding
      router.push('/onboarding');
    } catch {
      setError('Network error. Please check your connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex bg-surface overflow-hidden">
      {/* ─── LEFT: Brand Panel ──────────────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[48%] h-full relative flex-col justify-between p-12 overflow-hidden bg-[#090d16] shrink-0 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_-5%_-5%,rgba(30,96,243,0.3),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_45%_at_105%_105%,rgba(0,97,65,0.18),transparent)] pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined material-symbols-fill text-white text-[22px]">school</span>
          </div>
          <div>
            <span className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-jakarta)' }}>TestPrep</span>
            <p className="text-blue-300/70 text-xs font-medium -mt-0.5">Practice Today, Perform Tomorrow</p>
          </div>
        </div>

        {/* Main visual content */}
        <div className="relative z-10 flex flex-col gap-7">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-5">
              <span className="material-symbols-outlined material-symbols-fill text-blue-400 text-[14px]">verified</span>
              <span className="text-blue-300 text-xs font-semibold">Free to get started &mdash; no credit card needed</span>
            </div>
            <h1
              className="text-4xl xl:text-5xl font-extrabold text-white leading-tight tracking-tight"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Start Practicing
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-sky-300">
                Smarter Today
              </span>
            </h1>
            <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-sm">
              Create your free account and access real exam patterns, AI analytics, and performance tracking.
            </p>
          </div>

          {/* What you get */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: 'quiz', label: 'Free Mock Tests', sub: 'Unlimited practice' },
              { icon: 'insights', label: 'AI Analytics', sub: 'Identify weak areas' },
              { icon: 'emoji_events', label: 'All-India Rank', sub: 'Compare with peers' },
              { icon: 'history_edu', label: 'PYQ Papers', sub: 'Solved step-by-step' },
            ].map((item) => (
              <div key={item.icon} className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex flex-col gap-1.5">
                <span className="material-symbols-outlined material-symbols-fill text-blue-400 text-[20px]">{item.icon}</span>
                <span className="text-white text-xs font-semibold">{item.label}</span>
                <span className="text-slate-500 text-xs">{item.sub}</span>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
            <div className="flex -space-x-2">
              {['R', 'A', 'S', 'M'].map((initial, i) => (
                <div
                  key={initial}
                  className="w-8 h-8 rounded-full border-2 border-[#090d16] flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b'][i] }}
                >
                  {initial}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">10,000+ students joined this month</p>
              <p className="text-slate-500 text-[11px]">TCS · Infosys · Wipro · Accenture</p>
            </div>
          </div>
        </div>

        {/* Bottom quote */}
        <div className="relative z-10 p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
          <p className="text-slate-300 text-sm leading-relaxed">
            &ldquo;The AI feedback after every test helped me understand exactly where I was going wrong. Cleared Infosys DSE in 2 months.&rdquo;
          </p>
          <p className="text-slate-500 text-xs mt-2 font-medium">Arjun K. &mdash; Infosys DSE 2025</p>
        </div>
      </div>

      {/* ─── RIGHT: Registration Form Panel ─────────────────────────────── */}
      <div className="flex-1 h-screen overflow-y-auto bg-surface">
        <div className="min-h-full flex flex-col items-center px-6 py-10 sm:px-12">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <span className="material-symbols-outlined material-symbols-fill text-on-primary text-[20px]">school</span>
            </div>
            <span className="text-on-surface font-bold text-lg" style={{ fontFamily: 'var(--font-jakarta)' }}>TestPrep</span>
          </div>

          <div className="w-full max-w-[460px] my-auto">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all shrink-0 ${step >= 1 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
              {step > 1 ? <span className="material-symbols-outlined text-[16px]">check</span> : '1'}
            </div>
            <span className={`text-[11px] font-semibold whitespace-nowrap ${step >= 1 ? 'text-primary' : 'text-on-surface-variant'}`}>Personal Details</span>
            <div className={`flex-1 h-0.5 rounded-full transition-all ${step > 1 ? 'bg-primary' : 'bg-outline-variant'}`} />
            <span className={`text-[11px] font-semibold whitespace-nowrap ${step >= 2 ? 'text-primary' : 'text-on-surface-variant'}`}>Prep Goal</span>
            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all shrink-0 ${step >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
              2
            </div>
          </div>

          {/* Heading */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
              {step === 1 ? 'Student Registration' : 'Choose your target'}
            </h2>
            <p className="text-on-surface-variant text-sm mt-1">
              {step === 1 ? (
                <>Already have an account?{' '}<Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link></>
              ) : (
                "Select the company you're preparing for."
              )}
            </p>
          </div>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              {/* Google OAuth */}
              <a
                href="/api/auth/google"
                className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:border-outline hover:shadow-sm transition-all duration-200 text-on-surface font-semibold text-sm group mb-5"
              >
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Sign up with Google
                <span className="material-symbols-outlined text-outline group-hover:text-on-surface transition-colors text-[18px] ml-auto">arrow_forward</span>
              </a>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-outline-variant" />
                <span className="text-on-surface-variant text-xs font-medium">or register with email</span>
                <div className="flex-1 h-px bg-outline-variant" />
              </div>

              <form onSubmit={handleStep1} className="flex flex-col gap-4">

                {/* ── Section: Personal Details */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined material-symbols-fill text-primary text-[18px]">person</span>
                  <span className="text-on-surface text-sm font-bold">Personal Details</span>
                  <div className="flex-1 h-px bg-outline-variant/50 ml-1" />
                </div>

                {/* Full Name */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-name" className="text-on-surface text-sm font-semibold">
                    Full Name <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">badge</span>
                    <input
                      id="reg-name"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul Sharma"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-email" className="text-on-surface text-sm font-semibold">
                    Email Address <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">mail</span>
                    <input
                      id="reg-email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Mobile Number */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-mobile" className="text-on-surface text-sm font-semibold">
                    Mobile Number
                    <span className="text-on-surface-variant text-xs font-normal ml-1">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">phone</span>
                    <input
                      id="reg-mobile"
                      type="tel"
                      autoComplete="tel"
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value)}
                      placeholder="+91 98765 43210"
                      maxLength={13}
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* College / University */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-college" className="text-on-surface text-sm font-semibold">
                    College / University
                    <span className="text-on-surface-variant text-xs font-normal ml-1">(optional)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">school</span>
                    <input
                      id="reg-college"
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      placeholder="e.g. VIT Vellore, NIT Trichy…"
                      className={inputClass}
                    />
                  </div>
                </div>

                {/* Course & Batch Year — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Course */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-course" className="text-on-surface text-sm font-semibold">Course</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">menu_book</span>
                      <select
                        id="reg-course"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Select</option>
                        {COURSES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px] pointer-events-none">expand_more</span>
                    </div>
                  </div>

                  {/* Batch / Graduation Year */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="reg-batch" className="text-on-surface text-sm font-semibold">Batch / Grad Year</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">calendar_today</span>
                      <select
                        id="reg-batch"
                        value={batchYear}
                        onChange={(e) => setBatchYear(e.target.value)}
                        className={selectClass}
                      >
                        <option value="">Year</option>
                        {BATCH_YEARS.map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[18px] pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>

                {/* ── Section: Set Password */}
                <div className="flex items-center gap-2 mt-2 mb-1">
                  <span className="material-symbols-outlined material-symbols-fill text-primary text-[18px]">lock</span>
                  <span className="text-on-surface text-sm font-bold">Set Password</span>
                  <div className="flex-1 h-px bg-outline-variant/50 ml-1" />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-password" className="text-on-surface text-sm font-semibold">
                    Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">lock</span>
                    <input
                      id="reg-password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="w-full pl-10 pr-12 py-3 rounded-xl bg-surface-container-lowest border border-outline-variant text-on-surface text-sm placeholder:text-outline focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all"
                    />

                    <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                    </button>
                  </div>
                  {/* Strength meter */}
                  {passwordStrength && (
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-1 bg-outline-variant/30 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-300 ${strengthColor[passwordStrength]} ${strengthWidth[passwordStrength]}`} />
                      </div>
                      <span className={`text-[11px] font-semibold ${passwordStrength === 'strong' ? 'text-emerald-600' : passwordStrength === 'medium' ? 'text-amber-500' : 'text-red-500'}`}>
                        {strengthLabel[passwordStrength]}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="reg-confirm" className="text-on-surface text-sm font-semibold">
                    Confirm Password <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-[20px]">lock_reset</span>
                    <input
                      id="reg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full pl-10 pr-12 py-3 rounded-xl bg-surface-container-lowest border text-on-surface text-sm placeholder:text-outline focus:outline-none focus:ring-2 transition-all ${
                        confirmPassword && !passwordsMatch
                          ? 'border-error focus:border-error focus:ring-error/15'
                          : confirmPassword && passwordsMatch
                          ? 'border-tertiary focus:border-tertiary focus:ring-tertiary/15'
                          : 'border-outline-variant focus:border-primary focus:ring-primary/15'
                      }`}
                    />
                    <button type="button" tabIndex={-1} onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface-variant transition-colors">
                      <span className="material-symbols-outlined text-[20px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                    </button>
                    {confirmPassword && (
                      <span className={`absolute right-10 top-1/2 -translate-y-1/2 material-symbols-outlined text-[18px] ${passwordsMatch ? 'text-tertiary' : 'text-error'}`}>
                        {passwordsMatch ? 'check_circle' : 'cancel'}
                      </span>
                    )}
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="text-error text-xs">Passwords do not match</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={!step1Valid}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  Continue to Prep Goal
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </form>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <form onSubmit={handleFinalSubmit} className="flex flex-col gap-5">

              {error && (
                <div className="mb-2 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-error-container border border-error/30">
                  <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">error</span>
                  <p className="text-on-error-container text-sm">{error}</p>
                </div>
              )}

              {/* Summary card */}
              <div className="flex items-center gap-3 p-3.5 rounded-xl bg-surface-container-lowest border border-outline-variant">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined material-symbols-fill text-primary text-[20px]">person</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-on-surface text-sm font-semibold truncate">{name}</p>
                  <p className="text-on-surface-variant text-xs truncate">{email}{college ? ` · ${college}` : ''}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-on-surface-variant hover:text-primary text-xs font-semibold transition-colors shrink-0"
                >
                  Edit
                </button>
              </div>

              {/* Goal label */}
              <div>
                <p className="text-on-surface text-sm font-bold mb-1">Preparation Goal</p>
                <p className="text-on-surface-variant text-xs">Which company are you targeting?</p>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    type="button"
                    onClick={() => setSelectedGoal(goal.id)}
                    className={`flex flex-col items-center gap-2 p-3.5 rounded-xl border-2 transition-all duration-200 ${
                      selectedGoal === goal.id
                        ? 'border-primary bg-primary/5 shadow-sm'
                        : 'border-outline-variant bg-surface-container-lowest hover:border-outline hover:bg-surface-container-low'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedGoal === goal.id ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined material-symbols-fill text-[20px]">{goal.icon}</span>
                    </div>
                    <span className={`text-xs font-semibold ${selectedGoal === goal.id ? 'text-primary' : 'text-on-surface-variant'}`}>
                      {goal.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Terms checkbox */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${agreed ? 'bg-primary border-primary' : 'border-outline-variant group-hover:border-outline'}`}
                  onClick={() => setAgreed(!agreed)}
                >
                  {agreed && <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>}
                </div>
                <span className="text-on-surface-variant text-sm leading-relaxed">
                  I agree to the{' '}
                  <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                </span>
              </label>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1.5 px-4 py-3 rounded-xl border border-outline-variant hover:bg-surface-container-low text-on-surface-variant text-sm font-semibold transition-all"
                >
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={!agreed || loading}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-semibold text-sm shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating account&hellip;
                    </>
                  ) : (
                    <>
                      Create Account
                      <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Back to home */}
        <div className="mt-8 mb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-on-surface-variant text-sm hover:text-on-surface transition-colors group">
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span>
            Back to home
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}