import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '🏀 Free Throw Project - Blockchain Basketball Prediction Game',
  description: 'Basketball free throw prediction game on blockchain. Make 3 shot predictions, simulate actual shots, earn STX tokens! Free game developed with Stacks blockchain, Next.js and modern web technologies.',
  keywords: [
    'basketball game',
    'blockchain game',
    'free throw',
    'prediction game',
    'stacks blockchain',
    'cryptocurrency game',
    'web3 game',
    'bitcoin game',
    'basketball prediction',
    'crypto game',
    'blockchain game',
    'basketball prediction',
    'free throw game',
    'stx token',
    'online basketball game',
    'blockchain based game',
    'cryptocurrency earning',
    'web3 basketball',
    'english blockchain game'
  ],
  authors: [{ name: 'Çağıl Emek Kurtul', url: 'https://github.com/cagilemek' }],
  creator: 'Çağıl Emek Kurtul',
  publisher: 'Çağıl Emek Kurtul',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://free-throw-project.vercel.app/',
    title: '🏀 Free Throw Project - Blockchain Basketball Prediction Game',
    description: 'Basketball free throw prediction game on blockchain. Make 3 shot predictions, simulate actual shots, earn STX tokens!',
    siteName: 'Free Throw Project',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Free Throw Project - Blockchain Basketball Game',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🏀 Free Throw Project - Blockchain Basketball Prediction Game',
    description: 'Basketball free throw prediction game on blockchain. Make 3 shot predictions, simulate actual shots, earn STX tokens!',
    images: ['/og-image.png'],
    creator: '@cagilemek',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'gaming',
  classification: 'Blockchain Game, Basketball Game, Prediction Game',
  icons: {
    icon: [
      {
        url: '/favicon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      }
    ],
    apple: {
      url: '/apple-icon.png',
      sizes: '180x180',
      type: 'image/png',
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F97316" />
        <meta name="application-name" content="Free Throw Project" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Free Throw Project" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#F97316" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Game",
              "name": "Free Throw Project",
              "description": "Basketball free throw prediction game on blockchain",
              "url": "https://free-throw-project.vercel.app/",
              "author": {
                "@type": "Person",
                "name": "Çağıl Emek Kurtul"
              },
              "gameCategory": "Sports Game, Prediction Game, Blockchain Game",
              "operatingSystem": "Web Browser",
              "applicationCategory": "Game",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
        <link rel="canonical" href="https://free-throw-project.vercel.app/" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
          {children}
        </div>
      </body>
    </html>
  )
}