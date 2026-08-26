import { HeroSection } from "@/components/home/HeroSection";
import { TopicGrid } from "@/components/home/TopicGrid";
import { CandidateCard } from "@/components/ui/CandidateCard";
import { fetchCandidates, fetchTopics } from "@/lib/api";
import { Sparkles, Bot, ShieldCheck, ArrowRight } from "lucide-react";
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
      <section className="py-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
              Candidaturas Registradas
            </span>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Planos de Governo Oficiais Analisados
            </h2>
          </div>
          <Link
            href="/candidatos"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:text-sky-300"
          >
            Ver todos os detalhes
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
          {candidates.map((cand) => (
            <CandidateCard key={cand.id} candidate={cand} />
          ))}
        </div>
      </section>

      {/* How RAG Works Section */}
      <section className="liquid-glass-card rounded-3xl p-8 sm:p-10 border border-white/[0.08] relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-4">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>TransparÃªncia CÃ­vica com IA</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
              Como funciona o Motor RAG com CitaÃ§Ãµes AuditÃ¡veis?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
              Diferente de IAs generativas convencionais que podem alucinar, o <strong>Radar de Propostas</strong> utiliza uma arquitetura RAG (Retrieval-Augmented Generation) estrita: cada resposta Ã© ancorada em trechos reais extraÃ­dos dos PDFs submetidos ao TSE, trazendo o nÃºmero da pÃ¡gina correspondente.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/chat"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
              >
                <Bot className="w-4 h-4" />
                Experimentar Chat RAG
              </Link>
              <Link
                href="/quiz"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] font-semibold text-xs transition-colors"
              >
                Fazer Quiz de Afinidade
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="liquid-glass-card rounded-2xl p-4 border border-white/[0.06] bg-black/40">
              <span className="text-[10px] font-mono text-sky-400">PASSO 1</span>
              <h4 className="text-sm font-bold text-white mt-1">ExtraÃ§Ã£o e Chunking Estruturado</h4>
              <p className="text-xs text-slate-400 mt-1">
                Os PDFs do DivulgaCandContas sÃ£o processados e divididos em blocos semÃ¢nticos com metadados de eixo temÃ¡tico e pÃ¡gina oficial.
              </p>
            </div>
            <div className="liquid-glass-card rounded-2xl p-4 border border-white/[0.06] bg-black/40">
              <span className="text-[10px] font-mono text-emerald-400">PASSO 2</span>
              <h4 className="text-sm font-bold text-white mt-1">IndexaÃ§Ã£o Vetorial SemÃ¢ntica</h4>
              <p className="text-xs text-slate-400 mt-1">
                GeraÃ§Ã£o de vetores para busca semÃ¢ntica por similaridade de cosseno, permitindo encontrar propostas mesmo com termos sinÃ´nimos.
              </p>
            </div>
            <div className="liquid-glass-card rounded-2xl p-4 border border-white/[0.06] bg-black/40">
              <span className="text-[10px] font-mono text-indigo-400">PASSO 3</span>
              <h4 className="text-sm font-bold text-white mt-1">SÃ­ntese Fundamentada com CitaÃ§Ãµes</h4>
              <p className="text-xs text-slate-400 mt-1">
                A resposta Ã© gerada combinando os trechos mais relevantes com indicaÃ§Ã£o de pÃ¡gina para auditoria imediata pelo cidadÃ£o.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
