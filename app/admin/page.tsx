'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/admin/login')
    }
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-netflix-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-netflix-red border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return <AdminDashboard />
}
