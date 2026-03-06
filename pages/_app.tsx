import 'katex/dist/katex.min.css'
import 'prismjs/themes/prism-coy.css'
import 'react-notion-x/src/styles.css'
import 'styles/global.css'
import 'styles/notion.css'
import 'styles/prism-theme.css'

import type { AppProps } from 'next/app'
import * as Fathom from 'fathom-client'
import { useRouter } from 'next/router'
import { posthog } from 'posthog-js'
import * as React from 'react'
import { useState, useEffect } from 'react'

import { bootstrap } from '@/lib/bootstrap-client'
import { fathomConfig, fathomId, isServer, posthogConfig, posthogId } from '@/lib/config'

if (!isServer) { bootstrap() }

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    // GECE MODUNU SİSTEME KAZI
    const forceDark = () => {
      localStorage.setItem('darkMode', 'true')
      document.body.classList.add('dark-mode')
      document.body.classList.remove('light-mode')
    }
    forceDark()

    const handleStart = () => setIsTransitioning(true)
    const handleComplete = () => {
      setIsTransitioning(false)
      if (fathomId) Fathom.trackPageview()
      if (posthogId) posthog.capture('$pageview')
    }

    router.events.on('routeChangeStart', handleStart)
    router.events.on('routeChangeComplete', handleComplete)
    router.events.on('routeChangeError', handleComplete)

    return () => {
      router.events.off('routeChangeStart', handleStart)
      router.events.off('routeChangeComplete', handleComplete)
      router.events.off('routeChangeError', handleComplete)
    }
  }, [router])

  return (
    <>
      <div className={`cinematic-overlay ${isTransitioning ? 'active' : ''}`} />
      <div className={`page-content ${isTransitioning ? 'shrinking' : ''}`}>
        <Component {...pageProps} />
      </div>
    </>
  )
}
