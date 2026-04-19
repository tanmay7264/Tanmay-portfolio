import type { Metadata } from 'next'
import { Bebas_Neue, Space_Grotesk } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-sans',
})

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'Tanmay Narnaware | Portfolio',
  description: 'PGDM E-Business | Ex-Apexon | AWS Certified | Entrepreneur | Front End Developer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${bebasNeue.variable}`}>{children}</body>
    </html>
  )
}
