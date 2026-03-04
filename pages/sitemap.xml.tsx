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

  const urls = Object.keys(siteMap.canonicalPageMap)
    .map((canonicalId) => {
      const slug = overrides[canonicalId] ?? canonicalId

      return `
  <url>
    <loc>${host}/${slug}</loc>
  </url>`.trim()
    })
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
