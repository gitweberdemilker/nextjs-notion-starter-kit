import { type GetStaticProps } from 'next'

import { NotionPage } from '@/components/NotionPage'
import { domain, isDev, pageUrlOverrides } from '@/lib/config'
import { getSiteMap } from '@/lib/get-site-map'
import { resolveNotionPage } from '@/lib/resolve-notion-page'
import { type PageProps, type Params } from '@/lib/types'

// BEKLEME FONKSİYONU: Next.js'in Notion'a DDoS atmasını engeller :)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getStaticProps: GetStaticProps<PageProps, Params> = async (
  context
) => {
  const rawPageId = context.params?.pageId as string

  // NOTION API'SİNİ YORMAMAK İÇİN RASTGELE 4 İLA 10 SANİYE BEKLE
  // İstekleri zamana yayarak 429 (Too Many Requests) hatasını engelliyoruz.
  const waitTime = Math.floor(Math.random() * 6000) + 4000; 
  console.log(`[Throttle] Sayfa çekilmeden önce bekleniyor: ${waitTime}ms - Sayfa: ${rawPageId}`);
  await delay(waitTime);

  try {
    const props = await resolveNotionPage(domain, rawPageId)

    return { props, revalidate: 10 }
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
  // Tüm sayfaları build anında oluşturmak yerine, paths dizisini boş gönderiyoruz.
  // Fallback 'blocking' sayesinde sayfalar ziyaretçi tıkladığında "On-Demand" (istek üzerine) oluşturulacak.
  return {
    paths: [], 
    fallback: 'blocking' 
  }
}

export default function NotionDomainDynamicPage(props: PageProps) {
  return <NotionPage {...props} />
}
