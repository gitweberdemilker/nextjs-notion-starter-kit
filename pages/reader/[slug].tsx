import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

declare global {
  interface Window {
    ePub: any
    JSZip: any
  }
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement | null

    if (existing) {
      if (existing.dataset.loaded === 'true') return resolve()
      existing.onload = () => resolve()
      existing.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`))
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error(`Script yüklenemedi: ${src}`))
    document.body.appendChild(script)
  })
}

export default function ReaderPage() {
  const router = useRouter()
  const { slug } = router.query
  const viewerRef = useRef<HTMLDivElement | null>(null)

  const [status, setStatus] = useState('Hazırlanıyor...')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!router.isReady) return
    if (!slug || Array.isArray(slug)) return
    if (!viewerRef.current) return

    const viewer = viewerRef.current

    // ✅ DOĞRU EPUB YOLU
    const bookUrl = `/epub/${slug}.epub`

    let book: any = null
    let rendition: any = null
    let cancelled = false

    async function init() {
      try {
        setError('')
        setStatus('Kitap yükleniyor...')

        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
        await loadScript('https://unpkg.com/epubjs/dist/epub.min.js')

        if (!window.ePub) throw new Error('epub.js yüklenmedi.')

        book = window.ePub(bookUrl)

        rendition = book.renderTo(viewer, {
          width: '100%',
          height: '100%',
          flow: 'paginated'
        })

        await rendition.display()

        // ok tuşları
        rendition.on('keyup', (e: any) => {
          if (e.key === 'ArrowRight') rendition.next()
          if (e.key === 'ArrowLeft') rendition.prev()
        })

        // swipe
        let startX = 0

        viewer.addEventListener('touchstart', (e: TouchEvent) => {
          const t = e.changedTouches?.[0]
          if (!t) return
          startX = t.screenX
        })

        viewer.addEventListener('touchend', (e: TouchEvent) => {
          const t = e.changedTouches?.[0]
          if (!t) return
          const endX = t.screenX

          if (startX - endX > 50) rendition.next()
          if (endX - startX > 50) rendition.prev()
        })

        if (!cancelled) setStatus('')
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Kitap açılırken hata oluştu.')
          setStatus('')
        }
      }
    }

    init()

    return () => {
      cancelled = true
      try {
        rendition?.destroy?.()
        book?.destroy?.()
      } catch {}
    }
  }, [router.isReady, slug])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0b0b0b',
        color: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      <div
        style={{
          padding: '14px 16px',
          borderBottom: '1px solid #222',
          textAlign: 'center',
          fontSize: '14px'
        }}
      >
        {Array.isArray(slug) ? slug[0] : slug}
      </div>

      <div
        ref={viewerRef}
        style={{
          flex: 1,
          width: '100%',
          minHeight: 'calc(100vh - 52px)'
        }}
      />

      {(status || error) && (
        <div
          style={{
            position: 'absolute',
            top: '52px',
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(11,11,11,0.9)',
            color: error ? '#ff8a8a' : '#ddd',
            textAlign: 'center',
            padding: '32px'
          }}
        >
          {error || status}
        </div>
      )}
    </div>
  )
}
