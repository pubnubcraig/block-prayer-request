import type { Metadata, Viewport } from 'next';
import AuthSessionProvider from '@/components/providers/session-provider';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://gofish.life'),
  title: 'GoFish.Life \u2014 Scripture-Based Prayer Responses',
  description:
    'Bring your concern and receive a Bible verse, faithful interpretation, practical guidance, and a prayer grounded in Scripture. Free, private, and always available.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'GoFish.Life \u2014 Scripture-Based Prayer Responses',
    description: "Bring your concern and receive hope from God's Word.",
    siteName: 'GoFish.Life',
    url: 'https://gofish.life',
    type: 'website',
    images: [
      {
        url: '/gofish-og.png',
        width: 1731,
        height: 909,
        alt: 'GoFish.Life — Scripture-Based Prayer Responses',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GoFish.Life — Scripture-Based Prayer Responses',
    description: "Bring your concern and receive hope from God's Word.",
    images: ['/gofish-og.png'],
  },
};

export const viewport: Viewport = {
  themeColor: '#0D2B45',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthSessionProvider>
          <div className="page-bg" aria-hidden="true" />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
