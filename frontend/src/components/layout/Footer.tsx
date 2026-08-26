import Link from "next/link";
import { ShieldCheck, Database, Terminal, GitBranch } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#05070A] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">Radar de Propostas IA + InvestigaVoto</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                ● PRODUÇÃO AUDITADA
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Plataforma cívica open-source que utiliza Inteligência Artificial com arquitetura RAG (Retrieval-Augmented Generation) estrita e auditoria de prestação de contas eleitorais para análise neutra dos planos de governo registrados no Tribunal Superior Eleitoral.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-3">Auditoria & Fontes</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                TSE DivulgaCandContas
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                Citações Oficiais Auditáveis
              </li>
              <li className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-slate-400" />
                TF-IDF & Embeddings Semânticos
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider font-mono mb-3">Módulos Cívicos</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/comparador" className="hover:text-emerald-300 transition-colors">Comparador de Propostas</Link></li>
              <li><Link href="/chat" className="hover:text-emerald-300 transition-colors">Chat RAG com Citações</Link></li>
              <li><Link href="/quiz" className="hover:text-emerald-300 transition-colors">Bússola de Afinidade</Link></li>
              <li><Link href="/financiamento" className="hover:text-emerald-300 transition-colors">InvestigaVoto (Finanças)</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Radar de Propostas IA • Eleição Presidencial 2026</p>
          <div className="flex items-center gap-2 text-slate-400 font-mono">
            <span>Desenvolvido por</span>
            <a href="https://github.com/Renanbritto" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline font-semibold">
              Renan Nocelli
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
