import {
  Candidate,
  Topic,
  CompareResponse,
  QuizQuestion,
  QuizResultResponse,
  FinanceOverviewResponse,
  CandidateFinancials
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

const FALLBACK_CANDIDATES: Candidate[] = [
  {
    id: "cand_1",
    name: "Helena Silveira",
    ballot_name: "Helena Silveira",
    ballot_number: 45,
    party: "Partido da Inovação & Sustentabilidade",
    party_acronym: "PIS",
    coalition: "Aliança por um Futuro Verde e Digital",
    role: "Prefeita",
    color: "#10B981",
    summary: "Proposta centrada em sustentabilidade urbana, modernização digital dos serviços públicos e fortalecimento da atenção primária em saúde com telemedicina.",
    total_pages: 48,
    total_proposals: 124,
    theme_distribution: {
      saude: 26,
      educacao: 22,
      economia: 18,
      seguranca: 14,
      meio_ambiente: 30,
      tecnologia: 24,
      social: 16,
      infraestrutura: 18
    },
    key_highlights: [
      "Criação de 15 Clínicas da Família 100% integradas com telemedicina 24h",
      "Eletrificação de 60% da frota de ônibus municipais até o 3º ano de gestão",
      "Polo de Tecnologia Verde com isenção fiscal para startups de impacto",
      "Implementação de Guarda Civil Comunitária orientada por dados preditivos"
    ]
  },
  {
    id: "cand_2",
    name: "Marcus Vinicius Ramos",
    ballot_name: "Marcus Ramos",
    ballot_number: 22,
    party: "Partido Liberal Renovador",
    party_acronym: "PLR",
    coalition: "União pelo Progresso e Segurança",
    role: "Prefeito",
    color: "#3B82F6",
    summary: "Plano focado em desregulamentação econômica, atração de capital privado através de PPPs, tolerância zero na segurança pública e eficiência fiscal.",
    total_pages: 52,
    total_proposals: 138,
    theme_distribution: {
      saude: 20,
      educacao: 18,
      economia: 32,
      seguranca: 28,
      meio_ambiente: 12,
      tecnologia: 16,
      social: 14,
      infraestrutura: 26
    },
    key_highlights: [
      "Redução da alíquota do ISS para 2% para atrair centros de tecnologia e serviços",
      "Concessão à iniciativa privada da gestão de 100% dos hospitais municipais",
      "Muralha Digital com 5.000 câmeras de reconhecimento facial e IA",
      "Vouchers de ensino privado para zerar a fila de creches municipais em 180 dias"
    ]
  },
  {
    id: "cand_3",
    name: "Clarice Monteiro",
    ballot_name: "Clarice Monteiro",
    ballot_number: 13,
    party: "Partido dos Trabalhadores e Direitos",
    party_acronym: "PTD",
    coalition: "Frente Popular da Cidadania",
    role: "Prefeita",
    color: "#EF4444",
    summary: "Plano focado em combate à desigualdade, investimento estatal em infraestrutura de periferia, ampliação de creches públicas e orçamento participativo.",
    total_pages: 60,
    total_proposals: 156,
    theme_distribution: {
      saude: 28,
      educacao: 30,
      economia: 20,
      seguranca: 16,
      meio_ambiente: 22,
      tecnologia: 14,
      social: 34,
      infraestrutura: 24
    },
    key_highlights: [
      "Tarifa Zero progressiva no transporte público iniciando por fins de semana e estudantes",
      "Programa 'Bairro Digno' com urbanização de 12 comunidades e saneamento 100%",
      "Duplicação do piso salarial dos professores da rede municipal em 4 anos",
      "Rede Municipal de Restaurantes Populares 'Prato do Povo' a R$ 2,00"
    ]
  }
];

const FALLBACK_TOPICS: Topic[] = [
  { id: "saude", name: "Saúde Pública", icon: "HeartPulse", description: "SUS, telemedicina, hospitais, vacinação e atenção primária" },
  { id: "educacao", name: "Educação & Ciência", icon: "GraduationCap", description: "Ensino básico, integral, creches e valorização docente" },
  { id: "economia", name: "Economia & Emprego", icon: "TrendingUp", description: "Geração de renda, impostos, desregulamentação e microcrédito" },
  { id: "seguranca", name: "Segurança Pública", icon: "ShieldAlert", description: "Policiamento, inteligência, câmeras e prevenção social" },
  { id: "meio_ambiente", name: "Meio Ambiente & Clima", icon: "Leaf", description: "Sustentabilidade, transição energética e resiliência a enchentes" },
  { id: "tecnologia", name: "Tecnologia & Inovação", icon: "Cpu", description: "Governo digital, conectividade e apoio a startups" }
];

export async function fetchCandidates(): Promise<Candidate[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/candidates`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Falha ao buscar candidatos");
    return await res.json();
  } catch (err) {
    return FALLBACK_CANDIDATES;
  }
}

export async function fetchTopics(): Promise<Topic[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/candidates/topics`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Falha ao buscar tópicos");
    return await res.json();
  } catch (err) {
    return FALLBACK_TOPICS;
  }
}

