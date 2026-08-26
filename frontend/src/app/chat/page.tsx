"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage, Candidate, Topic } from "@/types";
import { askRAGChat, fetchCandidates, fetchTopics } from "@/lib/api";
import { CitationBadge } from "@/components/ui/CitationBadge";
import { Bot, User, Send, Sparkles, BookOpen, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const INITIAL_SUGGESTIONS = [
  "Como os candidatos pretendem fortalecer o SUS e a produção de vacinas?",
  "Quais são as propostas para a isenção do Imposto de Renda e Reforma Tributária?",
  "Como cada candidato aborda o combate ao desmatamento na Amazônia?",
  "Quais os planos para segurança pública e controle de armas?"
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_welcome",
      role: "assistant",
      content: "Olá! Sou o assistente cívico de IA do **Radar de Propostas**.\n\nPosso responder qualquer dúvida sobre os **Planos de Governo Oficiais** registrados no TSE para a Eleição Presidencial de 2026. Todas as respostas trazem **citações auditáveis com o número exato da página** no documento oficial.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<string>("all");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCandidates().then(setCandidates);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(textToSend?: string) {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr_${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const candFilter = selectedCandidate === "all" ? undefined : selectedCandidate;
      const resp = await askRAGChat(query, candFilter);

      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        role: "assistant",
        content: resp.answer,
        citations: resp.citations,
        suggested_followups: resp.suggested_followups,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Motor RAG com Citações Auditáveis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Chat Cívico com IA
          </h1>
        </div>

        {/* Candidate Filter Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Filtrar por:</span>
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            className="bg-white/[0.04] text-slate-200 border border-white/[0.1] rounded-xl px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-sky-500"
          >
            <option value="all" className="bg-slate-900 text-white">Todos os Candidatos</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                {c.ballot_name} ({c.party_acronym})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Box */}
      <div className="liquid-glass-card rounded-3xl p-4 sm:p-6 min-h-[480px] max-h-[600px] overflow-y-auto space-y-6">
        {messages.map((msg) => {
          const isUser = msg.role === "user";
          return (
            <div
              key={msg.id}
              className={cn("flex gap-3 max-w-[90%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-md",
                  isUser ? "bg-sky-500 text-slate-950" : "bg-white/[0.08] text-sky-400 border border-white/[0.08]"
                )}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div className="space-y-3">
                <div
                  className={cn(
                    "p-4 rounded-2xl text-xs sm:text-sm leading-relaxed",
                    isUser
                      ? "bg-sky-500 text-slate-950 font-medium shadow-md"
                      : "liquid-glass-card border border-white/[0.06] text-slate-200"
                  )}
                >
                  <p className="whitespace-pre-line">{msg.content}</p>
                </div>

                {/* Citations Attached */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
                      <BookOpen className="w-3.5 h-3.5 text-sky-400" />
                      <span>Citações Oficiais Auditáveis:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((c, i) => (
                        <CitationBadge key={i} citation={c} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Followups */}
                {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                      Perguntas Relacionadas:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggested_followups.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] text-sky-300 hover:text-sky-200 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 px-2.5 py-1 rounded-lg transition-all text-left"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <div className="w-8 h-8 rounded-xl bg-white/[0.08] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
            </div>
            <span>Consultando índices vetoriais dos planos de governo do TSE...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Initial Prompts */}
      {messages.length === 1 && (
        <div className="space-y-2">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-sky-400" />
            Sugestões para começar:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {INITIAL_SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-xs text-slate-300 text-left p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-sky-500/30 hover:bg-sky-500/5 transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pergunte sobre qualquer proposta (ex: Reforma Tributária, SUS, Segurança)..."
          className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-sky-500/20"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </form>
    </div>
  );
}
