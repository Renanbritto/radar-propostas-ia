"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bot, Compass, GitCompare, ArrowRight, Search, Sparkles } from "lucide-react";

export function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      router.push("/chat");
    } else {
      router.push(`/chat?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <section className="relative pt-12 pb-12 text-center">
      {/* Subtle Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Eleições Presidenciais 2026 • IA & RAG Auditável</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
          Compare Planos de Governo e <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Gastos de Campanha com IA
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Análise neutra dos programas de governo e prestação de contas do TSE, com respostas fundamentadas em citações oficiais com número de página.
        </p>

        {/* Interactive Search / Prompt Input */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto pt-2">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pergunte sobre qualquer proposta (ex: SUS, Imposto de Renda, Segurança)..."
              className="w-full pl-11 pr-28 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.06] focus:bg-[#0C1019] border border-white/[0.1] focus:border-emerald-500/50 text-white text-xs sm:text-sm placeholder-slate-400 outline-none transition-all shadow-lg shadow-black/40"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
            >
              <span>Consultar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Shortcut Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          <Link
            href="/comparador"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-medium transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-emerald-400" />
            Comparador Lado a Lado
          </Link>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-medium transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            Quiz de Afinidade
          </Link>
          <Link
            href="/financiamento"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white border border-white/[0.06] text-xs font-medium transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            InvestigaVoto (Finanças)
          </Link>
        </div>

        {/* Clean Minimal Stats Strip */}
        <div className="pt-8 max-w-2xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 px-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
            <div>
              <span className="text-base font-bold text-white font-mono">100%</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Auditável</p>
            </div>
            <div className="sm:border-l border-white/[0.06]">
              <span className="text-base font-bold text-emerald-400 font-mono">804+</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Propostas</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-2 sm:pt-0">
              <span className="text-base font-bold text-cyan-400 font-mono">8 Eixos</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Temas</p>
            </div>
            <div className="border-t sm:border-t-0 sm:border-l border-white/[0.06] pt-2 sm:pt-0">
              <span className="text-base font-bold text-amber-400 font-mono">R$ 858M</span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">Gastos TSE</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
