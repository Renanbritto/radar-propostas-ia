from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# Topic Schemas
class Topic(BaseModel):
    id: str
    name: str
    icon: str
    description: str

# Candidate Schemas
class ThemeScore(BaseModel):
    topic_id: str
    proposal_count: int
    emphasis_score: float # 0.0 to 10.0

class Candidate(BaseModel):
    id: str
    name: str
    ballot_name: str
    ballot_number: int
    party: str
    party_acronym: str
    coalition: Optional[str] = None
    role: str = "Prefeito / Governador / Presidente"
    photo_url: Optional[str] = None
    color: str = "#3B82F6"
    summary: str
    total_pages: int
    total_proposals: int
    plan_pdf_url: Optional[str] = None
    theme_distribution: Dict[str, int] = Field(default_factory=dict)
    key_highlights: List[str] = Field(default_factory=list)

# Citation Schema
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

# Proposal Chunk Schema
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

# Comparison Schemas
class CandidateComparisonDetail(BaseModel):
    candidate_id: str
    candidate_name: str
    party_acronym: str
    color: str
    summary_of_proposals: str
    key_proposals: List[str]
    quotes_with_citations: List[Citation]
    governance_style: str  # ex: "Foco em Parcerias Público-Privadas", "Investimento Estatal Direto"
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

# Chat Schemas
class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
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

# Quiz Schemas
class QuizOption(BaseModel):
    id: str
    text: str
    bias_scores: Dict[str, float]  # e.g., {"liberal": 0.8, "social_democrata": 0.2, "sustentavel": 0.9}

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
