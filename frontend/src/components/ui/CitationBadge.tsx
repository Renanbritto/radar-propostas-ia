"use client";

import { useState } from "react";
import { Citation } from "@/types";
import { BookOpen, CheckCircle2, X } from "lucide-react";

interface CitationBadgeProps {
  citation: Citation;
}

export function CitationBadge({ citation }: CitationBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-mono transition-all hover:scale-[1.02]"
        title="Ver citação e página oficial no Plano de Governo"
      >
        <BookOpen className="w-3 h-3 text-sky-400" />
        <span className="font-semibold">{citation.party_acronym}</span>
        <span className="text-slate-400">•</span>
        <span>Pág. {citation.page_number}</span>
      </button>

      {/* Citation Modal / Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg liquid-glass-card rounded-2xl p-6 border border-white/[0.12] shadow-2xl">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 rounded-lg bg-sky-500/20 text-sky-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <div>
                <h4 className="text-sm font-bold text-white">Citação Oficial Auditável</h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  {citation.candidate_name} ({citation.party_acronym}) • Página {citation.page_number}
                </p>
              </div>
            </div>

            {citation.section_title && (
              <div className="mb-3 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs font-medium text-slate-300">
                📌 Seção: <span className="text-sky-300">{citation.section_title}</span>
              </div>
            )}

            <blockquote className="p-4 rounded-xl bg-black/40 border-l-4 border-sky-500 text-xs text-slate-200 leading-relaxed font-sans italic mb-4">
              "{citation.excerpt}"
            </blockquote>

            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06] text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Documento Registrado no TSE</span>
              </div>
              <span className="font-mono">Relevância: {(citation.relevance_score * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
