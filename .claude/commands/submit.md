# /submit — Teslim Hazırlık Kontrolü

BTK Hackathon 2026 teslim gereksinimlerini kontrol et ve eksikleri listele.

## Kontrol Listesi

### Zorunlu Teslim Ögesi: GitHub
- [ ] `README.md` mevcut ve dolu mu?
- [ ] `README.md` proje açıklaması, kurulum adımları içeriyor mu?
- [ ] `.env.example` mevcut mi (gerçek API anahtarı olmadan)?
- [ ] `.gitignore` içinde `.env` var mı?
- [ ] `requirements.txt` güncel ve tüm bağımlılıklar dahil mi?
- [ ] Kod temiz, açıklama satırları yeterli mi?

### Zorunlu Teslim Ögesi: Demo
- [ ] Canlı deploy linki var mı? (Vercel, Render, Railway, vb.)
  - VEYA
- [ ] 1 dakikalık demo videosu hazır mı?
- [ ] Demo senaryoları belirlendi mi?

### Zorunlu Teslim Ögesi: Dökümantasyon
- [ ] Proje ne yapıyor? (1-2 paragraf)
- [ ] Gemini nasıl kullanıldı? (jüri bunu arar)
- [ ] Teknik mimari açıklandı mı?
- [ ] Kurulum adımları var mı?

### Değerlendirme Kriterleri (Jüri Bakış Açısı)
- Gemini'nin kullanım derinliği ve yaratıcılığı
- Çözülen gerçek dünya problemi
- Demo edilebilirlik ve kullanıcı deneyimi
- Teknik kalite

## Görev

1. `README.md` dosyasını oku ve eksikleri belirle
2. `.gitignore` dosyasını kontrol et
3. `requirements.txt` dosyasını kontrol et
4. Eksik olan her madde için ne yapılması gerektiğini açıkla
5. README'yi geliştirmek için öneriler sun
6. Deploy seçenekleri öner (Railway veya Render backend için ücretsiz)
