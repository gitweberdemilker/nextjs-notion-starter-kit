import { useRouter } from 'next/router'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    ePub: any
    JSZip: any
  }
}

export default function ReaderPage() {
  const router = useRouter()
  const { slug } = router.query
  const viewerRef = useRef<HTMLDivElement | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!ready) return
    if (!slug || Array.isArray(slug)) return
    if (!viewerRef.current) return
    if (!window.ePub) return

    const bookUrl = `/epub/${slug}.epub`

    let book: any = null
    let rendition: any = null

    try {
      book = window.ePub(bookUrl)

      rendition = book.renderTo(viewerRef.current, {
        width: '100%',
        height: '100%',
        method: 'continuous',
        flow: 'scrolled-doc'
      })

      rendition.display()
    } catch (e) {
      setError('Kitap yüklenirken bir hata oluştu.')
    }

    return () => {
      try {
        rendition?.destroy?.()
        book?.destroy?.()
      } catch {}
    }
  }, [ready, slug])

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
        strategy="beforeInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/epubjs/dist/epub.min.js"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />

      <div
        style={{
          minHeight: '100vh',
          background: '#0b0b0b',
          color: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          style={{
            padding: '14px 16px',
            borderBottom: '1px solid #222',
            textAlign: 'center',
            fontSize: '14px',
            letterSpacing: '0.5px'
          }}
        >
          {Array.isArray(slug) ? slug[0] : slug}
        </div>

        {error ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        ) : (
          <div
            ref={viewerRef}
            style={{
              flex: 1,
              width: '100%',
              minHeight: 'calc(100vh - 52px)'
            }}
          />
        )}
      </div>
    </>
  )
}
