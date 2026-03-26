import { type GetStaticProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev, pageUrlOverrides } from '@/lib/config'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params?.pageId as string

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    // REVALIDATE 3600 (1 Saat): Notion'ı arka planda sürekli yormamak ve
    // sayfa tasarımının (karanlık mod vb.) bozulmasını engellemek için.
    return { props, revalidate: 3600 }
  } catch (err) {
    console.error('page error', domain, rawPageId, err)

    // we don't want to publish the error version of this page, so
    // let next.js know explicitly that incremental SSG failed
    throw err
  }
}

export async function getStaticPaths() {
  if (isDev) {
    return {
      paths: [],
      fallback: true
    }
  }

  // VERCEL'İN NOTION'A TOPLU İSTEK ATMASINI ENGELLİYORUZ
  // Sayfalar ziyaretçi tıkladığında "On-Demand" (istek üzerine) oluşturulacak.
  return {
    paths: [], 
    fallback: 'blocking' 
  }
}

export default function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}
