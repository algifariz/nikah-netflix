import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { generateInvitationCode, getBaseUrl } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '15', 10)))
    const offset = (page - 1) * limit

    // Build query for count and data
    let countQuery = supabaseAdmin.from('guests').select('*', { count: 'exact', head: true })
    let dataQuery = supabaseAdmin.from('guests').select('*')

    if (search) {
      const searchFilter = `%${search}%`
      countQuery = countQuery.or(`name.ilike.${searchFilter},phone.ilike.${searchFilter}`)
      dataQuery = dataQuery.or(`name.ilike.${searchFilter},phone.ilike.${searchFilter}`)
    }

    const { count, error: countError } = await countQuery
    if (countError) {
      console.error('[API /guests GET] count error:', countError.message)
      return NextResponse.json({ error: countError.message }, { status: 500 })
    }

    const { data, error } = await dataQuery
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('[API /guests GET]', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      guests: data || [],
      total: count || 0,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (err: any) {
    console.error('[API /guests GET] Exception:', err.message)
    return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
