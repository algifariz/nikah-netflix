export function detectInAppBrowser(): boolean {
  if (typeof window === 'undefined') return false

  const ua = navigator.userAgent.toLowerCase()

  // WhatsApp in-app browser
  if (ua.includes('whatsapp')) return true

  // Telegram in-app browser
  if (ua.includes('telegram')) return true

  // Facebook / Messenger in-app browser
  if (ua.includes('fb') && (ua.includes('fbav') || ua.includes('fban'))) return true
  if (ua.includes('messenger')) return true

  // Instagram in-app browser
  if (ua.includes('instagram')) return true

  // LINE in-app browser
  if (ua.includes('line/')) return true

  // Twitter/X in-app browser
  if (ua.includes('twitter')) return true

  // TikTok in-app browser
  if (ua.includes('tiktok')) return true

  return false
}


export function generateInvitationCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function formatDate(date: string, locale = 'id-ID'): string {
  return new Date(date).toLocaleDateString(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_URL) {
    const url = process.env.NEXT_PUBLIC_URL.startsWith('http')
      ? process.env.NEXT_PUBLIC_URL
      : `https://${process.env.NEXT_PUBLIC_URL}`
    return url.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '')
  }
  return 'http://localhost:3000'
}

export function toAbsoluteUrl(url: string): string {
  if (!url) return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  const base = getBaseUrl()
  if (!base) return url
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`
}
