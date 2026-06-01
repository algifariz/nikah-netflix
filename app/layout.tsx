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
      title,
      description: 'You are invited to our wedding celebration',
    }
  } catch {
    return {
      title: 'Wedding Invitation',
      description: 'You are invited to our wedding celebration',
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
