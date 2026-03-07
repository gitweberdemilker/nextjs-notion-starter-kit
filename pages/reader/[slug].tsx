import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Reader() {
  const router = useRouter()
  const { slug } = router.query

  useEffect(() => {
    if (!slug || Array.isArray(slug)) return

    window.location.href = `/epub/${slug}.epub`
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
