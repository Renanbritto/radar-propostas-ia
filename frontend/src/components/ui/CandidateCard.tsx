import { Candidate } from "@/types";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CandidateCardProps {
  candidate: Candidate;
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  return (
    <div className="rounded-2xl p-4 bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.06] hover:border-white/[0.12] transition-all flex flex-col justify-between group">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs text-white shadow-sm shrink-0"
              style={{ backgroundColor: candidate.color }}
            >
              {candidate.ballot_number}
            </div>
            <div>
              <h3 className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors">
                {candidate.ballot_name}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                {candidate.party_acronym}
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.03] text-slate-400">
            {candidate.total_pages}p
          </span>
        </div>

        {/* Summary */}
        <p className="text-xs text-slate-300 leading-relaxed mb-3 line-clamp-2">
          {candidate.summary}
        </p>

        {/* Top Highlight */}
        <div className="space-y-1.5 mb-3">
          {candidate.key_highlights.slice(0, 1).map((highlight, idx) => (
            <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-400">
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
              <span className="line-clamp-2">{highlight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Actions */}
      <div className="pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
        <span className="font-mono text-slate-400">
          {candidate.total_proposals} propostas
        </span>
        <Link
          href={`/comparador?candidatos=${candidate.id}`}
          className="font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          Comparar
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
