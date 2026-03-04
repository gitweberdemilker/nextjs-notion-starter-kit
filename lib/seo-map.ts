export type SEOEntry = {
  title: string
  description: string
  ogImage?: string
  keywords?: string[]
}

export const defaultSEO: SEOEntry = {
  title: 'Karanlık Hikayeler – Absürd Korku, Animasyon ve Çizgiroman',
  description:
    "Karanlık hikayeler, absürd korku animasyonları ve çizgiroman evreni. Kimsesizler Mezarlığı serisi ve fantastik romanlar burada.",
  ogImage: 'https://www.erdemilker.com.tr/og/default.jpg',
  keywords: [
    'karanlık hikayeler',
    'absürd korku',
    'korku animasyon',
    'çizgiroman',
    'fantastik roman'
  ]
}

export const seoMap: Record<string, SEOEntry> = {
  '318ddc548f4180bbbfcff76d174e9e8d': {
    title: 'Son Savaş – Fantastik Apokaliptik Roman',
    description:
      'Son Savaş: Karanlık fantastik ve apokaliptik bir roman.',
    ogImage: 'https://www.erdemilker.com.tr/og/son-savas.jpg',
    keywords: [
      'son savaş roman',
      'apokaliptik roman',
      'fantastik kitap'
    ]
  }
}
