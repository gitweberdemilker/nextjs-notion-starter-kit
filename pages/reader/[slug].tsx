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
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }

      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener(
        'error',
        () => reject(new Error(`Script yüklenemedi: ${src}`)),
        { once: true }
      )
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

    const bookUrl = `/${slug}.epub`

    let book: any = null
    let rendition: any = null
    let cancelled = false

    async function init() {
      try {
        setError('')
        setStatus('Scriptler yükleniyor...')

        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js')
        await loadScript('https://unpkg.com/epubjs/dist/epub.min.js')

        if (!window.ePub) {
          throw new Error('epub.js yüklenmedi.')
        }

        setStatus('Kitap açılıyor...')

        book = window.ePub(bookUrl)

        rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          flow: 'paginated' // ✅ BURASI DEĞİŞTİ
        })

        await rendition.display()

        // ✅ ok tuşları
        rendition.on('keyup', (e: any) => {
          if (e.key === 'ArrowRight') rendition.next()
          if (e.key === 'ArrowLeft') rendition.prev()
        })

        // ✅ swipe (mobil)
        let startX = 0

        viewerRef.current.addEventListener('touchstart', (e: any) => {
          startX = e.changedTouches[0].screenX
        })

        viewerRef.current.addEventListener('touchend', (e: any) => {
          const endX = e.changedTouches[0].screenX
          if (startX - endX > 50) rendition.next()
          if (endX - startX > 50) rendition.prev()
        })

        if (!cancelled) setStatus('')
      } catch (e: any) {
        if (!cancelled) {
          setError(e?.message || 'Kitap yüklenirken bir hata oluştu.')
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
          fontSize: '14px',
          letterSpacing: '0.5px'
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
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '32px',
            background: error ? 'rgba(11,11,11,0.92)' : 'rgba(11,11,11,0.72)',
            color: error ? '#ff8a8a' : '#ddd',
            textAlign: 'center',
            lineHeight: 1.6,
            paddingLeft: '20px',
            paddingRight: '20px',
            zIndex: 5
          }}
        >
          {error || status}
        </div>
      )}
    </div>
  )
}
