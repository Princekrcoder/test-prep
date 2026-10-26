'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth, useLogout } from '@/lib/query/auth';

export default function ProfileAndBillingPage() {
  const { data: user } = useAuth();
  const logout = useLogout();

  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'security'>('profile');

  // Form states with realistic student defaults
  const [name, setName] = useState(user?.name || 'Prince Kumar');
  const [email, setEmail] = useState(user?.email || 'prince.kumar@university.edu');
  const [mobile, setMobile] = useState('+91 98765 43210');
  const [college, setCollege] = useState('Lovely Professional University, Punjab');
  const [course, setCourse] = useState('MCA (Computer Science)');
  const [gradYear, setGradYear] = useState('2026');
  const [targetGoal, setTargetGoal] = useState('TCS NQT & Infosys DSE');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Security states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Preference toggles
  const [notifyExams, setNotifyExams] = useState(true);
  const [notifyAiReports, setNotifyAiReports] = useState(true);
  const [notifyDeadlines, setNotifyDeadlines] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto pb-12">
      {/* ─── 1. Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
            <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
            <span>Account &amp; Settings Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight" style={{ fontFamily: 'var(--font-jakarta)' }}>
            Account, Subscriptions &amp; Preferences
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">
            Manage academic records, competitive target goals, active billing entitlements, and portal security.
          </p>
        </div>

        {/* Quick status badge & Save button */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-surface-container-low px-3.5 py-2 rounded-xl border border-outline-variant/40 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-tertiary animate-pulse" />
            <span className="text-xs font-bold text-on-surface">Pass Status: Active</span>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            className="flex items-center gap-1.5 bg-primary text-on-primary font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:bg-primary-container transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3.5 rounded-xl bg-tertiary-fixed text-on-tertiary-fixed text-xs font-bold flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span>Your profile information and exam goals have been updated successfully!</span>
        </motion.div>
      )}

      {/* ─── 2. Navigation Tabs ───────────────────────────────────────────── */}
      <div className="bg-surface-container-lowest rounded-2xl p-1.5 border border-outline-variant/60 shadow-sm flex items-center gap-1 overflow-x-auto">
        {[
          { id: 'profile', label: 'My Profile & Exam Target', icon: 'badge' },
          { id: 'billing', label: 'Subscriptions & Invoices', icon: 'receipt_long' },
          { id: 'security', label: 'Security & Preferences', icon: 'security' },
        ].map(({ id, label, icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                isActive
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: Profile & Academic Dossier ────────────────────────────── */}
      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          {/* Profile Hero Card */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-outline-variant/60 shadow-sm relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary/10 blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-3xl font-bold">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <label
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-primary text-on-primary flex items-center justify-center cursor-pointer shadow-md hover:scale-105 transition-transform"
                    title="Upload New Photo"
                  >
                    <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  </label>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-bold text-on-surface" style={{ fontFamily: 'var(--font-jakarta)' }}>
                      {name}
                    </h2>
                    <span className="inline-flex items-center gap-1 bg-surface-container text-primary px-2.5 py-0.5 rounded-full text-xs font-semibold">
                      <span className="material-symbols-outlined text-[14px]">verified</span> MCA Scholar
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1.5 text-xs text-on-surface-variant flex-wrap">
                    <span className="text-on-surface bg-surface-container-low px-2 py-0.5 rounded font-mono font-semibold">
                      Roll: #TP-2026-MCA-904
                    </span>
                    <span>&bull;</span>
                    <span>{college}</span>
                  </div>

                  <div className="flex items-center gap-4 mt-2.5 text-xs text-on-surface-variant flex-wrap">
                    <span className="text-tertiary font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">check_circle</span>
                      Identity Verified via DigiLocker
                    </span>
                    <span>Member since July 2024</span>
                  </div>
                </div>
              </div>

              {/* Readiness Score Widget */}
              <div className="flex items-center gap-4 bg-surface-container-low/70 px-5 py-4 rounded-xl border border-outline-variant/40 w-full lg:w-auto justify-between lg:justify-start">
                <div className="flex flex-col">
                  <span className="text-[11px] text-on-surface-variant font-bold uppercase tracking-wider">
                    Target Preparedness
                  </span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-2xl font-black text-primary">88.4</span>
                    <span className="text-xs text-on-surface-variant font-semibold">/ 100</span>
                  </div>
                  <span className="text-xs text-tertiary font-semibold mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">trending_up</span> Top 4% In Cohort
                  </span>
                </div>

                {/* Circular Indicator */}
                <div className="w-14 h-14 rounded-full border-4 border-primary/20 border-t-primary flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Dossier Form */}
          <form
            onSubmit={handleSaveProfile}
            className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-outline-variant/60 shadow-sm flex flex-col gap-5"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/40">
              <span className="material-symbols-outlined text-primary text-[20px]">school</span>
              <h3 className="text-base font-bold text-on-surface">Personal &amp; Academic Details</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Mobile Number</label>
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Course / Degree</label>
                <input
                  type="text"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Graduation Year</label>
                <select
                  value={gradYear}
                  onChange={(e) => setGradYear(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5 pt-2">
              <label className="text-xs font-bold text-on-surface">Primary Competitive Target</label>
              <input
                type="text"
                value={targetGoal}
                onChange={(e) => setTargetGoal(e.target.value)}
                placeholder="e.g. TCS NQT, Infosys DSE, JEE Main..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
              >
                Update Profile
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ─── TAB 2: Subscriptions & Billing ──────────────────────────────── */}
      {activeTab === 'billing' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          {/* Active Plan Card */}
          <div className="bg-gradient-to-br from-primary via-primary to-primary-container text-on-primary rounded-2xl p-6 sm:p-7 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  Active Subscription
                </span>
                <span className="text-xs text-white/80">Renews Annually</span>
              </div>
              <h2 className="text-2xl font-black text-white" style={{ fontFamily: 'var(--font-jakarta)' }}>
                TestPrep Pro Super Pass 2026
              </h2>
              <p className="text-xs text-white/85 max-w-lg leading-relaxed">
                Unlimited access to all company-specific mock tests, AI percentile diagnostic engine, and verified faculty doubt resolution.
              </p>
              <span className="text-xs text-white/90 font-semibold mt-1">
                Valid till: <strong className="text-white underline">31 December 2026</strong>
              </span>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 flex flex-col items-center gap-2 text-center min-w-[180px]">
              <span className="text-xs text-white/80">Plan Status</span>
              <span className="text-xl font-bold text-white flex items-center gap-1">
                <span className="material-symbols-outlined text-[20px] text-tertiary-fixed-dim">verified</span>
                Fully Unlocked
              </span>
              <button
                type="button"
                className="mt-1 w-full py-2 px-3 bg-white text-primary text-xs font-bold rounded-lg hover:bg-surface-container-low transition-colors"
              >
                Manage Billing
              </button>
            </div>
          </div>

          {/* Invoices Table */}
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/60 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-outline-variant/40 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-on-surface">Payment &amp; Invoices History</h3>
                <p className="text-xs text-on-surface-variant mt-0.5">Download official GST tax receipts and payment summaries</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low/60 text-[11px] uppercase font-bold text-on-surface-variant tracking-wider border-b border-outline-variant/40">
                    <th className="py-3 px-5">Invoice ID</th>
                    <th className="py-3 px-4">Billing Date</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {[
                    { id: 'INV-2026-0812', date: '12 Jan 2026', desc: 'Pro Super Pass Annual 2026', amount: '₹1,499', status: 'Paid' },
                    { id: 'INV-2025-0419', date: '15 Jul 2025', desc: 'TCS NQT Diagnostic Booster', amount: '₹499', status: 'Paid' },
                  ].map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-container-low/40 transition-colors">
                      <td className="py-3.5 px-5 font-mono font-bold text-on-surface">{inv.id}</td>
                      <td className="py-3.5 px-4 text-on-surface-variant">{inv.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-on-surface">{inv.desc}</td>
                      <td className="py-3.5 px-4 font-bold text-primary">{inv.amount}</td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-tertiary-fixed text-on-tertiary-fixed text-[11px] font-bold">
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          type="button"
                          className="text-primary hover:underline font-bold text-xs inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">download</span>
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 3: Security & Preferences ───────────────────────────────── */}
      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6">
          {/* Password Reset */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-outline-variant/60 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/40">
              <span className="material-symbols-outlined text-primary text-[20px]">lock_reset</span>
              <h3 className="text-base font-bold text-on-surface">Change Account Password</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">New Password</label>
                <input
                  type="password"
                  placeholder="Min. 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-on-surface">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low/60 border border-outline-variant/50 text-xs text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                className="px-5 py-2.5 bg-primary text-on-primary rounded-xl text-xs font-bold hover:bg-primary-container transition-colors shadow-sm"
              >
                Update Password
              </button>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-outline-variant/60 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/40">
              <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
              <h3 className="text-base font-bold text-on-surface">Notification Preferences</h3>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/40 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-on-surface block">Upcoming Live Mock Exam Reminders</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Receive alert 30 minutes before proctored national tests begin
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyExams}
                  onChange={(e) => setNotifyExams(e.target.checked)}
                  className="w-4 h-4 rounded text-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/40 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-on-surface block">AI Mistake Diagnosis &amp; Weekly Summary</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Send personalized weak-area tips to registered email
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyAiReports}
                  onChange={(e) => setNotifyAiReports(e.target.checked)}
                  className="w-4 h-4 rounded text-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low/40 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-on-surface block">Campus Placement Drive Deadline Alerts</span>
                  <span className="text-[11px] text-on-surface-variant">
                    Alerts for TCS, Infosys, and Accenture application registration dates
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyDeadlines}
                  onChange={(e) => setNotifyDeadlines(e.target.checked)}
                  className="w-4 h-4 rounded text-primary cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 sm:p-7 border border-error/30 shadow-sm flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-error">Account Session</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">
                Sign out from this device. All test sessions and active attempts are securely preserved.
              </p>
            </div>
            <button
              type="button"
              onClick={() => logout.mutate()}
              disabled={logout.isPending}
              className="px-4 py-2.5 rounded-xl border border-error text-error hover:bg-error-container text-xs font-bold transition-colors whitespace-nowrap"
            >
              {logout.isPending ? 'Signing out...' : 'Sign Out of TestPrep'}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}