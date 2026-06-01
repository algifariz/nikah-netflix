import { supabaseAdmin } from '@/lib/supabase/server'
import { WeddingApp } from '@/components/invitation/WeddingApp'
import { notFound } from 'next/navigation'

interface Props {
  params: Promise<{ code: string }>
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
    .select('*')
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
