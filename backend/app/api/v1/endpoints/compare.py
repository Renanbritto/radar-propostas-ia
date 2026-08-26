import json
import os
from fastapi import APIRouter, HTTPException
from app.models.schemas import CompareRequest, CompareResponse
from app.services.comparator import comparator_service

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../../data/sample_candidates.json")

def load_candidates():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8-sig") as f:
            return json.load(f).get("candidates", [])
    return []

@router.post("", response_model=CompareResponse)
def compare_proposals(request: CompareRequest):
    """Compara as propostas de múltiplos candidatos para um determinado tópico."""
    candidates = load_candidates()
    if not request.candidate_ids:
        raise HTTPException(status_code=400, detail="Pelo menos um candidato deve ser selecionado para comparação.")
    
    return comparator_service.compare(request, candidates)
