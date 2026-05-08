# KızılelmaAI — Kişisel Finans Asistanı

**BTK Akademi Hackathon 2026** | Konsept: **Finans** | Google Gemini + FastAPI + React

## Proje Açıklaması

KızılelmaAI, Türkiye'deki bireylerin finansal okuryazarlığını artırmak ve harcama alışkanlıklarını iyileştirmek için tasarlanmış Gemini destekli kişisel finans koçudur.

### Çözülen Problem
Türkiye'de yüksek enflasyon ortamında milyonlarca kişi bütçe yönetiminde zorlanmakta, harcamalarını analiz edememekte ve finansal hedef belirleyememektedir. KızılelmaAI bu sorunu 7/24 ücretsiz erişilebilir AI koçu ile çözer.

### Özellikler
| Özellik | Açıklama |
|---------|----------|
| 🤖 AI Finans Koçu | Gemini ile çok-turlu finansal sohbet |
| 📊 Agentik Harcama Analizi | Gemini tool calling ile otomatik kategorize + rapor |
| 💰 Bütçe Planlama | 50/30/20 kuralı, Türkiye koşullarına özel plan |

## Gemini Kullanımı

```
Endpoint          Gemini Özelliği
/chat             Multi-turn sohbet + sistem promptu
/harcama-analiz   Tool calling (agentik kategorize) + analiz raporu
/butce-olustur    Kişiselleştirilmiş prompt + yapılandırılmış çıktı
```

**Model:** `gemini-2.5-flash`
**SDK:** `google-genai` (Python)
**Teknik:** Conversation history, system instruction, function declarations (tool calling), temperature kontrolü

## Teknoloji Stack

| Katman | Teknoloji |
|--------|-----------|
| AI | **Google Gemini 2.5 Flash** (birincil) |
| Backend | Python 3.11 + FastAPI + uvicorn |
| Frontend | React 18 + Vite |

## Kurulum

```bash
# 1. API anahtarı
cp .env.example .env
# .env dosyasına GEMINI_API_KEY ekle → https://aistudio.google.com/apikey

# 2. Backend
pip install -r requirements.txt
python src/api.py         # → http://localhost:8000

# 3. Frontend
cd frontend
npm install
npm run dev               # → http://localhost:5173
```

## API

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| POST | `/chat` | Finans koçuyla sohbet |
| POST | `/harcama-analiz` | Agentik harcama analizi |
| POST | `/butce-olustur` | Kişisel bütçe planı |
| GET | `/health` | Servis durumu |

## Proje Yapısı

```
KizilelmaAI/
├── src/api.py          # FastAPI backend + Gemini tool calling
├── frontend/src/
│   ├── App.jsx         # React — Chat, Harcama, Bütçe sayfaları
│   └── App.css         # Stiller
├── .env.example
├── requirements.txt
└── README.md
```

## Hackathon

- **Organizatör:** BTK Akademi + Google + GİRVAK
- **Konsept:** Finans ✓
- **Gemini birincil AI aracı:** ✓
- **Yarışma:** 8–19 Mayıs 2026
