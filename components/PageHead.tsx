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
  isBlogPost,
  keywords
}: types.PageProps & {
  title?: string
  description?: string
  image?: string
  url?: string
  isBlogPost?: boolean
  keywords?: string
}) {
  const rssFeedUrl = `${config.host}/feed`

  title = title ?? site?.name
  description = description ?? site?.description

  // ==========================================
  // SOSYAL MEDYA GÖRSELİ (PNG VE TAM YOL)
  // ==========================================
  
  // Önce sitenin yeni ana afişini (kapak.png) varsayılan yapalım
  let socialImageUrl = 'https://www.erdemilker.com.tr/kapak.png';

  // Eğer sayfaya özel (Notion'dan gelen) bir resim varsa onu işlemeye çalışalım
  if (image) {
    if (image.includes('_next/image?url=')) {
      try {
        const urlPart = image.split('url=')[1];
        if (urlPart) {
          const extractedUrl = urlPart.split('&')[0];
          if (extractedUrl) {
            socialImageUrl = decodeURIComponent(extractedUrl);
          }
        }
      } catch (e) {
        // Hata durumunda kapak.png varsayılan kalır
      }
    } else if (image.startsWith('/')) {
      socialImageUrl = `https://www.erdemilker.com.tr${image}`;
    } else {
      socialImageUrl = image;
    }
  }

  // ==========================================
  // CANONICAL URL & ANA SAYFA KORUMASI
  // ==========================================
  let canonicalUrl = url;
  if (pageId && siteConfig) {
    const cleanId = pageId.replace(/-/g, '').toLowerCase();
    let rootId = siteConfig.rootNotionPageId?.replace(/-/g, '').toLowerCase() || '';
    
    if (cleanId === rootId) {
      canonicalUrl = 'https://www.erdemilker.com.tr/';
    } else if (siteConfig.pageUrlOverrides) {
      const overrides = siteConfig.pageUrlOverrides;
      for (const slug in overrides) {
        const overrideValue = overrides[slug];
        if (overrideValue && overrideValue.replace(/-/g, '').toLowerCase() === cleanId) {
          const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
          canonicalUrl = `https://www.erdemilker.com.tr${cleanSlug}`;
          break;
        }
      }
    }
  }

  const isBookPage = canonicalUrl?.includes('son-yil') || canonicalUrl?.includes('kitaplar');
  const isVideoPage = canonicalUrl?.includes('animasyon');

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover' />

      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />

      {/* KARANLIK MOD ZORLAYICISI */}
      <script dangerouslySetInnerHTML={{ __html: `(function(){try{window.localStorage.setItem('theme','dark');document.documentElement.classList.add('dark-mode');}catch(e){}})();` }} />

      {site && (
        <>
          <meta property='og:site_name' content={site.name} />
          <meta property='twitter:domain' content={site.domain} />
        </>
      )}

      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      {keywords && <meta name='keywords' content={keywords} />}

      {/* GÖRSEL ETİKETLERİ - PNG GÜNCELLEMESİ */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:image' content={socialImageUrl} />
      <meta property='og:image' content={socialImageUrl} />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta property='og:image:type' content='image/png' />

      {canonicalUrl && (
        <>
          <link rel='canonical' href={canonicalUrl} />
          <meta property='og:url' content={canonicalUrl} />
          <meta property='twitter:url' content={canonicalUrl} />
        </>
      )}

      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>{title}</title>

      {/* JSON-LD Logosu PNG olarak güncellendi */}
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
