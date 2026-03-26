# Zühre Yatırım — Website Brief

## Firma Bilgisi

- **Firma adı:** Zühre Yatırım Gayrimenkul Danışmanlığı
- **Kısa logo:** ZÜHRE YATIRIM.
- **Konum:** Serik, Antalya
- **Ekip:** Üç kişi — Zühre Kuş (kurucu, soft yönetici), Sefa Çoşkun, Mehmet Kuş. Aralarında eşitlik hakimdir, hiyerarşi vurgulanmamalı.
- **Ana iş:** Kat karşılığı müteahhitlik (arsa sahibi ile müteahhidi birleştirme). Bunun yanında gayrimenkul satışı.
- **Hedef kitle:** Yerli yatırımcılar, yerel halk (Serik/Antalya), kısmen yabancı alıcılar. Ama yabancı alıcı ağırlığı Belek tarafında; Serik merkez daha çok yerli/yerel kitleye hitap ediyor.

## Tasarım Tonu

- **Minimalist ve lüks.** Cafcaflı değil ama ağır ve profesyonel.
- **Açık tema.** Site açık/beyaz zemin üzerine tasarlanacak. Hero section'daki koyu tema sadece prototip amaçlıydı — nihai site açık temada olacak. Altın aksanlar (#B8976A) korunacak, koyu renkler metin ve başlıklar için kullanılacak.
- **Tipografi:** Playfair Display (serif, başlıklar) + Jost (sans-serif, gövde metin). Bu kombinasyon onaylandı.
- Fotoğraf bağımlılığı minimum olmalı. Atmosfer tipografi, spacing ve ince görsel detaylarla oluşturulmalı.
- **Mobil uyumluluk zorunlu.** Site mobile-first yaklaşımla tasarlanmalı. Tüm sayfalar (ana sayfa, ilanlar, ilan detay) mobilde düzgün çalışmalı. Özellikle ilan detay sayfasındaki %80/%20 yan yana düzen mobilde alt alta dönmeli.

## Teknik Gereksinimler

- **Statik site.** Backend yok, veritabanı yok. Tamamen statik HTML/CSS/JS.
- **İlan verileri bir JSON dosyasında tutulacak.** Site sahibi yeni ilan eklemek veya mevcut ilanı güncellemek istediğinde JSON dosyasını ve fotoğrafları manuel olarak güncelleyecek. JSON yapısı basit ve anlaşılır olmalı.
- Örnek JSON yapısı (öneri):
  ```json
  {
    "ilanlar": [
      {
        "id": "1",
        "baslik": "3+1 Sıfır Daire, Güney Cephe",
        "konum": "Orta Mahalle, Serik",
        "tip": "daire",
        "fiyat": "4.250.000 ₺",
        "m2": 145,
        "oda": "3+1",
        "kat": "3 / 4",
        "bina_yasi": "Sıfır",
        "aciklama": "Merkeze yürüme mesafesinde, 2024 teslim...",
        "fotograflar": ["foto1.jpg", "foto2.jpg", "foto3.jpg"],
        "one_cikan": true
      }
    ]
  }
  ```
- `one_cikan: true` olan ilanlar ana sayfadaki "Güncel İlanlar" kayan gridinde gösterilecek.
- Fotoğraflar bir klasörde (örn: `/images/ilanlar/1/`) tutulacak.

## Site Yapısı

Toplam üç sayfa:

1. **Ana sayfa (one-page story)** — Aşağıda detaylandırılmış 6 adımlık akış.
2. **İlanlar sayfası** — Tüm aktif ilanların listelendiği sayfa.
3. **İlan detay sayfası** — İlanlar sayfasından bir ilana tıklandığında açılan alt sayfa.

## İlanlar Sayfası

- Sadece satılık ilanlar. Kiralık yok — site bir ilan portalı değil, prestij vitrini. "Burada gördüysen ciddi bir mülktür" mesajı vermeli.
- Kategorilere bölünmüş ayrı sayfalar yok. Tek liste halinde tüm ilanlar gösterilecek.
- Üstte basit bir filtre satırı (tab şeklinde): Tümü / Daire / Müstakil / Arsa & Arazi. Varsayılan görünüm "Tümü" — sayfa açıldığında dolu bir vitrin karşılasın.
- Mülk tipleri: Daire, Müstakil Ev / Villa, Arsa (imarlı), Tarla / Arazi (tarımsal).
- Her ilan kartı: görsel, konum (mahalle), m², oda sayısı (varsa), fiyat. Tıklanınca ilan detay sayfasına gider.
- İlan sayısı muhtemelen az olacak (5-15 arası). Tasarım buna göre yapılmalı — az ilan olduğunda bile sayfa boş veya zayıf görünmemeli.

