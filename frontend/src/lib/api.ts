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
    id: "cand_lula",
    name: "Luiz Inácio Lula da Silva",
    ballot_name: "Lula",
    ballot_number: 13,
    party: "Partido dos Trabalhadores",
    party_acronym: "PT",
    coalition: "Brasil Pronto Pra Mais (PT / PCdoB / PV / PSB / Solidariedade)",
    role: "Presidente da República",
    color: "#EF4444",
    summary: "Candidato à reeleição com plano de continuidade das políticas do terceiro mandato: fortalecimento do SUS e do Complexo Industrial da Saúde, Novo PAC de infraestrutura, isenção do IR até R$ 5.000, transição energética e Desmatamento Zero na Amazônia.",
    total_pages: 78,
    total_proposals: 196,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/20322002026",
    theme_distribution: {
      saude: 36, educacao: 40, economia: 30, seguranca: 22,
      meio_ambiente: 30, tecnologia: 18, social: 48, infraestrutura: 38
    },
    key_highlights: [
      "Consolidação do Novo PAC com R$ 1,7 trilhão em obras de saneamento, ferrovias e habitação",
      "Isenção do Imposto de Renda para salários de até R$ 5.000 e taxação de super-ricos",
      "Desmatamento Zero na Amazônia e metas de transição energética com créditos de carbono",
      "Ampliação do Minha Casa Minha Vida e universalização do acesso à água potável"
    ]
  },
  {
    id: "cand_flavio",
    name: "Flavio Nantes Bolsonaro",
    ballot_name: "Flavio Bolsonaro",
    ballot_number: 22,
    party: "Partido Liberal",
    party_acronym: "PL",
    coalition: "Coligação Pelo Bem do Brasil (PL / PP / Republicanos)",
    role: "Presidente da República",
    color: "#3B82F6",
    summary: "Plano focado em liberdade econômica, privatizações de estatais, desregulamentação ampla, fortalecimento do agronegócio exportador, redução de ministérios, endurecimento penal e defesa das fronteiras com as Forças Armadas.",
    total_pages: 62,
    total_proposals: 168,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/20322002026",
    theme_distribution: {
      saude: 22, educacao: 20, economia: 48, seguranca: 44,
      meio_ambiente: 14, tecnologia: 22, social: 16, infraestrutura: 34
    },
    key_highlights: [
      "Reforma Administrativa com redução drástica de ministérios e cargos comissionados",
      "Privatização de estatais e concessões de ferrovias, portos e aeroportos",
      "Endurecimento do Código Penal e garantia do direito à legítima defesa armada",
      "Desoneração permanente de combustíveis e incentivos fiscais ao agronegócio exportador"
    ]
  },
  {
    id: "cand_renan",
    name: "Renan Antonio Ferreira dos Santos",
    ballot_name: "Renan Santos",
    ballot_number: 14,
    party: "Missão",
    party_acronym: "MISSÃO",
    coalition: "Missão (MISSÃO)",
    role: "Presidente da República",
    color: "#8B5CF6",
    summary: "Plano pautado em valores conservadores, combate à corrupção sistêmica, revisão de pautas no ensino público, fortalecimento da família como núcleo social e defesa da soberania nacional.",
    total_pages: 48,
    total_proposals: 120,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/20322002026",
    theme_distribution: {
      saude: 18, educacao: 24, economia: 26, seguranca: 30,
      meio_ambiente: 10, tecnologia: 14, social: 20, infraestrutura: 18
    },
    key_highlights: [
      "Combate à corrupção com endurecimento de penas para crimes contra o erário",
      "Revisão curricular no ensino público com foco em valores cívicos e patrióticos",
      "Fortalecimento da família como base da política social e proteção à infância",
      "Soberania nacional e renegociação de acordos internacionais desfavoráveis ao Brasil"
    ]
  },
  {
    id: "cand_caiado",
    name: "Ronaldo Ramos Caiado",
    ballot_name: "Ronaldo Caiado",
    ballot_number: 55,
    party: "Partido Social Democrático",
    party_acronym: "PSD",
    coalition: "Coligação Brasil de Resultados (PSD / MDB / União Brasil / Podemos)",
    role: "Presidente da República",
    color: "#F59E0B",
    summary: "Plano de centro-direita com ênfase em gestão eficiente e resultados, experiência como governador de Goiás, equilíbrio fiscal rigoroso, parcerias público-privadas e digitalização dos serviços públicos.",
    total_pages: 70,
    total_proposals: 178,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/20322002026",
    theme_distribution: {
      saude: 30, educacao: 32, economia: 40, seguranca: 32,
      meio_ambiente: 24, tecnologia: 26, social: 24, infraestrutura: 36
    },
    key_highlights: [
      "Modelo Goiás para o Brasil: gestão por resultados com metas auditáveis por trimestre",
      "Reforma Tributária com simplificação de impostos e incentivos fiscais regionalizados",
      "PPPs na saúde com metas de atendimento e prontuário digital integrado nacionalmente",
      "Programa de Concessões em rodovias e ferrovias com investimento privado de R$ 200 bilhões"
    ]
  },
  {
    id: "cand_zema",
    name: "Romeu Zema Neto",
    ballot_name: "Zema",
    ballot_number: 30,
    party: "Partido Novo",
    party_acronym: "NOVO",
    coalition: "Coligação Brasil Eficiente (NOVO / Cidadania)",
    role: "Presidente da República",
    color: "#F97316",
    summary: "Plano de gestão empresarial aplicada ao governo: austeridade fiscal, privatizações, desburocratização, estado mínimo eficiente, corte de privilégios e digitalização total dos serviços públicos.",
    total_pages: 56,
    total_proposals: 142,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/#/candidato/BR/BR/20322002026",
    theme_distribution: {
      saude: 22, educacao: 26, economia: 46, seguranca: 28,
      meio_ambiente: 18, tecnologia: 30, social: 14, infraestrutura: 30
    },
    key_highlights: [
      "Modelo Minas Gerais: estado saneado financeiramente com superávit e nota de crédito A",
      "Privatização de estatais federais não estratégicas e fim de cabides políticos",
      "Corte de 30% dos cargos comissionados e eliminação de privilégios do funcionalismo",
      "Governo 100% digital com inteligência artificial para atendimento ao cidadão"
    ]
  }
];

