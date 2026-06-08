import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { getBaseUrl } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(getBaseUrl())

  return {
    metadataBase,
    title: {
      default: 'Wedding Invitation',
      template: '%s | Wedding Invitation',
    },
    description: 'You are invited to our wedding celebration',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}
