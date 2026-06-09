import Link from 'next/link'
import type { Metadata } from 'next'
import { getBaseUrl, toAbsoluteUrl } from '@/lib/utils'

export async function generateMetadata(): Promise<Metadata> {
  const metadataBase = new URL(getBaseUrl())

  return {
    metadataBase,
    title: '404 - Halaman Tidak Ditemukan',
    description: 'Maaf, halaman yang Anda cari tidak tersedia.',
    openGraph: {
      title: '404 - Halaman Tidak Ditemukan',
      description: 'Maaf, halaman yang Anda cari tidak tersedia.',
      url: toAbsoluteUrl('/'),
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
  }
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-netflix-black flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-netflix-red text-6xl font-black mb-4">404</h1>
      <h2 className="text-2xl font-bold text-white mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-netflix-light/50 text-sm mb-8">
        Maaf, halaman yang Anda cari tidak tersedia.
      </p>
      <Link
        href="/"
        className="bg-netflix-red text-white font-bold px-6 py-3 rounded hover:bg-red-700 transition"
      >
        Kembali ke Beranda
      </Link>
    </div>
  )
}
