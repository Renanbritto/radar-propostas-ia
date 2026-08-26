from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# ==========================================
# TOPIC & CANDIDATE SCHEMAS
# ==========================================
class Topic(BaseModel):
    id: str
    name: str
    icon: str
    description: str

class Candidate(BaseModel):
    id: str
    name: str
    ballot_name: str
    ballot_number: int
    party: str
    party_acronym: str
    coalition: Optional[str] = None
    role: str = "Prefeito"
    photo_url: Optional[str] = None
    color: str = "#3B82F6"
    summary: str
    total_pages: int
    total_proposals: int
    plan_pdf_url: Optional[str] = None
    theme_distribution: Dict[str, int] = Field(default_factory=dict)
    key_highlights: List[str] = Field(default_factory=list)

# ==========================================
# RAG & CITATIONS
# ==========================================
class Citation(BaseModel):
    candidate_id: str
    candidate_name: str
    party_acronym: str
    topic_id: str
    topic_name: str
    page_number: int
    excerpt: str
    section_title: Optional[str] = None
    relevance_score: float

class ProposalChunk(BaseModel):
    id: str
    candidate_id: str
    candidate_name: str
    party_acronym: str
    topic_id: str
    topic_name: str
    text: str
    page_number: int
    metadata: Dict[str, Any] = Field(default_factory=dict)

# ==========================================
# COMPARISON SCHEMAS
# ==========================================
class CandidateComparisonDetail(BaseModel):
    candidate_id: str
    candidate_name: str
    party_acronym: str
    color: str
    summary_of_proposals: str
    key_proposals: List[str]
    quotes_with_citations: List[Citation]
    governance_style: str
    funding_strategy: str

class CompareRequest(BaseModel):
    candidate_ids: List[str]
    topic_id: str

class CompareResponse(BaseModel):
    topic: Topic
    comparative_summary: str
    candidate_details: List[CandidateComparisonDetail]
    divergence_points: List[str]
    convergence_points: List[str]

# ==========================================
# CHAT RAG SCHEMAS
# ==========================================
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    candidate_id: Optional[str] = None
    topic_id: Optional[str] = None
    history: Optional[List[ChatMessage]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    answer: str
    citations: List[Citation]
    suggested_followups: List[str]
    searched_candidates: List[str]

# ==========================================
# QUIZ SCHEMAS
# ==========================================
class QuizOption(BaseModel):
    id: str
    text: str
    bias_scores: Dict[str, float]

class QuizQuestion(BaseModel):
    id: str
    topic_id: str
    topic_name: str
    question: str
    description: str
    options: List[QuizOption]

class QuizAnswerSubmission(BaseModel):
    question_id: str
    selected_option_id: str

class QuizSubmissionRequest(BaseModel):
    answers: List[QuizAnswerSubmission]

class TopicAffinity(BaseModel):
    topic_id: str
    topic_name: str
    match_percentage: float

class CandidateAffinityResult(BaseModel):
    candidate_id: str
    candidate_name: str
    party_acronym: str
    color: str
    overall_match_percentage: float
    topics_breakdown: List[TopicAffinity]
    matching_highlights: List[str]
    potential_divergences: List[str]

class QuizResultResponse(BaseModel):
    top_candidate: CandidateAffinityResult
    all_candidates: List[CandidateAffinityResult]
    user_ideological_profile: Dict[str, float]
    summary_analysis: str

# ==========================================
# INVESTIGAVOTO / FORENSIC FINANCE SCHEMAS
# ==========================================
class RevenueItem(BaseModel):
    source_type: str  # "Fundo Eleitoral / Partidário", "Doações Pessoas Físicas", "Recursos Próprios"
    amount: float
    percentage: float
    donor_count: int

class ExpenseCategoryItem(BaseModel):
    category: str  # "Marketing & Publicidade", "Serviços Gráficos & Impressos", "Produção de Vídeo", "Comícios & Eventos", "Transporte & Logística", "Consultoria Jurídica / Contábil"
    amount: float
    percentage: float

class SupplierItem(BaseModel):
    id: str
    name: str
    cnpj: str
    service_type: str
    total_received: float
    percentage_of_candidate_budget: float
    creation_date: str
    is_recently_created: bool  # Flag forense: aberta a < 6 meses da eleição
    risk_level: str  # "Normal", "Médio", "Alto"
    notes: Optional[str] = None

class FinancialAnomaly(BaseModel):
    id: str
    candidate_id: str
    candidate_name: str
    party_acronym: str
    anomaly_type: str  # "Alta Concentração de Fornecedor", "Fornecedor Recém-Criado", "Discrepância Promessa vs Gasto", "Despesa Desproporcional"
    severity: str  # "Alta", "Média", "Informativa"
    description: str
    financial_impact: float
    audit_recommendation: str

class CandidateFinancials(BaseModel):
    candidate_id: str
    candidate_name: str
    party_acronym: str
    color: str
    total_revenue: float
    total_expenses: float
    spending_limit: float
    budget_execution_percentage: float
    revenue_breakdown: List[RevenueItem]
    expense_breakdown: List[ExpenseCategoryItem]
    top_suppliers: List[SupplierItem]
    anomalies: List[FinancialAnomaly]
    promise_vs_spending_insight: str

class FinanceOverviewResponse(BaseModel):
    total_campaign_funds: float
    total_campaign_expenses: float
    total_anomalies_flagged: int
    transparency_index_score: float # 0.0 to 10.0
    candidates_financials: List[CandidateFinancials]
    system_wide_anomalies: List[FinancialAnomaly]