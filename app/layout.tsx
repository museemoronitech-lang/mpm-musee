import type { Metadata } from 'next'
import { Bebas_Neue, Libre_Baskerville, DM_Mono } from 'next/font/google'
import './globals.css'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import Toast from '@/components/Toast'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

const libreBaskerville = Libre_Baskerville({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
})

const dmMono = DM_Mono({
  weight: ['300', '400'],
  subsets: ['latin'],
  variable: '--font-mono',
})

export const metadata: Metadata = {
  title: 'MPM — Musée de la Photographie de Moroni',
  description: 'Plateforme de préservation et de valorisation du patrimoine photographique des Comores. Archives 1880–1995.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className={`${bebasNeue.variable} ${libreBaskerville.variable} ${dmMono.variable}`}>
      <body>
        <Nav />
        {children}
        <Footer />
        <Toast />
      </body>
    </html>
  )
}