# /feature — Yeni AI Özelliği Ekle

Argüman olarak eklenecek özelliği belirt: `/feature <özellik adı veya açıklaması>`

## Görev

KızılelmaAI projesine yeni bir Gemini destekli özellik ekle. Aşağıdaki adımları takip et:

### 1. Analiz
- Mevcut `src/api.py` backend kodunu oku
- Mevcut `frontend/src/App.jsx` frontend kodunu oku
- Özelliğin mevcut yapıya nasıl uyacağını planla

### 2. Backend (src/api.py)
- Yeni endpoint veya mevcut `/chat` endpoint'inin genişletilmesi
- Gemini 2.5 Flash kullan (`gemini-2.5-flash` model ID)
- Pydantic modeli ile request/response tanımla
- Sistem promptu ile Gemini'yi yönlendir

### 3. Frontend (frontend/src/App.jsx)
- Yeni özelliğe uygun UI bileşeni ekle
- Backend endpoint'i ile bağla
- Hata durumlarını ele al

### 4. Test
- Backend'i yeniden başlat
- Manuel olarak yeni özelliği test et
- Edge case'leri kontrol et

## Önemli Notlar
- Gemini API anahtarı `.env` dosyasındaki `GEMINI_API_KEY`'den okunuyor
- Model: `gemini-2.5-flash` (hızlı ve hackathon için yeterli)
- CORS middleware zaten `allow_origins=["*"]` ile açık
- LangChain/LangGraph kullanmak istersen `requirements.txt`'e ekle
