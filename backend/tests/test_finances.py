import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_get_finance_overview():
    response = client.get("/api/v1/finances/overview")
    assert response.status_code == 200
    data = response.json()
    assert data["total_campaign_funds"] > 0
    assert data["total_campaign_expenses"] > 0
    assert len(data["candidates_financials"]) >= 3
    assert len(data["system_wide_anomalies"]) > 0
    assert data["transparency_index_score"] > 0

def test_get_candidate_finances_valid():
    response = client.get("/api/v1/finances/candidates/cand_pres_1")
    assert response.status_code == 200
    data = response.json()
    assert data["candidate_name"] == "Fernando Valente"
    assert len(data["revenue_breakdown"]) > 0
    assert len(data["expense_breakdown"]) > 0
    assert len(data["top_suppliers"]) > 0

def test_get_candidate_finances_not_found():
    response = client.get("/api/v1/finances/candidates/cand_inexistente")
    assert response.status_code == 404

def test_get_anomalies():
    response = client.get("/api/v1/finances/anomalies")
    assert response.status_code == 200
    anomalies = response.json()
    assert len(anomalies) > 0
    assert any(a["severity"] == "Alta" for a in anomalies)