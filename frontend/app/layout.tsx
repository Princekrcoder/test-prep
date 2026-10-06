import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'TestPrep — Practice Today, Perform Tomorrow',
    template: '%s | TestPrep',
  },
  description:
    'Secure, adaptive mock tests for TCS NQT, Infosys, Wipro and more. Track your performance, identify weak areas, and ace your placement.',
  keywords: ['mock test', 'TCS NQT', 'placement preparation', 'aptitude test', 'online test'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    siteName: 'TestPrep',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`} suppressHydrationWarning>
      <body className="bg-background text-on-surface font-sans text-body-md antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
