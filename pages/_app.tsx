// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/global.css'
// this might be better for dark mode
// import 'prismjs/themes/prism-okaidia.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'

import { bootstrap } from '@/lib/bootstrap-client'
import {
  fathomConfig,
  fathomId,
  isServer,
  posthogConfig,
  posthogId
} from '@/lib/config'

if (!isServer) {
  bootstrap()
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    // ========================================================
    // 1. ZORUNLU GECE MODU KİLİDİ
    // ========================================================
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', 'true')
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    }

    // ========================================================
    // 2. SİNEMATİK GEÇİŞ VE ANALİTİK (FATHOM/POSTHOG) KONTROLÜ
    // ========================================================
    function onRouteChangeStart() {
      // Linke tıklandığı an geçiş animasyonunu başlat
      document.body.classList.add('page-transitioning')
    }

    function onRouteChangeComplete() {
      // Sayfa yüklendiğinde animasyonu kaldır
      document.body.classList.remove('page-transitioning')

      // Ziyaretçi analitiklerini çalıştır
      if (fathomId) {
        Fathom.trackPageview()
      }
      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    function onRouteChangeError() {
      // Bir hata olursa ekranın karanlıkta kalmasını engelle
      document.body.classList.remove('page-transitioning')
    }

    // Analitikleri başlat
    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }
    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    // Olay dinleyicilerini (Event Listeners) kaydet
    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    router.events.on('routeChangeError', onRouteChangeError)

    // Bileşen çöpe atılırken dinleyicileri temizle
    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
      router.events.off('routeChangeError', onRouteChangeError)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
