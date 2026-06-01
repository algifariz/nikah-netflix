import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateInvitationCode, getBaseUrl } from '@/lib/utils'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { data, error } = await supabaseAdmin
      .from('guests')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[API /guests GET]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data || [])
  } catch (err: any) {
    console.error('[API /guests GET] Exception:', err.message)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const code = generateInvitationCode()
    const baseUrl = getBaseUrl()

    const { data, error } = await supabaseAdmin
      .from('guests')
      .insert({
        name: body.name,
        phone: body.phone || null,
        email: body.email || null,
        category: body.category || 'REGULAR',
        invitation_code: code,
        invitation_url: `${baseUrl}/invitation/${code}`,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to create guest' }, { status: 500 })
  }
}