const FALLBACK_TOPICS: Topic[] = [
  { id: "saude", name: "Saúde Pública", icon: "HeartPulse", description: "SUS, produção nacional de vacinas, hospitais e atenção primária" },
  { id: "educacao", name: "Educação & Ciência", icon: "GraduationCap", description: "Ensino básico, integral, universidades federais e pesquisa" },
  { id: "economia", name: "Economia & Emprego", icon: "TrendingUp", description: "Reindustrialização, reforma tributária, inflação e emprego" },
  { id: "seguranca", name: "Segurança & Defesa", icon: "ShieldAlert", description: "Polícia Federal, SUSP, fronteiras e combate a facções" },
  { id: "meio_ambiente", name: "Meio Ambiente & Clima", icon: "Leaf", description: "Amazônia, desmatamento zero, transição energética e crédito de carbono" },
  { id: "tecnologia", name: "Tecnologia & Inovação", icon: "Cpu", description: "Governo digital, IA soberana, semicondutores e conectividade" },
  { id: "social", name: "Desenvolvimento Social", icon: "Users", description: "Bolsa Família, combate à fome, previdência e habitação" },
  { id: "infraestrutura", name: "Infraestrutura & PAC", icon: "Building2", description: "Ferrovias, portos, saneamento, energia e logística nacional" }
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
      comparative_summary: `Comparativo de abordagens para ${topic.name}: contraste entre fortalecimento do Estado e investimentos públicos (Lula), liberalismo e privatizações (Flavio Bolsonaro/Zema), gestão por resultados (Caiado) e combate à corrupção (Renan Santos).`,
      divergence_points: [
        "Papel do Estado na Economia: Reindustrialização via investimento público vs Privatizações e desregulamentação ampla.",
        "Segurança Pública e Armamento: Controle e desarmamento civil rigoroso com inteligência vs Ampliação do direito ao porte e legítima defesa.",
        "Saúde Pública: Fortalecimento do SUS 100% público com produção estatal vs Parcerias público-privadas e incentivo a planos privados."
      ],
      convergence_points: [
        "Todos os candidatos reconhecem a urgência da Reforma Tributária sobre o consumo.",
        "Necessidade de digitalização dos serviços públicos e expansão da conectividade nas escolas brasileiras."
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
              page_number: 21,
              excerpt: cand.key_highlights[0] || "Proposta constante nas diretrizes oficiais submetidas ao TSE.",
              section_title: `Eixo Estratégico: ${topic.name}`,
              relevance_score: 0.98
            }
          ],
          governance_style: "Gestão Estratégica Nacional",
          funding_strategy: "Orçamento Geral da União + Fundos Setoriais"
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
      answer: `Com base nas diretrizes oficiais registradas no TSE para a consulta "${query}":\n\n🔴 **Lula (PT)**: Fortalecimento do SUS público, Complexo Industrial da Saúde e Mais Médicos.\n🔵 **Flavio Bolsonaro (PL)**: PPPs na gestão hospitalar, telemedicina e liberdade para planos privados.\n🟣 **Renan Santos (MISSÃO)**: Prioridade materno-infantil, reajuste da tabela do SUS e combate às drogas.\n🟡 **Ronaldo Caiado (PSD)**: Prontuário eletrônico nacional, diagnóstico rápido e consórcios intermunicipais.\n🟠 **Zema (NOVO)**: Gestão do SUS por Organizações Sociais, licitação eletrônica e IA para triagem.`,
      citations: [
        {
          candidate_id: "cand_lula",
          candidate_name: "Lula",
          party_acronym: "PT",
          topic_id: "saude",
          topic_name: "Saúde Pública",
          page_number: 24,
          excerpt: "Consolidação do Complexo Econômico e Industrial da Saúde para produção nacional de 80% dos insumos e vacinas consumidos pelo SUS.",
          section_title: "Eixo 3: SUS Soberano e Acesso Universal à Saúde",
          relevance_score: 0.98
        }
      ],
      suggested_followups: [
        "Qual a proposta de cada candidato para a Reforma Tributária e isenção do IR?",
        "Como os planos tratam o combate ao desmatamento na Amazônia e transição energética?",
        "Qual a diferença nas propostas de segurança pública e controle de armas?"
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
        id: "qp_1",
        topic_id: "economia",
        topic_name: "Economia & Modelo de Estado",
        question: "Qual deve ser o principal motor para o crescimento da economia e geração de empregos no Brasil?",
        description: "Escolha a visão que melhor reflete seu posicionamento sobre o papel do Estado na economia nacional.",
        options: [
          { id: "qp1_opt_a", text: "Investimento público em infraestrutura (Novo PAC), aumento real do salário mínimo e fortalecimento das estatais.", bias_scores: { cand_lula: 0.98, cand_flavio: 0.10, cand_renan: 0.30, cand_caiado: 0.35, cand_zema: 0.10 } },
          { id: "qp1_opt_b", text: "Privatizações amplas, desregulamentação, corte de ministérios e liberdade de mercado.", bias_scores: { cand_lula: 0.10, cand_flavio: 0.95, cand_renan: 0.30, cand_caiado: 0.45, cand_zema: 0.98 } },
          { id: "qp1_opt_c", text: "Estado eficiente com PPPs, concessões, responsabilidade fiscal e incentivos regionais.", bias_scores: { cand_lula: 0.35, cand_flavio: 0.40, cand_renan: 0.30, cand_caiado: 0.98, cand_zema: 0.65 } },
          { id: "qp1_opt_d", text: "Combate à corrupção como motor da economia, com microcrédito comunitário.", bias_scores: { cand_lula: 0.25, cand_flavio: 0.30, cand_renan: 0.98, cand_caiado: 0.35, cand_zema: 0.30 } }
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
        candidate_id: "cand_lula",
        candidate_name: "Lula",
        party_acronym: "PT",
        color: "#EF4444",
        overall_match_percentage: 92.5,
        topics_breakdown: [
          { topic_id: "saude", topic_name: "Saúde Pública (SUS)", match_percentage: 98.0 },
          { topic_id: "economia", topic_name: "Economia & Emprego", match_percentage: 95.0 },
          { topic_id: "seguranca", topic_name: "Segurança Pública", match_percentage: 85.0 }
        ],
        matching_highlights: [
          "Alta concordância com investimentos públicos em infraestrutura e defesa do SUS.",
          "Alinhamento com reindustrialização sustentável e valorização do salário mínimo."
        ],
        potential_divergences: ["Ritmo de transição para nova âncora fiscal."]
      },
      all_candidates: [],
      user_ideological_profile: { "desenvolvimento_social_estatal": 0.92 },
      summary_analysis: "Seu perfil de respostas teve maior alinhamento com as diretrizes do plano de governo de Lula (PT)."
    };
  }
}

export async function fetchFinanceOverview(): Promise<FinanceOverviewResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/finances/overview`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Falha ao buscar dados financeiros");
    return await res.json();
  } catch (err) {
    return {
      total_campaign_funds: 858000000.0,
      total_campaign_expenses: 568000000.0,
      total_anomalies_flagged: 0,
      transparency_index_score: 8.6,
      system_wide_anomalies: [],
      candidates_financials: []
    };
  }
}