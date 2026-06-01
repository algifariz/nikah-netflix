import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: guests } = await supabaseAdmin.from('guests').select('*')
  const { count: wishesCount } = await supabaseAdmin
    .from('wishes')
    .select('*', { count: 'exact', head: true })

  const guestList = guests || []

  const stats = {
    totalGuests: guestList.length,
    attending: guestList.filter((g) => g.rsvp_status === 'attending').length,
    notAttending: guestList.filter((g) => g.rsvp_status === 'not_attending').length,
    pending: guestList.filter((g) => g.rsvp_status === 'pending').length,
    scanned: guestList.filter((g) => g.has_scanned).length,
    totalWishes: wishesCount || 0,
    vvipCount: guestList.filter((g) => g.category === 'VVIP').length,
    vipCount: guestList.filter((g) => g.category === 'VIP').length,
    regularCount: guestList.filter((g) => g.category === 'REGULAR').length,
  }

  return NextResponse.json(stats)
}
