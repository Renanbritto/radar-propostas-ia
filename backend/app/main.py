import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger
from app.api.v1.router import api_router
from app.services.pdf_processor import PDFProcessor
from app.services.vector_store import vector_store

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Indexar propostas na inicialização
    logger.info("Iniciando Radar de Propostas IA Backend...")
    data_path = os.path.join(os.path.dirname(__file__), "data/sample_candidates.json")
    chunks = PDFProcessor.load_initial_proposals(data_path)
    vector_store.index_chunks(chunks)
    logger.info(f"Indexação concluída: {len(chunks)} chunks ativos no motor RAG.")
    yield
    logger.info("Encerrando aplicação...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API Cívica de RAG e NLP para análise, comparação e consulta a Planos de Governo.",
    lifespan=lifespan
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["Health Check"])
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "indexed_chunks": len(vector_store.chunks)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
