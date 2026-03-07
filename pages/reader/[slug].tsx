import { useRouter } from 'next/router'
import { useEffect } from 'react'

const BOOK_LINKS: Record<string, { mobile: string; desktop: string }> = {
  'son-yil': {
    mobile: '/epub/son-yil.epub',
    desktop: 'https://heyzine.com/flip-book/a47b59fa15.html'
  }
}

export default function Reader() {
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (!slug || Array.isArray(slug)) return

    const book = BOOK_LINKS[slug]
    if (!book) return

    const isMobile = window.innerWidth <= 768
    window.location.href = isMobile ? book.mobile : book.desktop
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
