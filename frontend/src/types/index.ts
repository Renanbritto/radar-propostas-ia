export interface Candidate {
  id: string;
  name: string;
  ballot_name: string;
  ballot_number: number;
  party: string;
  party_acronym: string;
  coalition?: string;
  role: string;
  photo_url?: string;
  color: string;
  summary: string;
  total_pages: number;
  total_proposals: number;
  plan_pdf_url?: string;
  theme_distribution: Record<string, number>;
  key_highlights: string[];
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Citation {
  candidate_id: string;
  candidate_name: string;
  party_acronym: string;
  topic_id: string;
  topic_name: string;
  page_number: number;
  excerpt: string;
  section_title?: string;
  relevance_score: number;
}

export interface CandidateComparisonDetail {
  candidate_id: string;
  candidate_name: string;
  party_acronym: string;
  color: string;
  summary_of_proposals: string;
  key_proposals: string[];
  quotes_with_citations: Citation[];
  governance_style: string;
  funding_strategy: string;
}

export interface CompareResponse {
  topic: Topic;
  comparative_summary: string;
  candidate_details: CandidateComparisonDetail[];
  divergence_points: string[];
  convergence_points: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: Citation[];
  suggested_followups?: string[];
  timestamp: string;
}

export interface QuizOption {
  id: string;
  text: string;
  bias_scores: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  topic_id: string;
  topic_name: string;
  question: string;
  description: string;
  options: QuizOption[];
}

export interface TopicAffinity {
  topic_id: string;
  topic_name: string;
  match_percentage: number;
}

export interface CandidateAffinityResult {
  candidate_id: string;
  candidate_name: string;
  party_acronym: string;
  color: string;
  overall_match_percentage: number;
  topics_breakdown: TopicAffinity[];
  matching_highlights: string[];
  potential_divergences: string[];
}

export interface QuizResultResponse {
  top_candidate: CandidateAffinityResult;
  all_candidates: CandidateAffinityResult[];
  user_ideological_profile: Record<string, number>;
  summary_analysis: string;
}

// ==========================================
// INVESTIGAVOTO / FINANCIAL SCHEMAS
// ==========================================
export interface RevenueItem {
  source_type: string;
  amount: number;
  percentage: number;
  donor_count: number;
}

export interface ExpenseCategoryItem {
  category: string;
  amount: number;
  percentage: number;
}

export interface SupplierItem {
  id: string;
  name: string;
  cnpj: string;
  service_type: string;
  total_received: number;
  percentage_of_candidate_budget: number;
  creation_date: string;
  is_recently_created: boolean;
  risk_level: "Normal" | "Média" | "Alto";
  notes?: string;
}

export interface FinancialAnomaly {
  id: string;
  candidate_id: string;
  candidate_name: string;
  party_acronym: string;
  anomaly_type: string;
  severity: "Alta" | "Média" | "Informativa";
  description: string;
  financial_impact: number;
  audit_recommendation: string;
}

export interface CandidateFinancials {
  candidate_id: string;
  candidate_name: string;
  party_acronym: string;
  color: string;
  total_revenue: number;
  total_expenses: number;
  spending_limit: number;
  budget_execution_percentage: number;
  revenue_breakdown: RevenueItem[];
  expense_breakdown: ExpenseCategoryItem[];
  top_suppliers: SupplierItem[];
  anomalies: FinancialAnomaly[];
  promise_vs_spending_insight: string;
}

export interface FinanceOverviewResponse {
  total_campaign_funds: number;
  total_campaign_expenses: number;
  total_anomalies_flagged: number;
  transparency_index_score: number;
  candidates_financials: CandidateFinancials[];
  system_wide_anomalies: FinancialAnomaly[];
}
