import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { code } = await req.json()

    const { data: guest, error: fetchError } = await supabaseAdmin
      .from('guests')
      .select('*')
      .eq('invitation_code', code)
      .single()

    if (fetchError || !guest) {
      return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
    }

    if (guest.has_scanned) {
      return NextResponse.json({
        guest,
        warning: 'QR sudah pernah di-scan sebelumnya',
        already_scanned: true,
      })
    }

    const { data, error } = await supabaseAdmin
      .from('guests')
      .update({
        has_scanned: true,
        scanned_at: new Date().toISOString(),
      })
      .eq('id', guest.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ guest: data, already_scanned: false })
  } catch (error) {
    return NextResponse.json({ error: 'Scan failed' }, { status: 500 })
  }
}
