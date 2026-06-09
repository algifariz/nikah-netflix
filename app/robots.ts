import type { MetadataRoute } from 'next'
import { getBaseUrl } from '@/lib/utils'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl()

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    // Uncomment when you add a sitemap
    // sitemap: `${baseUrl}/sitemap.xml`,
  }
}
