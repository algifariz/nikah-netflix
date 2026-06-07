import { supabaseAdmin } from '@/lib/supabase/server'
import { WeddingApp } from '@/components/invitation/WeddingApp'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getBaseUrl, toAbsoluteUrl } from '@/lib/utils'

interface Props {
  params: Promise<{ code: string }>
}

// Cache guest data for 60 seconds to reduce DB hits
export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params
  const metadataBase = new URL(getBaseUrl())

  if (code === 'preview') {
    return {
      metadataBase,
      title: 'Wedding Invitation - Preview',
      description: 'You are invited to our wedding celebration',
      openGraph: {
        title: 'Wedding Invitation - Preview',
        description: 'You are invited to our wedding celebration',
        images: [{ url: toAbsoluteUrl('/ai.png'), width: 1200, height: 630, alt: 'Wedding Invitation' }],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Wedding Invitation - Preview',
        description: 'You are invited to our wedding celebration',
        images: [toAbsoluteUrl('/ai.png')],
      },
    }
  }

  // Fetch settings for dynamic OG tags
  const { data: settings } = await supabaseAdmin
    .from('settings')
    .select('groom_name, bride_name, hero_image, og_image, og_title, og_description')
    .maybeSingle()

  const coupleName = settings
    ? `${settings.groom_name} & ${settings.bride_name}`
    : 'Wedding Invitation'
  const title = settings?.og_title || `Wedding Invitation - ${coupleName}`
  const description = settings?.og_description || 'Kami mengundang Anda untuk hadir di acara pernikahan kami'
  const ogImage = toAbsoluteUrl(settings?.og_image || settings?.hero_image || '/ai.png')

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Wedding Invitation',
      locale: 'id_ID',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: coupleName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  }
}

export default async function InvitationPage({ params }: Props) {
  const { code } = await params

  // Preview mode
  if (code === 'preview') {
    return <WeddingApp guestName="Tamu Undangan" code="preview" category="REGULAR" />
  }

  // Fetch guest by invitation code from database
  const { data: guest } = await supabaseAdmin
    .from('guests')
    .select('name, invitation_code, category')
    .eq('invitation_code', code)
    .single()

  if (!guest) {
    notFound()
  }

  return (
    <WeddingApp
      guestName={guest.name}
      code={guest.invitation_code}
      category={guest.category}
    />
  )
}
