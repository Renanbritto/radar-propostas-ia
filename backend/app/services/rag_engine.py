import os
from typing import List, Optional
from app.models.schemas import ChatRequest, ChatResponse, Citation, ProposalChunk
from app.services.vector_store import vector_store
from app.core.config import settings
from app.core.logging import logger

class RAGEngine:
    """
    Motor RAG (Retrieval-Augmented Generation) com Citações Oficiais.
    Garante respostas estritamente fundamentadas nos planos de governo,
    indicando página, candidato e trecho exato para auditoria.
    """

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
                    section_title=chunk.metadata.get("section_title"),
                    relevance_score=score
                )
            )
        return citations

    @classmethod
    async def generate_response(cls, request: ChatRequest) -> ChatResponse:
        # 1. Recuperação Semântica (Retrieve)
        ranked_chunks = vector_store.search(
            query=request.query,
            top_k=4,
            candidate_id=request.candidate_id,
            topic_id=request.topic_id
        )

        if not ranked_chunks:
            return ChatResponse(
                answer="Não foram encontradas propostas específicas sobre esse termo nos planos de governo cadastrados. Tente pesquisar por temas como Saúde, Educação, Segurança, Economia ou Meio Ambiente.",
                citations=[],
                suggested_followups=[
                    "Quais as propostas para a saúde pública e telemedicina?",
                    "Como os candidatos pretendem resolver a fila de creches?",
                    "Quais são os planos para armamento da Guarda Municipal?",
                    "O que propõem para atração de empresas e redução de impostos?"
                ],
                searched_candidates=[request.candidate_id] if request.candidate_id else ["Todos"]
            )

        citations = cls._create_citations(ranked_chunks)
        searched_candidates = list(set([c.candidate_name for c in citations]))

        # 2. Geração Fundamentada (Synthesize)
        answer = cls._synthesize_grounded_answer(request.query, ranked_chunks)

        # 3. Follow-ups inteligentes
        followups = cls._generate_followups(ranked_chunks)

        return ChatResponse(
            answer=answer,
            citations=citations,
            suggested_followups=followups,
            searched_candidates=searched_candidates
        )

    @classmethod
    def _synthesize_grounded_answer(cls, query: str, ranked_chunks: List[tuple[ProposalChunk, float]]) -> str:
        """Gera uma síntese comparativa e fundamentada com citações explícitas de página."""
        
        # Agrupar por candidato
        candidates_map = {}
        for chunk, score in ranked_chunks:
            if chunk.candidate_name not in candidates_map:
                candidates_map[chunk.candidate_name] = []
            candidates_map[chunk.candidate_name].append(chunk)

        sections = []
        sections.append(f"Com base na análise dos planos de governo oficiais registrados, aqui está o detalhamento sobre sua consulta:\n")

        for cand_name, chunks in candidates_map.items():
            party = chunks[0].party_acronym
            sections.append(f"### 📌 **{cand_name} ({party})**")
            for chunk in chunks:
                sections.append(
                    f"- **{chunk.metadata.get('section_title', chunk.topic_name)}** *(Pág. {chunk.page_number})*:\n"
                    f"  > \"{chunk.text}\"\n"
                )

        sections.append(
            "\n💡 *Todas as informações acima foram extraídas diretamente dos documentos submetidos à Justiça Eleitoral. Você pode auditar cada trecho pelo número da página indicado.*"
        )

        return "\n".join(sections)

    @classmethod
    def _generate_followups(cls, ranked_chunks: List[tuple[ProposalChunk, float]]) -> List[str]:
        topics = list(set([chunk.topic_id for chunk, _ in ranked_chunks]))
        followups = []
        if "saude" in topics:
            followups.append("Qual a diferença de custo e gestão entre o modelo de OSS e o SUS 100% público?")
        if "educacao" in topics:
            followups.append("Como funciona a proposta de Cheque-Creche (Vouchers) vs novas creches públicas?")
        if "seguranca" in topics:
            followups.append("Como a Guarda Municipal armada vs desarmada é tratada nos planos?")
        if "economia" in topics:
            followups.append("Quais são os incentivos fiscais propostos para atração de novas empresas?")
        
        if not followups:
            followups = [
                "Qual a meta dos candidatos para o meio ambiente e resíduos?",
                "Como pretendem custear as novas obras e contratações?",
                "Quais as propostas voltadas para a juventude e primeiro emprego?"
            ]
        return followups[:3]

rag_engine = RAGEngine()
