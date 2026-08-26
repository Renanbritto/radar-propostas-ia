"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Compass, GitCompare, Users, Sparkles, Github, DollarSign, Radio } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Visão Geral", href: "/", icon: Sparkles },
  { label: "Comparador", href: "/comparador", icon: GitCompare },
  { label: "Chat RAG", href: "/chat", icon: Bot },
  { label: "Bússola", href: "/quiz", icon: Compass },
  { label: "InvestigaVoto", href: "/financiamento", icon: DollarSign },
  { label: "Candidatos", href: "/candidatos", icon: Users },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#07090E]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#07090E] rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight text-white">Radar de Propostas</span>
              <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                2026 TSE
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono tracking-wide">Inteligência Cívica & Auditoria</span>
          </div>
        </Link>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 bg-white/[0.02] p-1 rounded-2xl border border-white/[0.06]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-emerald-400" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* GitHub / Status Info */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-white/[0.02] border border-white/[0.05] text-[11px] font-mono text-slate-400">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>5 CANDIDATOS</span>
          </div>

          <a
            href="https://github.com/Renanbritto/radar-propostas-ia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Repositório</span>
          </a>
        </div>
      </div>
    </header>
  );
}
