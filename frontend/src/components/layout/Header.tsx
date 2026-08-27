"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Compass, GitCompare, Users, Sparkles, Github, DollarSign, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Comparador", href: "/comparador", icon: GitCompare },
  { label: "Chat IA", href: "/chat", icon: Bot },
  { label: "Bússola", href: "/quiz", icon: Compass },
  { label: "InvestigaVoto", href: "/financiamento", icon: DollarSign },
  { label: "Candidatos", href: "/candidatos", icon: Users },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#07090E]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform shrink-0">
            <div className="w-full h-full bg-[#07090E] rounded-[10px] flex items-center justify-center">
              <Bot className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-white tracking-tight group-hover:text-emerald-300 transition-colors">
              Radar de Propostas
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              2026
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                  isActive
                    ? "bg-white/[0.08] text-emerald-300 font-semibold"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                <Icon className={cn("w-3.5 h-3.5", isActive ? "text-emerald-400" : "text-slate-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop GitHub & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <a
            href="https://github.com/Renanbritto/radar-propostas-ia"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-xs font-medium text-slate-300 hover:text-white border border-white/[0.06] transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub</span>
          </a>

          {/* Hamburger Menu Toggle (Mobile) */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white transition-colors"
            aria-label="Abrir menu de navegação"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bottom-0 bg-[#07090E]/95 backdrop-blur-2xl z-50 p-6 flex flex-col justify-between animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-2">
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-3">
              Módulos da Plataforma
            </span>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold"
                      : "bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] border border-white/[0.04]"
                  )}
                >
                  <div className={cn("p-2 rounded-xl", isActive ? "bg-emerald-500/20 text-emerald-300" : "bg-white/[0.05] text-slate-400")}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-6 border-t border-white/[0.06] space-y-3">
            <a
              href="https://github.com/Renanbritto/radar-propostas-ia"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-white/[0.05] text-xs font-semibold text-white border border-white/[0.08]"
            >
              <Github className="w-4 h-4" />
              Ver Código no GitHub
            </a>
            <p className="text-center text-[11px] text-slate-400 font-mono">
              Radar de Propostas IA • Presidência 2026
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
