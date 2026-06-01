import Link from 'next/link'

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
