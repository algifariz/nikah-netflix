import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Wedding Invitation',
  description: 'You are invited to our wedding celebration',
}

export default function Home() {
  redirect('/invitation/preview')
}
