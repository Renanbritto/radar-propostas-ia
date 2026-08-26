"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Compass, GitCompare, Users, Sparkles, Github } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Visão Geral", href: "/", icon: Sparkles },
  { label: "Comparador", href: "/comparador", icon: GitCompare },
  { label: "Chat RAG Cívico", href: "/chat", icon: Bot },
  { label: "Bússola (Quiz)", href: "/quiz", icon: Compass },
  { label: "Candidatos", href: "/candidatos", icon: Users },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.08] bg-[#090D16]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#090D16] rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-sky-400" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">Radar de Propostas</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                IA Cívica
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Planos Oficiais TSE</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] p-1 rounded-2xl border border-white/[0.06]">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200",
                  isActive
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* GitHub / Action */}
        <div className="flex items-center gap-3">
          <a
            href="https://github.com/Renanbritto/radar-propostas-ia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
}
