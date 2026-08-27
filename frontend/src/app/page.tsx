import { HeroSection } from "@/components/home/HeroSection";
import { TopicGrid } from "@/components/home/TopicGrid";
import { CandidateCard } from "@/components/ui/CandidateCard";
import { fetchCandidates, fetchTopics } from "@/lib/api";
import { ShieldCheck, ArrowRight, Bot, Compass, Database } from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const [candidates, topics] = await Promise.all([
    fetchCandidates(),
    fetchTopics()
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Clean Hero Section */}
      <HeroSection />

      {/* 2. Candidaturas 2026 */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Candidaturas Registradas no TSE
            </h2>
            <p className="text-xs text-slate-400">
              Planos de governo oficiais da eleição presidencial 2026
            </p>
          </div>
          <Link
            href="/candidatos"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
          >
            <span>Ver perfil completo</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
          {candidates.map((cand) => (
            <CandidateCard key={cand.id} candidate={cand} />
          ))}
        </div>
      </section>

      {/* 3. Thematic Grid */}
      <TopicGrid topics={topics} />

      {/* 4. Minimalist Transparency Strip */}
      <section className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
              <Database className="w-4 h-4" />
              <span>DADOS OFICIAIS TSE</span>
            </div>
            <h3 className="text-sm font-bold text-white">Documentos Autênticos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Extração direta dos PDFs submetidos à Justiça Eleitoral pelo portal DivulgaCandContas 2026.
            </p>
          </div>

          <div className="space-y-2 md:border-l border-white/[0.06] md:pl-6">
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold">
              <Bot className="w-4 h-4" />
              <span>MOTOR RAG ESTRITO</span>
            </div>
            <h3 className="text-sm font-bold text-white">Citações com Página</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cada resposta da IA é ancorada em trechos reais, trazendo a página exata para auditoria imediata.
            </p>
          </div>

          <div className="space-y-2 md:border-l border-white/[0.06] md:pl-6">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>INVESTIGAVOTO</span>
            </div>
            <h3 className="text-sm font-bold text-white">Auditoria de Gastos</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cruzamento de promessas de campanha com fornecedores contratados e doações declaradas.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
