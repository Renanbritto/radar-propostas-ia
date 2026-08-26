"use client";

import { useState, useRef, useEffect } from "react";
import { askRAGChat, fetchCandidates } from "@/lib/api";
import { ChatMessage, Candidate, Citation } from "@/types";
import { CitationBadge } from "@/components/ui/CitationBadge";
import { Bot, Send, User, Sparkles, CornerDownLeft, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_SUGGESTIONS = [
  "Como os candidatos pretendem investir em telemedicina e postos de saúde?",
  "Qual a proposta para zerar a fila de creches municipais?",
  "O que cada plano diz sobre armamento e tecnologia na Guarda Municipal?",
  "Quais são os incentivos fiscais para pequenas empresas e geração de empregos?",
  "Quais as metas para o meio ambiente, energia limpa e prevenção de enchentes?"
];

export default function ChatRAGPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandId, setSelectedCandId] = useState<string>("all");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Olá! Sou o assistente cívico de IA do Radar de Propostas. Pergunte qualquer dúvida sobre as propostas dos candidatos e eu responderei com base estrita nos planos oficiais registrados no TSE, citando a página de cada trecho.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      suggested_followups: DEFAULT_SUGGESTIONS.slice(0, 3)
    }
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      const cands = await fetchCandidates();
      setCandidates(cands);
    }
    load();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery("");
    setLoading(true);

    try {
      const candFilter = selectedCandId === "all" ? undefined : selectedCandId;
      const res = await askRAGChat(query, candFilter);

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: res.answer,
        citations: res.citations,
        suggested_followups: res.suggested_followups,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error("Erro no chat:", err);
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Desculpe, ocorreu uma instabilidade momentânea ao consultar a base de dados dos planos. Por favor, tente novamente.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        role: "assistant",
        content: "Conversa reiniciada. Como posso ajudar com os planos de governo?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggested_followups: DEFAULT_SUGGESTIONS.slice(0, 3)
      }
    ]);
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Motor RAG com Citações Oficiais</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Chat Cívico sobre os Planos de Governo
          </h1>
        </div>

        {/* Filter Candidate & Reset */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCandId}
            onChange={(e) => setSelectedCandId(e.target.value)}
            className="bg-[#0F172A] border border-white/[0.1] rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-sky-500 font-medium"
          >
            <option value="all">🔍 Todos os Candidatos</option>
            {candidates.map((cand) => (
              <option key={cand.id} value={cand.id}>
                {cand.ballot_name} ({cand.party_acronym})
              </option>
            ))}
          </select>
          <button
            onClick={resetChat}
            className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-white border border-white/[0.08] transition-colors"
            title="Reiniciar conversa"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="liquid-glass-card rounded-3xl p-4 sm:p-6 flex flex-col h-[600px] justify-between border border-white/[0.08]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex items-start gap-3 text-xs sm:text-sm",
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-md",
                  msg.role === "user"
                    ? "bg-gradient-to-tr from-sky-500 to-indigo-600"
                    : "bg-slate-800 border border-white/[0.1] text-sky-400"
                )}
              >
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={cn(
                  "max-w-[85%] rounded-2xl p-4 leading-relaxed",
                  msg.role === "user"
                    ? "bg-sky-500 text-slate-950 font-medium rounded-tr-none shadow-md shadow-sky-500/10"
                    : "bg-black/40 border border-white/[0.08] text-slate-200 rounded-tl-none space-y-3"
                )}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* Citations List (if available) */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-3 border-t border-white/[0.08] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                      📄 Citações e Páginas nos Planos Oficiais:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.citations.map((c, i) => (
                        <CitationBadge key={i} citation={c} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Followups */}
                {msg.suggested_followups && msg.suggested_followups.length > 0 && (
                  <div className="pt-3 border-t border-white/[0.08] space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 block">💡 Sugestões de perguntas:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggested_followups.map((sug, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(sug)}
                          className="text-[11px] text-left px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-sky-300 border border-white/[0.06] transition-colors"
                        >
                          {sug}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <span className="text-[9px] text-slate-400 block text-right font-mono">{msg.timestamp}</span>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-white/[0.1] flex items-center justify-center text-sky-400">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="bg-black/40 border border-white/[0.08] rounded-2xl px-4 py-3 text-slate-300">
                Recuperando e analisando trechos nos planos de governo com o motor RAG...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="pt-4 border-t border-white/[0.08]">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ex: Como os candidatos propõem diminuir a fila de exames no SUS?"
              disabled={loading}
              className="w-full bg-black/50 border border-white/[0.12] focus:border-sky-500 rounded-2xl px-4 py-3.5 pr-14 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
            <button
              onClick={() => handleSend()}
              disabled={!inputQuery.trim() || loading}
              className="absolute right-2 p-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 disabled:opacity-30 disabled:hover:bg-sky-500 text-slate-950 font-bold transition-all shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
            <span>Pressione Enter para enviar</span>
            <span>Respostas auditáveis com base em dados do TSE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
