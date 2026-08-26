import Link from "next/link";
import { Bot, Compass, GitCompare, Sparkles, FileSearch, ShieldCheck } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20">
      {/* Glow background effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-sky-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Inteligência Artificial Aplicada a Políticas Públicas</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Compare e Audite os <br className="hidden sm:block" />
          <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Planos de Governo com IA & RAG
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
          Acesse uma análise semântica e neutra das propostas oficiais de campanha registradas no TSE. Obtenha respostas fundamentadas com número de página e citações diretas.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Link
            href="/comparador"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-sky-500/20 transition-all hover:scale-105"
          >
            <GitCompare className="w-4 h-4" />
            Comparar Propostas por Tema
          </Link>
          <Link
            href="/chat"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white border border-white/[0.1] font-semibold text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Bot className="w-4 h-4 text-sky-400" />
            Perguntar à IA (Chat RAG)
          </Link>
          <Link
            href="/quiz"
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 font-semibold text-xs sm:text-sm transition-all hover:scale-105"
          >
            <Compass className="w-4 h-4" />
            Bússola de Afinidade
          </Link>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
          <div className="liquid-glass-card rounded-xl p-4">
            <span className="text-xl font-bold text-sky-400 font-mono">100%</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Citações com Páginas Oficiais</p>
          </div>
          <div className="liquid-glass-card rounded-xl p-4">
            <span className="text-xl font-bold text-emerald-400 font-mono">804+</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Propostas Indexadas</p>
          </div>
          <div className="liquid-glass-card rounded-xl p-4">
            <span className="text-xl font-bold text-indigo-400 font-mono">8</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Eixos Temáticos Analisados</p>
          </div>
          <div className="liquid-glass-card rounded-xl p-4">
            <span className="text-xl font-bold text-teal-400 font-mono">Zero</span>
            <p className="text-[11px] text-slate-400 mt-0.5">Alucinações / RAG Estrito</p>
          </div>
        </div>
      </div>
    </section>
  );
}
