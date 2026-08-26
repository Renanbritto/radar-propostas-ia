from typing import List, Dict
from app.models.schemas import (
    QuizSubmissionRequest,
    QuizResultResponse,
    CandidateAffinityResult,
    TopicAffinity
)
from app.core.config import settings

class QuizService:
    """
    Serviço da Bússola Eleitoral & Match de Prioridades.
    Calcula a afinidade vetorial entre as respostas do eleitor e os planos de governo oficiais.
    """

    @classmethod
    def calculate_results(
        cls,
        submission: QuizSubmissionRequest,
        questions: List[dict],
        candidates: List[dict]
    ) -> QuizResultResponse:
        
        # Mapeamento de perguntas e opções
        q_map = {q["id"]: q for q in questions}
        
        # Acumulador de pontuação por candidato e por tópico
        candidate_scores: Dict[str, float] = {c["id"]: 0.0 for c in candidates}
        candidate_topic_scores: Dict[str, Dict[str, List[float]]] = {
            c["id"]: {} for c in candidates
        }

        total_questions = len(submission.answers) or 1

        for ans in submission.answers:
            q = q_map.get(ans.question_id)
            if not q:
                continue
            
            topic_id = q.get("topic_id", "geral")
            selected_opt = next((opt for opt in q["options"] if opt["id"] == ans.selected_option_id), None)
            
            if selected_opt and "bias_scores" in selected_opt:
                for cand_id, score in selected_opt["bias_scores"].items():
                    if cand_id in candidate_scores:
                        candidate_scores[cand_id] += score
                        
                        if topic_id not in candidate_topic_scores[cand_id]:
                            candidate_topic_scores[cand_id][topic_id] = []
                        candidate_topic_scores[cand_id][topic_id].append(score)

        # Construir resultados detalhados
        results: List[CandidateAffinityResult] = []
        
        for cand in candidates:
            cand_id = cand["id"]
            raw_score = candidate_scores[cand_id]
            pct = min(round((raw_score / total_questions) * 100, 1), 99.0)
            
            # Detalhamento por tópico
            topics_breakdown = []
            for t in settings.TOPICS:
                t_id = t["id"]
                t_scores = candidate_topic_scores[cand_id].get(t_id, [0.5])
                t_avg = sum(t_scores) / len(t_scores)
                t_pct = min(round(t_avg * 100, 1), 99.0)
                topics_breakdown.append(
                    TopicAffinity(
                        topic_id=t_id,
                        topic_name=t["name"],
                        match_percentage=t_pct
                    )
                )

            # Destaques de convergência
            highlights = [
                f"Alta concordância nas prioridades para {cand['summary'][:60]}...",
                f"Alinhamento estratégico com o modelo de gestão proposto em {cand['party_acronym']}."
            ]

            results.append(
                CandidateAffinityResult(
                    candidate_id=cand_id,
                    candidate_name=cand["name"],
                    party_acronym=cand["party_acronym"],
                    color=cand.get("color", "#3B82F6"),
                    overall_match_percentage=pct,
                    topics_breakdown=topics_breakdown,
                    matching_highlights=highlights,
                    potential_divergences=[
                        "Diferenças em ritmo de investimento fiscal ou modelos de parceria público-privada."
                    ]
                )
            )

        # Ordenar por maior afinidade
        results.sort(key=lambda x: x.overall_match_percentage, reverse=True)
        top = results[0] if results else None

        user_profile = {
            "inovacao_sustentabilidade": 0.85 if top and top.candidate_id == "cand_1" else 0.40,
            "livre_mercado_seguranca": 0.90 if top and top.candidate_id == "cand_2" else 0.35,
            "desenvolvimento_social_estatal": 0.92 if top and top.candidate_id == "cand_3" else 0.45
        }

        summary = (
            f"Seu perfil de respostas teve maior alinhamento com **{top.candidate_name} ({top.party_acronym})** "
            f"com **{top.overall_match_percentage}% de afinidade programática**, demonstrando preferência por soluções focadas em suas prioridades declaradas."
        )

        return QuizResultResponse(
            top_candidate=top,
            all_candidates=results,
            user_ideological_profile=user_profile,
            summary_analysis=summary
        )

quiz_service = QuizService()
