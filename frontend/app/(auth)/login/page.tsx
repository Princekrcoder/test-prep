import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-margin-mobile">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-space-xl">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-space-sm">
            <span className="text-on-primary font-display font-bold text-xl">T</span>
          </div>
          <h1 className="font-display text-headline-xl text-on-surface">Welcome to TestPrep</h1>
          <p className="text-body-md text-on-surface-variant mt-space-xs">
            Sign in to track your progress and access full mocks
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-space-xl shadow-sm">
          <a
            href="/api/auth/google"
            className="w-full flex items-center justify-center gap-space-sm px-space-lg py-space-sm bg-surface-container rounded-xl border border-outline-variant text-label-lg text-on-surface hover:bg-surface-container-high transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </a>

          <div className="mt-space-lg text-center">
            <p className="text-body-sm text-on-surface-variant">
              By signing in you agree to our{' '}
              <Link href="/terms" className="text-primary hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>

        <div className="text-center mt-space-lg">
          <Link href="/" className="text-label-md text-on-surface-variant hover:text-on-surface transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
