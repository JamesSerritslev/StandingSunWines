import type { Metadata, Viewport } from 'next'
import './globals.css'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#282b2e',
}

/** Fonts load at runtime via <link> — avoids build failures when fonts.googleapis.com is unreachable (offline / firewall). */

export const metadata: Metadata = {
  title: 'The Analogue Room | Vinyl Bar & Listening Lounge | Solvang, CA',
  description: 'A curated vinyl bar and listening lounge in Solvang, California. Experience hand-selected records, thoughtful drinks, and a space designed for listening.',
  keywords: ['vinyl bar', 'listening lounge', 'Solvang', 'Santa Ynez Valley', 'wine bar', 'records', 'hi-fi'],
  openGraph: {
    title: 'The Analogue Room | Vinyl Bar & Listening Lounge',
    description: 'A curated vinyl bar and listening lounge in Solvang, California.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Analogue Room | Vinyl Bar & Listening Lounge',
    description: 'A curated vinyl bar and listening lounge in Solvang, California.',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Oswald:wght@200..700&family=Special+Elite&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body min-h-dvh min-w-0 overflow-x-hidden bg-cream text-coal antialiased">
        <div className="relative z-[1] min-h-dvh min-w-0 w-full max-w-full overflow-x-hidden">
          {children}
        </div>
      </body>
    </html>
  )
}
