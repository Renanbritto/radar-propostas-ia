import Link from "next/link";
import { Bot, Compass, GitCompare, Sparkles, ShieldCheck, Activity, Terminal } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-16 radar-grid-bg rounded-3xl border border-white/[0.06] mt-4">
      {/* Glow background effects (Emerald & Cyan Sonar) */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[320px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none animate-sonar" />
      <div className="absolute top-1/4 left-1/3 w-[350px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-mono shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>CENTRAL DE AUDITORIA ELEITORAL • PRESIDÊNCIA 2026</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12]">
          Auditoria & Comparação de <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Planos de Governo com IA e RAG
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Análise semântica e neutra dos programas de governo oficiais registrados no TSE. Obtenha respostas com citações auditáveis, número exato de página e análise forense de gastos de campanha.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/comparador"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
          >
            <GitCompare className="w-4 h-4" />
            Comparar Propostas por Tema
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/[0.1] font-semibold text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4 text-cyan-400" />
            Chat RAG com Citações
          </Link>
          <Link
            href="/quiz"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            Bússola de Afinidade
          </Link>
        </div>

        {/* Intelligence Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left pt-6">
          <div className="obsidian-card rounded-2xl p-4 border-l-2 border-emerald-500">
            <span className="text-xl font-bold text-emerald-400 font-mono">100%</span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Citações com Página Oficial</p>
          </div>
          <div className="obsidian-card rounded-2xl p-4 border-l-2 border-cyan-500">
            <span className="text-xl font-bold text-cyan-400 font-mono">804+</span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Propostas Indexadas no RAG</p>
          </div>
          <div className="obsidian-card rounded-2xl p-4 border-l-2 border-indigo-500">
            <span className="text-xl font-bold text-indigo-400 font-mono">8 Eixos</span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Temas Estratégicos Nacionais</p>
          </div>
          <div className="obsidian-card rounded-2xl p-4 border-l-2 border-amber-500">
            <span className="text-xl font-bold text-amber-400 font-mono">R$ 858M</span>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">Gastos TSE Monitorados</p>
          </div>
        </div>
      </div>
    </section>
  );
}
