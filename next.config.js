export default {
  // Sayfalar artık tek tek derleneceği için işlem uzayacaktır.
  // Vercel'in zaman aşımına uğramaması için süreyi 1000 saniyeye çıkarıyoruz.
  staticPageGenerationTimeout: 1000,

  // Next.js'in sayfaları paralel oluşturup Notion API'sini kilitlemesini (429 hatası) engeller.
  experimental: {
    workerThreads: false,
    cpus: 1
  },

  async redirects() {
    return [
      // Kırık "yeni-site-yaynda" bağlantısını onaran yönlendirme
      {
        source: '/yeni-site-yaynda',
        destination: '/yeni-site-yayinda',
        permanent: true
      },

      // Eski tamamlanan-kitaplar klasörü
      {
        source: '/tamamlanan-kitaplar/:slug',
        destination: '/:slug',
        permanent: true
      },

      // Eski kısa karanlık hikayeler klasörü
      {
        source: '/kisa---karanlik-hikayeler/:slug',
        destination: '/:slug',
        permanent: true
      }
    ]
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'abs.twimg.com' },
      { protocol: 'https', hostname: 'pbs.twimg.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox;"
  },

  transpilePackages: ['react-tweet']
}
