import type { Metadata } from 'next'
import './globals.css'
import { SessionProvider } from '@/components/providers/SessionProvider'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { data } = await supabaseAdmin.from('settings').select('groom_name, bride_name').single()
    const title = data
      ? `${data.groom_name} & ${data.bride_name} - Wedding Invitation`
      : 'Wedding Invitation'
    return {
      metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://your-domain.vercel.app'),
      title,
      description: 'You are invited to our wedding celebration',
      openGraph: {
        title,
        description: 'You are invited to our wedding celebration',
        type: 'website',
        images: [
          {
            url: '/ai.png',
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: 'You are invited to our wedding celebration',
        images: ['/ai.png'],
      },
    }
  } catch {
    return {
      metadataBase: new URL(process.env.NEXTAUTH_URL || 'https://your-domain.vercel.app'),
      title: 'Wedding Invitation',
      description: 'You are invited to our wedding celebration',
      openGraph: {
        title: 'Wedding Invitation',
        description: 'You are invited to our wedding celebration',
        type: 'website',
        images: [
          {
            url: '/ai.png',
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
        images: ['/ai.png'],
      },
    }
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
