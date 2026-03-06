// used for rendering equations (optional)
import 'katex/dist/katex.min.css'
// used for code syntax highlighting (optional)
import 'prismjs/themes/prism-coy.css'
// core styles shared by all of react-notion-x (required)
import 'react-notion-x/src/styles.css'
// global styles shared across the entire site
import 'styles/global.css'
// global style overrides for notion
import 'styles/notion.css'
// global style overrides for prism theme (optional)
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'
import { useState, useEffect } from 'react'

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
  // SİNEMATİK GEÇİŞ İÇİN TETİKLEYİCİ
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // ========================================================
    // 1. ZORUNLU GECE MODU KİLİDİ
    // ========================================================
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', 'true');
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }

    // ========================================================
    // 2. SİNEMATİK GEÇİŞ VE ANALİTİKLER
    // ========================================================
    const handleStart = () => setIsTransitioning(true)
    const handleComplete = () => {
      setIsTransitioning(false)
      
      if (fathomId) Fathom.trackPageview()
      if (posthogId) posthog.capture('$pageview')
    }

    if (fathomId) Fathom.load(fathomId, fathomConfig)
    if (posthogId) posthog.init(posthogId, posthogConfig)

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router.events])

  return (
    <>
      <div className={`cinematic-overlay ${isTransitioning ? 'active' : ''}`}></div>
      <div className={`page-content ${isTransitioning ? 'shrinking' : ''}`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}
