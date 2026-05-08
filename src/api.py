import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

app = FastAPI(title="KızılelmaAI Finans", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None
MODEL = "gemini-2.5-flash"

FINANS_SYSTEM_PROMPT = """Sen KızılelmaAI Finans Asistanı'sın — Türkiye'nin en akıllı kişisel finans koçu.

Uzmanlık alanların:
1. **Harcama Analizi**: Harcamaları kategorize et (gıda, ulaşım, kira, eğlence, faturalar, sağlık, giyim, diğer), kalıpları belirle, tasarruf fırsatları göster
2. **Bütçe Planlama**: Gelire göre 50/30/20 kuralı ve Türkiye ekonomik koşullarına uygun bütçe öner
3. **Finansal Hedefler**: Birikim hedeflerini belirle, aylık plan oluştur, enflasyona karşı koruma stratejileri sun
4. **Yatırım Rehberliği**: Türkiye'deki yatırım araçları (altın, döviz, TL mevduat, hisse, fon) hakkında genel bilgi ver — yatırım tavsiyesi değil, eğitim amaçlı
5. **Tasarruf Koçluğu**: Günlük harcama alışkanlıklarını iyileştirme önerileri, market stratejileri, fatura optimizasyonu

Yanıt tarzı:
- Türkçe yanıt ver, rakamlarda TL birimi kullan
- Net, uygulanabilir öneriler sun
- Verilen harcama verilerini analiz et ve **spesifik** çıkarımlar yap
- Markdown kullan (listeler, başlıklar, kalın metin)
- Motive edici ve pratik ol

Sınırlar:
- Kesin yatırım tavsiyesi verme, "genel bilgi" çerçevesinde kal
- Finans dışı konularda "Ben finans konusunda yardımcı olabilirim" de"""

KATEGORI_ARACLARI = [
    types.Tool(
        function_declarations=[
            types.FunctionDeclaration(
                name="kategorize_harcama",
                description="Harcamayı finans kategorisine ayır ve analiz et",
                parameters=types.Schema(
                    type=types.Type.OBJECT,
                    properties={
                        "kategori": types.Schema(
                            type=types.Type.STRING,
                            enum=["gida", "ulasim", "kira_aidat", "faturalar", "eglence", "saglik", "giyim", "egitim", "tasarruf", "diger"],
                            description="Harcama kategorisi"
                        ),
                        "oneri": types.Schema(
                            type=types.Type.STRING,
                            description="Bu harcamayla ilgili kısa tasarruf önerisi"
                        ),
                        "risk_seviyesi": types.Schema(
                            type=types.Type.STRING,
                            enum=["dusuk", "orta", "yuksek"],
                            description="Bu harcama kalıbının bütçeye etkisi"
                        )
                    },
                    required=["kategori", "oneri", "risk_seviyesi"]
                )
            )
        ]
    )
]


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: Optional[list[Message]] = []


class HarcamaKalemi(BaseModel):
    aciklama: str
    tutar: float
    tarih: Optional[str] = None


class HarcamaAnalizRequest(BaseModel):
    harcamalar: list[HarcamaKalemi]
    aylik_gelir: Optional[float] = None


class ButceRequest(BaseModel):
    aylik_gelir: float
    sabit_giderler: Optional[float] = None
    hedef: Optional[str] = None


def build_contents(history: list[Message], user_message: str) -> list:
    contents = []
    for msg in history:
        role = "user" if msg.role == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg.content)]))
    contents.append(types.Content(role="user", parts=[types.Part(text=user_message)]))
    return contents


