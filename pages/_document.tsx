import Document, { Head, Html, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  override render() {
    return (
      <Html lang='en'>
        <Head>
          <link rel='shortcut icon' href='/favicon.ico' />
          <link rel='icon' type='image/png' sizes='32x32' href='favicon.png' />

          <link rel='manifest' href='/manifest.json' />
        </Head>

        {/* SUNUCUDA SAYFAYI ZORLA KARANLIK MODDA OLUŞTUR */}
        <body className="dark-mode">
          <script
            dangerouslySetInnerHTML={{
              __html: `
/** Inlined version of noflash.js from use-dark-mode */
;(function () {
  var storageKey = 'darkMode'
  var classNameDark = 'dark-mode'
  var classNameLight = 'light-mode'
  function setClassOnDocumentBody(darkMode) {
    document.body.classList.add(darkMode ? classNameDark : classNameLight)
    document.body.classList.remove(darkMode ? classNameLight : classNameDark)
  }
  var localStorageTheme = null
  try {
    localStorageTheme = localStorage.getItem(storageKey)
  } catch (err) {}
  var localStorageExists = localStorageTheme !== null
  if (localStorageExists) {
    localStorageTheme = JSON.parse(localStorageTheme)
  }
  
  // Determine the source of truth
  if (localStorageExists) {
    // Kullanıcı daha önce bir seçim yaptıysa (Güneş/Ay ikonuna bastıysa) onu hatırla
    setClassOnDocumentBody(localStorageTheme)
  } else {
    // SİTEYE İLK KEZ GİREN HERKES İÇİN (Sistemi aydınlık olsa bile) ZORLA KARANLIK MOD
    setClassOnDocumentBody(true)
    localStorage.setItem(storageKey, 'true')
  }
})();
`
            }}
          />
          <Main />

          <NextScript />
        </body>
      </Html>
    )
  }
}
