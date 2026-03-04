import type { PageProps as NotionPageProps } from '@/lib/types'
import { seoMap, defaultSEO } from '@/lib/seo-map'

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
      Tweet,
      Header: NotionPageHeader,
      propertyLastEditedTimeValue,
      propertyTextValue,
      propertyDateValue
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

  // ----------------------------------------------------
  // 🔥 SEO OVERRIDE
  // ----------------------------------------------------

  const seo = seoMap[pageId] || defaultSEO

  const canonicalPageUrl = config.isDev
    ? undefined
    : getCanonicalPageUrl(site, recordMap)(pageId)

  const finalTitle =
    seo?.title || getBlockTitle(block, recordMap) || site.name

  const finalDescription =
    seo?.description ||
    getPageProperty<string>('Description', block, recordMap) ||
    config.description

  const finalImage =
    seo?.ogImage ||
    mapImageUrl(
      getPageProperty<string>('Social Image', block, recordMap) ||
        (block as PageBlock).format?.page_cover ||
        config.defaultPageCover,
      block
    )

  const keywords = (seo?.keywords || defaultSEO.keywords || []).join(', ')

  // ----------------------------------------------------

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