@app.post("/chat")
async def chat(request: ChatRequest):
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API anahtarı bulunamadı.")
    try:
        contents = build_contents(request.history or [], request.message)
        response = client.models.generate_content(
            model=MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=FINANS_SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=2048,
            ),
        )
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/harcama-analiz")
async def harcama_analiz(request: HarcamaAnalizRequest):
    """Agentik harcama analizi — Gemini tool calling ile otomatik kategorize eder."""
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API anahtarı bulunamadı.")

    harcama_listesi = "\n".join(
        [f"- {h.aciklama}: {h.tutar:.2f} TL{f' ({h.tarih})' if h.tarih else ''}"
         for h in request.harcamalar]
    )
    toplam = sum(h.tutar for h in request.harcamalar)
    gelir_bilgisi = f"\nAylık Gelir: {request.aylik_gelir:.2f} TL" if request.aylik_gelir else ""

    prompt = f"""Aşağıdaki harcamaları analiz et ve her birini kategorize et:

{harcama_listesi}

Toplam Harcama: {toplam:.2f} TL{gelir_bilgisi}

Her harcama kalemi için kategori, risk seviyesi ve kısa öneri belirle.
Sonunda genel değerlendirme ve 3 somut tasarruf önerisi sun."""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=FINANS_SYSTEM_PROMPT,
                tools=KATEGORI_ARACLARI,
                temperature=0.3,
                max_output_tokens=3000,
            ),
        )

        # Tool call sonuçlarını topla
        kategoriler = {}
        tool_calls_data = []

        for part in response.candidates[0].content.parts:
            if hasattr(part, "function_call") and part.function_call:
                fc = part.function_call
                tool_calls_data.append({
                    "tool": fc.name,
                    "args": dict(fc.args)
                })
                cat = fc.args.get("kategori", "diger")
                kategoriler[cat] = kategoriler.get(cat, 0) + 1

        # Tool call sonrası final analiz
        final_prompt = f"""{prompt}

Harcama kategorileri: {json.dumps(kategoriler, ensure_ascii=False)}

Şimdi detaylı finansal analiz raporunu Türkçe markdown formatında yaz:
- Kategori bazlı özet
- Bütçe sağlığı değerlendirmesi
- Öncelikli tasarruf fırsatları
- Önümüzdeki ay için eylem planı"""

        final_response = client.models.generate_content(
            model=MODEL,
            contents=final_prompt,
            config=types.GenerateContentConfig(
                system_instruction=FINANS_SYSTEM_PROMPT,
                temperature=0.5,
                max_output_tokens=2048,
            ),
        )

        return {
            "analiz": final_response.text,
            "toplam_harcama": toplam,
            "kategori_dagilimi": kategoriler,
            "agent_calls": len(tool_calls_data),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/butce-olustur")
async def butce_olustur(request: ButceRequest):
    """Kişiselleştirilmiş bütçe planı oluştur."""
    if not client:
        raise HTTPException(status_code=500, detail="Gemini API anahtarı bulunamadı.")

    prompt = f"""Aylık gelir: {request.aylik_gelir:.2f} TL
{f'Sabit giderler (kira, fatura vs.): {request.sabit_giderler:.2f} TL' if request.sabit_giderler else ''}
{f'Finansal hedef: {request.hedef}' if request.hedef else ''}

Türkiye ekonomik koşullarını (enflasyon, yaşam maliyeti) göz önünde bulundurarak:
1. 50/30/20 bütçe kuralına göre önerilen dağılım (ihtiyaçlar/istekler/tasarruf)
2. Gelire göre kategori bazlı aylık limit önerileri (TL cinsinden)
3. {request.hedef if request.hedef else 'Acil durum fonu'} için kaç ayda hedefe ulaşılır?
4. Pratik tasarruf ipuçları (Türkiye'ye özgü)

Markdown tablo ve listelerle düzenli bir plan sun."""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=FINANS_SYSTEM_PROMPT,
                temperature=0.4,
                max_output_tokens=2048,
            ),
        )
        return {"butce_plani": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "api_key_configured": GEMINI_API_KEY is not None,
        "model": MODEL,
        "project": "KızılelmaAI Finans — BTK Hackathon 2026",
        "konsept": "Finans",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
