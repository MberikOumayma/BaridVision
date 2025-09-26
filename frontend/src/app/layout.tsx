import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BaridVision - Système intelligent de tri postal',
  description: 'Solution IA pour le calcul volumétrique et la détection de matières interdites',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-white text-[#001F5B] antialiased`}>
        {/* Structure de base */}
        <div className="min-h-screen flex flex-col">
          {children}
          
          {/* Footer commun (optionnel) */}
          <footer className="bg-[#001F5B] py-6 text-white text-center mt-auto">
            <div className="container mx-auto px-6">
              <p>© 2025 BaridVision - Centre de tri postal</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}