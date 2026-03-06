@import url('https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400;1,600&display=swap');

* { box-sizing: border-box; }

/* =========================================================
   SİNEMATİK GEÇİŞ KATMANLARI
   ========================================================= */
.cinematic-overlay {
  position: fixed;
  top: 0; left: 0; width: 100vw; height: 100vh;
  background-color: #000;
  z-index: 999999;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;
}
.cinematic-overlay.active { opacity: 1; pointer-events: all; }

.page-content {
  transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), filter 0.6s ease, opacity 0.6s ease;
  transform-origin: center center;
}
.page-content.shrinking {
  transform: scale(1.1);
  filter: blur(10px) brightness(0);
  opacity: 0;
}

/* =========================================================
   TEMA RENKLERİ (ÇAKIŞMAYI ÖNLEYEN YAPI)
   ========================================================= */
body {
  --notion-font: 'Crimson Text', serif;
  font-family: var(--notion-font);
  transition: background-color 0.3s ease; /* Modlar arası yumuşak geçiş */
}

/* KARANLIK MOD (Default ve Aktif) */
body.dark-mode, body:not(.light-mode) {
  background-color: #000 !important;
  color: #d1d1d1 !important;
}

/* AYDINLIK MOD (Butona basınca burası devreye girer) */
body.light-mode {
  background-color: #fcfcfc !important;
  color: #1a1a1a !important;
}

/* Kan Kırmızısı Linkler - Hem global hem notion üzerinden garantiye alalım */
.notion-link {
  background-image: linear-gradient(to right, #900, #900) !important;
}
.notion-link:hover {
  background-image: linear-gradient(to right, #f00, #c00) !important;
}

/* Orijinal global.css kodunun geri kalan tüm mobil/footer ayarlarını buraya ekle... */
