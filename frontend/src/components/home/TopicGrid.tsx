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
    <section className="space-y-4 sm:space-y-5">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Eixos Temáticos
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400">
            Compare o posicionamento por área de governo
          </p>
        </div>
        <Link
          href="/comparador"
          className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors shrink-0"
        >
          <span className="hidden sm:inline">Abrir comparador</span>
          <span className="sm:hidden">Comparar</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
        {topics.map((topic) => {
          const Icon = ICON_MAP[topic.icon] || HeartPulse;
          return (
            <Link
              key={topic.id}
              href={`/comparador?tema=${topic.id}`}
              className="p-3.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.05] hover:border-emerald-500/30 transition-all duration-200 group flex items-center sm:items-start gap-3"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                  {topic.name}
                </h3>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {topic.description}
                </p>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 sm:hidden shrink-0" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
