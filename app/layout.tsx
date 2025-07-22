import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Serbest Atış Projesi - Basketball Prediction Game',
  description: 'Tahmin et, atış yap, token kazan! Stacks blockchain üzerinde basketbol oyunu.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
          {children}
        </div>
      </body>
    </html>
  )
}