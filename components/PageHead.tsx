import Head from 'next/head'

import type * as types from '@/lib/types'
import * as config from '@/lib/config'
import { getSocialImageUrl } from '@/lib/get-social-image-url'

// Hata veren import satırı düzeltildi ve doğru yoldan (../) çağrıldı
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
  // CANONICAL URL KESİN ÇÖZÜMÜ
  // ==========================================
  let canonicalUrl = url;
  if (canonicalUrl && pageId && siteConfig?.pageUrlOverrides) {
    const cleanId = pageId.replace(/-/g, '').toLowerCase();
    const overrideKeys = Object.keys(siteConfig.pageUrlOverrides);
    
    for (const key of overrideKeys) {
      if (key.replace(/-/g, '').toLowerCase() === cleanId) {
        // Notion ID'si yerine kendi belirlediğimiz temiz URL'yi zorla basıyoruz
        canonicalUrl = `https://www.erdemilker.com.tr${siteConfig.pageUrlOverrides[key]}`;
        break;
      }
    }
  }

  // ==========================================
  // ZENGİN SEO (JSON-LD) SAYFA TESPİTİ
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
          VARSAYILAN KARANLIK MOD ZORLAMASI
          Site ilk açıldığında beyaz parlamayı önler ve karanlık modu kilitler
          ========================================== */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            try {
              if (!localStorage.getItem('theme')) {
                localStorage.setItem('theme', 'dark');
                document.documentElement.classList.add('dark-mode');
              }
            } catch (e) {}
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

      {/* DÜZELTİLMİŞ TEMİZ CANONICAL URL BURAYA BASILIYOR */}
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

      {/* BlogPosting Schema */}
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

      {/* Zengin SEO: Kitap (Book) Şeması (Son Yıl ve Kitaplar için) */}
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

      {/* Zengin SEO: Animasyon (VideoObject) Şeması */}
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

      {/* Person Schema */}
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

      {/* Organization Schema */}
      <script type='application/ld+json'>
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Karanlık Hikayeler',
          url: 'https://www.erdemilker.com.tr',
          logo: `${config.host}/og/default.jpg`
        })}
      </script>

      {/* WebSite Schema */}
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
