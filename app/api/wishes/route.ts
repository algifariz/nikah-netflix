import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('wishes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  try {
    const { guest_name, message } = await req.json()

    // Validate name is not empty
    if (!guest_name || !guest_name.trim()) {
      return NextResponse.json(
        { error: 'Nama tamu tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Validate message is not empty
    if (!message || !message.trim()) {
      return NextResponse.json(
        { error: 'Pesan tidak boleh kosong' },
        { status: 400 }
      )
    }

    // Check if guest exists in database
    const { data: existingGuest, error: guestError } = await supabaseAdmin
      .from('guests')
      .select('id, name')
      .ilike('name', guest_name.trim())
      .maybeSingle()

    if (guestError) throw guestError

    if (!existingGuest) {
      return NextResponse.json(
        { error: 'Maaf, nama Anda tidak terdaftar sebagai tamu undangan' },
        { status: 403 }
      )
    }

    const { data, error } = await supabaseAdmin
      .from('wishes')
      .insert({ guest_name: guest_name.trim(), message: message.trim() })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('[API /wishes POST]', error)
    return NextResponse.json({ error: 'Gagal menyimpan ucapan' }, { status: 500 })
  }
}
