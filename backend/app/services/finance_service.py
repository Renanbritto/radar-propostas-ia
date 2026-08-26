import os
import json
from typing import List, Optional
from app.models.schemas import (
    FinanceOverviewResponse,
    CandidateFinancials,
    FinancialAnomaly,
    SupplierItem
)
from app.core.logging import logger

DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/sample_finances.json")

class FinanceService:
    """
    Serviço InvestigaVoto: Análise Forense de Financiamento & Gastos de Campanha.
    Realiza auditoria de prestação de contas, detecção de outliers, concentração de fornecedores e alertas de risco.
    """

    @classmethod
    def _load_data(cls) -> List[dict]:
        if not os.path.exists(DATA_PATH):
            logger.warning(f"Arquivo financeiro {DATA_PATH} não encontrado.")
            return []
        with open(DATA_PATH, "r", encoding="utf-8-sig") as f:
            return json.load(f).get("financials", [])

    @classmethod
    def get_overview(cls) -> FinanceOverviewResponse:
        raw_list = cls._load_data()
        
        candidates_fin: List[CandidateFinancials] = []
        all_anomalies: List[FinancialAnomaly] = []
        total_funds = 0.0
        total_exp = 0.0

        for item in raw_list:
            cf = CandidateFinancials(**item)
            candidates_fin.append(cf)
            all_anomalies.extend(cf.anomalies)
            total_funds += cf.total_revenue
            total_exp += cf.total_expenses

        # Cálculo do índice de transparência (0.0 a 10.0)
        # Baseado no número de anomalias de alta severidade
        high_severity_count = sum(1 for a in all_anomalies if a.severity == "Alta")
        med_severity_count = sum(1 for a in all_anomalies if a.severity == "Média")
        transparency_score = max(round(10.0 - (high_severity_count * 2.0) - (med_severity_count * 0.8), 1), 5.0)

        return FinanceOverviewResponse(
            total_campaign_funds=total_funds,
            total_campaign_expenses=total_exp,
            total_anomalies_flagged=len(all_anomalies),
            transparency_index_score=transparency_score,
            candidates_financials=candidates_fin,
            system_wide_anomalies=all_anomalies
        )

    @classmethod
    def get_candidate_finances(cls, candidate_id: str) -> Optional[CandidateFinancials]:
        raw_list = cls._load_data()
        for item in raw_list:
            if item["candidate_id"] == candidate_id:
                return CandidateFinancials(**item)
        return None

finance_service = FinanceService()