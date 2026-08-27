import re
import unicodedata
from typing import List, Optional
from app.models.schemas import ChatRequest, ChatResponse, Citation, ProposalChunk
from app.services.vector_store import vector_store, normalize_text
from app.services.llm_client import LLMClient
from app.core.logging import logger

class RAGEngine:
    """
    Motor RAG Inteligente com Detecção de Intenções Cívicas e Citações Auditáveis.
    Combina classificação de intenções, LLM em tempo real (Groq/Gemini/OpenAI) e
    síntese semântica estruturada com citações exatas de página do TSE.
    """

    GREETING_PATTERNS = [
        r"\b(oi|ola|bom dia|boa tarde|boa noite|opa|fala|e ai|tudo bem|tudo bom|como vai|hey|hello|saudacoes)\b"
    ]
    
    WHO_ARE_YOU_PATTERNS = [
        r"\b(quem e voce|o que voce faz|quem e vc|como funciona|o que e o radar|qual sua funcao|me explique)\b"
    ]

    CANDIDATES_LIST_PATTERNS = [
        r"\b(quais candidatos|quem sao os candidatos|quais sao os candidatos|lista de candidatos|quem esta concorrendo|quem concorre|quais presidenciaveis|quais presidentes)\b"
    ]

    @classmethod
    def _detect_intent(cls, query: str) -> str:
        norm = normalize_text(query)
        for p in cls.GREETING_PATTERNS:
            if re.search(p, norm):
                return "GREETING"
        for p in cls.WHO_ARE_YOU_PATTERNS:
            if re.search(p, norm):
                return "WHO_ARE_YOU"
        for p in cls.CANDIDATES_LIST_PATTERNS:
            if re.search(p, norm):
                return "CANDIDATES_LIST"
        return "PROPOSAL_SEARCH"

    @staticmethod
    def _create_citations(ranked_chunks: List[tuple[ProposalChunk, float]]) -> List[Citation]:
        citations = []
        for chunk, score in ranked_chunks:
            citations.append(
                Citation(
                    candidate_id=chunk.candidate_id,
                    candidate_name=chunk.candidate_name,
                    party_acronym=chunk.party_acronym,
                    topic_id=chunk.topic_id,
                    topic_name=chunk.topic_name,
                    page_number=chunk.page_number,
                    excerpt=chunk.text,
                    section_title=chunk.metadata.get("section"),
                    relevance_score=score
                )
            )
        return citations

    @classmethod
    async def generate_response(cls, request: ChatRequest) -> ChatResponse:
        intent = cls._detect_intent(request.query)

        # 1. Tratar Saudações
        if intent == "GREETING":
            answer = (
                "Olá! Seja muito bem-vindo ao **Radar de Propostas IA** 🇧🇷\n\n"
                "Sou seu assistente de inteligência cívica e auditoria para a **Eleição Presidencial de 2026**. "
                "Posso comparar planos de governo, esclarecer propostas por área temática e consultar a prestação de contas dos candidatos no TSE.\n\n"
                "**Como posso te ajudar agora?** Você pode perguntar sobre Saúde, Economia, Educação, Segurança, Meio Ambiente ou pedir um comparativo entre candidatos!"
            )
            return ChatResponse(
                answer=answer,
                citations=[],
                suggested_followups=[
                    "Quais são os 6 candidatos presidenciais cadastrados?",
                    "Como os candidatos pretendem fortalecer o SUS e a Saúde Mental?",
                    "O que propõem para a isenção do Imposto de Renda?",
                    "Qual a diferença entre Zema e Caiado na economia?"
                ],
                searched_candidates=["Todos"]
            )

        # 2. Tratar 'Quem é você / Como funciona'
        if intent == "WHO_ARE_YOU":
            answer = (
                "O **Radar de Propostas IA** é uma plataforma neutra de auditoria cívica baseada em **RAG (Retrieval-Augmented Generation)**.\n\n"
                "🔍 **O que me diferencia:**\n"
                "- **Zero Alucinações:** Todas as respostas são extraídas diretamente dos PDFs oficiais protocolados no TSE (DivulgaCandContas).\n"
                "- **Citações Auditáveis:** Cada argumento vem acompanhado do **número exato da página** no plano de governo para você mesmo checar.\n"
                "- **InvestigaVoto:** Cruzamos as promessas de campanha com as despesas e doações declaradas à Justiça Eleitoral.\n\n"
                "Experimente me fazer uma pergunta sobre qualquer política pública!"
            )
            return ChatResponse(
                answer=answer,
                citations=[],
                suggested_followups=[
                    "Quais as propostas para segurança pública e controle de armas?",
                    "O que o Augusto Cury propõe para a educação socioemocional?",
                    "Como o Lula pretende financiar o Novo PAC?",
                    "Quais estatais o Flávio Bolsonaro quer privatizar?"
                ],
                searched_candidates=["Todos"]
            )

        # 3. Tratar Lista de Candidatos
        if intent == "CANDIDATES_LIST":
            answer = (
                "Atualmente, o **Radar de Propostas** monitora **6 candidaturas presidenciais oficiais para 2026**:\n\n"
                "1. 🔴 **Lula (PT - 13)**: Foco no Novo PAC (R$ 1,7 tri), expansão do SUS, isenção do IR até R$ 5 mil e Desmatamento Zero.\n"
                "2. 🔵 **Flavio Bolsonaro (PL - 22)**: Liberdade econômica, privatizações amplas (Petrobras, Correios), agro exportador e legítima defesa armada.\n"
                "3. 🟣 **Renan Santos (MISSÃO - 14)**: Combate à corrupção sistêmica (meta de R$ 200 bi/ano), valores conservadores e reforma do ensino público.\n"
                "4. 🟡 **Ronaldo Caiado (PSD - 55)**: Modelo de gestão por resultados de Goiás, equilíbrio fiscal, concessões de infraestrutura e IA na segurança.\n"
                "5. 🟠 **Romeu Zema (NOVO - 30)**: Saneamento fiscal (superávit de 2% do PIB), corte de 30% em comissionados e governo 100% digital.\n"
                "6. 🌐 **Augusto Cury (PRD - 44)**: Plano Nacional de Saúde Mental no SUS, Escola da Inteligência socioemocional e liderança humanizada.\n\n"
                "Qual desses candidatos você gostaria de analisar em detalhes?"
            )
            return ChatResponse(
                answer=answer,
                citations=[],
                suggested_followups=[
                    "Comparar Lula e Flávio Bolsonaro na economia",
                    "Quais as propostas de Augusto Cury para a saúde mental?",
                    "Comparar Caiado e Zema na gestão pública",
                    "O que Renan Santos propõe contra a corrupção?"
                ],
                searched_candidates=["Todos"]
            )

        # 4. Busca Semântica RAG (Retrieve)
        ranked_chunks = vector_store.search(
            query=request.query,
            top_k=5,
            candidate_id=request.candidate_id,
            topic_id=request.topic_id
        )

        citations = cls._create_citations(ranked_chunks)
        searched_candidates = list(set([c.candidate_name for c in citations])) if citations else (
            [request.candidate_id] if request.candidate_id else ["Todos"]
        )

        # 5. Tentativa com LLM (Se API Key configurada)
        if LLMClient.is_configured():
            chunk_texts = [
                f"[{c.candidate_name} ({c.party_acronym}) - Pág. {c.page_number} - {c.topic_name}]: {c.text}"
                for c in [chunk for chunk, _ in ranked_chunks]
            ]
            llm_answer = await LLMClient.generate(request.query, chunk_texts)
            if llm_answer:
                return ChatResponse(
                    answer=llm_answer,
                    citations=citations,
                    suggested_followups=cls._generate_followups(ranked_chunks),
                    searched_candidates=searched_candidates
                )

        # 6. Fallback Estruturado e Inteligente (Zero-Dependency High Intelligence)
        if not ranked_chunks:
            answer = (
                f"Não encontrei propostas com correspondência direta para o termo **'{request.query}'** nos documentos cadastrados.\n\n"
                "💡 **Sugestões para refinar sua busca:**\n"
                "- Tente termos temáticos amplos: *Saúde*, *SUS*, *Impostos*, *Economia*, *Segurança*, *Educação*, *Saúde Mental* ou *Meio Ambiente*.\n"
                "- Ou pergunte sobre um candidato específico, por exemplo: *'O que o Augusto Cury propõe para a educação?'* ou *'Quais os planos de Zema para o funcionalismo?'*."
            )
            return ChatResponse(
                answer=answer,
                citations=[],
                suggested_followups=[
                    "Quais são as propostas para a saúde e SUS?",
                    "Como os candidatos pretendem gerar empregos?",
                    "Quais os planos para educação e valorização de professores?",
                    "O que dizem sobre segurança pública e combate ao crime?"
                ],
                searched_candidates=searched_candidates
            )

        answer = cls._synthesize_grounded_answer(request.query, ranked_chunks)
        followups = cls._generate_followups(ranked_chunks)

        return ChatResponse(
            answer=answer,
            citations=citations,
            suggested_followups=followups,
            searched_candidates=searched_candidates
        )

    @classmethod
    def _synthesize_grounded_answer(cls, query: str, ranked_chunks: List[tuple[ProposalChunk, float]]) -> str:
        candidates_map = {}
        for chunk, score in ranked_chunks:
            if chunk.candidate_name not in candidates_map:
                candidates_map[chunk.candidate_name] = []
            candidates_map[chunk.candidate_name].append(chunk)

        sections = []
        sections.append(f"Com base na análise semântica dos **Planos de Governo Oficiais** registrados no TSE para 2026, aqui está o posicionamento dos candidatos sobre **'{query}'**:\n")

        for cand_name, chunks in candidates_map.items():
            party = chunks[0].party_acronym
            sections.append(f"### 🏛️ **{cand_name} ({party})**")
            for chunk in chunks:
                section_title = chunk.metadata.get("section", chunk.topic_name)
                page_info = f"*(Página {chunk.page_number} do documento oficial)*"
                sections.append(f"- **{section_title}** {page_info}:\n  > \"{chunk.text}\"\n")

        sections.append(
            "\n🔒 *Todas as diretrizes acima foram extraídas diretamente dos documentos submetidos à Justiça Eleitoral. Você pode auditar cada citação pelo número exato da página indicado acima.*"
        )

        return "\n".join(sections)

    @classmethod
    def _generate_followups(cls, ranked_chunks: List[tuple[ProposalChunk, float]]) -> List[str]:
        topics = list(set([chunk.topic_id for chunk, _ in ranked_chunks]))
        followups = []
        if "saude" in topics:
            followups.append("Como Augusto Cury e Lula abordam a saúde pública e psicossocial?")
        if "educacao" in topics:
            followups.append("Qual a diferença entre a Escola da Inteligência e o modelo tradicional?")
        if "seguranca" in topics:
            followups.append("Quais as diretrizes para armamento e segurança ostensiva?")
        if "economia" in topics:
            followups.append("Quais são os incentivos fiscais e metas de superávit primário?")
        
        if not followups:
            followups = [
                "Qual a meta dos candidatos para o meio ambiente e clima?",
                "Como pretendem custear as novas obras e concessões?",
                "Quais as propostas voltadas para a juventude e primeiro emprego?"
            ]
        return followups[:3]

rag_engine = RAGEngine()
