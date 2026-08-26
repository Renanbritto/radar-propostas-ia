# 🤖 Radar de Propostas IA (RAG + NLP)

> **Plataforma Cívica Inteligente de Análise, Comparação e Consulta Semântica com RAG sobre Planos de Governo Oficiais.**

[![CI Pipeline](https://github.com/Renanbritto/radar-propostas-ia/actions/workflows/ci.yml/badge.svg)](https://github.com/Renanbritto/radar-propostas-ia/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111.0+-009688.svg?style=flat&logo=FastAPI&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black.svg?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.11+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://python.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4+-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🎯 Sobre o Projeto

O **Radar de Propostas IA** é uma aplicação completa (Fullstack + Data Science & IA Generativa) projetada para empoderar eleitores através do acesso simplificado, transparente e auditável aos planos de governo oficiais submetidos à Justiça Eleitoral (TSE).

Diferente de IAs generativas generalistas que podem apresentar alucinações, o projeto utiliza uma arquitetura **RAG (Retrieval-Augmented Generation) estrita**: todas as respostas e comparações são obrigatoriamente vinculadas a trechos reais, indicando o **número da página e a citação oficial** registrada pelo candidato.

---

## 🚀 Principais Funcionalidades

### 1. 🔍 Comparador Temático Lado a Lado
* **Contraste de Propostas:** Compare 2 ou mais candidatos simultaneamente para qualquer um dos 8 eixos temáticos (Saúde, Educação, Segurança, Economia, Meio Ambiente, Tecnologia, etc.).
* **Análise de Governança & Financiamento:** Identificação do modelo de gestão (Estatal direto vs PPPs/concessões) e da estratégia orçamentária declarada.
* **Mapeamento de Convergências e Divergências:** Destaque automático de pontos de concordância e conflito ideológico entre os planos.

### 2. 💬 Chat RAG Cívico com Citações Auditáveis
* **Busca Semântica & Q&A:** O usuário pode perguntar em linguagem natural (ex: *"Como pretendem zerar a fila de creches ou investir em telemedicina?"*).
* **Citação com Verificação Instantânea:** Cada balão de resposta traz badges interativos que abrem um modal com a citação original do plano e a página correspondente.
* **Filtro por Candidato:** Possibilidade de consultar o plano de um candidato específico ou varrer todos os concorrentes simultaneamente.

### 3. 🧭 Bússola de Afinidade (Quiz de Prioridades)
* **Match Programático:** Questionário interativo com perguntas estratégicas sobre dilemas de gestão pública.
* **Cálculo Vetorial:** Avalia a afinidade entre as preferências do eleitor e as propostas dos candidatos, gerando um ranking percentual com breakdown por área.

### 4. 📊 Diretório de Candidaturas & Analytics
* **Métricas dos Planos:** Contagem total de propostas indexadas, volume de páginas e distribuição proporcional de ênfase por tema.

---

## 🏗️ Arquitetura do Sistema

```mermaid
flowchart TD
    subgraph Ingestao [1. Ingestão & Processamento de Dados]
        PDF[PDFs Oficiais do TSE] --> Parser[PDF Parser & Text Extractor]
        Parser --> Chunker[Semantic Chunker com Metadados]
        Chunker --> VectorStore[(Vector Store / Índice Semântico)]
    end

    subgraph Backend [2. Backend FastAPI - Python 3.11]
        VectorStore --> RAG[RAG Engine & Citation Service]
        RAG --> API[API Endpoints v1]
        API --> Endpoints[/candidates, /compare, /chat, /quiz]
    end

    subgraph Frontend [3. Frontend Next.js 14 & TypeScript]
        Endpoints --> HTTPClient[Typed API Client]
        HTTPClient --> Comparador[Comparador Lado a Lado]
        HTTPClient --> ChatRAG[Chat Cívico RAG]
        HTTPClient --> Quiz[Bússola de Afinidade]
        HTTPClient --> Candidatos[Diretório de Candidatos]
    end
```

---

## 📂 Estrutura de Diretórios

```
radar-propostas-ia/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/       # Endpoints: candidates, compare, chat, quiz
│   │   ├── core/                   # Settings, Pydantic BaseSettings, logging
│   │   ├── data/                   # Dataset estruturado e metadados
│   │   ├── models/                 # Pydantic v2 schemas tipados
│   │   ├── services/               # RAG Engine, VectorStore, Comparator, QuizService
│   │   └── main.py                 # FastAPI Application
│   ├── tests/                      # Pytest test suite (100% passing)
│   ├── Dockerfile
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router (/, /comparador, /chat, /quiz, /candidatos)
│   │   ├── components/             # UI Components (Liquid Glass, Header, Footer, Badges)
│   │   ├── lib/                    # API client tipado & helpers
│   │   ├── styles/                 # Tailwind design tokens & globals.css
│   │   └── types/                  # TypeScript interfaces
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── .github/workflows/ci.yml        # CI Pipeline (GitHub Actions)
├── docker-compose.yml              # Container orchestration
├── .env.example                    # Template de variáveis de ambiente
├── .gitignore
└── README.md
```

---

## ⚡ Como Executar Localmente

### Opção 1: Via Docker Compose (Recomendado)
```bash
# 1. Clone o repositório
git clone https://github.com/Renanbritto/radar-propostas-ia.git
cd radar-propostas-ia

# 2. Copie as variáveis de ambiente
cp .env.example .env

# 3. Suba a aplicação completa
docker-compose up --build
```
Acesse:
* **Frontend:** `http://localhost:3000`
* **API Docs (Swagger/OpenAPI):** `http://localhost:8000/docs`

---

### Opção 2: Execução Manual

#### 1. Backend (Python 3.11+)
```bash
cd backend
python -m venv .venv

# Windows
.\\.venv\\Scripts\\activate
# Linux/macOS
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

#### 2. Frontend (Node.js 18+)
```bash
cd frontend
npm install
npm run dev
```

---

## 🧪 Testes Automatizados

O backend conta com uma suíte de testes com `pytest` cobrindo buscas vetoriais, RAG, comparador e endpoints REST:

```bash
cd backend
pytest tests/ -v
```

---

## 👨‍💻 Autor

Desenvolvido com foco em boas práticas de engenharia de software, IA generativa e transparência cívica por **Renan Nocelli Britto**.

* **Portfólio:** [renannocelli.dev](https://renannocelli.com.br)
* **LinkedIn:** [linkedin.com/in/renan-nocelli](https://linkedin.com/in/renan-nocelli)
* **GitHub:** [@Renanbritto](https://github.com/Renanbritto)

---

## 📜 Licença

Distribuído sob a licença MIT.