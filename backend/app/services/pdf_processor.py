import os
import json
from typing import List
from app.models.schemas import ProposalChunk
from app.core.logging import logger

class PDFProcessor:
    """
    Processador de Planos de Governo em PDF.
    Extrai texto, identifica cabeçalhos de eixos temáticos e gera chunks com metadados de rastreabilidade (página, tópico, candidato).
    """
    
    TOPIC_KEYWORDS = {
        "saude": ["saúde", "sus", "hospital", "ubs", "médico", "telemedicina", "vacina", "clínica", "remédio", "psicossocial"],
        "educacao": ["educação", "escola", "creche", "professor", "ensino", "fundamental", "médio", "universidade", "pedagógico", "robótica"],
        "economia": ["economia", "emprego", "renda", "tribut", "imposto", "iss", "iptu", "investimento", "microcrédito", "empresa", "comércio"],
        "seguranca": ["segurança", "guarda", "polícia", "câmera", "crime", "violência", "patrulha", "armamento", "monitoramento", "iluminação"],
        "meio_ambiente": ["ambiente", "clima", "verde", "carbono", "árvore", "lixo", "reciclagem", "enchent", "drenagem", "sustentab", "parque"],
        "tecnologia": ["tecnologia", "digital", "inovação", "software", "aplicativo", "ia", "inteligência artificial", "startup", "conectividade"],
        "social": ["social", "fome", "pobreza", "assistência", "vulnerável", "mulher", "criança", "idoso", "restaurante popular", "moradia"],
        "infraestrutura": ["infraestrutura", "obra", "transporte", "ônibus", "tarifa", "rua", "asfalto", "trânsito", "mobilidade", "saneamento"]
    }

    @classmethod
    def classify_topic(cls, text: str) -> str:
        text_lower = text.lower()
        scores = {}
        for topic, keywords in cls.TOPIC_KEYWORDS.items():
            count = sum(1 for kw in keywords if kw in text_lower)
            if count > 0:
                scores[topic] = count
        
        if scores:
            return max(scores, key=scores.get)
        return "social"

    @classmethod
    def load_initial_proposals(cls, data_file_path: str) -> List[ProposalChunk]:
        """Carrega e converte o dataset estruturado de propostas pré-processadas."""
        if not os.path.exists(data_file_path):
            logger.warning(f"Arquivo de propostas {data_file_path} não encontrado.")
            return []
            
        with open(data_file_path, "r", encoding="utf-8-sig") as f:
            data = json.load(f)
            
        chunks = []
        for prop in data.get("proposals", []):
            chunk = ProposalChunk(
                id=prop["id"],
                candidate_id=prop["candidate_id"],
                candidate_name=prop["candidate_name"],
                party_acronym=prop["party_acronym"],
                topic_id=prop["topic_id"],
                topic_name=prop["topic_name"],
                text=prop["text"],
                page_number=prop.get("page_number", 1),
                metadata={"section_title": prop.get("section_title", "")}
            )
            chunks.append(chunk)
            
        logger.info(f"Carregadas {len(chunks)} propostas estruturadas com sucesso.")
        return chunks
