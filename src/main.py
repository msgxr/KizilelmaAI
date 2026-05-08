import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

def main():
    if not GEMINI_API_KEY or GEMINI_API_KEY == "your_key_here":
        print("Lütfen .env dosyasına geçerli bir GEMINI_API_KEY değeri girin.")
        return

    client = genai.Client(api_key=GEMINI_API_KEY)

    print("KızılelmaAI sistemine hoş geldiniz! Gemini API ile bağlantı kuruluyor...\n")

    try:
        prompt = "BTK Akademi Hackathon 2026 için motive edici, teknoloji odaklı kısa bir slogan yazar mısın?"
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        print("Soru:", prompt)
        print("\nGemini Yanıtı:\n", response.text)
    except Exception as e:
        print("Bir hata oluştu:", e)

if __name__ == "__main__":
    main()
