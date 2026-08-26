import pytest
import os
from app.services.pdf_processor import PDFProcessor
from app.services.vector_store import vector_store
from app.services.rag_engine import rag_engine
from app.models.schemas import ChatRequest

@pytest.fixture(autouse=True)
def setup_vector_store():
    data_path = os.path.join(os.path.dirname(__file__), "../app/data/sample_candidates.json")
    chunks = PDFProcessor.load_initial_proposals(data_path)
    vector_store.index_chunks(chunks)

@pytest.mark.asyncio
async def test_rag_semantic_search_accuracy():
    # Teste de busca semântica para Educação e Creches
    results = vector_store.search("cheque-creche e vouchers para rede privada", top_k=2)
    assert len(results) > 0
    top_chunk, score = results[0]
    assert "creche" in top_chunk.text.lower() or "voucher" in top_chunk.text.lower()
    assert top_chunk.candidate_id == "cand_2"

@pytest.mark.asyncio
async def test_rag_answer_with_citations():
    request = ChatRequest(query="Quais as propostas para segurança pública e armamento da Guarda?")
    response = await rag_engine.generate_response(request)
    
    assert len(response.citations) > 0
    assert any("armamento" in c.excerpt.lower() or "guarda" in c.excerpt.lower() for c in response.citations)
    
    # Validação de citação transparente com página auditável
    for citation in response.citations:
        assert citation.page_number is not None
        assert len(citation.excerpt) > 10
