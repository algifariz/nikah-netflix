import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase/server'

export const config = {
  api: {
    bodyParser: false,
  },
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'general'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Check file size (max 50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File terlalu besar (max 50MB)' }, { status: 400 })
    }

    // Convert File to Uint8Array (works better than Buffer in edge/serverless)
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)

    const fileExt = file.name.split('.').pop() || 'bin'
    const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${fileExt}`

    // First check if bucket exists, if not create it
    const { data: buckets } = await supabaseAdmin.storage.listBuckets()
    const bucketExists = buckets?.some(b => b.id === 'uploads')

    if (!bucketExists) {
      await supabaseAdmin.storage.createBucket('uploads', { public: true })
    }

    // Upload file
    const { data, error } = await supabaseAdmin.storage
      .from('uploads')
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: true,
      })

    if (error) {
      console.error('[Upload Error]', error)
      return NextResponse.json(
        { error: `Upload gagal: ${error.message}` },
        { status: 500 }
      )
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('uploads')
      .getPublicUrl(data.path)

    return NextResponse.json({ url: urlData.publicUrl })
  } catch (error: any) {
    console.error('[Upload Exception]', error)
    return NextResponse.json(
      { error: `Upload error: ${error?.message || 'Unknown'}` },
      { status: 500 }
    )
  }
}
