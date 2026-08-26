import { Candidate } from "@/types";
import { FileText, CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="liquid-glass-card rounded-2xl p-6 flex flex-col justify-between group transition-all duration-300">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-base text-white shadow-md"
              style={{ backgroundColor: candidate.color }}
            >
              {candidate.ballot_number}
            </div>
            <div>
              <h3 className="font-bold text-base text-white group-hover:text-sky-300 transition-colors">
                {candidate.ballot_name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                {candidate.party_acronym} • {candidate.role}
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/[0.05] text-slate-300 border border-white/[0.08]">
            {candidate.total_pages} páginas
          </span>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
          {candidate.summary}
        </p>

        {/* Highlights */}
        <div className="space-y-2 mb-6">
          <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Destaques do Plano:
          </h4>
          {candidate.key_highlights.slice(0, 2).map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
              <CheckCircle className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <FileText className="w-3.5 h-3.5" />
          <span>{candidate.total_proposals} propostas indexadas</span>
        </div>
        <Link
          href={`/comparador?candidatos=${candidate.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300 transition-colors"
        >
          Comparar
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
