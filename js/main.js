/**
 * Zühre Yatırım - Main JS Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  fetchData();
});

async function fetchData() {
  try {
    const response = await fetch('data/ilanlar.json');
    if (!response.ok) throw new Error('Data could not be loaded.');
    const data = await response.json();
    
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
    const msg = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-muted);">JSON verisi yüklenemedi. (Lütfen CORS için yerel bir sunucu kullanın - README.md)</div>';
    
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
      <img src="images/projeler/${proje.gorsel}" alt="${proje.isim}" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'400\\' height=\\'300\\' viewBox=\\'0 0 400 300\\'%3E%3Crect width=\\'400\\' height=\\'300\\' fill=\\'%23F0EEE9\\'/%3E%3Ctext x=\\'50%25\\' y=\\'50%25\\' font-family=\\'sans-serif\\' font-size=\\'14\\' fill=\\'%2399938D\\' text-anchor=\\'middle\\' dominant-baseline=\\'middle\\'%3EProje Görseli%3C/text%3E%3C/svg%3E'">
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
        <img src="images/ilanlar/${ilan.id}/${thumb}" alt="${ilan.baslik}" 
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
          <span>${ilan.m2} m²</span>
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

  window.getImgSrc = function(idx) {
    if (window.currentListingImages[0] === 'Placeholder') {
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='800' viewBox='0 0 1200 800'%3E%3Crect width='1200' height='800' fill='%23F0EEE9'/%3E%3Ctext x='50%25' y='50%25' font-family='sans-serif' font-size='24' fill='%2399938D' text-anchor='middle' dominant-baseline='middle'%3EGörsel Yok%3C/text%3E%3C/svg%3E`;
    }
    return `images/ilanlar/${ilan.id}/${window.currentListingImages[idx]}`;
  }
  
  let thumbsHtml = window.currentListingImages.map((img, idx) => `
    <div class="thumb ${idx === 0 ? 'active' : ''}" onclick="window.changeImage(${idx})">
      <img src="${window.getImgSrc(idx)}" alt="Thumbnail ${idx}">
    </div>
  `).join('');

  layout.innerHTML = `
    <!-- Left: Gallery (80%) -->
    <div class="listing-gallery">
      <div class="gallery-main" id="mainGallery">
        <img id="mainImage" src="${window.getImgSrc(0)}" alt="${ilan.baslik}">
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
    <!-- Right: Sidebar (20%) -->
    <div class="listing-sidebar">
      <div class="sidebar-card">
        <div class="sidebar-price">${ilan.fiyat}</div>
        <div class="sidebar-price-note">Satılık</div>
        <div class="sidebar-title">${ilan.baslik}</div>
        <div class="sidebar-loc">
          <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          ${ilan.konum}
        </div>
        <div class="sidebar-specs">
          <div class="spec-item"><div class="spec-label">Alan</div><div class="spec-value">${ilan.m2} m²</div></div>
          <div class="spec-item"><div class="spec-label">Oda</div><div class="spec-value">${ilan.oda}</div></div>
          <div class="spec-item"><div class="spec-label">Kat</div><div class="spec-value">${ilan.kat}</div></div>
          <div class="spec-item"><div class="spec-label">Bina Yaşı</div><div class="spec-value">${ilan.bina_yasi}</div></div>
        </div>
        <a href="index.html#iletisim" class="btn-primary" style="width: 100%;">İletişime Geç</a>
        <div class="sidebar-divider"></div>
        <a href="https://wa.me/905551234567" target="_blank" class="sidebar-phone">
          <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          0 555 123 45 67
        </a>
      </div>
    </div>
  `;

  // Global methods for gallery
  window.currImgIndex = 0;
  window.changeImage = function(idx) {
    window.currImgIndex = idx;
    document.getElementById('mainImage').src = window.getImgSrc(idx);
    document.getElementById('currentIndex').textContent = idx + 1;
    document.querySelectorAll('.thumb').forEach((t, i) => {
      t.classList.toggle('active', i === idx);
    });
  };
  window.nextImage = function() {
    let next = (window.currImgIndex + 1) % window.currentListingImages.length;
    window.changeImage(next);
  };
  window.prevImage = function() {
    let prev = (window.currImgIndex - 1 + window.currentListingImages.length) % window.currentListingImages.length;
    window.changeImage(prev);
  }
}
