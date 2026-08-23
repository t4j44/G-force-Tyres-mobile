import type { Metadata } from 'next';
import './globals.css';
import SmoothScroll from '@/components/animations/SmoothScroll';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'G Force Tyres — Mobile Tyre Fitting in London',
  description:
    'We fit your tyres wherever you are. Enter your reg, pick your tyres, choose a slot. Same-day fitting across London.',
  openGraph: {
    title: 'G Force Tyres — Mobile Tyre Fitting',
    description: 'Tyres fitted at your home, office or roadside. Book in under two minutes.',
    type: 'website',
    locale: 'en_GB',
  },
  robots: { index: true, follow: true },
};

export const viewport = {
  themeColor: '#0D0D0D',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-brand focus:text-ink-inverse focus:px-4 focus:py-2"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
