import { useRouter } from 'next/router'
import { useEffect, useRef } from 'react'
import ePub from 'epubjs'

export default function Reader() {
  const router = useRouter()
  const { slug } = router.query
  const viewerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!slug || !viewerRef.current) return

    const book = ePub(`/epub/${slug}.epub`)
    const rendition = book.renderTo(viewerRef.current, {
      width: '100%',
      height: '100%'
    })

    rendition.display()

    return () => {
      book.destroy()
    }
  }, [slug])

  return (
    <div
      ref={viewerRef}
      style={{
        width: '100%',
        height: '100vh',
        background: '#111'
      }}
    />
  )
}
