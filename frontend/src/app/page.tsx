import { HeroSection } from "@/components/home/HeroSection";
import { TopicGrid } from "@/components/home/TopicGrid";
import { CandidateCard } from "@/components/ui/CandidateCard";
import { fetchCandidates, fetchTopics } from "@/lib/api";
import { Sparkles, Bot, ShieldCheck, ArrowRight, Activity, Terminal } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [candidates, topics] = await Promise.all([
    fetchCandidates(),
    fetchTopics()
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <HeroSection />

      {/* Topics Grid */}
      <TopicGrid topics={topics} />

      {/* Candidates Section */}
      <section className="py-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-2">
              <Activity className="w-3.5 h-3.5" />
              <span>DIRETÓRIO OFICIAL TSE</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Planos de Governo Presidenciais Registrados
            </h2>
          </div>
          <Link
            href="/candidatos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            Ver todos os detalhes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {candidates.map((cand) => (
            <CandidateCard key={cand.id} candidate={cand} />
          ))}
        </div>
      </section>

      {/* How RAG Works Section */}
      <section className="obsidian-card rounded-3xl p-8 sm:p-10 border border-white/[0.08] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ARQUITETURA DE AUDITORIA CÍVICA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4 leading-tight">
              Como funciona o Motor RAG com Citações Auditáveis?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Diferente de IAs generativas convencionais que podem alucinar, o <strong>Radar de Propostas</strong> utiliza uma arquitetura RAG (Retrieval-Augmented Generation) estrita: cada resposta é ancorada em trechos reais extraídos dos PDFs submetidos ao TSE, trazendo o número da página correspondente.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/chat"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-emerald-500/20"
              >
                <Bot className="w-4 h-4" />
                Experimentar Chat RAG
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] font-semibold text-xs transition-colors"
              >
                Fazer Quiz de Afinidade
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="obsidian-card rounded-2xl p-4 border-l-2 border-emerald-500">
              <span className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wider">PASSO 01 • INGESTÃO</span>
              <h4 className="text-sm font-bold text-white mt-1">Extração e Chunking Estruturado</h4>
              <p className="text-xs text-slate-400 mt-1">
                Os PDFs do DivulgaCandContas são processados e divididos em blocos semânticos com metadados de eixo temático e página oficial.
              </p>
            </div>
            <div className="obsidian-card rounded-2xl p-4 border-l-2 border-cyan-500">
              <span className="text-[10px] font-mono text-cyan-400 font-semibold tracking-wider">PASSO 02 • RECUPERAÇÃO</span>
              <h4 className="text-sm font-bold text-white mt-1">Indexação Vetorial Semântica</h4>
              <p className="text-xs text-slate-400 mt-1">
                Geração de vetores para busca semântica por similaridade de cosseno, permitindo encontrar propostas mesmo com termos sinônimos.
              </p>
            </div>
            <div className="obsidian-card rounded-2xl p-4 border-l-2 border-indigo-500">
              <span className="text-[10px] font-mono text-indigo-400 font-semibold tracking-wider">PASSO 03 • AUDITORIA</span>
              <h4 className="text-sm font-bold text-white mt-1">Síntese Fundamentada com Citações</h4>
              <p className="text-xs text-slate-400 mt-1">
                A resposta é gerada combinando os trechos mais relevantes com indicação de página para auditoria imediata pelo cidadão.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
