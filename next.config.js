export default {
  staticPageGenerationTimeout: 1000,
  
  // Vercel üzerinde Next.js build'ini yavaşlatacak ayarlar
  experimental: {
    workerThreads: false,
    cpus: 1,
    // Bu özellik, aynı anda çok fazla pre-render yapılmasını engeller.
    isrMemoryCacheSize: 0 
  },

  // Eşzamanlı export sınırını belirliyoruz:
  onDemandEntries: {
    maxInactiveAge: 60 * 1000,
    pagesBufferLength: 1,
  },

  async redirects() {
    return [
      { source: '/yeni-site-yaynda', destination: '/yeni-site-yayinda', permanent: true },
      { source: '/tamamlanan-kitaplar/:slug', destination: '/:slug', permanent: true },
      { source: '/kisa---karanlik-hikayeler/:slug', destination: '/:slug', permanent: true }
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
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  transpilePackages: ['react-tweet']
}
