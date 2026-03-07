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

  const [epubReady, setEpubReady] = useState(false)
  const [zipReady, setZipReady] = useState(false)
  const [status, setStatus] = useState('Yükleniyor...')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!slug || Array.isArray(slug)) return
    if (!viewerRef.current) return
    if (!epubReady || !zipReady) return

    const bookUrl = `/epub/${slug}.epub`

    let book: any = null
    let rendition: any = null
    let cancelled = false

    async function loadBook() {
      try {
        setStatus('Kitap dosyası kontrol ediliyor...')

        const res = await fetch(bookUrl, { method: 'HEAD' })
        if (!res.ok) {
          throw new Error(`EPUB dosyası bulunamadı: ${bookUrl}`)
        }

        if (!window.ePub) {
          throw new Error('epub.js yüklenmedi.')
        }

        setStatus('Kitap açılıyor...')

        book = window.ePub(bookUrl)

        rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          method: 'continuous',
          flow: 'scrolled-doc'
        })

        await rendition.display()

        if (!cancelled) {
          setStatus('')
        }
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Kitap yüklenirken bir hata oluştu.')
          setStatus('')
        }
      }
    }

    loadBook()

    return () => {
      cancelled = true
      try {
        rendition?.destroy?.()
        book?.destroy?.()
      } catch {}
    }
  }, [slug, epubReady, zipReady])

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"
        strategy="afterInteractive"
        onLoad={() => setZipReady(true)}
        onError={() => setError('JSZip yüklenemedi.')}
      />
      <Script
        src="https://unpkg.com/epubjs/dist/epub.min.js"
        strategy="afterInteractive"
        onLoad={() => setEpubReady(true)}
        onError={() => setError('epub.js yüklenemedi.')}
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
              textAlign: 'center',
              color: '#ff8080',
              lineHeight: 1.6
            }}
          >
            {error}
          </div>
        ) : status ? (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              color: '#ddd',
              lineHeight: 1.6
            }}
          >
            {status}
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
