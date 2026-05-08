import type { Metadata } from 'next'
import { Special_Elite, Oswald, Inter } from 'next/font/google'
import './globals.css'

const specialElite = Special_Elite({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const oswald = Oswald({
  subsets: ['latin'],
  variable: '--font-label',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
})

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
    <html lang="en" className={`${specialElite.variable} ${oswald.variable} ${inter.variable}`}>
      <body className="font-body antialiased bg-cream text-coal">
        {children}
      </body>
    </html>
  )
}
