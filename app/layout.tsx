import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { getBaseUrl, toAbsoluteUrl } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(getBaseUrl())

  return {
    metadataBase,
    title: 'Wedding Invitation',
    description: 'You are invited to our wedding celebration',
    openGraph: {
      title: 'Wedding Invitation',
      description: 'You are invited to our wedding celebration',
      type: 'website',
      siteName: 'Wedding Invitation',
      locale: 'id_ID',
      images: [
        {
          url: toAbsoluteUrl('/og-image.png'),
          width: 1200,
          height: 630,
          alt: 'Wedding Invitation',
        },
        {
          url: toAbsoluteUrl('/og-image-square.png'),
          width: 400,
          height: 400,
          alt: 'Wedding Invitation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Wedding Invitation',
      description: 'You are invited to our wedding celebration',
      images: [
        toAbsoluteUrl('/og-image.png'),
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
