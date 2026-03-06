import Head from 'next/head'
import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import siteConfig from '../site.config'

export function PageHead({
  site,
  title,
  description,
  pageId,
  image,
  url,
  keywords
}: types.PageProps & {
  title?: string
  description?: string
  image?: string
  url?: string
  keywords?: string
}) {
  title = title ?? site?.name
  description = description ?? site?.description

  // ==========================================
  // SOSYAL MEDYA GÖRSELİ (ZORLAYICI YÖNTEM)
  // ==========================================
  // Varsayılan görselimiz public/kapak.png olsun
  let socialImageUrl = 'https://www.erdemilker.com.tr/kapak.png';

  // Eğer Notion'dan özel bir kapak (ikon değil) geliyorsa onu temizleyip kullanalım
  if (image && !image.includes('ikon.jpg')) {
    if (image.includes('_next/image?url=')) {
      const urlPart = image.split('url=')[1];
      if (urlPart) {
        const extracted = urlPart.split('&')[0];
        if (extracted) socialImageUrl = decodeURIComponent(extracted);
      }
    } else if (image.startsWith('/')) {
      socialImageUrl = `https://www.erdemilker.com.tr${image}`;
    } else {
      socialImageUrl = image;
    }
  }

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover' />
      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />

      {/* KRİTİK GÖRSEL ETİKETLERİ */}
      <meta property='og:image' content={socialImageUrl} />
      <meta name='twitter:image' content={socialImageUrl} />
      <meta name='twitter:card' content='summary_large_image' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />

      {site && <meta property='og:site_name' content={site.name} />}
      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      <title>{title}</title>
      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      
      {url && <link rel='canonical' href={url} />}
      <meta property='og:url' content={url || 'https://www.erdemilker.com.tr/'} />

      {/* JSON-LD LOGO GÜNCELLEMESİ */}
      <script type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Karanlık Hikayeler',
        'url': 'https://www.erdemilker.com.tr',
        'logo': 'https://www.erdemilker.com.tr/kapak.png'
      })}} />
    </Head>
  )
}
