/**
 * Zühre Yatırım - Main JS Logic (Firebase Entegreli)
 */

// 1. Firebase Modüllerini İçe Aktar
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// 2. Kendi Firebase Config Bilgilerin
const firebaseConfig = {
  apiKey: "AIzaSyDlTPJ06IUHK7upDLZUB6cFFK4-3tQ_JzY",
  authDomain: "zuhre-yatirim.firebaseapp.com",
  projectId: "zuhre-yatirim",
  storageBucket: "zuhre-yatirim.firebasestorage.app",
  messagingSenderId: "215851700796",
  appId: "1:215851700796:web:437f1fba0f47d43eb8e939",
  measurementId: "G-FZ4T0P7KM6"
};

// 3. Firebase'i Başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

async function fetchData() {
  try {
    console.log("Firebase'den veriler çekiliyor...");

    // İlanları veritabanından al
    const ilanlarSorgusu = await getDocs(collection(db, "ilanlar"));
    const ilanlarListesi = [];
    ilanlarSorgusu.forEach(doc => ilanlarListesi.push(doc.data()));

    // Projeleri veritabanından al
    const projelerSorgusu = await getDocs(collection(db, "projeler"));
    const projelerListesi = [];
    projelerSorgusu.forEach(doc => projelerListesi.push(doc.data()));

    // Sisteminin beklediği JSON yapısını oluştur
    const data = {
      ilanlar: ilanlarListesi,
      projeler: projelerListesi
    };

    console.log("Bağlantı Başarılı, Gelen Veri:", data);

    // Check if on home page
    const featuredGrid = document.getElementById('featuredGrid');
    const projectsGrid = document.getElementById('projectsGrid');

    if (featuredGrid) {
      renderFeatured(data.ilanlar, featuredGrid);
    }

    if (projectsGrid) {
      renderProjects(data.projeler, projectsGrid);
    }

    // Check if on Properties page
    const propertiesGrid = document.getElementById('propertiesGrid');
    if (propertiesGrid) {
      renderAllProperties(data.ilanlar, propertiesGrid);
      setupFilters(data.ilanlar, propertiesGrid);
    }

    // Check if on Detail page
    if (document.getElementById('propertyDetailLayout')) {
      renderPropertyDetail(data.ilanlar);
    }

  } catch (error) {
    console.error('Error fetching data:', error);
    const msg = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">Veritabanına bağlanılamadı. Lütfen internet bağlantınızı kontrol edin.</div>';

    const fg = document.getElementById('featuredGrid');
    const pg = document.getElementById('propertiesGrid');
    const dl = document.getElementById('propertyDetailLayout');

    if (fg) fg.innerHTML = msg;
    if (pg) pg.innerHTML = msg;
    if (dl) dl.innerHTML = msg;
  }
}

function renderFeatured(ilanlar, container) {
  const featured = ilanlar.filter(ilan => ilan.one_cikan);

  if (featured.length === 0) {
    container.innerHTML = '<p class="text-muted" style="padding: 2rem;">Şu an öne çıkan ilan bulunmamaktadır.</p>';
    return;
  }

  container.innerHTML = featured.map(ilan => createPropertyCard(ilan)).join('');
}

function renderProjects(projeler, container) {
  if (!projeler || projeler.length === 0) return;

  container.innerHTML = projeler.map(proje => `
    <div class="project-card">
      <img src="${proje.gorsel && proje.gorsel.startsWith('http') ? proje.gorsel : 'images/projeler/' + proje.gorsel}" alt="${proje.isim}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\' viewBox=\\'0 0 400 300\\'%3E%3Crect width=\\'400\\' height=\\'300\\' fill=\\'%23F0EEE9\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%2399938D\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3EProje Görseli%3C/text%3E%3C/svg%3E'">
      <div class="project-overlay">
        <h3 class="project-title">${proje.isim}</h3>
        <p class="project-detail">${proje.detay}</p>
      </div>
    </div>
  `).join('');
}

function createPropertyCard(ilan) {
  const thumb = ilan.fotograflar && ilan.fotograflar.length > 0 ? ilan.fotograflar[0] : 'placeholder.jpg';

  return `
    <a href="ilan-detay.html?id=${ilan.id}" class="prop-card">
      <div class="prop-img-wrap">
        <img src="${thumb.startsWith('http') ? thumb : 'images/ilanlar/' + ilan.id + '/' + thumb}" alt="${ilan.baslik}" 
             onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\' viewBox=\\'0 0 400 300\\'%3E%3Crect width=\\'400\\' height=\\'300\\' fill=\\'%23F0EEE9\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%2399938D\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3Eİlan Görseli%3C/text%3E%3C/svg%3E'">
      </div>
      <div class="prop-info">
        <div class="prop-price">${ilan.fiyat}</div>
        <div class="prop-title">${ilan.baslik}</div>
        <div class="prop-loc">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${ilan.konum}
        </div>
        <div class="prop-meta">
          <span>${ilan.brut_m2 || ilan.net_m2 || '-'} m²</span>
          <span>${ilan.oda !== '-' ? ilan.oda : ilan.tip}</span>
        </div>
      </div>
    </a>
  `;
}

