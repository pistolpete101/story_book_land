import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import MobileWarning from '@/components/MobileWarning'
import SessionProvider from '@/components/SessionProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Story Book Land - Create Magical Stories',
  description: 'A fun and interactive platform for kids to create, read, and share their own magical stories',
  keywords: 'kids, stories, books, creativity, reading, writing, education',
  authors: [{ name: 'Story Book Land Team' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Story Book Land',
  },
  formatDetection: {
    telephone: false,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <MobileWarning />
          <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 safe-area-inset">
            {children}
          </div>
        </body>
      </html>
    </SessionProvider>
  )
}
