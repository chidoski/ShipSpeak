import type { Metadata } from 'next'
import './globals.css'
import AuthProvider from '@/providers/AuthProvider'

export const metadata: Metadata = {
  title: 'ShipSpeak - PM Leadership Development',
  description: 'AI-powered platform for product leadership development with meeting intelligence and adaptive practice modules',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}