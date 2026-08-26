from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag_engine import rag_engine

router = APIRouter()

@router.post("", response_model=ChatResponse)
async def chat_with_proposals(request: ChatRequest):
    """
    Endpoint RAG: Consulta semântica sobre os planos de governo com retorno de citações e fontes auditáveis.
    """
    return await rag_engine.generate_response(request)
