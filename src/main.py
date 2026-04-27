import os
from dotenv import load_dotenv
import google.generativeai as genai

# .env dosyasından çevre değişkenlerini yükle
load_dotenv()

# API anahtarını al
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def main():
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        print("Lütfen .env dosyası oluşturup geçerli bir GEMINI_API_KEY değeri girin.")
        return

    # Gemini API'yi yapılandır
    genai.configure(api_key=GEMINI_API_KEY)
    
    # Modeli seç
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    print("KızılelmaAI sistemine hoş geldiniz! Gemini API ile bağlantı kuruluyor...\n")
    
    try:
        # Örnek bir prompt gönder
        prompt = "BTK Akademi Hackathon 2026 için motive edici, teknoloji odaklı kısa bir slogan yazar mısın?"
        response = model.generate_content(prompt)
        
        print("Soru:", prompt)
        print("\nGemini Yanıtı:\n", response.text)
        
    except Exception as e:
        print("Bir hata oluştu:", e)

if __name__ == "__main__":
    main()
