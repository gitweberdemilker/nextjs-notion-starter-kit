import Head from 'next/head'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { getSocialImageUrl } from '@/lib/get-social-image-url'
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

  const socialImageUrl = getSocialImageUrl(pageId) || image

  // ==========================================
  // CANONICAL URL KESİN ÇÖZÜMÜ (MANTIK DÜZELTİLDİ)
  // ==========================================
  let canonicalUrl = url;
  if (pageId && siteConfig?.pageUrlOverrides) {
    // 1. O anki sayfanın Notion ID'sini tirelerden temizle
    const cleanId = pageId.replace(/-/g, '').toLowerCase();
    
    // 2. Config dosyanızdaki "URL: ID" sözlüğünü çek
    const overrides = siteConfig.pageUrlOverrides;
    
    for (const slug in overrides) {
      // Sağ taraftaki değeri (ID'yi) temizle
      const mappedId = overrides[slug].replace(/-/g, '').toLowerCase();
      
      // Eğer sayfa ID'miz sözlüktekiyle uyuşuyorsa...
      if (mappedId === cleanId) {
        // URL kısmını (sol tarafı) al ve canonical olarak ata!
        const cleanSlug = slug.startsWith('/') ? slug : `/${slug}`;
        canonicalUrl = `https://www.erdemilker.com.tr${cleanSlug}`;
        break;
      }
    }
  }

  // ==========================================
  // ZENGİN SEO SAYFA TESPİTİ (JSON-LD)
  // ==========================================
  const isBookPage = canonicalUrl?.includes('son-yil') || canonicalUrl?.includes('kitaplar') || canonicalUrl?.includes('tamamlanan-kitaplar');
  const isVideoPage = canonicalUrl?.includes('animasyon');

  return (
    <Head>
      <meta charSet='utf-8' />
      <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
      <meta
        name='viewport'
        content='width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover'
      />

      <meta name='mobile-web-app-capable' content='yes' />
      <meta name='apple-mobile-web-app-status-bar-style' content='black' />

      <meta
        name='theme-color'
        media='(prefers-color-scheme: light)'
        content='#fefffe'
        key='theme-color-light'
      />
      <meta
        name='theme-color'
        media='(prefers-color-scheme: dark)'
        content='#000000' 
        key='theme-color-dark'
      />

      <meta name='robots' content='index,follow' />
      <meta property='og:type' content='website' />

      {/* ==========================================
          AGRESİF KARANLIK MOD ZORLAYICISI
          Sistem ayarı aydınlık bile olsa, sitenizi zifiri karanlık açar
          ========================================== */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                window.localStorage.setItem('theme', 'dark');
                document.documentElement.classList.add('dark-mode');
                document.documentElement.setAttribute('data-theme', 'dark');
                document.body.classList.add('dark-mode');
              } catch (e) {}
            })();
          `
        }}
      />

      {site && (
        <>
          <meta property='og:site_name' content={site.name} />
          <meta property='twitter:domain' content={site.domain} />
        </>
      )}

      {config.twitter && (
        <meta name='twitter:creator' content={`@${config.twitter}`} />
      )}

      {description && (
        <>
          <meta name='description' content={description} />
          <meta property='og:description' content={description} />
          <meta name='twitter:description' content={description} />
        </>
      )}

      {keywords && <meta name='keywords' content={keywords} />}

      {socialImageUrl ? (
        <>
          <meta name='twitter:card' content='summary_large_image' />
          <meta name='twitter:image' content={socialImageUrl} />
          <meta property='og:image' content={socialImageUrl} />
        </>
      ) : (
        <meta name='twitter:card' content='summary' />
      )}

      {/* TERTEMİZ URL BURADA GOOGLE'A SUNULUYOR */}
      {canonicalUrl && (
        <>
          <link rel='canonical' href={canonicalUrl} />
          <meta property='og:url' content={canonicalUrl} />
          <meta property='twitter:url' content={canonicalUrl} />
        </>
      )}

      <link
        rel='alternate'
        type='application/rss+xml'
        href={rssFeedUrl}
        title={site?.name}
      />

      <meta property='og:title' content={title} />
      <meta name='twitter:title' content={title} />
      <title>{title}</title>

      {isBlogPost && canonicalUrl && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            '@id': `${canonicalUrl}#BlogPosting`,
            mainEntityOfPage: canonicalUrl,
            url: canonicalUrl,
            headline: title,
            name: title,
            description,
            author: {
              '@type': 'Person',
              name: config.author
            },
            image: socialImageUrl
          })}
        </script>
      )}

      {isBookPage && canonicalUrl && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Book',
            name: title,
            author: {
              '@type': 'Person',
              name: 'Erdem İlker'
            },
            url: canonicalUrl,
            genre: ['Fantastik Gerilim', 'Korku'],
            inLanguage: 'tr',
            publisher: {
              '@type': 'Organization',
              name: 'Karanlık Hikayeler'
            }
          })}
        </script>
      )}

      {isVideoPage && canonicalUrl && (
        <script type='application/ld+json'>
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'VideoObject',
            name: title,
            description: description || 'Kimsesizler Mezarlığı Animasyon Serisi',
            thumbnailUrl: socialImageUrl || `${config.host}/og/default.jpg`,
            uploadDate: '2026-01-01T08:00:00+08:00', 
            author: {
              '@type': 'Person',
              name: 'Erdem İlker'
            }
          })}
        </script>
      )}

      <script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Erdem İlker',
          url: 'https://www.erdemilker.com.tr',
          sameAs: config.twitter
            ? [`https://twitter.com/${config.twitter}`]
            : [],
          jobTitle: 'Yazar',
          worksFor: {
            '@type': 'Organization',
            name: 'Karanlık Hikayeler'
          }
        })}
      </script>

      <script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Karanlık Hikayeler',
          url: 'https://www.erdemilker.com.tr',
          logo: `${config.host}/og/default.jpg`
        })}
      </script>

      <script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Karanlık Hikayeler',
          url: 'https://www.erdemilker.com.tr',
          potentialAction: {
            '@type': 'SearchAction',
            target:
              'https://www.erdemilker.com.tr/?q={search_term_string}',
            'query-input': 'required name=search_term_string'
          }
        })}
      </script>
    </Head>
  )
}
