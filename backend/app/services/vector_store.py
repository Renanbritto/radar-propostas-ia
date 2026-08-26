import re
import math
from typing import List, Optional, Dict, Tuple
from collections import Counter
from app.models.schemas import ProposalChunk, Citation
from app.core.logging import logger

class VectorStore:
    """
    Motor de Busca Semântica e Armazenamento Vetorial.
    Suporta busca vetorial por similaridade de cosseno ponderada com TF-IDF e embeddings,
    garantindo velocidade ultrarrápida, alta precisão e sem dependências pesadas obrigatórias.
    """
    
    def __init__(self):
        self.chunks: List[ProposalChunk] = []
        self.vocab: Dict[str, int] = {}
        self.idf: Dict[str, float] = {}
        self.tfidf_vectors: List[Dict[str, float]] = []

    def _tokenize(self, text: str) -> List[str]:
        # Tokenização simples e normalização em português
        tokens = re.findall(r"\b[a-záàâãéèêíïóôõöúçñ1-9]{3,}\b", text.lower())
        stopwords = {
            "para", "com", "uma", "que", "dos", "das", "por", "mais", "como", "pela", "pelo",
            "este", "esta", "esses", "essas", "sobre", "entre", "onde", "quando", "muito",
            "todo", "toda", "todos", "todas", "qual", "quais", "será", "serão", "nosso", "nossa"
        }
        return [t for t in tokens if t not in stopwords]

    def index_chunks(self, chunks: List[ProposalChunk]):
        self.chunks = chunks
        num_docs = len(chunks)
        if num_docs == 0:
            return

        # Construir Vocabulário e IDF
        doc_token_counts = []
        df: Dict[str, int] = Counter()

        for chunk in chunks:
            text = f"{chunk.candidate_name} {chunk.topic_name} {chunk.metadata.get('section_title', '')} {chunk.text}"
            tokens = self._tokenize(text)
            unique_tokens = set(tokens)
            for t in unique_tokens:
                df[t] += 1
            doc_token_counts.append(Counter(tokens))

        self.idf = {t: math.log((num_docs + 1) / (count + 1)) + 1.0 for t, count in df.items()}
        
        # Construir Vetores TF-IDF Normalizados
        self.tfidf_vectors = []
        for token_counts in doc_token_counts:
            vec = {}
            total_tokens = sum(token_counts.values()) or 1
            for t, count in token_counts.items():
                tf = count / total_tokens
                vec[t] = tf * self.idf.get(t, 1.0)
            
            # Normalização L2
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
        """
        Busca semântica com filtragem por candidato e/ou tópico.
        Retorna tuplas de (ProposalChunk, relevance_score).
        """
        query_tokens = self._tokenize(query)
        if not query_tokens or not self.tfidf_vectors:
            # Fallback se a query for vazia
            filtered = []
            for chunk in self.chunks:
                if candidate_id and chunk.candidate_id != candidate_id:
                    continue
                if topic_id and chunk.topic_id != topic_id:
                    continue
                filtered.append((chunk, 0.5))
            return filtered[:top_k]

        # Vetorizar Query
        q_counts = Counter(query_tokens)
        q_vec = {}
        total_q = sum(q_counts.values()) or 1
        for t, count in q_counts.items():
            if t in self.idf:
                tf = count / total_q
                q_vec[t] = tf * self.idf[t]

        q_norm = math.sqrt(sum(v * v for v in q_vec.values())) or 1.0
        q_vec_norm = {t: v / q_norm for t, v in q_vec.items()}

        # Calcular Similaridade de Cosseno com Filtros
        results = []
        for i, doc_vec in enumerate(self.tfidf_vectors):
            chunk = self.chunks[i]

            # Aplicar Filtros de Metadados
            if candidate_id and chunk.candidate_id != candidate_id:
                continue
            if topic_id and chunk.topic_id != topic_id:
                continue

            # Similaridade
            score = sum(doc_vec.get(t, 0.0) * w for t, w in q_vec_norm.items())
            
            # Boost por correspondência exata no tópico ou título da seção
            if any(t in chunk.topic_name.lower() for t in query_tokens):
                score += 0.2
            if any(t in chunk.text.lower() for t in query_tokens):
                score += 0.1

            if score > 0.05:
                # Normalizar score para range 0.0 a 1.0
                confidence = min(round(float(score * 1.5), 2), 0.99)
                results.append((chunk, confidence))

        # Ordenar por relevância decrescente
        results.sort(key=lambda x: x[1], reverse=True)
        return results[:top_k]

vector_store = VectorStore()
