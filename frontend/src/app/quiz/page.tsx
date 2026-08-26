"use client";

import { useState, useEffect } from "react";
import { QuizQuestion, QuizResultResponse } from "@/types";
import { fetchQuizQuestions, submitQuizAnswers } from "@/lib/api";
import { Compass, Sparkles, CheckCircle2, RotateCcw, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchQuizQuestions()
      .then(setQuestions)
      .finally(() => setLoading(false));
  }, []);

  function handleSelect(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = Object.entries(answers).map(([question_id, selected_option_id]) => ({
        question_id,
        selected_option_id
      }));
      const res = await submitQuizAnswers(payload);
      setResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setAnswers({});
    setResult(null);
  }

  const isComplete = questions.length > 0 && Object.keys(answers).length === questions.length;

  return (
    <div className="py-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>BÚSSOLA PROGRAMÁTICA 2026</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Quiz de Afinidade com Planos Oficiais
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          Descubra qual candidato à Presidência da República tem maior convergência com suas visões sobre economia, saúde, segurança e educação.
        </p>
      </div>

      {!result ? (
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="obsidian-card rounded-2xl p-6 space-y-4">
              <div>
                <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                  Questão {idx + 1} de {questions.length} • {q.topic_name}
                </span>
                <h3 className="text-base font-bold text-white mt-1">{q.question}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{q.description}</p>
              </div>

              <div className="space-y-2.5">
                {q.options.map((opt) => {
                  const isSelected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelect(q.id, opt.id)}
                      className={cn(
                        "w-full text-left p-3.5 rounded-xl border text-xs leading-relaxed transition-all duration-200 flex items-start gap-3",
                        isSelected
                          ? "bg-emerald-500/20 text-white border-emerald-500/40 shadow-sm"
                          : "bg-white/[0.02] text-slate-300 border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-4 h-4 rounded-full border flex items-center justify-center shrink-0 mt-0.5",
                          isSelected ? "border-emerald-400 bg-emerald-500" : "border-slate-500"
                        )}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />}
                      </div>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <span className="text-xs text-slate-400 font-mono">
              {Object.keys(answers).length} de {questions.length} respondidas
            </span>
            <button
              onClick={handleSubmit}
              disabled={!isComplete || submitting}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition-all"
            >
              {submitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Calculando Afinidade...
                </>
              ) : (
                <>
                  Ver Resultado
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Results View */
        <div className="space-y-6">
          {/* Top Match Hero */}
          <div
            className="obsidian-card-elevated rounded-3xl p-8 border-l-8 relative overflow-hidden"
            style={{ borderLeftColor: result.top_candidate.color }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-emerald-400 font-semibold">
                  Maior Afinidade Programática
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {result.top_candidate.candidate_name} ({result.top_candidate.party_acronym})
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-lg leading-relaxed">
                  {result.summary_analysis}
                </p>
              </div>

              <div className="text-center p-4 rounded-2xl bg-white/[0.04] border border-white/[0.08] shrink-0">
                <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                  {result.top_candidate.overall_match_percentage.toFixed(0)}%
                </span>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">Afinidade Global</p>
              </div>
            </div>

            {/* Topic Breakdown */}
            <div className="space-y-3 pt-4 border-t border-white/[0.06]">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Convergência por Eixo Temático:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {result.top_candidate.topics_breakdown.map((t) => (
                  <div key={t.topic_id} className="p-3 rounded-xl bg-black/40 border border-white/[0.04]">
                    <span className="text-xs text-slate-300 block truncate">{t.topic_name}</span>
                    <span className="text-base font-bold text-emerald-400 font-mono">
                      {t.match_percentage.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] space-y-2">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                Pontos Fortes de Alinhamento:
              </h4>
              {result.top_candidate.matching_highlights.map((h, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{h}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reset Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/[0.08] text-xs font-semibold transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Refazer o Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
