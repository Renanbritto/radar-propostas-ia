"use client";

import { useState, useEffect } from "react";
import { FinanceOverviewResponse, CandidateFinancials } from "@/types";
import { fetchFinanceOverview } from "@/lib/api";
import { DollarSign, ShieldAlert, AlertTriangle, Building, ArrowUpRight, CheckCircle2, FileSearch } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinanciamentoPage() {
  const [data, setData] = useState<FinanceOverviewResponse | null>(null);
  const [selectedCandId, setSelectedCandId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFinanceOverview()
      .then((res) => {
        setData(res);
        if (res.candidates_financials.length > 0) {
          setSelectedCandId(res.candidates_financials[0].candidate_id);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const selectedCand = data?.candidates_financials.find(c => c.candidate_id === selectedCandId);

  return (
    <div className="py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-2">
          <DollarSign className="w-3.5 h-3.5" />
          <span>INVESTIGAVOTO • AUDITORIA FORENSE TSE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Prestação de Contas e Gastos
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Painel de auditoria cívica baseado nas declarações oficiais submetidas ao TSE (DivulgaCandContas), com detecção de concentração de fornecedores e prestação de contas.
        </p>
      </div>

      {data && (
        <>
          {/* Quick Metrics (2x2 on Mobile, 4x1 on Desktop) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="obsidian-card rounded-2xl p-4 sm:p-5 border-l-2 border-emerald-500">
              <span className="text-[11px] text-slate-400 font-medium font-mono">RECURSOS TOTAIS</span>
              <p className="text-lg sm:text-2xl font-bold text-white font-mono mt-1">
                R$ {(data.total_campaign_funds / 1e6).toFixed(1)}M
              </p>
              <span className="text-[10px] text-emerald-400">FEFC + Doações</span>
            </div>
            <div className="obsidian-card rounded-2xl p-4 sm:p-5 border-l-2 border-cyan-500">
              <span className="text-[11px] text-slate-400 font-medium font-mono">DESPESAS</span>
              <p className="text-lg sm:text-2xl font-bold text-cyan-400 font-mono mt-1">
                R$ {(data.total_campaign_expenses / 1e6).toFixed(1)}M
              </p>
              <span className="text-[10px] text-slate-400">Executado</span>
            </div>
            <div className="obsidian-card rounded-2xl p-4 sm:p-5 border-l-2 border-amber-500">
              <span className="text-[11px] text-slate-400 font-medium font-mono">ALERTAS</span>
              <p className="text-lg sm:text-2xl font-bold text-amber-400 font-mono mt-1">
                {data.total_anomalies_flagged}
              </p>
              <span className="text-[10px] text-amber-300">Auditoria</span>
            </div>
            <div className="obsidian-card rounded-2xl p-4 sm:p-5 border-l-2 border-emerald-500">
              <span className="text-[11px] text-slate-400 font-medium font-mono">TRANSPARÊNCIA</span>
              <p className="text-lg sm:text-2xl font-bold text-emerald-400 font-mono mt-1">
                {data.transparency_index_score.toFixed(1)}/10
              </p>
              <span className="text-[10px] text-emerald-300">Conformidade</span>
            </div>
          </div>

          {/* Candidate Selector Tabs (Scrollable on Mobile) */}
          <div className="flex overflow-x-auto gap-2 border-b border-white/[0.06] pb-3 no-scrollbar">
            {data.candidates_financials.map((cand) => {
              const isSelected = cand.candidate_id === selectedCandId;
              return (
                <button
                  key={cand.candidate_id}
                  onClick={() => setSelectedCandId(cand.candidate_id)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0",
                    isSelected
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                      : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-white/[0.06]"
                  )}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: cand.color }}
                  />
                  <span>{cand.candidate_name} ({cand.party_acronym})</span>
                </button>
              );
            })}
          </div>

          {/* Candidate Detailed Financials */}
          {selectedCand && (
            <div className="space-y-5 sm:space-y-6">
              {/* Insight Bar */}
              <div className="obsidian-card rounded-2xl p-4 sm:p-5 border-l-4 border-emerald-500">
                <h4 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-1">
                  Análise de Execução Orçamentária:
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedCand.promise_vs_spending_insight}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
                {/* Revenue Breakdown */}
                <div className="obsidian-card rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs sm:text-sm text-white">Origem dos Recursos (Receitas)</h3>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      R$ {(selectedCand.total_revenue / 1e6).toFixed(1)}M
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedCand.revenue_breakdown.map((rev, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 truncate max-w-[60%]">{rev.source_type}</span>
                          <span className="font-mono text-white font-medium text-[11px] sm:text-xs">
                            R$ {(rev.amount / 1e6).toFixed(1)}M ({rev.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{ width: `${rev.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Expense Breakdown */}
                <div className="obsidian-card rounded-2xl p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-xs sm:text-sm text-white">Destinação dos Gastos (Despesas)</h3>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      R$ {(selectedCand.total_expenses / 1e6).toFixed(1)}M
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedCand.expense_breakdown.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 truncate max-w-[60%]">{exp.category}</span>
                          <span className="font-mono text-white font-medium text-[11px] sm:text-xs">
                            R$ {(exp.amount / 1e6).toFixed(1)}M ({exp.percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyan-500"
                            style={{ width: `${exp.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Suppliers Table (Horizontally scrollable for mobile) */}
              <div className="obsidian-card rounded-2xl p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-400 shrink-0" />
                    Maiores Fornecedores Contratados
                  </h3>
                  <span className="text-[10px] sm:text-xs text-slate-400 font-mono">
                    {selectedCand.top_suppliers.length} mapeados
                  </span>
                </div>

                <div className="overflow-x-auto -mx-2 sm:mx-0">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-slate-400 font-mono text-[10px]">
                        <th className="pb-2 pl-2">Fornecedor</th>
                        <th className="pb-2">CNPJ</th>
                        <th className="pb-2">Serviço</th>
                        <th className="pb-2">Valor</th>
                        <th className="pb-2">%</th>
                        <th className="pb-2">Risco</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {selectedCand.top_suppliers.map((sup) => (
                        <tr key={sup.id} className="hover:bg-white/[0.02]">
                          <td className="py-2.5 pl-2 font-medium text-white">{sup.name}</td>
                          <td className="py-2.5 font-mono text-slate-400 text-[11px]">{sup.cnpj}</td>
                          <td className="py-2.5 text-slate-300 text-[11px]">{sup.service_type}</td>
                          <td className="py-2.5 font-mono font-bold text-white">
                            R$ {(sup.total_received / 1e6).toFixed(2)}M
                          </td>
                          <td className="py-2.5 font-mono text-emerald-400">
                            {sup.percentage_of_candidate_budget.toFixed(1)}%
                          </td>
                          <td className="py-2.5">
                            <span
                              className={cn(
                                "px-1.5 py-0.5 rounded text-[9px] font-semibold font-mono",
                                sup.risk_level === "Alto"
                                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                                  : sup.risk_level === "Média"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              )}
                            >
                              {sup.risk_level}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Anomalies List */}
              {selectedCand.anomalies.length > 0 && (
                <div className="obsidian-card rounded-2xl p-5 sm:p-6 border-l-4 border-amber-500 space-y-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-xs sm:text-sm text-white font-mono uppercase">Alertas de Auditoria Forense</h3>
                  </div>

                  <div className="space-y-2.5">
                    {selectedCand.anomalies.map((anom) => (
                      <div key={anom.id} className="p-3.5 rounded-xl bg-black/40 border border-white/[0.04] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-amber-300 font-mono">{anom.anomaly_type}</span>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                            {anom.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{anom.description}</p>
                        <p className="text-[11px] text-slate-400 pt-1 border-t border-white/[0.04]">
                          <strong className="text-slate-300">Recomendação:</strong> {anom.audit_recommendation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
