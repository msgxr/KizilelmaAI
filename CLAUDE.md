# KızılelmaAI — BTK Hackathon 2026

## Yarışma Takvimi (Resmi)
| Tarih | Etkinlik |
|-------|----------|
| 08.05.2026 | Yarışma resmi başlangıcı (canlı yayın) |
| **19.05.2026 23:59** | **Teslim son tarihi** |
| 20–30.05.2026 | Ön jüri değerlendirmesi |
| 05.06.2026 | Jüri sunumu (7 dakika, online) |

## KONSEPT: FİNANS veya E-TİCARET
**Seçilen: FİNANS** — Kişisel finans yönetimi, harcama analizi, bütçe planlama

### Neden Finans?
- Gemini ile derin finansal analiz yapılabilir
- Agentik yapılar kolayca entegre edilebilir (harcama kategorize etme, tahmin)
- Türkiye ekonomik bağlamı güçlü demo yaratır
- Açık veri ile RAG yapılabilir

## Proje Konsepti: KızılelmaAI Finans Asistanı
**"Gemini destekli kişisel finans koçu"**

Özellikler:
1. Harcama takibi ve AI destekli kategorizasyon
2. Bütçe analizi ve öneriler (Gemini)
3. Finansal hedef belirleme ve takip
4. Aylık harcama raporu (Gemini analizi)
5. Türk lirası enflasyon bağlamında tasarruf önerileri
6. **Agentik yapı**: harcama analiz agenti (bonus puan)

## Değerlendirme Kriterleri (Jüriden)
| Kriter | Puan |
|--------|------|
| Ürün uygulanabilirliği ve kullanıcı değeri | |
| Teknik kalite (algoritmalar, mimari) | |
| **Agentik yapılar** (bonus) | |
| Yenilikçilik | |
| Kullanıcı dostu arayüz | 10 puan |
| Takım çalışması / sunum | |

## Zorunlu Teslim (19 Mayıs 23:59)
1. **GitHub repo** — public, düzenli commitler, yarışma başlangıcından sonra
2. **1 dakikalık video** — ne yaptığını göster (YouTube'a yükle, link paylaş)
3. **Kısa paragraf** — ürün açıklaması + teknolojiler
4. **Canlı link** (opsiyonel ama tercih edilen)

## Kritik Git Kuralları
- Commit geçmişi jüri tarafından inceleniyor
- Yarışma öncesi (08.05.2026 öncesi) commit OLMAMALI
- Düzenli commit at — az ve dev commit yerine anlamlı küçük commitler
- Repo yarışma süresince private olabilir, 19 Mayıs'ta public yap

## Teknik Stack
| Katman | Teknoloji |
|--------|-----------|
| Backend | Python + FastAPI + uvicorn |
| AI | **Google Gemini 2.5 Flash** (zorunlu) |
| Agentic | LangGraph veya google-genai ile tool calling |
| Frontend | React 18 + Vite |

## Çalıştırma
```bash
# Backend
pip install -r requirements.txt
python src/api.py        # → http://localhost:8000

# Frontend
cd frontend && npm install && npm run dev  # → http://localhost:5173
```

## Slash Komutları
- `/dev` — geliştirme ortamını başlat
- `/feature <isim>` — yeni özellik ekle
- `/submit` — teslim kontrol listesi
- `/demo` — demo senaryoları oluştur
