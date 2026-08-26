from fastapi import APIRouter
from app.api.v1.endpoints import candidates, compare, chat, quiz, finances

api_router = APIRouter()

api_router.include_router(candidates.router, prefix="/candidates", tags=["Candidatos & Tópicos"])
api_router.include_router(compare.router, prefix="/compare", tags=["Comparador Temático"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chat RAG Cívico"])
api_router.include_router(quiz.router, prefix="/quiz", tags=["Bússola de Afinidade"])
api_router.include_router(finances.router, prefix="/finances", tags=["InvestigaVoto & Financiamento"])