export async function compareCandidates(candidateIds: string[], topicId: string): Promise<CompareResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/compare`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ candidate_ids: candidateIds, topic_id: topicId })
    });
    if (!res.ok) throw new Error("Falha na requisição de comparação");
    return await res.json();
  } catch (err) {
    const topic = FALLBACK_TOPICS.find(t => t.id === topicId) || FALLBACK_TOPICS[0];
    return {
      topic,
      comparative_summary: `Comparativo de abordagens para ${topic.name}: contraste claro entre modelos de gestão pública direta, incentivo a parcerias privadas e inovação digital sustentável.`,
      divergence_points: [
        "Gestão direta do serviço público vs Concessões e Organizações Sociais (OSS).",
        "Investimento estatal financiado pelo orçamento vs Atração de capital privado por desregulamentação.",
        "Tecnologia aplicada à prevenção vs Ampliação de efetivo policial e infraestrutura física."
      ],
      convergence_points: [
        "Reconhecimento prioritário de gargalos estruturais nas áreas periféricas da cidade.",
        "Necessidade urgente de digitalização e transparência na prestação de contas dos serviços públicos."
      ],
      candidate_details: candidateIds.map(id => {
        const cand = FALLBACK_CANDIDATES.find(c => c.id === id) || FALLBACK_CANDIDATES[0];
        return {
          candidate_id: cand.id,
          candidate_name: cand.name,
          party_acronym: cand.party_acronym,
          color: cand.color,
          summary_of_proposals: cand.summary,
          key_proposals: cand.key_highlights,
          quotes_with_citations: [
            {
              candidate_id: cand.id,
              candidate_name: cand.name,
              party_acronym: cand.party_acronym,
              topic_id: topic.id,
              topic_name: topic.name,
              page_number: 14,
              excerpt: cand.key_highlights[0] || "Proposta constante no plano de diretrizes oficial.",
              section_title: `Eixo Estratégico: ${topic.name}`,
              relevance_score: 0.95
            }
          ],
          governance_style: "Gestão Estratégica & Resultados",
          funding_strategy: "Orçamento Municipal + Fundos Setoriais"
        };
      })
    };
  }
}

export async function askRAGChat(query: string, candidateId?: string, topicId?: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, candidate_id: candidateId, topic_id: topicId })
    });
    if (!res.ok) throw new Error("Erro na consulta RAG");
    return await res.json();
  } catch (err) {
    return {
      answer: `Com base nos planos de governo cadastrados para a consulta "${query}":\n\n📌 **Helena Silveira (PIS)** foca em telemedicina, digitalização e escolas sustentáveis.\n📌 **Marcus Ramos (PLR)** foca em parcerias público-privadas, vouchers e desregulamentação.\n📌 **Clarice Monteiro (PTD)** propõe ampliação direta do SUS, concurso público e tarifa zero progressiva.`,
      citations: [
        {
          candidate_id: "cand_1",
          candidate_name: "Helena Silveira",
          party_acronym: "PIS",
          topic_id: "saude",
          topic_name: "Saúde Pública",
          page_number: 12,
          excerpt: "Implementação do Programa Saúde Conectada com telemedicina 24h e integração de todas as UBSs.",
          section_title: "Eixo 1: Saúde Integral",
          relevance_score: 0.94
        }
      ],
      suggested_followups: [
        "Quais as propostas para a educação infantil e creches?",
        "Qual o modelo de segurança pública proposto pelos candidatos?"
      ],
      searched_candidates: ["Todos"]
    };
  }
}

export async function fetchQuizQuestions(): Promise<QuizQuestion[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/quiz/questions`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Erro ao buscar perguntas do Quiz");
    return await res.json();
  } catch (err) {
    return [
      {
        id: "q1",
        topic_id: "saude",
        topic_name: "Saúde Pública",
        question: "Qual estratégia você considera prioritária para acabar com as filas no SUS municipal?",
        description: "Escolha o modelo de gestão e atendimento que mais reflete suas prioridades.",
        options: [
          { id: "q1_opt_a", text: "Investir fortemente em telemedicina 24h, digitalização e atenção primária nas UBSs.", bias_scores: { cand_1: 0.95, cand_2: 0.50, cand_3: 0.30 } },
          { id: "q1_opt_b", text: "Fazer Parcerias Público-Privadas (PPPs) e contratar capacidade ociosa de clínicas privadas (Corujão).", bias_scores: { cand_1: 0.35, cand_2: 0.98, cand_3: 0.10 } },
          { id: "q1_opt_c", text: "Expandir o SUS 100% público e estatal com concurso público para médicos e agentes comunitários.", bias_scores: { cand_1: 0.40, cand_2: 0.15, cand_3: 0.95 } }
        ]
      }
    ];
  }
}

