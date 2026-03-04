import cs from 'classnames'
import dynamic from 'next/dynamic'
import Image from 'next/legacy/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { type PageBlock } from 'notion-types'
import { getBlockTitle, getBlockValue, getPageProperty } from 'notion-utils'
import * as React from 'react'
import BodyClassName from 'react-body-classname'
import { type NotionComponents, NotionRenderer } from 'react-notion-x'
import { useSearchParam } from 'react-use'

import type { PageProps as NotionPageProps } from '@/lib/types'
import * as config from '@/lib/config'
import { defaultSEO, seoMap } from '@/lib/seo-map'
import { mapImageUrl } from '@/lib/map-image-url'
import { mapPageUrl } from '@/lib/map-page-url'
import { searchNotion } from '@/lib/search-notion'
import { useDarkMode } from '@/lib/use-dark-mode'

import { Footer } from './Footer'
import { GitHubShareButton } from './GitHubShareButton'
import { Loading } from './Loading'
import { NotionPageHeader } from './NotionPageHeader'
import { Page404 } from './Page404'
import { PageAside } from './PageAside'
import { PageHead } from './PageHead'
import styles from './styles.module.css'

// Dynamic imports (optional blocks)
const Code = dynamic(() =>
  import('react-notion-x/build/third-party/code').then((m) => m.Code)
)

const Collection = dynamic(() =>
  import('react-notion-x/build/third-party/collection').then(
    (m) => m.Collection
  )
)

const Equation = dynamic(() =>
  import('react-notion-x/build/third-party/equation').then((m) => m.Equation)
)

const Pdf = dynamic(
  () => import('react-notion-x/build/third-party/pdf').then((m) => m.Pdf),
  { ssr: false }
)

const Modal = dynamic(
  () =>
    import('react-notion-x/build/third-party/modal').then((m) => {
      m.Modal.setAppElement('.notion-viewport')
      return m.Modal
    }),
  { ssr: false }
)

export function NotionPage({
  site,
  recordMap,
  error,
  pageId
}: NotionPageProps) {
  const router = useRouter()
  const lite = useSearchParam('lite')

  const components = React.useMemo<Partial<NotionComponents>>(
    () => ({
      nextLegacyImage: Image,
      nextLink: Link,
      Code,
      Collection,
      Equation,
      Pdf,
      Modal,
      Header: NotionPageHeader
    }),
    []
  )

  const isLiteMode = lite === 'true'
  const { isDarkMode } = useDarkMode()

  const siteMapPageUrl = React.useMemo(() => {
    const params: any = {}
    if (lite) params.lite = lite

    const searchParams = new URLSearchParams(params)
    return site ? mapPageUrl(site, recordMap!, searchParams) : undefined
  }, [site, recordMap, lite])

  const keys = Object.keys(recordMap?.block || {})
  const block = getBlockValue(recordMap?.block?.[keys[0]!])

  const isBlogPost =
    block?.type === 'page' && block?.parent_table === 'collection'

  if (router.isFallback) return <Loading />

  if (error || !site || !block || !recordMap) {
    return <Page404 site={site} pageId={pageId} error={error} />
  }

  // =========================
  // SEO OVERRIDE SYSTEM (IMPROVED)
  // =========================

  // 1) SEO entry seçimi (pageId undefined güvenli)
  const seo =
    (pageId ? seoMap[pageId as keyof typeof seoMap] : undefined) ?? defaultSEO

  // 2) slug hesapla: override varsa onu kullan
  const slug =
    pageId && (config as any).pageUrlOverrides?.[pageId]
      ? (config as any).pageUrlOverrides[pageId]
      : pageId

  // 3) Ana sayfa tespiti
  const isHome = pageId === site.rootNotionPageId

  // 4) Canonical: ana sayfa => root, diğerleri => /slug
  const canonicalPageUrl =
    !config.isDev
      ? isHome
        ? `https://${site.domain}`
        : slug
          ? `https://${site.domain}/${slug}`
          : undefined
      : undefined

  // 5) Title branding
  const baseTitle =
    seo.title || getBlockTitle(block, recordMap) || site.name

  const finalTitle = isHome
    ? `${site.name} | ${config.description}`
    : `${baseTitle} | ${site.name}`

  // 6) Description (Notion Description fallback + global description)
  const finalDescription =
    seo.description ||
    getPageProperty<string>('Description', block, recordMap) ||
    config.description

  // 7) OG Image
  const finalImage =
    seo.ogImage ||
    mapImageUrl(
      getPageProperty<string>('Social Image', block, recordMap) ||
        (block as PageBlock).format?.page_cover ||
        config.defaultPageCover,
      block
    )

  // 8) Keywords
  const keywords = (seo.keywords || defaultSEO.keywords || []).join(', ')

  // =========================

  return (
    <>
      <PageHead
        pageId={pageId}
        site={site}
        title={finalTitle}
        description={finalDescription}
        image={finalImage}
        url={canonicalPageUrl}
        isBlogPost={isBlogPost}
        keywords={keywords}
      />

      {isLiteMode && <BodyClassName className='notion-lite' />}
      {isDarkMode && <BodyClassName className='dark-mode' />}

      <NotionRenderer
        bodyClassName={cs(
          styles.notion,
          pageId === site.rootNotionPageId && 'index-page'
        )}
        darkMode={isDarkMode}
        components={components}
        recordMap={recordMap}
        rootPageId={site.rootNotionPageId}
        rootDomain={site.domain}
        fullPage={!isLiteMode}
        previewImages={!!recordMap.preview_images}
        showCollectionViewDropdown={false}
        showTableOfContents={!!isBlogPost}
        minTableOfContentsItems={3}
        defaultPageIcon={config.defaultPageIcon}
        defaultPageCover={config.defaultPageCover}
        defaultPageCoverPosition={config.defaultPageCoverPosition}
        mapPageUrl={siteMapPageUrl}
        mapImageUrl={mapImageUrl}
        searchNotion={config.isSearchEnabled ? searchNotion : undefined}
        pageAside={
          <PageAside
            block={block!}
            recordMap={recordMap!}
            isBlogPost={isBlogPost}
          />
        }
        footer={<Footer />}
      />

      <GitHubShareButton />
    </>
  )
}
