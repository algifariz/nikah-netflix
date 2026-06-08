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
        url: toAbsoluteUrl('/invitation/preview'),
        siteName: 'Wedding Invitation',
        locale: 'id_ID',
        type: 'website',
        images: [
          {
            url: toAbsoluteUrl('/og-image.jpg'),
            secureUrl: toAbsoluteUrl('/og-image.jpg'),
            width: 1200,
            height: 630,
            alt: 'Wedding Invitation',
            type: 'image/jpeg',
          },
          {
            url: toAbsoluteUrl('/og-image-square.jpg'),
            secureUrl: toAbsoluteUrl('/og-image-square.jpg'),
            width: 400,
            height: 400,
            alt: 'Wedding Invitation',
            type: 'image/jpeg',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Wedding Invitation - Preview',
        description: 'You are invited to our wedding celebration',
        images: [toAbsoluteUrl('/ai.jpg')],
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

  const landscapeImage = toAbsoluteUrl(settings?.og_image || settings?.hero_image || '/og-image.jpg')
  const squareImage = toAbsoluteUrl(settings?.og_image || settings?.hero_image || '/og-image-square.jpg')

  // Truncate for WhatsApp: title max ~65 chars, description max ~155 chars
  const waTitle = title.length > 60 ? title.slice(0, 57) + '...' : title
  const waDescription = description.length > 150 ? description.slice(0, 147) + '...' : description

  return {
    metadataBase,
    title,
    description,
    openGraph: {
      title: waTitle,
      description: waDescription,
      url: toAbsoluteUrl(`/invitation/${code}`),
      type: 'website',
      siteName: 'Wedding Invitation',
      locale: 'id_ID',
      images: [
        {
          url: landscapeImage,
          secureUrl: landscapeImage,
          width: 1200,
          height: 630,
          alt: coupleName,
          type: 'image/jpeg',
        },
        {
          url: squareImage,
          secureUrl: squareImage,
          width: 400,
          height: 400,
          alt: coupleName,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: waTitle,
      description: waDescription,
      images: [landscapeImage],
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