export async function submitQuizAnswers(answers: { question_id: string; selected_option_id: string }[]): Promise<QuizResultResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/quiz/match`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers })
    });
    if (!res.ok) throw new Error("Erro ao calcular afinidade");
    return await res.json();
  } catch (err) {
    return {
      top_candidate: {
        candidate_id: "cand_1",
        candidate_name: "Helena Silveira",
        party_acronym: "PIS",
        color: "#10B981",
        overall_match_percentage: 88.5,
        topics_breakdown: [
          { topic_id: "saude", topic_name: "Saúde Pública", match_percentage: 95.0 },
          { topic_id: "educacao", topic_name: "Educação & Ciência", match_percentage: 85.0 },
          { topic_id: "economia", topic_name: "Economia & Emprego", match_percentage: 80.0 }
        ],
        matching_highlights: [
          "Alta concordância com inovação tecnológica em serviços essenciais.",
          "Priorização de sustentabilidade e eficiência na atenção básica."
        ],
        potential_divergences: ["Ritmo de transição para modelo sustentável."]
      },
      all_candidates: [],
      user_ideological_profile: { "inovacao_sustentabilidade": 0.88 },
      summary_analysis: "Seu perfil indicou alta afinidade com propostas orientadas à modernização digital e sustentabilidade urbana."
    };
  }
}

// ==========================================
// INVESTIGAVOTO API CALLS
// ==========================================
export async function fetchFinanceOverview(): Promise<FinanceOverviewResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/finances/overview`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Falha ao buscar dados financeiros");
    return await res.json();
  } catch (err) {
    return {
      total_campaign_funds: 12250000.0,
      total_campaign_expenses: 11620000.0,
      total_anomalies_flagged: 3,
      transparency_index_score: 7.2,
      system_wide_anomalies: [
        {
          id: "anom_2",
          candidate_id: "cand_2",
          candidate_name: "Marcus Vinicius Ramos",
          party_acronym: "PLR",
          anomaly_type: "Alta Concentração em Fornecedor Recém-Criado",
          severity: "Alta",
          description: "O fornecedor 'Alpha Prime Produções' foi constituído em março de 2024 e recebeu R$ 2.150.000,00 (45.5% do orçamento total da campanha).",
          financial_impact: 2150000.0,
          audit_recommendation: "Auditoria de capacidade operacional instalada e eventual vínculo societário."
        },
        {
          id: "anom_1",
          candidate_id: "cand_1",
          candidate_name: "Helena Silveira",
          party_acronym: "PIS",
          anomaly_type: "Fornecedor Recém-Criado",
          severity: "Média",
          description: "Contratação de R$ 340.000,00 da 'Gráfica Verde Papéis', aberta em fevereiro de 2024 (5 meses antes da eleição).",
          financial_impact: 340000.0,
          audit_recommendation: "Verificar notas fiscais de compra de papel reciclado e maquinário."
        },
        {
          id: "anom_3",
          candidate_id: "cand_3",
          candidate_name: "Clarice Monteiro",
          party_acronym: "PTD",
          anomaly_type: "Volume Elevado de Pagamento Direto de Pessoal",
          severity: "Informativa",
          description: "Despesas com mobilizadores somam 43.6% do orçamento com mais de 350 recibos individuais emitidos.",
          financial_impact: 1650000.0,
          audit_recommendation: "Conferência por amostragem dos termos de prestação de serviço de militância."
        }
      ],
      candidates_financials: [
        {
          candidate_id: "cand_1",
          candidate_name: "Helena Silveira",
          party_acronym: "PIS",
          color: "#10B981",
          total_revenue: 3450000.0,
          total_expenses: 3120000.0,
          spending_limit: 5000000.0,
          budget_execution_percentage: 62.4,
          revenue_breakdown: [
            { source_type: "Fundo Eleitoral (FEFC)", amount: 2600000.0, percentage: 75.36, donor_count: 1 },
            { source_type: "Doações Pessoas Físicas", amount: 750000.0, percentage: 21.74, donor_count: 1420 },
            { source_type: "Recursos Próprios", amount: 100000.0, percentage: 2.90, donor_count: 1 }
          ],
          expense_breakdown: [
            { category: "Marketing Digital & Mídias", amount: 1150000.0, percentage: 36.86 },
            { category: "Produção de TV e Vídeos", amount: 820000.0, percentage: 26.28 },
            { category: "Militância de Rua", amount: 540000.0, percentage: 17.31 },
            { category: "Material Gráfico Sustentável", amount: 360000.0, percentage: 11.54 },
            { category: "Assessoria Jurídica / Contábil", amount: 250000.0, percentage: 8.01 }
          ],
          top_suppliers: [
            {
              id: "sup_1_1",
              name: "EcoDigital Estratégia e Mídia Ltda",
              cnpj: "34.567.890/0001-12",
              service_type: "Gestão de Tráfego e Redes Sociais",
              total_received: 950000.0,
              percentage_of_candidate_budget: 30.45,
              creation_date: "2021-03-15",
              is_recently_created: false,
              risk_level: "Normal"
            },
            {
              id: "sup_1_3",
              name: "Gráfica Verde Papéis Ecológicos Eireli",
              cnpj: "41.987.654/0001-33",
              service_type: "Impressão de Folhetos e Santinhos Reciclados",
              total_received: 340000.0,
              percentage_of_candidate_budget: 10.90,
              creation_date: "2024-02-10",
              is_recently_created: true,
              risk_level: "Médio"
            }
          ],
          anomalies: [],
          promise_vs_spending_insight: "A candidata dedica 30% do seu plano ao Meio Ambiente e alocou 11.5% do orçamento em gráficas sustentáveis com papel reciclado."
        },
        {
          candidate_id: "cand_2",
          candidate_name: "Marcus Vinicius Ramos",
          party_acronym: "PLR",
          color: "#3B82F6",
          total_revenue: 4850000.0,
          total_expenses: 4720000.0,
          spending_limit: 5000000.0,
          budget_execution_percentage: 94.4,
          revenue_breakdown: [
            { source_type: "Fundo Eleitoral (FEFC)", amount: 3200000.0, percentage: 65.98, donor_count: 1 },
            { source_type: "Grandes Doações Empresariais (PF)", amount: 1450000.0, percentage: 29.90, donor_count: 48 },
            { source_type: "Recursos Próprios", amount: 200000.0, percentage: 4.12, donor_count: 1 }
          ],
          expense_breakdown: [
            { category: "Produção de TV e Vídeos", amount: 2150000.0, percentage: 45.55 },
            { category: "Marketing Digital & Tráfego", amount: 1200000.0, percentage: 25.42 },
            { category: "Pesquisas de Opinião Pública", amount: 620000.0, percentage: 13.14 },
            { category: "Veículos Blindados & Logística", amount: 450000.0, percentage: 9.53 },
            { category: "Material Gráfico", amount: 300000.0, percentage: 6.36 }
          ],
          top_suppliers: [
            {
              id: "sup_2_1",
              name: "Alpha Prime Produções e Comunicação",
              cnpj: "48.765.432/0001-88",
              service_type: "Produção Audiovisual e Estratégia de TV",
              total_received: 2150000.0,
              percentage_of_candidate_budget: 45.55,
              creation_date: "2024-03-01",
              is_recently_created: true,
              risk_level: "Alto"
            }
          ],
          anomalies: [],
          promise_vs_spending_insight: "O plano defende 'Eficiência Fiscal e Redução de Custos', mas a campanha executou 94.4% do teto máximo de gastos permitido."
        },
        {
          candidate_id: "cand_3",
          candidate_name: "Clarice Monteiro",
          party_acronym: "PTD",
          color: "#EF4444",
          total_revenue: 3950000.0,
          total_expenses: 3780000.0,
          spending_limit: 5000000.0,
          budget_execution_percentage: 75.6,
          revenue_breakdown: [
            { source_type: "Fundo Eleitoral (FEFC)", amount: 3400000.0, percentage: 86.08, donor_count: 1 },
            { source_type: "Doações de Militantes (PF)", amount: 510000.0, percentage: 12.91, donor_count: 2890 },
            { source_type: "Recursos Próprios", amount: 40000.0, percentage: 1.01, donor_count: 1 }
          ],
          expense_breakdown: [
            { category: "Militância de Rua e Campo", amount: 1650000.0, percentage: 43.65 },
            { category: "Produção de TV e Vídeos", amount: 950000.0, percentage: 25.13 },
            { category: "Material Gráfico e Banners", amount: 580000.0, percentage: 15.34 },
            { category: "Comícios e Carros de Som", amount: 380000.0, percentage: 10.05 },
            { category: "Assessoria Jurídica e Contábil", amount: 220000.0, percentage: 5.82 }
          ],
          top_suppliers: [
            {
              id: "sup_3_1",
              name: "Cooperativa Popular de Comunicação",
              cnpj: "38.444.555/0001-02",
              service_type: "Mobilização de Rua e Produção de Jornais",
              total_received: 1120000.0,
              percentage_of_candidate_budget: 29.63,
              creation_date: "2018-06-14",
              is_recently_created: false,
              risk_level: "Normal"
            }
          ],
          anomalies: [],
          promise_vs_spending_insight: "A candidata prioriza 'Trabalho e Renda Popular' no plano e refletiu isso na campanha destinando 43.6% do orçamento para pagamento de equipes locais."
        }
      ]
    };
  }
}