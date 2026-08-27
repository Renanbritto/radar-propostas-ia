import re
import unicodedata
from typing import List, Optional
from app.models.schemas import ChatRequest, ChatResponse, Citation, ProposalChunk
from app.services.vector_store import vector_store, normalize_text
from app.services.llm_client import LLMClient
from app.core.logging import logger

class RAGEngine:
    """
    Motor RAG Inteligente de Alta Precisão (Google Gemini + Vector Store TSE).
    Capaz de responder qualquer pergunta sobre a plataforma, eleições 2026,
    candidatos e propostas com fundamentação em citações documentais oficiais.
    """

    GREETING_PATTERNS = [
        r"\b(oi|ola|bom dia|boa tarde|boa noite|opa|fala|e ai|tudo bem|tudo bom|como vai|hey|hello|saudacoes)\b"
    ]
    
    SITE_PURPOSE_PATTERNS = [
        r"\b(para que serve|pra que serve|o que e esse site|o que e este site|qual a funcao|qual o objetivo|como funciona|o que faz esse site|o que voce faz|quem e voce|para que esse site serve)\b"
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
        for p in cls.SITE_PURPOSE_PATTERNS:
            if re.search(p, norm):
                return "SITE_PURPOSE"
        for p in cls.CANDIDATES_LIST_PATTERNS:
            if re.search(p, norm):
                return "CANDIDATES_LIST"
        return "GENERAL_OR_PROPOSAL"

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
        query_text = request.query.strip()
        intent = cls._detect_intent(query_text)

        # 1. Buscar Chunks Relevantes no Índice Vetorial
        ranked_chunks = vector_store.search(
            query=query_text,
            top_k=5,
            candidate_id=request.candidate_id,
            topic_id=request.topic_id
        )

        citations = cls._create_citations(ranked_chunks) if ranked_chunks else []
        searched_candidates = list(set([c.candidate_name for c in citations])) if citations else (
            [request.candidate_id] if request.candidate_id else ["Todos"]
        )

        # 2. Se o Gemini (LLM) estiver disponível, delegar a geração para ele (Máxima Inteligência)
        if LLMClient.is_configured():
            chunk_texts = [
                f"[{c.candidate_name} ({c.party_acronym}) - Página {c.page_number} - {c.topic_name}]: {c.text}"
                for c in [chunk for chunk, _ in ranked_chunks]
            ]
            try:
                llm_answer = await LLMClient.generate(query_text, chunk_texts)
                if llm_answer:
                    return ChatResponse(
                        answer=llm_answer,
                        citations=citations if intent != "GREETING" and intent != "SITE_PURPOSE" else [],
                        suggested_followups=cls._generate_followups(ranked_chunks),
                        searched_candidates=searched_candidates
                    )
            except Exception as e:
                logger.error(f"Erro ao gerar resposta com LLM: {e}")

        # 3. Fallbacks Locais Estruturados (se LLM offline ou sem chave)
        if intent == "GREETING":
            answer = (
                "Olá! Seja muito bem-vindo ao **Radar de Propostas IA** 🇧🇷\n\n"
                "Sou seu assistente cívico oficial de auditoria para a **Eleição Presidencial de 2026**. "
                "Posso comparar planos de governo, esclarecer propostas por área temática e consultar a prestação de contas dos candidatos no TSE.\n\n"
                "**Como posso te ajudar agora?** Você pode perguntar sobre Saúde, Economia, Educação, Segurança, Saúde Mental ou pedir um comparativo entre candidatos!"
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

        if intent == "SITE_PURPOSE":
            answer = (
                "O **Radar de Propostas IA + InvestigaVoto** é uma plataforma neutra de auditoria cívica e transparência eleitoral para as **Eleições Presidenciais de 2026**.\n\n"
                "🏛️ **O que você pode fazer aqui:**\n"
                "1. ⚖️ **Comparador Lado a Lado:** Analise o posicionamento dos 6 presidenciáveis em 8 eixos temáticos (Saúde, Educação, Economia, Segurança, etc.).\n"
                "2. 💬 **Chat RAG com IA:** Faça perguntas livres sobre qualquer proposta e receba respostas fundamentadas com o **número exato da página** no PDF oficial do TSE.\n"
                "3. 🧭 **Bússola Programática (Quiz):** Descubra com qual candidato suas ideias têm maior afinidade.\n"
                "4. 💰 **InvestigaVoto:** Audite gastos de campanha, fornecedores contratados e doações declaradas à Justiça Eleitoral.\n\n"
                "💡 Experimente perguntar algo como: *'O que o Lula propõe para o SUS?'* ou *'Quais estatais o Flávio Bolsonaro quer privatizar?'*!"
            )
            return ChatResponse(
                answer=answer,
                citations=[],
                suggested_followups=[
                    "Quais são os 6 candidatos presidenciais cadastrados?",
                    "O que o Augusto Cury propõe para a saúde mental?",
                    "Comparar Lula e Flávio Bolsonaro na economia",
                    "Qual o modelo de gestão proposto por Caiado e Zema?"
                ],
                searched_candidates=["Todos"]
            )

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

        # Fallback RAG se houver chunks
        if ranked_chunks:
            answer = cls._synthesize_grounded_answer(query_text, ranked_chunks)
            followups = cls._generate_followups(ranked_chunks)
            return ChatResponse(
                answer=answer,
                citations=citations,
                suggested_followups=followups,
                searched_candidates=searched_candidates
            )

        # Se nada for encontrado no fallback local
        answer = (
            f"Não encontrei propostas com correspondência direta para **'{query_text}'** nos documentos cadastrados.\n\n"
            "💡 **Dicas de consulta:**\n"
            "- Tente pesquisar por temas: *Saúde*, *SUS*, *Impostos*, *Economia*, *Segurança*, *Educação*, *Saúde Mental* ou *Meio Ambiente*.\n"
            "- Ou pergunte sobre um candidato específico, como: *'O que o Augusto Cury propõe para a educação?'* ou *'Quais os planos de Zema para o funcionalismo?'*."
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
