import { fetchCandidates, fetchTopics } from "@/lib/api";
import { Users, FileText, CheckCircle, ArrowRight, Bot, GitCompare, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default async function CandidatosPage() {
  const [candidates, topics] = await Promise.all([
    fetchCandidates(),
    fetchTopics()
  ]);

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-3">
          <Users className="w-3.5 h-3.5" />
          <span>DIRETÓRIO OFICIAL DE CANDIDATURAS</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Planos de Governo Registrados no TSE (2026)
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Consulte o perfil programático de cada candidatura presidencial, a distribuição de propostas por eixo temático e os documentos oficiais indexados no motor RAG.
        </p>
      </div>

      {/* Candidate Dossiers */}
      <div className="space-y-6">
        {candidates.map((cand) => (
          <div
            key={cand.id}
            className="obsidian-card rounded-3xl p-6 sm:p-8 border-l-4"
            style={{ borderLeftColor: cand.color }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Col */}
              <div className="lg:col-span-1 space-y-4">
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center font-extrabold text-2xl text-white shadow-lg shrink-0"
                    style={{ backgroundColor: cand.color }}
                  >
                    {cand.ballot_number}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{cand.ballot_name}</h2>
                    <p className="text-xs text-slate-400 font-mono font-medium">
                      {cand.party_acronym} • {cand.role}
                    </p>
                    {cand.coalition && (
                      <p className="text-[11px] text-slate-500 mt-0.5">{cand.coalition}</p>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {cand.summary}
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300">
                    📄 {cand.total_pages} Páginas no PDF
                  </span>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-300">
                    🎯 {cand.total_proposals} Propostas
                  </span>
                </div>

                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href={`/comparador?candidatos=${cand.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    Comparar
                  </Link>
                  <Link
                    href={`/chat`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/[0.08] text-xs font-semibold transition-colors"
                  >
                    <Bot className="w-3.5 h-3.5 text-cyan-400" />
                    Perguntar ao RAG
                  </Link>
                </div>
              </div>

              {/* Highlights & Thematic Breakdown */}
              <div className="lg:col-span-2 space-y-6">
                {/* Highlights */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">
                    Principais Compromissos do Plano:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cand.key_highlights.map((highlight, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-black/40 border border-white/[0.04] flex items-start gap-2.5">
                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-200 leading-relaxed">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Theme Distribution */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-3">
                    Distribuição de Propostas por Área:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {topics.map((t) => {
                      const count = cand.theme_distribution[t.id] || 0;
                      return (
                        <div key={t.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <span className="text-[11px] text-slate-400 block truncate font-medium">{t.name}</span>
                          <span className="text-sm font-bold text-white font-mono">{count}</span>
                          <span className="text-[10px] text-slate-500 ml-1">propostas</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
