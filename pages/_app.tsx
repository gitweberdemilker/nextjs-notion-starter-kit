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
    // === 1. SİNEMATİK GEÇİŞ TETİKLEYİCİSİ ===
    const handleStart = () => document.body.classList.add('page-transitioning');
    const handleComplete = () => document.body.classList.remove('page-transitioning');

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    // === 2. ANALİTİK KODLARIN (ORİJİNAL) ===
    function onRouteChangeCompleteAnalytics() {
      if (fathomId) Fathom.trackPageview()
      if (posthogId) posthog.capture('$pageview')
    }

    if (fathomId) Fathom.load(fathomId, fathomConfig)
    if (posthogId) posthog.init(posthogId, posthogConfig)

    router.events.on('routeChangeComplete', onRouteChangeCompleteAnalytics)

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
      router.events.off('routeChangeComplete', onRouteChangeCompleteAnalytics);
    }
  }, [router.events])

  return <Component {...pageProps} />
}
