import httpx
from typing import Optional, List
from app.core.config import settings
from app.core.logging import logger

class LLMClient:
    """
    Cliente universal para LLMs comerciais e abertos (Groq, Gemini, OpenAI).
    Permite raciocínio avançado, síntese e linguagem natural sem dependências pesadas.
    """

    SYSTEM_PROMPT = """Você é o Assistente Cívico de Inteligência Artificial do Radar de Propostas (Eleição Presidencial de 2026).
Sua missão é fornecer análises neutras, claras, analíticas e fundamentadas nos Planos de Governo Oficiais registrados no TSE.

Diretrizes obrigatórias:
1. Seja sempre cordial, imparcial, respeitoso e analítico. Nunca expresse viés ou preferência partidária.
2. Ao responder sobre propostas de candidatos, cite o nome do candidato, o partido e o número da página correspondente no plano de governo com base nos trechos fornecidos.
3. Se a mensagem for uma saudação (ex: 'oi', 'boa noite'), responda de forma acolhedora, explique como pode ajudar e sugira temas como Saúde, Economia, Educação, Segurança e Saúde Mental.
4. Os 6 candidatos presidenciais monitorados são: Lula (PT - 13), Flávio Bolsonaro (PL - 22), Renan Santos (MISSÃO - 14), Ronaldo Caiado (PSD - 55), Romeu Zema (NOVO - 30) e Augusto Cury (PRD - 44).
5. Mantenha as respostas bem formatadas em Markdown com títulos, listas e citações em bloco.
"""

    GEMINI_MODELS = ["gemini-flash-latest", "gemini-2.5-flash-lite", "gemini-pro-latest"]

    @classmethod
    def is_configured(cls) -> bool:
        return bool(
            settings.GEMINI_API_KEY or
            settings.GROQ_API_KEY or
            settings.OPENAI_API_KEY
        )

    @classmethod
    async def generate(cls, prompt: str, context_chunks: Optional[List[str]] = None) -> Optional[str]:
        """Gera resposta usando o provedor configurado com prioridade para Gemini."""
        context_str = ""
        if context_chunks:
            context_str = "\n\n--- TRECHOS OFICIAIS DO TSE (RAG CONTEXT) ---\n" + "\n".join(context_chunks) + "\n---------------------------------------------\n"

        full_user_prompt = f"{prompt}\n{context_str}"

        # 1. Tentar Gemini (Google Gemini Flash)
        if settings.GEMINI_API_KEY:
            for model_name in cls.GEMINI_MODELS:
                try:
                    res = await cls._call_gemini_model(model_name, full_user_prompt)
                    if res:
                        return res
                except Exception as e:
                    logger.warning(f"Falha ao chamar Gemini ({model_name}): {e}")

        # 2. Tentar Groq (Llama 3.3 70B)
        if settings.GROQ_API_KEY:
            try:
                res = await cls._call_groq(full_user_prompt)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Falha ao chamar Groq: {e}")

        # 3. Tentar OpenAI (GPT-4o Mini)
        if settings.OPENAI_API_KEY:
            try:
                res = await cls._call_openai(full_user_prompt)
                if res:
                    return res
            except Exception as e:
                logger.warning(f"Falha ao chamar OpenAI: {e}")

        return None

    @classmethod
    async def _call_gemini_model(cls, model_name: str, user_prompt: str) -> Optional[str]:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={settings.GEMINI_API_KEY}"
        
        payload = {
            "contents": [
                {"role": "user", "parts": [{"text": f"{cls.SYSTEM_PROMPT}\n\nConsulta do Cidadão: {user_prompt}"}]}
            ],
            "generationConfig": {
                "temperature": 0.3,
                "maxOutputTokens": 1200
            }
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts:
                        return parts[0].get("text")
            else:
                logger.warning(f"Gemini API ({model_name}) status: {resp.status_code}")
        return None

    @classmethod
    async def _call_groq(cls, user_prompt: str) -> Optional[str]:
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.GROQ_MODEL,
            "messages": [
                {"role": "system", "content": cls.SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 1000
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"]
        return None

    @classmethod
    async def _call_openai(cls, user_prompt: str) -> Optional[str]:
        url = "https://api.openai.com/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": settings.OPENAI_MODEL,
            "messages": [
                {"role": "system", "content": cls.SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.3,
            "max_tokens": 1000
        }
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, headers=headers, json=payload)
            if resp.status_code == 200:
                return resp.json()["choices"][0]["message"]["content"]
        return None
