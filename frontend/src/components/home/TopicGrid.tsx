import Link from "next/link";
import { Topic } from "@/types";
import {
  HeartPulse,
  GraduationCap,
  TrendingUp,
  ShieldAlert,
  Leaf,
  Cpu,
  Users,
  Building2,
  ArrowRight,
  LucideIcon
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  HeartPulse,
  GraduationCap,
  TrendingUp,
  ShieldAlert,
  Leaf,
  Cpu,
  Users,
  Building2
};

interface TopicGridProps {
  topics: Topic[];
}

export function TopicGrid({ topics }: TopicGridProps) {
  return (
    <section className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
            Matriz de Políticas Públicas
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
            Eixos Temáticos Estratégicos
          </h2>
        </div>
        <p className="text-xs text-slate-400 max-w-sm">
          Selecione uma área para analisar e contrastar os compromissos de cada candidato.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {topics.map((topic) => {
          const Icon = ICON_MAP[topic.icon] || HeartPulse;
          return (
            <Link
              key={topic.id}
              href={`/comparador?tema=${topic.id}`}
              className="obsidian-card rounded-2xl p-5 group flex flex-col justify-between hover:border-emerald-500/40 transition-all duration-200"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                  {topic.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {topic.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-xs font-semibold text-emerald-400 group-hover:text-emerald-300">
                <span>Comparar propostas</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
