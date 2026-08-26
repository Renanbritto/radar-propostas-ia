import json
import os
from typing import List
from fastapi import APIRouter
from app.models.schemas import (
    QuizQuestion,
    QuizSubmissionRequest,
    QuizResultResponse
)
from app.services.quiz_service import quiz_service

router = APIRouter()

DATA_PATH = os.path.join(os.path.dirname(__file__), "../../../data/sample_candidates.json")

def load_data():
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r", encoding="utf-8-sig") as f:
            return json.load(f)
    return {"quiz_questions": [], "candidates": []}

@router.get("/questions", response_model=List[QuizQuestion])
def get_quiz_questions():
    """Retorna as perguntas da Bússola Eleitoral."""
    data = load_data()
    return data.get("quiz_questions", [])

@router.post("/match", response_model=QuizResultResponse)
def calculate_match(submission: QuizSubmissionRequest):
    """Calcula a afinidade com os planos de governo com base nas respostas enviadas."""
    data = load_data()
    questions = data.get("quiz_questions", [])
    candidates = data.get("candidates", [])
    return quiz_service.calculate_results(submission, questions, candidates)
