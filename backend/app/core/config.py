import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(case_sensitive=True, env_file=".env", extra="ignore")

    PROJECT_NAME: str = "Radar de Propostas IA"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # LLM Settings
    LLM_PROVIDER: str = "auto"  # 'groq', 'gemini', 'openai', 'auto'
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    OPENAI_API_KEY: str = ""
    
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    GEMINI_MODEL: str = "gemini-1.5-flash"
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    # Topics configuration
    TOPICS: List[dict] = [
        {"id": "saude", "name": "Saúde Pública", "icon": "HeartPulse", "description": "SUS, telemedicina, hospitais, vacinação e atenção primária"},
        {"id": "educacao", "name": "Educação & Ciência", "icon": "GraduationCap", "description": "Ensino básico, integral, valorização docente, universidades e pesquisa"},
        {"id": "economia", "name": "Economia & Emprego", "icon": "TrendingUp", "description": "Geração de empregos, tributação, atração de investimentos e inovação produtiva"},
        {"id": "seguranca", "name": "Segurança Pública", "icon": "ShieldAlert", "description": "Policiamento ostensivo, inteligência, redução de homicídios e sistema prisional"},
        {"id": "meio_ambiente", "name": "Meio Ambiente & Clima", "icon": "Leaf", "description": "Transição energética, desmatamento zero, saneamento básico e sustentabilidade"},
        {"id": "tecnologia", "name": "Tecnologia & Inovação", "icon": "Cpu", "description": "Governo digital, IA no setor público, inclusão digital e startups"},
        {"id": "social", "name": "Assistência & Direitos", "icon": "Users", "description": "Transferência de renda, combate à fome, habitação e inclusão social"},
        {"id": "infraestrutura", "name": "Infraestrutura & Mobilidade", "icon": "Building2", "description": "Transporte público, ferrovias, portos, rodovias e habitação popular"}
    ]

settings = Settings()
