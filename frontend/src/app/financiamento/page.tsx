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
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-semibold mb-3">
          <DollarSign className="w-3.5 h-3.5" />
          <span>INVESTIGAVOTO • AUDITORIA FORENSE DE FINANÇAS TSE</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Prestação de Contas e Gastos de Campanha
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Painel forense de auditoria cívica baseado nas declarações oficiais submetidas ao TSE (DivulgaCandContas), com detecção de concentração de fornecedores e alertas de conformidade.
        </p>
      </div>

      {data && (
        <>
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="obsidian-card rounded-2xl p-5 border-l-2 border-emerald-500">
              <span className="text-xs text-slate-400 font-medium font-mono">RECURSOS DECLARADOS</span>
              <p className="text-xl sm:text-2xl font-bold text-white font-mono mt-1">
                R$ {(data.total_campaign_funds / 1e6).toFixed(1)}M
              </p>
              <span className="text-[10px] text-emerald-400">FEFC + Doações PF</span>
            </div>
            <div className="obsidian-card rounded-2xl p-5 border-l-2 border-cyan-500">
              <span className="text-xs text-slate-400 font-medium font-mono">DESPESAS CONTRATADAS</span>
              <p className="text-xl sm:text-2xl font-bold text-cyan-400 font-mono mt-1">
                R$ {(data.total_campaign_expenses / 1e6).toFixed(1)}M
              </p>
              <span className="text-[10px] text-slate-400">Execução orçamentária</span>
            </div>
            <div className="obsidian-card rounded-2xl p-5 border-l-2 border-amber-500">
              <span className="text-xs text-slate-400 font-medium font-mono">ALERTAS FORENSES</span>
              <p className="text-xl sm:text-2xl font-bold text-amber-400 font-mono mt-1">
                {data.total_anomalies_flagged}
              </p>
              <span className="text-[10px] text-amber-300">Detecção algorítmica</span>
            </div>
            <div className="obsidian-card rounded-2xl p-5 border-l-2 border-emerald-500">
              <span className="text-xs text-slate-400 font-medium font-mono">TRANSPARÊNCIA TSE</span>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono mt-1">
                {data.transparency_index_score.toFixed(1)}/10
              </p>
              <span className="text-[10px] text-emerald-300">Conformidade e dados abertos</span>
            </div>
          </div>

          {/* Candidate Selector Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-white/[0.06] pb-4">
            {data.candidates_financials.map((cand) => {
              const isSelected = cand.candidate_id === selectedCandId;
              return (
                <button
                  key={cand.candidate_id}
                  onClick={() => setSelectedCandId(cand.candidate_id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all",
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
            <div className="space-y-6">
              {/* Insight Bar */}
              <div className="obsidian-card rounded-2xl p-5 border-l-4 border-emerald-500">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono mb-1">
                  Análise Pericial de Execução Orçamentária:
                </h4>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {selectedCand.promise_vs_spending_insight}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Breakdown */}
                <div className="obsidian-card rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Origem dos Recursos (Receitas)</h3>
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      R$ {(selectedCand.total_revenue / 1e6).toFixed(1)}M
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedCand.revenue_breakdown.map((rev, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{rev.source_type}</span>
                          <span className="font-mono text-white font-medium">
                            R$ {(rev.amount / 1e6).toFixed(1)}M ({rev.percentage.toFixed(1)}%)
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
                <div className="obsidian-card rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-white">Destinação dos Gastos (Despesas)</h3>
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      R$ {(selectedCand.total_expenses / 1e6).toFixed(1)}M
                    </span>
                  </div>

                  <div className="space-y-3">
                    {selectedCand.expense_breakdown.map((exp, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300">{exp.category}</span>
                          <span className="font-mono text-white font-medium">
                            R$ {(exp.amount / 1e6).toFixed(1)}M ({exp.percentage.toFixed(1)}%)
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

              {/* Top Suppliers Table */}
              <div className="obsidian-card rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-emerald-400" />
                    Maiores Fornecedores & Prestadores de Serviços Mapeados
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedCand.top_suppliers.length} contratados
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/[0.06] text-slate-400 font-mono">
                        <th className="pb-2">Fornecedor / Razão Social</th>
                        <th className="pb-2">CNPJ</th>
                        <th className="pb-2">Serviço Prestado</th>
                        <th className="pb-2">Valor Recebido</th>
                        <th className="pb-2">% Orçamento</th>
                        <th className="pb-2">Risco Forense</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {selectedCand.top_suppliers.map((sup) => (
                        <tr key={sup.id} className="hover:bg-white/[0.02]">
                          <td className="py-3 font-medium text-white">{sup.name}</td>
                          <td className="py-3 font-mono text-slate-400">{sup.cnpj}</td>
                          <td className="py-3 text-slate-300">{sup.service_type}</td>
                          <td className="py-3 font-mono font-bold text-white">
                            R$ {(sup.total_received / 1e6).toFixed(2)}M
                          </td>
                          <td className="py-3 font-mono text-emerald-400">
                            {sup.percentage_of_candidate_budget.toFixed(1)}%
                          </td>
                          <td className="py-3">
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-semibold font-mono",
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
                <div className="obsidian-card rounded-2xl p-6 border-l-4 border-amber-500 space-y-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-sm text-white font-mono uppercase">Alertas de Auditoria Forense</h3>
                  </div>

                  <div className="space-y-3">
                    {selectedCand.anomalies.map((anom) => (
                      <div key={anom.id} className="p-4 rounded-xl bg-black/40 border border-white/[0.04] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-amber-300 font-mono">{anom.anomaly_type}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30 font-mono">
                            Severidade: {anom.severity}
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
