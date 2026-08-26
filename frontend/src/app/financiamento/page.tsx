"use client";

import { useState, useEffect } from "react";
import { fetchFinanceOverview } from "@/lib/api";
import { FinanceOverviewResponse, CandidateFinancials, FinancialAnomaly } from "@/types";
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Building,
  CheckCircle2,
  PieChart,
  Layers,
  Sparkles,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

function formatCurrency(val: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
}

export default function FinanciamentoPage() {
  const [data, setData] = useState<FinanceOverviewResponse | null>(null);
  const [selectedCandId, setSelectedCandId] = useState<string>("cand_1");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetchFinanceOverview();
      setData(res);
      if (res.candidates_financials.length > 0) {
        setSelectedCandId(res.candidates_financials[0].candidate_id);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <Sparkles className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-300">Carregando dados de prestação de contas e auditoria forense...</p>
      </div>
    );
  }

  const selectedCand: CandidateFinancials =
    data.candidates_financials.find((c) => c.candidate_id === selectedCandId) ||
    data.candidates_financials[0];

  return (
    <div className="py-8 space-y-8 animate-in fade-in">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
          <DollarSign className="w-3.5 h-3.5" />
          <span>InvestigaVoto · Análise Forense & Auditoria de Campanha</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Transparência, Receitas & Gastos de Campanha
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Audite de onde vem o dinheiro, os maiores fornecedores contratados, empresas recém-abertas e o cruzamento entre as promessas do plano de governo e o gasto real.
        </p>
      </div>

      {/* Global KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="liquid-glass-card rounded-2xl p-5 border-l-4 border-sky-500">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Total Arrecadado (Geral)
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-white font-mono mt-1 block">
            {formatCurrency(data.total_campaign_funds)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">FEFC + Doações PF + Recursos Próprios</span>
        </div>

        <div className="liquid-glass-card rounded-2xl p-5 border-l-4 border-indigo-500">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Total Despesas Declaradas
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-indigo-300 font-mono mt-1 block">
            {formatCurrency(data.total_campaign_expenses)}
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Pagamentos processados no TSE</span>
        </div>

        <div className="liquid-glass-card rounded-2xl p-5 border-l-4 border-amber-500">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Alertas Forenses Ativos
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-400 font-mono mt-1 block">
            {data.total_anomalies_flagged} inconsistências
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Empresas recentes e alta concentração</span>
        </div>

        <div className="liquid-glass-card rounded-2xl p-5 border-l-4 border-emerald-500">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Índice de Transparência
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-400 font-mono mt-1 block">
            {data.transparency_index_score} / 10.0
          </span>
          <span className="text-[10px] text-slate-500 mt-1 block">Nível de conformidade e integridade</span>
        </div>
      </div>

      {/* Candidate Tabs */}
      <div className="flex flex-wrap gap-2 pt-2 border-b border-white/[0.08] pb-4">
        {data.candidates_financials.map((cand) => {
          const isSelected = selectedCandId === cand.candidate_id;
          return (
            <button
              key={cand.candidate_id}
              onClick={() => setSelectedCandId(cand.candidate_id)}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold border transition-all duration-200",
                isSelected
                  ? "bg-white/[0.08] text-white border-sky-400 shadow-md"
                  : "bg-white/[0.02] text-slate-400 border-white/[0.06] hover:text-slate-200"
              )}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cand.color }}
              />
              <span>{cand.candidate_name}</span>
              <span className="font-mono text-[10px] text-slate-400">({cand.party_acronym})</span>
            </button>
          );
        })}
      </div>

      {/* Candidate Financial Detail Section */}
      {selectedCand && (
        <div className="space-y-8">
          {/* Candidate Overview Card */}
          <div
            className="liquid-glass-card rounded-3xl p-6 sm:p-8 border-t-4"
            style={{ borderTopColor: selectedCand.color }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  Prestação de Contas Auditada
                </span>
                <h2 className="text-2xl font-bold text-white mt-0.5">
                  {selectedCand.candidate_name} ({selectedCand.party_acronym})
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-xs text-slate-400 font-mono block">Execução do Teto:</span>
                  <span className="text-lg font-bold text-sky-400 font-mono">
                    {selectedCand.budget_execution_percentage}% do limite legal
                  </span>
                </div>
              </div>
            </div>

            {/* Insight Promessa vs Gasto */}
            <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] flex items-start gap-3">
              <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-white">Cruzamento Forense: Promessa vs. Gastos</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {selectedCand.promise_vs_spending_insight}
                </p>
              </div>
            </div>
          </div>

          {/* Revenue vs Expense Breakdowns Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Origin */}
            <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">Origem dos Recursos (Receitas)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-emerald-400">
                  {formatCurrency(selectedCand.total_revenue)}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {selectedCand.revenue_breakdown.map((rev, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/[0.04] space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{rev.source_type}</span>
                      <span className="text-white font-mono font-bold">{formatCurrency(rev.amount)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{rev.donor_count} doador(es)</span>
                      <span>{rev.percentage}% do total</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${rev.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Expense Categories */}
            <div className="liquid-glass-card rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Destino dos Gastos (Despesas)</h3>
                </div>
                <span className="text-xs font-mono font-bold text-indigo-300">
                  {formatCurrency(selectedCand.total_expenses)}
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {selectedCand.expense_breakdown.map((exp, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/30 border border-white/[0.04] space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{exp.category}</span>
                      <span className="text-white font-mono font-bold">{formatCurrency(exp.amount)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                      <span>{exp.percentage}% das despesas</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-400"
                        style={{ width: `${exp.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Suppliers Table */}
          <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-400" />
              <div>
                <h3 className="text-base font-bold text-white">Maiores Fornecedores Contratados</h3>
                <p className="text-xs text-slate-400">
                  Auditoria de empresas receptoras de recursos, data de constituição e nível de risco forense.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/[0.08] text-slate-400 font-mono text-[11px]">
                    <th className="pb-3 font-semibold">Empresa / Razão Social</th>
                    <th className="pb-3 font-semibold">CNPJ</th>
                    <th className="pb-3 font-semibold">Serviço Prestado</th>
                    <th className="pb-3 font-semibold text-right">Total Recebido</th>
                    <th className="pb-3 font-semibold text-right">% do Orçamento</th>
                    <th className="pb-3 font-semibold text-center">Risco Forense</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {selectedCand.top_suppliers.map((sup) => (
                    <tr key={sup.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 font-medium text-white">
                        {sup.name}
                        {sup.is_recently_created && (
                          <span className="block text-[10px] text-amber-400 mt-0.5">
                            ⚠️ Aberta a menos de 6 meses do pleito
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 font-mono text-slate-400">{sup.cnpj}</td>
                      <td className="py-3.5 text-slate-300">{sup.service_type}</td>
                      <td className="py-3.5 font-mono font-bold text-white text-right">
                        {formatCurrency(sup.total_received)}
                      </td>
                      <td className="py-3.5 font-mono text-sky-300 text-right">
                        {sup.percentage_of_candidate_budget}%
                      </td>
                      <td className="py-3.5 text-center">
                        <span
                          className={cn(
                            "inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold border",
                            sup.risk_level === "Alto"
                              ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                              : sup.risk_level === "Médio"
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
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

          {/* Forensic Anomalies List */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Alertas Forenses e Pontos de Auditoria</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.system_wide_anomalies.map((anom) => (
                <div
                  key={anom.id}
                  className={cn(
                    "liquid-glass-card rounded-2xl p-5 border-l-4 space-y-3",
                    anom.severity === "Alta"
                      ? "border-l-rose-500"
                      : anom.severity === "Média"
                      ? "border-l-amber-500"
                      : "border-l-sky-500"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                        {anom.candidate_name} ({anom.party_acronym})
                      </span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{anom.anomaly_type}</h4>
                    </div>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold font-mono border",
                        anom.severity === "Alta"
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                          : anom.severity === "Média"
                          ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                          : "bg-sky-500/20 text-sky-300 border-sky-500/30"
                      )}
                    >
                      Severidade {anom.severity}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {anom.description}
                  </p>

                  <div className="pt-2 border-t border-white/[0.04] text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">Recomendação:</span> {anom.audit_recommendation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}