# Zühre Yatırım — Website

Bu statik web sitesi **HTML, CSS ve JavaScript** ile oluşturulmuştur. Veritabanı kullanılmamakta, ilan verileri `data/ilanlar.json` dosyasından çekilmektedir.

## ⚠️ Önemli Kurulum & Çalıştırma Bilgisi (CORS Hatası)

İlanların listelenebilmesi için tarayıcıların güvenlik politikaları (`CORS` - Cross-Origin Resource Sharing) gereği statik HTML dosyalarınızı bir **Yerel Sunucu (Local Server)** üzerinden açmanız gerekmektedir. Dosyaya sadece çift tıklayıp (`file://` formatında) açarsanız tarayıcı JSON dosyasını okuyamaz ve ilanlar görünmez.

Aşağıdaki yöntemlerden birini kullanarak siteyi çalıştırabilirsiniz:

### Yöntem 1: VS Code üzerinden (En Kolay)
1. Projeyi Visual Studio Code'da açın.
2. Eklentiler (Extensions) bölümünden **Live Server** eklentisini kurun.
3. `index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğini seçin.

### Yöntem 2: Python ile
Eğer bilgisayarınızda (Mac/Linux) Mac üzerinde dahili olarak gelen *Python* varsa, terminal (komut satırı) açıp proje klasörüne gidin ve şu komutu çalıştırın:
```bash
python3 -m http.server 8000
```
Ardından tarayıcınızda `http://localhost:8000` adresine gidin.

### Yöntem 3: Node.js / npx ile
Eğer bilgisayarınızda npm yüklüyse terminalde proje klasöründe şunu çalıştırın:
```bash
npx serve .
```

---

## Veri Ekleme & Düzenleme
Yeni bir ilan eklemek için `data/ilanlar.json` dosyasını kullanıyoruz.

1. **İlan Eklentisi:** JSON yapısı içindeki `ilanlar` dizisine (array) yeni bir obje ekleyin ve bir `id` belirleyin.
2. **Fotoğraflar:** Belirlediğiniz `id` numarası ile `images/ilanlar/` klasörü içerisinde yeni bir klasör oluşturun (Örn: `images/ilanlar/6/`).
3. **Senkronizasyon:** JSON içerisindeki `"fotograflar"` dizisine, klasöre koyduğunuz resimlerin isimlerini ekleyin (`["foto1.jpg", "foto2.jpg"]` gibi).
