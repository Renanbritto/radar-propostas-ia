from typing import List
from app.models.schemas import (
    CompareRequest,
    CompareResponse,
    Topic,
    CandidateComparisonDetail,
    Citation
)
from app.services.vector_store import vector_store
from app.core.config import settings

class ProposalComparator:
    """
    Serviço de Comparação Temática Lado a Lado.
    Contrasta propostas entre candidatos para um tópico específico,
    extraindo pontos de convergência, divergência e citações documentais.
    """

    @classmethod
    def compare(cls, request: CompareRequest, candidates_list: List[dict]) -> CompareResponse:
        topic_info = next((t for t in settings.TOPICS if t["id"] == request.topic_id), None)
        if not topic_info:
            topic_info = {
                "id": request.topic_id,
                "name": request.topic_id.capitalize(),
                "icon": "FileText",
                "description": f"Propostas para o tema {request.topic_id}"
            }
        
        topic = Topic(**topic_info)
        details: List[CandidateComparisonDetail] = []
        
        # Mapeamento de perfis de governança e financiamento por candidato/tópico
        governance_profiles = {
            ("cand_1", "saude"): ("Gestão Pública com Inovação Digital", "Recursos municipais do SUS + Fundos de Inovação"),
            ("cand_2", "saude"): ("Parcerias Público-Privadas (PPPs & OSS)", "Contratação de capacidade ociosa do setor privado"),
            ("cand_3", "saude"): ("Estatização e Fortalecimento do SUS Direto", "Orçamento próprio + Concursos públicos municipais"),
            ("cand_1", "educacao"): ("Escolas de Tempo Integral Criativas", "Fundo Municipal de Desenvolvimento Educacional"),
            ("cand_2", "educacao"): ("Subsídio Direto via Vouchers (Cheque-Creche)", "Repasse financeiro para vagas na rede privada"),
            ("cand_3", "educacao"): ("Construção de Creches 100% Públicas", "Investimento direto e duplicação de piso de professores"),
            ("cand_1", "economia"): ("Economia Verde & Microcrédito Sustentável", "Fundo de R$ 50M de Microcrédito Verde"),
            ("cand_2", "economia"): ("Desregulamentação e Corte de Tributos (ISS/IPTU)", "Atração de investimentos pelo livre mercado"),
            ("cand_3", "economia"): ("Obras Públicas e Fomento Popular", "Investimento estatal direto gerando 15 mil vagas"),
            ("cand_1", "seguranca"): ("Prevenção Social, LED & Policiamento Comunitário", "Fundo de Segurança Urbana e Mobilidade"),
            ("cand_2", "seguranca"): ("Armamento Tático, Cerco Digital & OCR", "Modernização de equipamentos e câmeras de IA"),
            ("cand_3", "seguranca"): ("Guarda Desarmada & Centros Culturais 24h", "Orçamento de Cidadania e Prevenção Social")
        }

        for cand_id in request.candidate_ids:
            cand_meta = next((c for c in candidates_list if c["id"] == cand_id), None)
            if not cand_meta:
                continue

            # Buscar chunks do candidato para o tópico
            chunks_with_score = vector_store.search(
                query=f"{topic.name} {topic.description}",
                top_k=3,
                candidate_id=cand_id,
                topic_id=request.topic_id
            )

            citations = [
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
                for chunk, score in chunks_with_score
            ]

            key_props = [c.text for c, _ in chunks_with_score] if chunks_with_score else [
                f"Propostas gerais para {topic.name} em estruturação."
            ]

            style, funding = governance_profiles.get(
                (cand_id, request.topic_id),
                ("Gestão Mista", "Orçamento Geral do Município")
            )

            details.append(
                CandidateComparisonDetail(
                    candidate_id=cand_meta["id"],
                    candidate_name=cand_meta["name"],
                    party_acronym=cand_meta["party_acronym"],
                    color=cand_meta.get("color", "#3B82F6"),
                    summary_of_proposals=f"Abordagem de {cand_meta['name']} em {topic.name} enfatiza {style.lower()}.",
                    key_proposals=key_props,
                    quotes_with_citations=citations,
                    governance_style=style,
                    funding_strategy=funding
                )
            )

        # Gerar síntese comparativa e divergências
        divergences = [
            f"Modelo de Gestão: Varia de gestão 100% pública e estatal até concessão via PPPs e vouchers privados.",
            f"Estratégia de Financiamento: Contraste entre redução de impostos com atração de empresas vs aumento do gasto público em obras e infraestrutura.",
            f"Abordagem Técnica: Diferença entre ênfase em tecnologia/digitalização vs ampliação física de quadro de servidores e prédios."
        ]

        convergences = [
            f"Todos os candidatos reconhecem a urgência de melhorias no eixo de {topic.name}.",
            f"Necessidade de modernização tecnológica e maior transparência nos serviços municipais.",
            f"Priorização de atendimento a populações em áreas de maior vulnerabilidade urbana."
        ]

        summary = (
            f"Na área de **{topic.name}**, os candidatos apresentam visões distintas sobre o papel do Estado. "
            f"Enquanto alguns priorizam a eficiência por meio de parcerias privadas e tecnologia, outros defendem a expansão do investimento público direto e atendimento estatal integral."
        )

        return CompareResponse(
            topic=topic,
            comparative_summary=summary,
            candidate_details=details,
            divergence_points=divergences,
            convergence_points=convergences
        )

comparator_service = ProposalComparator()
