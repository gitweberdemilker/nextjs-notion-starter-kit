import { type ExtendedRecordMap } from 'notion-types'
import {
  getCanonicalPageId as getCanonicalPageIdImpl,
  parsePageId
} from 'notion-utils'

import { inversePageUrlOverrides } from './config'

export function getCanonicalPageId(
  pageId: string,
  recordMap: ExtendedRecordMap,
  { uuid = true }: { uuid?: boolean } = {}
): string | undefined {
  const cleanPageId = parsePageId(pageId, { uuid: false })
  if (!cleanPageId) {
    return
  }

  let override = inversePageUrlOverrides[cleanPageId]

  // 1. GÜVENLİK AŞAMASI: Eğer normalde eşleşme bulamazsa, 
  // ID'lerdeki tireleri (-) tamamen temizleyerek mutlak eşleşmeyi zorla.
  if (!override) {
    const normalizedTarget = cleanPageId.replace(/-/g, '').toLowerCase()
    for (const [key, value] of Object.entries(inversePageUrlOverrides)) {
      const normalizedKey = key.replace(/-/g, '').toLowerCase()
      if (normalizedKey === normalizedTarget) {
        override = value
        break
      }
    }
  }

  if (override) {
    // 2. GÜVENLİK AŞAMASI: site.config.ts içindeki URL'lerin başında bulunan
    // slash (/) işaretini kaldır. Böylece "domain.com//sayfa" hatası önlenir.
    return override.startsWith('/') ? override.substring(1) : override
  } else {
    // 3. Hiçbir özel URL atanmamış sayfalar için varsayılan Notion sistemine dön.
    return (
      getCanonicalPageIdImpl(pageId, recordMap, {
        uuid
      }) ?? undefined
    )
  }
}
