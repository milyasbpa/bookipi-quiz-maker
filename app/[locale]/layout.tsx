import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Toaster } from 'sonner';

import { SkipNavLink } from '@/core/components/skip_nav/SkipNav';
import { routing } from '@/core/i18n/routing';
import { NumberInputGuard, QueryProvider } from '@/core/providers';
import { ThemeProvider } from '@/core/providers/ThemeProvider';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    template: '%s | Quiz Maker',
    default: 'Quiz Maker',
  },
  description: 'Create, manage, and play interactive quizzes with our Quiz Maker platform.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Quiz Maker',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* SkipNavLink must be the first focusable element — WCAG 2.4.1 */}
        <SkipNavLink />
        <ThemeProvider>
          <NextIntlClientProvider>
            <QueryProvider>
              <NumberInputGuard />
              <main id="main-content">{children}</main>
              <Toaster richColors position="top-center" />
            </QueryProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
