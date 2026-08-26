import json
import os
from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import Candidate, Topic
from app.core.config import settings

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../../data/sample_candidates.json")

def load_data():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    return {"candidates": []}

@router.get("", response_model=List[Candidate])
def get_candidates():
    """Retorna todos os candidatos cadastrados e estatísticas dos planos."""
    data = load_data()
    return data.get("candidates", [])

@router.get("/topics", response_model=List[Topic])
def get_topics():
    """Retorna os tópicos e eixos temáticos disponíveis."""
    return [Topic(**t) for t in settings.TOPICS]

@router.get("/{candidate_id}", response_model=Candidate)
def get_candidate_by_id(candidate_id: str):
    """Retorna os detalhes de um candidato específico."""
    data = load_data()
    for cand in data.get("candidates", []):
        if cand["id"] == candidate_id:
            return cand
    raise HTTPException(status_code=404, detail="Candidato não encontrado.")
