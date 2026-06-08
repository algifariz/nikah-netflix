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
    openGraph: {
      title: 'Wedding Invitation',
      description: 'You are invited to our wedding celebration',
      siteName: 'Wedding Invitation',
      locale: 'id_ID',
      type: 'website',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: 'Wedding Invitation',
        },
        {
          url: '/og-image-square.jpg',
          width: 400,
          height: 400,
          alt: 'Wedding Invitation',
        },
      ],
    },
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
