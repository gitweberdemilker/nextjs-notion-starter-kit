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

const THEME_STORAGE_KEY = 'site-theme'

function applyThemeClass() {
  if (typeof window === 'undefined') return

  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
  const theme = savedTheme === 'light' ? 'light' : 'dark'

  document.body.classList.remove('dark-mode', 'light-mode')
  document.body.classList.add(theme === 'dark' ? 'dark-mode' : 'light-mode')
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  React.useEffect(() => {
    // ========================================================
    // 1. DEFAULT DARK MODE + KALICI TEMA UYGULAMA
    // ========================================================
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

      // Kullanıcı daha önce seçim yapmadıysa default dark olsun
      if (savedTheme !== 'dark' && savedTheme !== 'light') {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark')
      }

      applyThemeClass()
    }

    // ========================================================
    // 2. ROUTE GEÇİŞİ + ANALİTİK
    // ========================================================
    function onRouteChangeStart() {
      document.body.classList.add('page-transitioning')
    }

    function onRouteChangeComplete() {
      document.body.classList.remove('page-transitioning')

      // Sayfa geçişinden sonra tema class'ı tekrar garanti edilsin
      applyThemeClass()

      if (fathomId) {
        Fathom.trackPageview()
      }

      if (posthogId) {
        posthog.capture('$pageview')
      }
    }

    function onRouteChangeError() {
      document.body.classList.remove('page-transitioning')
    }

    if (fathomId) {
      Fathom.load(fathomId, fathomConfig)
    }

    if (posthogId) {
      posthog.init(posthogId, posthogConfig)
    }

    router.events.on('routeChangeStart', onRouteChangeStart)
    router.events.on('routeChangeComplete', onRouteChangeComplete)
    router.events.on('routeChangeError', onRouteChangeError)

    return () => {
      router.events.off('routeChangeStart', onRouteChangeStart)
      router.events.off('routeChangeComplete', onRouteChangeComplete)
      router.events.off('routeChangeError', onRouteChangeError)
    }
  }, [router.events])

  return <Component {...pageProps} />
}
