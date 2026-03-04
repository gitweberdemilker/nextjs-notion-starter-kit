export default {
  staticPageGenerationTimeout: 300,

  async redirects() {
    return [
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
