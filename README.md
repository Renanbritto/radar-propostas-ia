# 🤖 Radar de Propostas IA (RAG + NLP)

> **Plataforma Cívica Inteligente de Análise, Comparação e Consulta Semântica com RAG sobre Planos de Governo Oficiais.**

[![CI Pipeline](https://github.com/Renanbritto/radar-propostas-ia/actions/workflows/ci.yml/badge.svg)](https://github.com/Renanbritto/radar-propostas-ia/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 Sobre o Projeto

O **Radar de Propostas IA** é uma aplicação completa (Fullstack + Data Science / IA Generativa) projetada para empoderar eleitores através do acesso simplificado, transparente e auditável aos planos de governo oficiais submetidos à Justiça Eleitoral (TSE).

### 🚀 Principais Funcionalidades
1. **🔍 Comparador Temático Lado a Lado:** Contraste direto de propostas para eixos críticos (Saúde, Educação, Segurança, Economia, etc.) com síntese analítica gerada por IA.
2. **💬 Chat RAG Cívico com Citações:** Pergunte diretamente aos planos de governo em linguagem natural e receba respostas fundamentadas com número de página e trecho oficial citado (anti-alucinação).
3. **🧭 Bússola de Afinidade (Quiz Interativo):** Responda às suas prioridades de políticas públicas e visualize sua proximidade vetorial com os planos de cada candidato via gráfico radar.
4. **📊 Analytics & Visualização:** Métricas de densidade programática, tópicos mais enfatizados e análise de vocabulário chave.

---

## 🏗️ Arquitetura do Sistema

```mermaid
flowchart TD
    subgraph DataIngestion [ETL & Ingestão]
        PDF[PDFs Oficiais TSE] --> Extractor[PDF Parser & Structurer]
        Extractor --> Chunker[Semantic Chunker]
        Chunker --> Embeddings[Embedding Engine: Gemini / OpenAI]
        Embeddings --> Chroma[(ChromaDB Vector Store)]
    end

    subgraph BackendAPI [FastAPI Backend]
        Chroma --> RAG[RAG & Citations Engine]
        RAG --> API[FastAPI Endpoints v1]
        API -->|Endpoints: /candidates, /compare, /chat, /quiz| Router[API Router]
    end

    subgraph FrontendUI [Next.js Dashboard]
        Router --> Client[API Client]
        Client --> Views[Comparador | Chat RAG | Bússola Quiz | Analytics]
    end
```

---

## 🛠️ Stack Tecnológica

* **Backend:** Python 3.11+, FastAPI, Pydantic v2, ChromaDB, LangChain, PyPDF2 / pdfplumber.
* **Frontend:** Next.js 14 (App Router), TypeScript, TailwindCSS, Lucide React, Framer Motion, Recharts.
* **DevOps:** Docker, Docker Compose, GitHub Actions (CI).

---

## ⚡ Como Executar Localmente

### Pré-requisitos
* Python 3.11+
* Node.js 18+ ou 20+
* Docker & Docker Compose (Opcional)

### Opção 1: Via Docker Compose (Recomendado)
```bash
# Clone o repositório
git clone https://github.com/Renanbritto/radar-propostas-ia.git
cd radar-propostas-ia

# Copie o arquivo de variáveis de ambiente
cp .env.example .env

# Suba os containers
docker-compose up --build
```
Acesse:
* Frontend: `http://localhost:3000`
* Backend API / Docs: `http://localhost:8000/docs`

---

## 👨‍💻 Autor

Desenvolvido por **Renan Nocelli Britto**
* Portfólio: [renannocelli.dev](https://renannocelli.com.br)
* LinkedIn: [linkedin.com/in/renan-nocelli](https://linkedin.com/in/renan-nocelli)
* GitHub: [@Renanbritto](https://github.com/Renanbritto)
