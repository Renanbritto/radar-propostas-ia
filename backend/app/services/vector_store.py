import re
import math
import unicodedata
from typing import List, Optional, Dict, Tuple
from collections import Counter
from app.models.schemas import ProposalChunk
from app.core.logging import logger

def normalize_text(text: str) -> str:
    nfkd = unicodedata.normalize('NFKD', text.lower())
    return "".join([c for c in nfkd if not unicodedata.combining(c)])

class VectorStore:
    SYNONYM_MAP = {
        "saude": ["sus", "hospital", "medico", "medicos", "posto", "ubs", "remedio", "vacina", "vacinacao", "leito", "telemedicina", "psicologo", "ansiedade", "mental"],
        "mental": ["emocao", "psicossocial", "suicidio", "ansiedade", "burnout", "depressao", "psicologia", "psiquiatria", "cury"],
        "educacao": ["escola", "creche", "professor", "professores", "ensino", "faculdade", "universidade", "enem", "alfabetizacao", "aula", "aluno"],
        "economia": ["imposto", "impostos", "tributo", "tributaria", "tributos", "inflacao", "salario", "emprego", "trabalho", "pib", "renda", "privatizacao", "fiscal", "gasto", "reforma"],
        "seguranca": ["policia", "policial", "policiais", "crime", "violencia", "homicidio", "arma", "armas", "desarmamento", "prisao", "presidio", "faccao", "drogas"],
        "meio_ambiente": ["amazonia", "desmatamento", "clima", "floresta", "carbono", "sustentabilidade", "energia", "solar", "eolica", "arvore", "queimada"],
        "tecnologia": ["digital", "ia", "inteligencia", "computador", "software", "startup", "conectividade", "internet", "dados"],
        "social": ["pobreza", "fome", "bolsa", "familia", "auxilio", "moradia", "casa", "vulnerabilidade", "assistencia", "direitos"],
        "infraestrutura": ["estrada", "rodovia", "ferrovia", "porto", "aeroporto", "obras", "pac", "saneamento", "transporte", "metro", "trem"]
    }

    def __init__(self):
        self.chunks: List[ProposalChunk] = []
        self.vocab: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.tfidf_vectors: List[Dict[str, float]] = []

    def _tokenize(self, text: str) -> List[str]:
        cleaned = normalize_text(text)
        tokens = re.findall(r"\b[a-z0-9]{2,}\b", cleaned)
        stopwords = {
            "para", "com", "uma", "que", "dos", "das", "por", "mais", "como", "pela", "pelo",
            "este", "esta", "esses", "essas", "sobre", "entre", "onde", "quando", "muito",
            "todo", "toda", "todos", "todas", "qual", "quais", "sera", "serao", "nosso", "nossa",
            "quem", "eles", "elas", "dele", "dela", "esse", "essa", "isso", "aquilo", "tem", "ter"
        }
        
        expanded = []
        for t in tokens:
            if t not in stopwords:
                expanded.append(t)
                for topic, syns in self.SYNONYM_MAP.items():
                    if t == topic or t in syns:
                        expanded.append(topic)
                        expanded.extend(syns[:3])
        return expanded

    def index_chunks(self, chunks: List[ProposalChunk]):
        self.chunks = chunks
        num_docs = len(chunks)
        if num_docs == 0:
            return

        doc_token_counts = []
        df: Dict[str, int] = Counter()

        for chunk in chunks:
            text = f"{chunk.candidate_name} {chunk.party_acronym} {chunk.topic_name} {chunk.metadata.get('section', '')} {chunk.text}"
            tokens = self._tokenize(text)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                df[t] += 1
            doc_token_counts.append(Counter(tokens))

        self.idf = {t: math.log((num_docs + 1) / (count + 1)) + 1.0 for t, count in df.items()}
        
        self.tfidf_vectors = []
        for token_counts in doc_token_counts:
            vec = {}
            total_tokens = sum(token_counts.values()) or 1
            for t, count in token_counts.items():
                tf = count / total_tokens
                vec[t] = tf * self.idf.get(t, 1.0)
            
            norm = math.sqrt(sum(v * v for v in vec.values())) or 1.0
            self.tfidf_vectors.append({t: v / norm for t, v in vec.items()})

        logger.info(f"Índice vetorial construído com {len(self.chunks)} chunks e {len(self.idf)} termos no vocabulário.")

    def search(
        self,
        query: str,
        top_k: int = 5,
        candidate_id: Optional[str] = None,
        topic_id: Optional[str] = None
    ) -> List[Tuple[ProposalChunk, float]]:
        query_tokens = self._tokenize(query)
        if not query_tokens or not self.tfidf_vectors:
            filtered = []
            for chunk in self.chunks:
                if candidate_id and chunk.candidate_id != candidate_id:
                    continue
                if topic_id and chunk.topic_id != topic_id:
                    continue
                filtered.append((chunk, 0.6))
            return filtered[:top_k]

        q_counts = Counter(query_tokens)
        q_vec = {}
        total_q = sum(q_counts.values()) or 1
        for t, count in q_counts.items():
            if t in self.idf:
                tf = count / total_q
                q_vec[t] = tf * self.idf[t]

        q_norm = math.sqrt(sum(v * v for v in q_vec.values())) or 1.0
        q_vec_norm = {t: v / q_norm for t, v in q_vec.items()}

        results = []
        norm_query = normalize_text(query)

        for i, doc_vec in enumerate(self.tfidf_vectors):
            chunk = self.chunks[i]

            if candidate_id and chunk.candidate_id != candidate_id:
                continue
            if topic_id and chunk.topic_id != topic_id:
                continue

            score = sum(doc_vec.get(t, 0.0) * w for t, w in q_vec_norm.items())
            
            norm_cand = normalize_text(chunk.candidate_name)
            norm_topic = normalize_text(chunk.topic_name)
            norm_text = normalize_text(chunk.text)

            if any(name_part in norm_query for name_part in norm_cand.split() if len(name_part) > 2):
                score += 0.35
            if any(t in norm_topic for t in query_tokens):
                score += 0.25
            if any(t in norm_text for t in query_tokens):
                score += 0.15

            if score > 0.02:
                confidence = min(round(float(score * 1.6), 2), 0.98)
                results.append((chunk, confidence))

        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

vector_store = VectorStore()
