import { Candidate, Topic, CompareResponse, QuizQuestion, QuizResultResponse } from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Fallback datasets para funcionamento instantâneo offline/demo se o backend não estiver ativo
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
    console.warn("Usando dados locais de fallback para candidatos:", err);
    return FALLBACK_CANDIDATES;
  }
}

export async function fetchTopics(): Promise<Topic[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/candidates/topics`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Falha ao buscar tópicos");
    return await res.json();
  } catch (err) {
    console.warn("Usando tópicos locais de fallback:", err);
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
    console.warn("Usando síntese de comparação fallback:", err);
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
    console.warn("Fallback RAG Q&A:", err);
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
    console.warn("Fallback quiz questions:", err);
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
    console.warn("Fallback quiz match response:", err);
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
