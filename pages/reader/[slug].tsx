import { useRouter } from 'next/router'
import { useEffect } from 'react'

const BOOK_LINKS: Record<string, { mobile: string; desktop: string }> = {
  'son-yil': {
    mobile: '/epub/son-yil.epub',
    desktop: 'https://heyzine.com/flip-book/a47b59fa15.html'
  }
}

function isMobileDevice() {
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent || navigator.vendor || ''
  return /android|iphone|ipad|ipod|mobile|opera mini|iemobile|wpdesktop/i.test(
    ua.toLowerCase()
  )
}

export default function Reader() {
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (!slug || Array.isArray(slug)) return

    const book = BOOK_LINKS[slug]
    if (!book) return

    const mobile = isMobileDevice()
    window.location.href = mobile ? book.mobile : book.desktop
  }, [slug])

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        background: '#111',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px'
      }}
    >
      Yükleniyor...
    </div>
  )
}
