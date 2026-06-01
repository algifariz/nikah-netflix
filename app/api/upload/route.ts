import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const fileExt = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`

    // Try uploading to Supabase Storage
    const { data, error } = await supabaseAdmin.storage
      .from('uploads')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      console.error('[Upload Error]', JSON.stringify(error))
      // If bucket doesn't exist or storage fails, return error with details
      return NextResponse.json(
        { error: `Upload gagal: ${error.message}. Pastikan bucket "uploads" sudah dibuat di Supabase Storage dan diset Public.` },
        { status: 500 }
      )
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error: any) {
    console.error('[Upload Exception]', error?.message || error)
    return NextResponse.json(
      { error: `Upload exception: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    )
  }
}
