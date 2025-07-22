import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: '🏀 Serbest Atış Projesi - Blockchain Basketbol Tahmin Oyunu',
  description: 'Blockchain üzerinde basketbol serbest atış tahmin oyunu. 3 atış tahmini yap, gerçek atışları simüle et, STX token kazan! Stacks blockchain, Next.js ve modern web teknolojileri ile geliştirilmiş ücretsiz oyun.',
  keywords: [
    'basketbol oyunu',
    'blockchain oyun',
    'serbest atış',
    'tahmin oyunu',
    'stacks blockchain',
    'cryptocurrency oyun',
    'web3 oyun',
    'bitcoin oyun',
    'basketbol tahmin',
    'crypto oyun',
    'blockchain game',
    'basketball prediction',
    'free throw game',
    'stx token',
    'çevrimiçi basketbol oyunu',
    'blockchain tabanlı oyun',
    'cryptocurrency kazanma',
    'web3 basketball',
    'türkçe blockchain oyunu'
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
    locale: 'tr_TR',
    url: 'https://serbest-atis-proje-o8fm.vercel.app/',
    title: '🏀 Serbest Atış Projesi - Blockchain Basketbol Tahmin Oyunu',
    description: 'Blockchain üzerinde basketbol serbest atış tahmin oyunu. 3 atış tahmini yap, gerçek atışları simüle et, STX token kazan!',
    siteName: 'Serbest Atış Projesi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Serbest Atış Projesi - Blockchain Basketbol Oyunu',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '🏀 Serbest Atış Projesi - Blockchain Basketbol Tahmin Oyunu',
    description: 'Blockchain üzerinde basketbol serbest atış tahmin oyunu. 3 atış tahmini yap, gerçek atışları simüle et, STX token kazan!',
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
    <html lang="tr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F97316" />
        <meta name="application-name" content="Serbest Atış Projesi" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Serbest Atış Projesi" />
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
              "name": "Serbest Atış Projesi",
              "description": "Blockchain üzerinde basketbol serbest atış tahmin oyunu",
              "url": "https://serbest-atis-proje-o8fm.vercel.app/",
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
        <link rel="canonical" href="https://serbest-atis-proje-o8fm.vercel.app/" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
          {children}
        </div>
      </body>
    </html>
  )
}