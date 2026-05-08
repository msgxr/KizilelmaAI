# /dev — Geliştirme Ortamını Başlat

KızılelmaAI geliştirme ortamını kontrol et ve başlatma talimatlarını ver.

## Adımlar

1. `.env` dosyasının varlığını ve `GEMINI_API_KEY` ayarını kontrol et
2. `requirements.txt` bağımlılıklarının yüklü olup olmadığını kontrol et
3. `src/api.py` backend'ini başlatmak için terminal komutu ver
4. `frontend/` React uygulamasını başlatmak için terminal komutu ver
5. Her iki servisin çalıştığını doğrulamak için `http://localhost:8000/health` endpoint'ini kontrol et

## Beklenen Çıktı

- Backend: http://localhost:8000
- Frontend: http://localhost:5173
- Health Check: http://localhost:8000/health → `{"status": "ok", "api_key_configured": true}`

## Sorun Giderme

- `GEMINI_API_KEY` eksikse: `.env.example` dosyasını kopyala, gerçek anahtarı ekle
- Port 8000 doluysa: `netstat -ano | findstr :8000` ile kontrol et
- CORS hatası alıyorsan: backend'in çalıştığından ve 8000 portunda olduğundan emin ol
