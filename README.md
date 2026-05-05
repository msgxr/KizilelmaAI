# KızılelmaAI

## Hackathon
**BTK Akademi Hackathon 2026**
- **Yarışma:** 06.05.2026 – 19.05.2026
- **Tema:** Canlı yayında açıklanacak (06.05.2026)
- **Sunum:** 05.06.2026
- **Ödüller:** 1. 140.000₺ | 2. 85.000₺ | 3. 55.000₺

## Takım
**KızılelmaAI**

## Kullanılan Teknolojiler
- Python + FastAPI (Backend)
- Google Gemini 2.0 Flash API
- LangChain + LangGraph
- React + Vite (Frontend)

## Proje Yapısı
```
KizilelmaAI/
├── src/
│   ├── api.py        # FastAPI backend (port 8000)
│   └── main.py       # CLI test scripti
├── frontend/
│   ├── src/
│   │   ├── App.jsx   # Ana React bileşeni
│   │   ├── main.jsx  # React giriş noktası
│   │   └── App.css   # Stiller
│   ├── vite.config.js
│   └── index.html
├── .env              # API anahtarları (git'e eklenmez)
└── requirements.txt
```

## Kurulum

### 1. Gemini API Anahtarı
`.env` dosyasını düzenle:
```
GEMINI_API_KEY=buraya_gercek_anahtarini_yaz
```
API anahtarı için: https://aistudio.google.com/apikey

### 2. Backend
```bash
pip install -r requirements.txt
python src/api.py
# → http://localhost:8000
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## Hackathon Gereksinimleri
- Gemini ana yapay zeka aracı olarak kullanılmalı ✓
- Gemini API / LangChain / LangGraph / A2A kullanımı serbest ✓
- GitHub kodu + canlı demo linki (veya 1 dk video) teslim edilecek
- Herhangi bir ürün türü olabilir: web, mobil, masaüstü, RAG, chatbot vb.
