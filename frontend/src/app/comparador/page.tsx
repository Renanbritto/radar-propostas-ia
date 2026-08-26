"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Candidate, Topic, CompareResponse } from "@/types";
import { fetchCandidates, fetchTopics, compareCandidates } from "@/lib/api";
import { CitationBadge } from "@/components/ui/CitationBadge";
import { GitCompare, Sparkles, Check, AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function ComparadorContent() {
  const searchParams = useSearchParams();
  const initialTopic = searchParams.get("tema") || "saude";
  const initialCands = searchParams.get("candidatos")?.split(",") || [];

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedCandIds, setSelectedCandIds] = useState<string[]>(initialCands);
  const [selectedTopicId, setSelectedTopicId] = useState<string>(initialTopic);
  const [comparison, setComparison] = useState<CompareResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadMeta() {
      const [cands, topcs] = await Promise.all([fetchCandidates(), fetchTopics()]);
      setCandidates(cands);
      setTopics(topcs);

      if (selectedCandIds.length === 0 && cands.length >= 2) {
        setSelectedCandIds([cands[0].id, cands[1].id]);
      }
    }
    loadMeta();
  }, []);

  useEffect(() => {
    if (selectedCandIds.length > 0 && selectedTopicId) {
      handleCompare();
    }
  }, [selectedCandIds, selectedTopicId]);

  async function handleCompare() {
    setLoading(true);
    try {
      const result = await compareCandidates(selectedCandIds, selectedTopicId);
      setComparison(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function toggleCandidate(candId: string) {
    if (selectedCandIds.includes(candId)) {
      if (selectedCandIds.length > 1) {
        setSelectedCandIds(selectedCandIds.filter(id => id !== candId));
      }
    } else {
      setSelectedCandIds([...selectedCandIds, candId]);
    }
  }

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-3">
          <GitCompare className="w-3.5 h-3.5" />
          <span>MATRIZ TEMÁTICA CRUZADA</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Comparador Lado a Lado de Propostas
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Contraste as diretrizes oficiais dos candidatos por eixo temático, identificando convergências, divergências e citações com número de página oficial do TSE.
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="obsidian-card rounded-2xl p-6 space-y-6">
        {/* 1. Escolha de Candidatos */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block mb-3">
            1. Selecione os Candidatos para Comparar:
          </label>
          <div className="flex flex-wrap gap-2.5">
            {candidates.map((cand) => {
              const isSelected = selectedCandIds.includes(cand.id);
              return (
                <button
                  key={cand.id}
                  onClick={() => toggleCandidate(cand.id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all duration-200",
                    isSelected
                      ? "bg-emerald-500/20 text-white border-emerald-500/40 shadow-sm"
                      : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:border-white/[0.15] hover:text-slate-200"
                  )}
                >
                  <div
                    className="w-3 h-3 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                    style={{ backgroundColor: cand.color }}
                  >
                    {isSelected && <Check className="w-2 h-2" />}
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
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono block mb-3">
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
                      ? "bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/20"
                      : "bg-white/[0.02] text-slate-300 border-white/[0.06] hover:border-white/[0.15]"
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
        <div className="obsidian-card rounded-2xl p-12 text-center">
          <Sparkles className="w-8 h-8 text-emerald-400 animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-300 font-medium">Analisando propostas nos planos de governo oficiais...</p>
        </div>
      ) : comparison ? (
        <div className="space-y-6">
          {/* Executive Summary Card */}
          <div className="obsidian-card rounded-2xl p-6 border-l-4 border-emerald-500">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Síntese Comparativa da IA</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              {comparison.comparative_summary}
            </p>
          </div>

          {/* Side by Side Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {comparison.candidate_details.map((cand) => (
              <div
                key={cand.candidate_id}
                className="obsidian-card rounded-2xl p-6 flex flex-col justify-between border-t-4"
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
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px]">
                      <span className="text-slate-400 block font-semibold font-mono text-[10px]">MODELO DE GESTÃO:</span>
                      <span className="text-emerald-300 font-medium">{cand.governance_style}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.05] text-[11px]">
                      <span className="text-slate-400 block font-semibold font-mono text-[10px]">FONTE DE RECURSOS:</span>
                      <span className="text-slate-200">{cand.funding_strategy}</span>
                    </div>
                  </div>

                  {/* Key Proposals */}
                  <div className="space-y-3 mb-6">
                    <h5 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 font-mono">
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
                  <span className="text-[10px] text-slate-400 block mb-2 font-mono uppercase">Citações Documentais:</span>
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
            <div className="obsidian-card rounded-2xl p-6 border-l-4 border-amber-500">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Principais Divergências</h4>
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
            <div className="obsidian-card rounded-2xl p-6 border-l-4 border-emerald-500">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide">Pontos de Convergência</h4>
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

export default function ComparadorPage() {
  return (
    <Suspense fallback={
      <div className="py-12 text-center text-slate-400 text-xs font-mono">
        Carregando comparador de propostas...
      </div>
    }>
      <ComparadorContent />
    </Suspense>
  );
}
