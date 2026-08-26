from typing import List
from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    FinanceOverviewResponse,
    CandidateFinancials,
    FinancialAnomaly
)
from app.services.finance_service import finance_service

router = APIRouter()

@router.get("/overview", response_model=FinanceOverviewResponse)
def get_finance_overview():
    """
    Retorna o panorama forense consolidado das prestações de contas,
    incluindo total arrecadado, gastos, fornecedores e anomalias detectadas.
    """
    return finance_service.get_overview()

@router.get("/candidates/{candidate_id}", response_model=CandidateFinancials)
def get_candidate_finances(candidate_id: str):
    """Retorna os dados financeiros detalhados e auditoria de um candidato."""
    data = finance_service.get_candidate_finances(candidate_id)
    if not data:
        raise HTTPException(status_code=404, detail="Dados financeiros do candidato não encontrados.")
    return data

@router.get("/anomalies", response_model=List[FinancialAnomaly])
def get_anomalies():
    """Retorna todos os alertas e anomalias forenses detectados nas campanhas."""
    overview = finance_service.get_overview()
    return overview.system_wide_anomalies