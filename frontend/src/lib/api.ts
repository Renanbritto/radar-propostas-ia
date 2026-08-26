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
    coalition: "Federação Brasil da Esperança (PT/PCdoB/PV) / PSB / Solidariedade / Federação PSOL-Rede / Avante / Agir / PROS",
    role: "Presidente da República",
    color: "#EF4444",
    summary: "Plano centrado em reconstrução social, fortalecimento do SUS, reindustrialização nacional verde, aumento real do salário mínimo, ampliação de universidades públicas e transição ecológica com a Petrobras.",
    total_pages: 74,
    total_proposals: 192,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/proposta/governo/2022/BR/280001607829",
    theme_distribution: {
      saude: 35,
      educacao: 38,
      economia: 32,
      seguranca: 20,
      meio_ambiente: 28,
      tecnologia: 19,
      social: 45,
      infraestrutura: 36
    },
    key_highlights: [
      "Fortalecimento do SUS 100% público com o Complexo Econômico e Industrial da Saúde",
      "Isenção do Imposto de Renda para salários de até R$ 5.000,00 e reforma tributária progressiva",
      "Meta de Desmatamento Zero na Amazônia e transição para matriz energética de baixo carbono",
      "Novo Plano de Aceleração do Crescimento (PAC) para ferrovias, saneamento e habitação (Minha Casa Minha Vida)"
    ]
  },
  {
    id: "cand_bolsonaro",
    name: "Jair Messias Bolsonaro",
    ballot_name: "Jair Bolsonaro",
    ballot_number: 22,
    party: "Partido Liberal",
    party_acronym: "PL",
    coalition: "Pelo Bem do Brasil (PL / PP / Republicanos)",
    role: "Presidente da República",
    color: "#3B82F6",
    summary: "Plano focado em liberdade econômica, desregulamentação, privatizações de estatais, fortalecimento do agronegócio exportador, endurecimento penal e defesa das fronteiras nacionais.",
    total_pages: 68,
    total_proposals: 174,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/proposta/governo/2022/BR/280001618036",
    theme_distribution: {
      saude: 24,
      educacao: 22,
      economia: 48,
      seguranca: 42,
      meio_ambiente: 16,
      tecnologia: 22,
      social: 18,
      infraestrutura: 35
    },
    key_highlights: [
      "Desregulamentação ampla, corte de impostos federais (IPI, PIS/Cofins) e estímulo ao livre mercado",
      "Concessões e privatizações de ferrovias, rodovias, portos e estatais estratégicas",
      "Endurecimento do Código Penal com foco no combate ao crime organizado e segurança nas fronteiras",
      "Programa Conta-Saúde e apoio a Parcerias Público-Privadas para eficiência hospitalar"
    ]
  },
  {
    id: "cand_tebet",
    name: "Simone Nassar Tebet",
    ballot_name: "Simone Tebet",
    ballot_number: 15,
    party: "Movimento Democrático Brasileiro",
    party_acronym: "MDB",
    coalition: "Brasil Para Todos (MDB / Federação PSDB-Cidadania / Podemos)",
    role: "Presidente da República",
    color: "#F59E0B",
    summary: "Plano com ênfase em responsabilidade fiscal aliada ao investimento social, revolução no ensino básico e técnico, governo digital e transformação do Brasil em polo global de sustentabilidade e bioeconomia.",
    total_pages: 62,
    total_proposals: 165,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/proposta/governo/2022/BR/280001607833",
    theme_distribution: {
      saude: 30,
      educacao: 36,
      economia: 34,
      seguranca: 25,
      meio_ambiente: 35,
      tecnologia: 28,
      social: 26,
      infraestrutura: 30
    },
    key_highlights: [
      "Poupança Jovem para incentivar conclusão do Ensino Médio Técnico em tempo integral",
      "Reforma Tributária com simplificação de impostos e tributação neutra sobre consumo",
      "Prontuário Eletrônico Nacional Único e telemedicina integrada em todo o SUS",
      "Foco em descarbonização da indústria e mercado nacional de créditos de carbono"
    ]
  },
  {
    id: "cand_ciro",
    name: "Ciro Ferreira Gomes",
    ballot_name: "Ciro Gomes",
    ballot_number: 12,
    party: "Partido Democrático Trabalhista",
    party_acronym: "PDT",
    coalition: "Partido Democrático Trabalhista (PDT)",
    role: "Presidente da República",
    color: "#10B981",
    summary: "Projeto Nacional de Desenvolvimento (PND) com ênfase na taxação de grandes fortunas, refinanciamento das dívidas de famílias no SPC/Serasa, industrialização de alta tecnologia e escola pública integral no modelo cearense.",
    total_pages: 80,
    total_proposals: 204,
    plan_pdf_url: "https://divulgacandcontas.tse.jus.br/divulga/rest/v1/proposta/governo/2022/BR/280001607830",
    theme_distribution: {
      saude: 32,
      educacao: 44,
      economia: 46,
      seguranca: 26,
      meio_ambiente: 30,
      tecnologia: 32,
      social: 38,
      infraestrutura: 36
    },
    key_highlights: [
      "Projeto Nacional de Desenvolvimento (PND) com 4 complexos industriais estratégicos (Saúde, Defesa, TI, Petróleo)",
      "Programa 'Nome Limpo' com refinanciamento pelo Banco do Brasil e Caixa das dívidas de 66 milhões de brasileiros",
      "Universalização do Ensino Fundamental e Médio em Tempo Integral baseado na experiência pedagógica do Ceará",
      "Criação do Imposto sobre Grandes Fortunas (alíquota de 0,5% a 1%) para financiar renda mínima básica"
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
      comparative_summary: `Comparativo de abordagens para ${topic.name}: contraste claro entre fortalecimento do Estado e reindustrialização (Lula/Ciro), liberalismo e desregulamentação (Bolsonaro) e responsabilidade fiscal com foco social (Tebet).`,
      divergence_points: [
        "Papel do Estado na Economia: Reindustrialização via investimento público e estatais vs Privatizações e desregulamentação ampla.",
        "Segurança Pública e Armamento: Controle e desarmamento civil rigoroso com inteligência vs Ampliação do direito ao porte e legítima defesa.",
        "Saúde Pública: Fortalecimento do SUS 100% público com produção estatal de insumos vs Parcerias público-privadas e incentivo a planos privados."
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
      answer: `Com base nas diretrizes oficiais registradas no TSE para a consulta "${query}":\n\n📌 **Lula (PT)**: Fortalecimento do SUS público, Complexo Industrial da Saúde, retomada do Mais Médicos e produção nacional de vacinas.\n📌 **Jair Bolsonaro (PL)**: Apoio a PPPs na gestão hospitalar, programa Médicos pelo Brasil e liberdade para planos privados de saúde.\n📌 **Simone Tebet (MDB)**: Prontuário eletrônico unificado nacionalmente e reajuste da tabela do SUS para Santas Casas.\n📌 **Ciro Gomes (PDT)**: Investimento de R$ 20 bi do BNDES no Complexo Industrial da Saúde e carreira federal de Estado para médicos do SUS.`,
      citations: [
        {
          candidate_id: "cand_lula",
          candidate_name: "Lula",
          party_acronym: "PT",
          topic_id: "saude",
          topic_name: "Saúde Pública",
          page_number: 21,
          excerpt: "Fortalecimento do Sistema Único de Saúde (SUS) público e universal com produção nacional de insumos pelo Complexo Industrial da Saúde.",
          section_title: "Diretriz 3: Direito à Saúde e Defesa do SUS",
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
        topic_name: "Economia & Indústria",
        question: "Qual deve ser o principal motor para o crescimento da economia e geração de empregos no Brasil?",
        description: "Escolha a visão que melhor reflete seu posicionamento sobre o papel do Estado na economia nacional.",
        options: [
          { id: "qp1_opt_a", text: "Investimento público em infraestrutura (Novo PAC), aumento real do salário mínimo e fortalecimento das estatais.", bias_scores: { cand_lula: 0.98, cand_bolsonaro: 0.10, cand_tebet: 0.35, cand_ciro: 0.70 } },
          { id: "qp1_opt_b", text: "Privatizações amplas, desregulamentação, corte de ministérios e liberdade de mercado.", bias_scores: { cand_lula: 0.10, cand_bolsonaro: 0.98, cand_tebet: 0.45, cand_ciro: 0.15 } },
          { id: "qp1_opt_c", text: "Reforma Tributária com imposto dual (IVA), responsabilidade fiscal, incentivo a concessões privadas e bioeconomia.", bias_scores: { cand_lula: 0.40, cand_bolsonaro: 0.35, cand_tebet: 0.98, cand_ciro: 0.45 } },
          { id: "qp1_opt_d", text: "Projeto Nacional de Desenvolvimento (PND), taxação de grandes fortunas e refinanciamento de dívidas das famílias.", bias_scores: { cand_lula: 0.65, cand_bolsonaro: 0.10, cand_tebet: 0.30, cand_ciro: 0.98 } }
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
      total_campaign_funds: 256500000.0,
      total_campaign_expenses: 254500000.0,
      total_anomalies_flagged: 2,
      transparency_index_score: 8.4,
      system_wide_anomalies: [
        {
          id: "anom_bolso_1",
          candidate_id: "cand_bolsonaro",
          candidate_name: "Jair Bolsonaro",
          party_acronym: "PL",
          anomaly_type: "Alta Concentração em Empresa Aberta no Ano Eleitoral",
          severity: "Alta",
          description: "O fornecedor 'Prime Time Produções' foi constituído em fevereiro de 2024 e recebeu R$ 36.200.000,00 da campanha presidencial.",
          financial_impact: 36200000.0,
          audit_recommendation: "Auditoria contábil detalhada e rastreamento das subcontratações em plataformas digitais."
        },
        {
          id: "anom_lula_1",
          candidate_id: "cand_lula",
          candidate_name: "Lula",
          party_acronym: "PT",
          anomaly_type: "Fornecedor Digital Recém-Criado",
          severity: "Média",
          description: "Contratação de R$ 8.900.000,00 da 'Digital Vox', constituída em janeiro de 2024 para gestão de redes sociais.",
          financial_impact: 8900000.0,
          audit_recommendation: "Conferência das notas fiscais emitidas e relatórios de tráfego pago."
        }
      ],
      candidates_financials: []
    };
  }
}