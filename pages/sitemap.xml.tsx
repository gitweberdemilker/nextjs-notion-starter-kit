import type { GetServerSideProps } from 'next'

import type { SiteMap } from '@/lib/types'
import * as config from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.write(JSON.stringify({ error: 'method not allowed' }))
    res.end()
    return { props: {} }
  }

  const siteMap = await getSiteMap()

  // 8 saat cache
  res.setHeader(
    'Cache-Control',
    'public, max-age=28800, stale-while-revalidate=28800'
  )
  res.setHeader('Content-Type', 'text/xml')
  res.write(createSitemap(siteMap))
  res.end()

  return { props: {} }
}

const createSitemap = (siteMap: SiteMap) => {
  const host = config.host
  const overrides = (config as any).pageUrlOverrides ?? {}
  
  // Ana sayfanın Notion ID'sini alıyoruz (Çift yazımı engellemek için)
  const rootNotionPageId = ((config as any).rootNotionPageId || '').replace(/-/g, '').toLowerCase()

  const urls = Object.keys(siteMap.canonicalPageMap)
    .map((canonicalId) => {
      const cleanCanonicalId = canonicalId.replace(/-/g, '').toLowerCase()
      
      // 1. KORUMA: Eğer sayfa sitenin ana sayfasıysa, onu listeden çıkar 
      // (Çünkü aşağıda <urlset> içinde zaten manuel olarak ekleniyor)
      if (cleanCanonicalId === rootNotionPageId) {
        return null
      }

      let targetSlug = canonicalId

      // 2. TERSİNE EŞLEŞTİRME: Karmaşık ID'nin sözlükteki temiz URL karşılığını bul
      for (const slug in overrides) {
        const idValue = overrides[slug]
        if (typeof idValue === 'string' && idValue.replace(/-/g, '').toLowerCase() === cleanCanonicalId) {
          // URL'nin başındaki eğik çizgiyi (/) siliyoruz ki // şeklinde hatalı link çıkmasın
          targetSlug = slug.startsWith('/') ? slug.substring(1) : slug
          break
        }
      }

      return `
  <url>
    <loc>${host}/${targetSlug}</loc>
  </url>`.trim()
    })
    .filter(Boolean) // null dönen ana sayfayı listeden temizler
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  <url>
    <loc>${host}</loc>
  </url>

${urls}

</urlset>`
}

export default function noop() {
  return null
}
