import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'

function getMetadataBaseUrl(): URL {
  // Priority: NEXT_PUBLIC_URL > VERCEL_URL (auto-set by Vercel) > NEXTAUTH_URL > fallback
  if (process.env.NEXT_PUBLIC_URL) {
    const url = process.env.NEXT_PUBLIC_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_URL
      : `https://${process.env.NEXT_PUBLIC_URL}`
    return new URL(url)
  }
  if (process.env.VERCEL_URL) {
    return new URL(`https://${process.env.VERCEL_URL}`)
  }
  if (process.env.NEXTAUTH_URL) {
    return new URL(process.env.NEXTAUTH_URL)
  }
  return new URL('https://your-domain.vercel.app')
}

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = getMetadataBaseUrl()

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
          url: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop',
          width: 1200,
          height: 630,
          alt: 'Wedding Invitation',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Wedding Invitation',
      description: 'You are invited to our wedding celebration',
      images: ['https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&h=630&fit=crop'],
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
