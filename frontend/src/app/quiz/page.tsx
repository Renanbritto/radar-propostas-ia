"use client";

import { useState, useEffect } from "react";
import { fetchQuizQuestions, submitQuizAnswers } from "@/lib/api";
import { QuizQuestion, QuizResultResponse } from "@/types";
import { Compass, CheckCircle2, RotateCcw, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<QuizResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const qs = await fetchQuizQuestions();
      setQuestions(qs);
      setLoading(false);
    }
    load();
  }, []);

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionId: string) => {
    if (!currentQ) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setCalculating(true);
    try {
      const answersPayload = Object.entries(selectedAnswers).map(([qId, optId]) => ({
        question_id: qId,
        selected_option_id: optId
      }));
      const res = await submitQuizAnswers(answersPayload);
      setResult(res);
    } catch (err) {
      console.error("Erro ao submeter quiz:", err);
    } finally {
      setCalculating(false);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Sparkles className="w-8 h-8 text-sky-400 animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-300">Carregando perguntas da Bússola Eleitoral...</p>
      </div>
    );
  }

  // Tela de Resultados
  if (result) {
    return (
      <div className="py-8 max-w-4xl mx-auto space-y-8 animate-in fade-in">
        {/* Header */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resultado do Alinhamento Programático</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Sua Bússola Eleitoral
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">
            {result.summary_analysis}
          </p>
        </div>

        {/* Top Match Highlight Card */}
        {result.top_candidate && (
          <div
            className="liquid-glass-card rounded-3xl p-8 border-2 shadow-2xl relative overflow-hidden"
            style={{ borderColor: result.top_candidate.color }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="text-center sm:text-left">
                <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
                  Maior Afinidade com suas Respostas
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  {result.top_candidate.candidate_name}
                </h2>
                <p className="text-xs text-slate-400 font-medium font-mono">
                  {result.top_candidate.party_acronym} · Plano Oficial
                </p>
              </div>

              {/* Match Percentage Badge */}
              <div className="flex flex-col items-center justify-center w-28 h-28 rounded-2xl bg-white/[0.04] border border-white/[0.1] shadow-inner">
                <span className="text-3xl font-extrabold text-sky-400 font-mono">
                  {result.top_candidate.overall_match_percentage}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Afinidade</span>
              </div>
            </div>

            {/* Topic Breakdown */}
            <div className="mt-8 pt-6 border-t border-white/[0.08] space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Afinidade por Eixo Temático:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.top_candidate.topics_breakdown.map((t) => (
                  <div key={t.topic_id} className="p-3 rounded-xl bg-black/30 border border-white/[0.04]">
                    <div className="flex justify-between text-xs font-medium mb-1">
                      <span className="text-slate-300">{t.topic_name}</span>
                      <span className="text-sky-400 font-mono">{t.match_percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-sky-500"
                        style={{ width: `${t.match_percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/[0.08]">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 border border-white/[0.08] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refazer Questionário
              </button>
              <Link
                href={`/comparador?candidatos=${result.top_candidate.candidate_id}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-xs font-bold text-slate-950 transition-colors"
              >
                Ver propostas completas no Comparador
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}

        {/* Other Candidates Breakdown */}
        {result.all_candidates.length > 1 && (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Comparativo com os Demais Candidatos:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.all_candidates.slice(1).map((cand) => (
                <div key={cand.candidate_id} className="liquid-glass-card rounded-2xl p-5 border-l-4" style={{ borderLeftColor: cand.color }}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-sm text-white">{cand.candidate_name}</h4>
                      <span className="text-xs text-slate-400 font-mono">{cand.party_acronym}</span>
                    </div>
                    <span className="text-lg font-bold font-mono text-slate-300">{cand.overall_match_percentage}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-slate-400" style={{ width: `${cand.overall_match_percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Question Step Flow
  const isLastQuestion = currentIndex === questions.length - 1;
  const currentAnswer = currentQ ? selectedAnswers[currentQ.id] : undefined;
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="py-8 max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5" />
          <span>Questionário de Prioridades Cívicas</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Descubra o Plano de Governo mais Alinhado a Você
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          Responda a 5 perguntas objetivas sobre temas cruciais da cidade e compare sua visão diretamente com os planos registrados.
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium text-slate-400 font-mono">
          <span>Pergunta {currentIndex + 1} de {questions.length}</span>
          <span>{progress.toFixed(0)}% concluído</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.08] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      {currentQ && (
        <div className="liquid-glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-white/[0.08]">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-sky-400 font-semibold block mb-1">
              Tema: {currentQ.topic_name}
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {currentQ.question}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {currentQ.description}
            </p>
          </div>

          {/* Options List */}
          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = currentAnswer === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all duration-200 flex items-start gap-3",
                    isSelected
                      ? "bg-sky-500/20 border-sky-500/50 text-white shadow-md"
                      : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.2] text-slate-300 hover:bg-white/[0.04]"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                      isSelected
                        ? "border-sky-400 bg-sky-500 text-slate-950"
                        : "border-slate-600"
                    )}
                  >
                    {isSelected && <div className="w-2 h-2 rounded-full bg-slate-950" />}
                  </div>
                  <span className="leading-relaxed font-medium">{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-6 border-t border-white/[0.06]">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </button>

            <button
              onClick={handleNext}
              disabled={!currentAnswer || calculating}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:hover:bg-sky-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all"
            >
              {calculating ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  Calculando afinidade...
                </>
              ) : isLastQuestion ? (
                "Ver Meu Resultado"
              ) : (
                <>
                  Próxima
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