function renderAllProperties(ilanlar, container) {
  window.allProperties = ilanlar;
  container.innerHTML = ilanlar.map(ilan => createPropertyCard(ilan)).join('');
}

function setupFilters(ilanlar, container) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      const target = e.target;
      target.classList.add('active');

      const filter = target.dataset.filter;
      let filtered = ilanlar;
      if (filter === 'daire') filtered = ilanlar.filter(i => i.tip.toLowerCase().includes('daire'));
      else if (filter === 'müstakil') filtered = ilanlar.filter(i => i.tip.toLowerCase().includes('müstakil'));
      else if (filter === 'arsa') filtered = ilanlar.filter(i => i.tip.toLowerCase().includes('arsa') || i.tip.toLowerCase().includes('tarla'));

      container.innerHTML = filtered.map(ilan => createPropertyCard(ilan)).join('');
      if (filtered.length === 0) container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">Bu kategoride ilan bulunamadı.</div>';
    });
  });
}

function renderPropertyDetail(ilanlar) {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get('id');
  const ilan = ilanlar.find(i => i.id === id);
  const layout = document.getElementById('propertyDetailLayout');

  if (!ilan) {
    layout.innerHTML = '<div style="flex:1; padding:4rem; text-align:center;">İlan bulunamadı! Lütfen geçerli bir URL kullanın.</div>';
    return;
  }

  window.currentListingImages = ilan.fotograflar && ilan.fotograflar.length ? ilan.fotograflar : ['Placeholder'];
  window.currentListingId = ilan.id;

  window.getImgSrc = function (idx) {
    if (window.currentListingImages[0] === 'Placeholder') {
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%23F0EEE9'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%2399938D' text-anchor='middle' dominant-baseline='middle'%3EGörsel Yok%3C/text%3E%3C/svg%3E`;
    }
    const imgStr = window.currentListingImages[idx];
    return imgStr.startsWith('http') ? imgStr : `images/ilanlar/${ilan.id}/${imgStr}`;
  }

  let thumbsHtml = window.currentListingImages.map((img, idx) => `
    <div class="thumb ${idx === 0 ? 'active' : ''}" onclick="window.changeImage(${idx})">
      <img src="${window.getImgSrc(idx)}" alt="Thumbnail ${idx}">
    </div>
  `).join('');

  layout.innerHTML = `
    <div class="listing-gallery">
      <div class="gallery-main" id="mainGallery">
        <img id="mainImage" src="${window.getImgSrc(0)}" alt="${ilan.baslik}" style="cursor: zoom-in;" onclick="window.openLightbox()">
        <div class="gallery-expand" onclick="window.openLightbox()" title="Görseli Büyüt">
          <svg viewBox="0 0 24 24"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
        </div>
        <div class="gallery-counter"><span id="currentIndex">1</span> / <span id="totalCount">${window.currentListingImages.length}</span></div>
        <div class="gallery-arrow gallery-arrow--prev" onclick="window.prevImage()">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div class="gallery-arrow gallery-arrow--next" onclick="window.nextImage()">
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </div>
      </div>
      <div class="gallery-thumbs" id="thumbStrip">
        ${thumbsHtml}
      </div>
      <div class="listing-description">
        <h2>İlan Detayı</h2>
        <p>${ilan.aciklama}</p>
      </div>
    </div>
    <div class="listing-sidebar">
      <div class="sidebar-card">
        <div class="sidebar-price">${ilan.fiyat}</div>
        <div class="sidebar-price-note">Satılık</div>
        <div class="sidebar-title">${ilan.baslik}</div>
        <div class="sidebar-loc">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${ilan.konum}
        </div>
        <style>
          .spec-grid { display: grid; grid-template-columns: 1fr 1fr; border-top: 1px solid var(--gold-border); border-bottom: 1px solid var(--gold-border); padding: 1.5rem 0; margin-bottom: 1.5rem; gap: 1rem; }
          .spec-label { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-dim); margin-bottom: 0.4rem; }
          .spec-value { font-weight: 500; font-size: 0.95rem; color: var(--text-main); }
          .feature-list { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; margin-bottom: 2rem; }
          .feature-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--text-main); font-weight: 500; }
          .feature-item svg { width: 16px; height: 16px; fill: var(--gold); flex-shrink: 0; }
          .feature-item.false { color: var(--text-dim); text-decoration: line-through; font-weight: 400; }
          .feature-item.false svg { fill: var(--text-dim); opacity: 0.4; }
        </style>
        
        ${(ilan.tip && (ilan.tip.toLowerCase().includes('arsa') || ilan.tip.toLowerCase().includes('tarla'))) ? `
        <div class="spec-grid">
          <div><div class="spec-label">m²</div><div class="spec-value">${ilan.brut_m2 || ilan.net_m2 || ilan.m2 || '-'} m²</div></div>
          <div><div class="spec-label">m² Fiyatı</div><div class="spec-value">${ilan.m2_fiyati || '-'}</div></div>
          <div><div class="spec-label">Ada No</div><div class="spec-value">${ilan.ada_no || '-'}</div></div>
          <div><div class="spec-label">Parsel No</div><div class="spec-value">${ilan.parsel_no || '-'}</div></div>
          <div><div class="spec-label">İmar Durumu</div><div class="spec-value">${ilan.imar_durumu || '-'}</div></div>
          <div><div class="spec-label">Türü</div><div class="spec-value">${ilan.tip || '-'}</div></div>
          <div><div class="spec-label">Tapu Durumu</div><div class="spec-value">${ilan.tapu_durumu || '-'}</div></div>
          <div><div class="spec-label">Yola Cephe</div><div class="spec-value">${ilan.yola_cephe ? 'Var' : 'Yok'}</div></div>
        </div>

        <div class="feature-list">
          <div class="feature-item ${ilan.elektrik ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Elektrik
          </div>
          <div class="feature-item ${ilan.su ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Su
          </div>
          <div class="feature-item ${ilan.krediye_uygun ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Krediye Uygun
          </div>
          <div class="feature-item ${ilan.yatirima_uygun ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Yatırıma Uygun
          </div>
        </div>
        ` : `
        <div class="spec-grid">
          <div><div class="spec-label">Net / Brüt m²</div><div class="spec-value">${ilan.net_m2 || '-'} / ${ilan.brut_m2 || '-'} m²</div></div>
          <div><div class="spec-label">Oda / Banyo</div><div class="spec-value">${ilan.oda || '-'} / ${ilan.banyo || '-'}</div></div>
          <div><div class="spec-label">Bulunduğu Kat</div><div class="spec-value">${ilan.kat || '-'}</div></div>
          <div><div class="spec-label">Bina Yaşı</div><div class="spec-value">${ilan.bina_yasi || '-'}</div></div>
        </div>

        <div class="feature-list">
          <div class="feature-item ${ilan.dogalgaz ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Doğalgaz
          </div>
          <div class="feature-item ${ilan.otopark ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Otopark
          </div>
          <div class="feature-item ${ilan.site_ici ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Site İçi
          </div>
          <div class="feature-item ${ilan.asansor ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Asansör
          </div>
          <div class="feature-item ${ilan.krediye_uygun ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Krediye Uygun
          </div>
          <div class="feature-item ${ilan.yatirima_uygun ? 'true' : 'false'}">
            <svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg> Yatırıma Uygun
          </div>
        </div>
        `}
        <a href="index.html#iletisim" class="btn-primary" style="width: 100%;">İletişime Geç</a>
        <div class="sidebar-divider"></div>
        <a href="https://wa.me/905551234567" target="_blank" class="sidebar-phone">
          <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          0 555 123 45 67
        </a>
      </div>
    </div>
  `;

  const mapLayout = document.getElementById('propertyMapLayout');
  if (mapLayout) {
    if (ilan.adres_acik || ilan.il || ilan.ilce) {
      const fullAddress = [ilan.adres_acik, ilan.ilce, ilan.il, "Türkiye"].filter(Boolean).join(', ');
      const encodedQuery = encodeURIComponent(fullAddress);

      mapLayout.innerHTML = `
          <style>
            .map-card {
              background: var(--bg);
              border: 1px solid var(--gold-border);
              border-radius: 4px;
              padding: 3rem;
              margin-bottom: 2rem;
            }
            .map-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 1px solid var(--gold-border);
              padding-bottom: 1rem;
              margin-bottom: 2rem;
            }
            .map-header h2 {
              font-size: 1.5rem;
              font-family: var(--heading-font);
              color: var(--text-main);
              margin: 0;
            }
            .map-cta {
              background: var(--text-main);
              color: white;
              padding: 0.8rem 1.5rem;
              text-decoration: none;
              font-weight: 500;
              font-size: 0.9rem;
              display: inline-flex;
              align-items: center;
              gap: 0.5rem;
              transition: background 0.3s;
            }
            .map-cta:hover {
              background: var(--gold);
            }
            .map-cta svg {
              width: 18px;
              height: 18px;
              stroke: currentColor;
              fill: none;
              stroke-width: 2;
            }
            .map-info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 1rem 3rem;
              margin-bottom: 3rem;
              font-size: 0.95rem;
              color: var(--text-main);
            }
            .map-info-item {
              display: flex;
              justify-content: space-between;
              border-bottom: 1px solid var(--gold-border);
              padding-bottom: 0.8rem;
            }
            .map-info-item strong {
              font-weight: 600;
              margin-right: 1rem;
              white-space: nowrap;
            }
            .map-info-item span {
              text-align: right;
              line-height: 1.4;
            }
            .map-iframe-container {
              width: 100%;
              height: 450px;
              overflow: hidden;
              background: var(--bg-card);
            }
            @media (max-width: 768px) {
              .map-card { padding: 1.5rem; }
              .map-header { flex-direction: row; gap: 1rem; }
              .map-header h2 { font-size: 1.25rem; }
              .map-cta { padding: 0.6rem 1rem; font-size: 0.8rem; }
              .map-info-grid { grid-template-columns: 1fr; gap: 1rem; }
              .map-iframe-container { height: 250px; }
            }
          </style>
          <div class="map-card">
            <div class="map-header">
              <h2>Adres</h2>
              <a href="https://maps.google.com/?q=${encodedQuery}" target="_blank" class="map-cta">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                Haritada Göster
              </a>
            </div>
            
            <div class="map-info-grid">
                <div class="map-info-item">
                    <strong>Adres:</strong> <span>${ilan.adres_acik || '-'}</span>
                </div>
                <div class="map-info-item">
                    <strong>Şehir / İlçe:</strong> <span>${ilan.ilce || '-'}</span>
                </div>
                <div class="map-info-item">
                    <strong>İl:</strong> <span>${ilan.il || '-'}</span>
                </div>
                <div class="map-info-item">
                    <strong>Ülke:</strong> <span>Türkiye</span>
                </div>
            </div>

            <div class="map-iframe-container">
                <iframe width="100%" height="100%" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" 
                    src="https://maps.google.com/maps?width=100%25&amp;height=100%25&amp;hl=tr&amp;q=${encodedQuery}&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed">
                </iframe>
            </div>
          </div>
        `;
    } else {
      mapLayout.innerHTML = '';
    }
  }

  // Global methods for gallery
  window.currImgIndex = 0;
  window.changeImage = function (idx) {
    window.currImgIndex = idx;
    document.getElementById('mainImage').src = window.getImgSrc(idx);
    document.getElementById('currentIndex').textContent = idx + 1;
    document.querySelectorAll('.thumb').forEach((t, i) => {
      t.classList.toggle('active', i === idx);
    });
  };
  window.nextImage = function () {
    let next = (window.currImgIndex + 1) % window.currentListingImages.length;
    window.changeImage(next);
  };
  window.prevImage = function () {
    let prev = (window.currImgIndex - 1 + window.currentListingImages.length) % window.currentListingImages.length;
    window.changeImage(prev);
  };

  // Lightbox methods
  window.openLightbox = function () {
    let lightbox = document.getElementById('lightboxModal');
    if (!lightbox) {
      lightbox = document.createElement('div');
      lightbox.id = 'lightboxModal';
      lightbox.innerHTML = `
        <div class="lightbox-overlay" onclick="window.closeLightbox()"></div>
        <div class="lightbox-close" onclick="window.closeLightbox()">&times;</div>
        <img id="lightboxImage" src="${document.getElementById('mainImage').src}">
        <div class="lightbox-arrow lightbox-arrow--prev" onclick="window.prevImageLightbox(event)">
          <svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
        </div>
        <div class="lightbox-arrow lightbox-arrow--next" onclick="window.nextImageLightbox(event)">
          <svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="lightbox-counter"><span id="lightboxIndex">1</span> / <span id="lightboxTotal">1</span></div>
      `;
      document.body.appendChild(lightbox);
    }
    document.getElementById('lightboxImage').src = window.getImgSrc(window.currImgIndex);
    document.getElementById('lightboxIndex').textContent = window.currImgIndex + 1;
    document.getElementById('lightboxTotal').textContent = window.currentListingImages.length;
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  };

  window.closeLightbox = function () {
    const lightbox = document.getElementById('lightboxModal');
    if (lightbox) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  window.prevImageLightbox = function (e) {
    if (e) e.stopPropagation();
    window.prevImage();
    document.getElementById('lightboxImage').src = window.getImgSrc(window.currImgIndex);
    document.getElementById('lightboxIndex').textContent = window.currImgIndex + 1;
  };

  window.nextImageLightbox = function (e) {
    if (e) e.stopPropagation();
    window.nextImage();
    document.getElementById('lightboxImage').src = window.getImgSrc(window.currImgIndex);
    document.getElementById('lightboxIndex').textContent = window.currImgIndex + 1;
  };
}