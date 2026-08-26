import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.services.pdf_processor import PDFProcessor
from app.services.vector_store import vector_store
import os

@pytest.fixture(autouse=True)
def init_data():
    data_path = os.path.join(os.path.dirname(__file__), "../app/data/sample_candidates.json")
    chunks = PDFProcessor.load_initial_proposals(data_path)
    vector_store.index_chunks(chunks)

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["indexed_chunks"] > 0

def test_get_candidates():
    response = client.get("/api/v1/candidates")
    assert response.status_code == 200
    candidates = response.json()
    assert len(candidates) >= 3
    assert any(c["ballot_name"] == "Helena Silveira" for c in candidates)

def test_get_topics():
    response = client.get("/api/v1/candidates/topics")
    assert response.status_code == 200
    topics = response.json()
    assert len(topics) >= 5
    topic_ids = [t["id"] for t in topics]
    assert "saude" in topic_ids
    assert "educacao" in topic_ids

def test_compare_endpoint():
    payload = {
        "candidate_ids": ["cand_1", "cand_2"],
        "topic_id": "saude"
    }
    response = client.post("/api/v1/compare", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["topic"]["id"] == "saude"
    assert len(data["candidate_details"]) == 2
    assert len(data["divergence_points"]) > 0

def test_chat_rag_endpoint():
    payload = {
        "query": "Como os candidatos pretendem investir em telemedicina e postos de saúde?"
    }
    response = client.post("/api/v1/chat", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "telemedicina" in data["answer"].lower() or len(data["citations"]) > 0
    assert len(data["citations"]) > 0
    # Verifica presença do número de página na citação
    assert data["citations"][0]["page_number"] > 0

def test_quiz_match_endpoint():
    # Buscar perguntas primeiro
    q_resp = client.get("/api/v1/quiz/questions")
    assert q_resp.status_code == 200
    questions = q_resp.json()
    assert len(questions) > 0

    # Submeter respostas
    submission = {
        "answers": [
            {"question_id": "q1", "selected_option_id": "q1_opt_a"},
            {"question_id": "q2", "selected_option_id": "q2_opt_a"},
            {"question_id": "q3", "selected_option_id": "q3_opt_a"}
        ]
    }
    response = client.post("/api/v1/quiz/match", json=submission)
    assert response.status_code == 200
    result = response.json()
    assert "top_candidate" in result
    assert result["top_candidate"]["overall_match_percentage"] > 0
