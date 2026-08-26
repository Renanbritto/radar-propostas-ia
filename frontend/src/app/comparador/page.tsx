"use client";

import { useState, useEffect } from "react";
import { fetchCandidates, fetchTopics, compareCandidates } from "@/lib/api";
import { Candidate, Topic, CompareResponse } from "@/types";
import { CitationBadge } from "@/components/ui/CitationBadge";
import { GitCompare, CheckCircle2, AlertTriangle, Sparkles, Filter, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ComparadorPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("saude");
  const [selectedCandIds, setSelectedCandIds] = useState<string[]>([]);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Carregar candidatos e tópicos iniciais
  useEffect(() => {
    async function init() {
      const [cands, topcs] = await Promise.all([fetchCandidates(), fetchTopics()]);
      setCandidates(cands);
      setTopics(topcs);
      if (cands.length >= 2) {
        setSelectedCandIds([cands[0].id, cands[1].id]);
      } else if (cands.length > 0) {
        setSelectedCandIds([cands[0].id]);
      }
    }
    init();
  }, []);

  // Recalcular comparação sempre que mudar tópico ou candidatos
  useEffect(() => {
    if (selectedCandIds.length === 0 || !selectedTopicId) return;

    async function runCompare() {
      setLoading(true);
      try {
        const res = await compareCandidates(selectedCandIds, selectedTopicId);
        setComparison(res);
      } catch (err) {
        console.error("Erro na comparação:", err);
      } finally {
        setLoading(false);
      }
    }

    runCompare();
  }, [selectedTopicId, selectedCandIds]);

  const toggleCandidate = (id: string) => {
    setSelectedCandIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // Manter ao menos 1
        return prev.filter((item) => item !== id);
      }
      return [...prev, id];
    });
  };

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
          <GitCompare className="w-3.5 h-3.5" />
          <span>Comparador Semântico Lado a Lado</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Comparação de Propostas Oficiais por Tema
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Contraste diretamente as abordagens, modelo de governança, estratégia de financiamento e citações oficiais de cada plano.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="liquid-glass-card rounded-2xl p-6 space-y-6">
        {/* 1. Escolha de Candidatos */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            1. Selecione os Candidatos para Comparar:
          </label>
          <div className="flex flex-wrap gap-3">
            {candidates.map((cand) => {
              const isSelected = selectedCandIds.includes(cand.id);
              return (
                <button
                  key={cand.id}
                  onClick={() => toggleCandidate(cand.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200",
                    isSelected
                      ? "bg-sky-500/20 text-white border-sky-500/40 shadow-sm"
                      : "bg-white/[0.03] text-slate-400 border-white/[0.08] hover:border-white/[0.2] hover:text-slate-200"
                  )}
                >
                  <div
                    className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ backgroundColor: cand.color }}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5" />}
                  </div>
                  <span>{cand.ballot_name}</span>
                  <span className="font-mono text-[10px] text-slate-400">({cand.party_acronym})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Escolha do Tema */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-3">
            2. Selecione o Eixo Temático:
          </label>
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => {
              const isSelected = selectedTopicId === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopicId(t.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
                    isSelected
                      ? "bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-md shadow-sky-500/20"
                      : "bg-white/[0.03] text-slate-300 border-white/[0.08] hover:border-white/[0.2]"
                  )}
                >
                  {t.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {loading ? (
        <div className="liquid-glass-card rounded-2xl p-12 text-center">
          <Sparkles className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-300 font-medium">Analisando propostas nos planos de governo oficiais...</p>
        </div>
      ) : comparison ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="liquid-glass-card rounded-2xl p-6 border-l-4 border-sky-500">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <h3 className="text-sm font-bold text-white">Síntese Comparativa da IA</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {comparison.comparative_summary}
            </p>
          </div>

          {/* Side by Side Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparison.candidate_details.map((cand) => (
              <div
                key={cand.candidate_id}
                className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between border-t-4"
                style={{ borderTopColor: cand.color }}
              >
                <div>
                  {/* Candidate Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-bold text-base text-white">{cand.candidate_name}</h4>
                      <span className="text-xs text-slate-400 font-mono">{cand.party_acronym}</span>
                    </div>
                  </div>

                  {/* Governance & Funding Badges */}
                  <div className="space-y-2 mb-4">
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px]">
                      <span className="text-slate-400 block font-semibold">Modelo de Gestão:</span>
                      <span className="text-sky-300 font-medium">{cand.governance_style}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-[11px]">
                      <span className="text-slate-400 block font-semibold">Fonte de Recursos:</span>
                      <span className="text-slate-200">{cand.funding_strategy}</span>
                    </div>
                  </div>

                  {/* Key Proposals */}
                  <div className="space-y-3 mb-6">
                    <h5 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Propostas Registradas:
                    </h5>
                    {cand.key_proposals.map((prop, i) => (
                      <p key={i} className="text-xs text-slate-300 leading-relaxed pl-3 border-l-2 border-white/10">
                        {prop}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Citations Footer */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <span className="text-[10px] text-slate-400 block mb-2 font-mono">Citações no Documento:</span>
                  <div className="flex flex-wrap gap-2">
                    {cand.quotes_with_citations.map((citation, i) => (
                      <CitationBadge key={i} citation={citation} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Divergences & Convergences */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Divergence */}
            <div className="liquid-glass-card rounded-2xl p-6 border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Principais Divergências</h4>
              </div>
              <ul className="space-y-2.5">
                {comparison.divergence_points.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Convergence */}
            <div className="liquid-glass-card rounded-2xl p-6 border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Pontos de Convergência</h4>
              </div>
              <ul className="space-y-2.5">
                {comparison.convergence_points.map((pt, i) => (
                  <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                    <span className="text-emerald-400 font-bold">•</span>
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