## İlan Detay Sayfası

- İlanlar sayfasından bir ilana tıklandığında açılan alt sayfa.
- **Layout: %80 / %20 yatay bölme.**
  - **Sol (%80) — Foto galeri:** Üstte büyük ana fotoğraf, altında yatay thumbnail şeridi. Thumbnail'e tıklanınca üstteki büyük foto değişiyor. Ok tuşlarıyla da geçilebilir. Her ilan için 5-10 fotoğraf olacak.
  - **Sağ (%20) — Bilgi şeridi (sticky, scroll'da sabit kalır):**
    - Fiyat (büyük, belirgin)
    - Mülk bilgileri: m², oda sayısı, kat, bina yaşı
    - Konum (mahalle)
    - "İletişime geç" butonu → Ana sayfadaki iletişim bölümüne (Adım 6) yönlendirir
    - WhatsApp butonu ilan sayfasında yer almaz. Tüm iletişim ana sayfanın iletişim bölümünden sağlanır.
- Fotoğrafların altında (sol kolonda) açıklama metni yer alabilir.
- Tasarım ana sayfayla aynı tonu korumalı (koyu zemin, krem metin, altın aksanlar).

## Ana Sayfa — 6 Adımlık Story Akışı

### Adım 1: Hero

Tam ekran, soyut/minimal hero bölümü. Fotoğraf yok. Koyu arka plan üzerine güçlü tipografi ve ince mimari çizgilerle atmosfer oluşturuluyor.

**Bu adımın çalışan bir HTML prototipi mevcut — ekteki `hero-section.html` dosyasını referans al.** Tasarım kararları (renk, font, layout, animasyonlar) bu dosyada uygulanmış durumda. Siteyi bu temelin üzerine inşa et.

Hero içeriği:
- Üst: Logo (ZÜHRE YATIRIM.) sol, navigasyon (Hakkımızda, İlanlar, Projeler, İletişim) sağ
- Tagline: "Serik · Belek · Antalya"
- Ana başlık: "Toprağı tanır, *üstünü* inşa ederiz." ("üstünü" italik ve altın renk)
- Alt metin: "Kat karşılığı inşaat ve gayrimenkul danışmanlığı. Üç kişilik ekip, yirmi yıllık tecrübe." (yıl bilgisi placeholder, doğrulanacak)
- Alt bar: Sol — "Aşağı kaydır" scroll göstergesi. Sağ — WhatsApp butonu.

### Adım 2: Ekip — "Üç kişiyiz. Bizi ararsanız biz açarız."

Üç portre yan yana, eşit büyüklükte. Her birinin altında isim ve tek cümlelik rol tanımı (ünvan değil, ne yaptığını anlatan bir cümle). Uzun biyografi yok. Zühre'nin kurucu olduğu anlaşılsın ama hiyerarşi vurgulanmasın.

Placeholder rol cümleleri:
- Zühre Kuş — "Projenin başından sonuna kadar sahada"
- Sefa Çoşkun — "Teknik süreçlerin takipçisi"
- Mehmet Kuş — "Arsa değerlendirme ve saha koordinasyonu"

Mesaj: Küçük ama sağlam bir ekip. Muhatap belli, aracı yok.

### Adım 3: İki Kollu Değer Önerisi

Ekran ikiye bölünmüş, yan yana iki kolon:

**Sol kolon — Arsa sahiplerine:**
- Başlık: "Arsanız var mı?"
- Metin: "Arsanızı kat karşılığı modelle değerlendiriyoruz. Riski biz taşıyoruz, süreci birlikte yönetiyoruz. Sonunda arsanız, dairelere dönüşür."
- Buton: "Bizi arayın" → Sayfanın altındaki iletişim bölümüne (Adım 6) kaydırır veya doğrudan WhatsApp linki açar.

**Sağ kolon — Alıcılara:**
- Başlık: "Ev mi arıyorsunuz?"
- Metin: "Serik ve çevresinde satılık daire, müstakil ve arsa ilanlarımızı inceleyin. Neye ihtiyacınız olduğunu biliyoruz çünkü çoğunu biz inşa ettik."
- Buton: "İlanları inceleyin" → İlanlar sayfasına (/ilanlar) yönlendirir.

"Çoğunu biz inşa ettik" cümlesi önemli — satıcı değil üretici olduklarını ima ediyor.

### Adım 4: Öne Çıkan İlanlar — Yatay Kayan Grid

- Başlık: "Güncel İlanlar"
- 4-5 ilan kartından oluşan yatay bir grid (1×5).
- Yavaş otomatik kayma animasyonu, hover/touch'ta duruyor.
- Her kart: görsel, mahalle adı, m², oda sayısı, fiyat.
- Kartlara tıklanınca ilan detay sayfasına gidiyor.
- Baskıcı dil kullanma ("kaçırmayın", "fırsat" gibi).

### Adım 5: Tamamlanmış Projeler — "Teslim ettiklerimiz"

- 2-3 bitmiş proje.
- Her biri: tek fotoğraf + proje adı + tek satır bilgi (örn: "Orta Mahalle, 12 daire, 2023").
- Detaya girme, galeri açma, ayrı sayfa açma yok. Kısa ve net.
- "Teslim ettiklerimiz" başlığı bilinçli — "projelerimiz" değil. Bitirme vurgusu.
- Bu adım kat karşılığı iş yapan bir firma için güven inşasının temelidir.

### Adım 6: İletişim — "Konuşalım."

- Telefon numarası
- WhatsApp butonu (en büyük ve en belirgin eleman)
- Adres: Serik, Antalya
- Opsiyonel: küçük bir harita
- Form yok. Bu sektörde insanlar formu doldurmaz, direkt arar.
- Firma tam adı (Zühre Yatırım Gayrimenkul Danışmanlığı) burada footer'da yer alabilir.

## Önemli Notlar

- Serik, yabancı yatırımcı çeken bir yer değil. Yabancı yatırımcı profili Belek ve Kadriye'de. Serik merkez daha yerel ve yerli kitleye hitap ediyor. Site bu gerçeği yansıtmalı — Serik'i yabancılara tanıtma bölümüne gerek yok.
- Stok fotoğraf kullanımı minimumda tutulmalı. Özellikle "Teslim ettiklerimiz" bölümünde stok fotoğraf kullanmak güven yerine şüphe yaratır — gerçek proje fotoğrafları kullanılmalı.
- Kat karşılığı müteahhitlik firmanın asıl gücü. Site bunu kurumsal jargonla değil, doğal ve anlaşılır bir dille anlatmalı.

## Ek Dosyalar — HTML Prototipleri

Bu brief ile birlikte iki HTML prototipi ektedir. Bunlar tasarım yönünü, tipografi seçimlerini, layout oranlarını ve genel tonu göstermek için hazırlanmıştır. Nihai site açık tema olacak ama bu prototiplerdeki yapısal kararlar (layout, spacing, bileşen hiyerarşisi) referans alınmalıdır.

1. **`hero-section.html`** — Ana sayfanın hero bölümü (Adım 1). Tipografi (Playfair Display + Jost), animasyonlar, navigasyon yapısı, mimari çizgi efektleri ve genel atmosfer burada test edilmiştir. Açık temaya çevirirken yapısal kararları koru.

2. **`ilan-detay.html`** — İlan detay sayfası prototipi. %80/%20 yatay bölme (sol: foto galeri + thumbnail şeridi, sağ: sticky bilgi kartı), ok tuşuyla navigasyon, spec grid yapısı ve "İletişime Geç" buton yerleşimi burada gösterilmiştir. Mobilde alt alta düşen responsive davranış mevcut.

## Placeholder Görseller

Henüz gerçek mülk fotoğrafları mevcut değil. Geliştirme sürecinde eksik görseller için **Google Nano Banana** (AI görsel üretici) kullanarak geçici placeholder fotoğraflar üret. Bunlar siteyi doldurma ve tasarımı test etme amaçlıdır — ileride gerçek fotoğraflarla değiştirilecek.

Üretilmesi gereken placeholder görseller:
- **İlan kartları için:** Modern daire dış cephe, salon, mutfak, yatak odası, banyo, balkon manzarası (Akdeniz havası, sıcak ışık, minimal mobilya). Her ilan için 5-8 adet.
- **Tamamlanmış projeler için:** Bitmiş apartman binası dış cephe fotoğrafları (3 adet, farklı binalar).
- **Ekip bölümü için:** 3 adet profesyonel portre placeholder (erkek x2, kadın x1).
- Tüm görseller tutarlı bir estetikle üretilmeli — sıcak doğal ışık, temiz ve modern iç mekanlar, abartısız. Sitenin minimalist/lüks tonuyla uyumlu olmalı.
