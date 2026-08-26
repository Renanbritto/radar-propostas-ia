import Link from "next/link";
import { ShieldCheck, Database, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#070A12] py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="font-bold text-white text-base">Radar de Propostas IA</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Auditabilidade Aberta
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Plataforma cívica open-source que utiliza Inteligência Artificial (RAG & NLP) para analisar, indexar e contrastar os planos de governo oficiais dos candidatos submetidos à Justiça Eleitoral.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Transparência</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-sky-400" />
                Fonte: Dados Abertos TSE
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Citações com Página Oficial
              </li>
              <li>Imparcialidade Algorítmica</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Navegação</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/comparador" className="hover:text-white transition-colors">Comparador de Propostas</Link></li>
              <li><Link href="/chat" className="hover:text-white transition-colors">Chat RAG Cívico</Link></li>
              <li><Link href="/quiz" className="hover:text-white transition-colors">Bússola de Afinidade</Link></li>
              <li><Link href="/candidatos" className="hover:text-white transition-colors">Planos Cadastrados</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Radar de Propostas IA. Desenvolvido para fins cívicos e de portfólio.</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Construído por</span>
            <a href="https://github.com/Renanbritto" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline font-medium">
              Renan Nocelli
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
