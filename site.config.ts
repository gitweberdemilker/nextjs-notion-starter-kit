import { siteConfig } from './lib/site-config'

export default siteConfig({

  rootNotionPageId: '318ddc548f4180a3ac2fe2dea9adc63f',
  rootNotionSpaceId: null,

  // SEO için güncellediğimiz başlık ve açıklama (Burası kalsın)
  name: 'Erdem İlker | Karanlık Hikayeler ve Absürt Korku',
  domain: 'www.erdemilker.com.tr',
  author: 'Erdem İlker',
  description: "Erdem İlker'in kaleminden çıkan Kimsesizler Mezarlığı animasyon serisi, noir çizgi romanlar ve fantastik korku hikayelerinin merkezine hoş geldiniz.",
  twitter: 'BOykuler',

  defaultPageIcon: null,
  
  // ==========================================
  // YEDEK SOSYAL MEDYA AFİŞİ (ÇOK ÖNEMLİ!)
  // Sitede kapak yoksa WhatsApp ve Twitter bu resmi çeker.
  // LÜTFEN AŞAĞIDAKİ LİNKİ GERÇEK BİR GÖRSEL LİNKİYLE DEĞİŞTİR!
  // ==========================================
  defaultPageCover: 'https://www.erdemilker.com.tr/yedek-karanlik-afis.jpg',
  defaultPageCoverPosition: 0.5,

  isPreviewImageSupportEnabled: true,
  isRedisEnabled: false,

  // === ORİJİNAL, ÇALIŞAN (DÜZ) LİNK YAPISI ===
  pageUrlOverrides: {
    '/karanlik-hikayeler': '318ddc548f4180a3ac2fe2dea9adc63f',
    '/kimsesizler-mezarligi-animasyon': '318ddc548f4180d1b110e67d584dc8f3',
    '/kimsesizler-mezarligi-cizgiroman': '318ddc548f418015a425c2bc7027f16b',
    '/kimsesizler-mezarligi-bolum-1': '318ddc548f418098b229e074620feb3c',
    '/kimsesizler-mezarligi-bolum-2': '318ddc548f418097a18efc64da8c8b54',
    '/kimsesizler-mezarligi-bolum-3': '318ddc548f4180388f7cef6ea0fa4220',
    '/son-yil': '318ddc548f4180b8ac25f1d91c4a325e',
    '/kimsesizler-mezarligi-tum-sezonlar': '318ddc548f418095a4b5c40b8d9a8aaa',
    '/cinayet-rota-olusturuldu': '318ddc548f4180ab8f9ec51c7289c47c',
    '/kisa-karanlik-hikayeler': '318ddc548f4180ae9682d682cc246308',
    '/selen-kisa-hikaye': '318ddc548f418048924dea486a6b8e70',
    '/ibret-kisa-hikaye': '318ddc548f4180839489fe59e96928ec',
    '/zaman-yolcusu': '318ddc548f4180ceac2feed5ecdb28f4',
    '/gercek-kisa-hikaye': '318ddc548f4180d5979ff7794de2f578',
    '/yoksun-kisa-hikaye': '318ddc548f4180c69eedd9d7dd7cf3db',
    '/aramizdalar-serisi': '318ddc548f4180669640c1d5a9e0c8cb',
    '/freddy-krueger-kocamustafapasa': '318ddc548f41807da4c1d2e60688123a',
    '/tamamlanan-kitaplar': '318ddc548f418064aa3ddce2e421ed84',
    '/sesli-kitaplar': '318ddc548f41806c8785c7c9cf136696',
    '/michael-myers-saf-kotuluk': '318ddc548f418030a892c338f2a03195',
    '/leatherface': '318ddc548f418065bfd8d6d5f4470b50',
    '/olumsuz': '318ddc548f418079856de22ed781f08f',
    '/karanligin-fisiltilari': '318ddc548f41800ead86ea5987da80a7',
    '/son-savas': '318ddc548f4180bbbfcff76d174e9e8d',
    '/animasyon': '318ddc548f418052b800edf86e326eb3',
    '/cizgiroman': '318ddc548f4180a2b91ee80a374edce8',
    '/kitaplar': '318ddc548f4180358a6fd72ac0e8b557',
    '/hikayeler': '318ddc548f41808f9deffcbf9d8292cc',
    '/seyahatname': '318ddc548f418083b264c9dfd0215b5b',
    '/yeni-site-hakkinda': '31addc548f41801582fbffab10ec3453',
    '/karanlik-seyahatname': '31addc548f4180fbab4be8692f5f22ce',
    '/cinayet-rota-olusturuldu-tanitim': '31addc548f41802b84b9f52064e8a30a'
  },

  navigationStyle: 'custom',
  navigationLinks: [
    {
      title: 'Animasyon',
      pageId: '318ddc548f418052b800edf86e326eb3'
    },
    {
      title: 'Çizgiroman',
      pageId: '318ddc548f4180a2b91ee80a374edce8'
    },
    {
      title: 'Kitaplar',
      pageId: '318ddc548f4180358a6fd72ac0e8b557'
    },
    {
      title: 'Hikayeler',
      pageId: '318ddc548f41808f9deffcbf9d8292cc'
    },
    {
      title: 'Karanlık Hikayeler Seyahatnamesi',
      pageId: '318ddc548f418083b264c9dfd0215b5b'
    }
  ]
})
