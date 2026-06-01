import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { code, rsvp_status, number_of_guests } = await req.json()

    const { error } = await supabaseAdmin
      .from('guests')
      .update({
        rsvp_status,
        number_of_guests,
        updated_at: new Date().toISOString(),
      })
      .eq('invitation_code', code)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update RSVP' }, { status: 500 })
  }
}
