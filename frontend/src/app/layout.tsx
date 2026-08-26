import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-comfortaa",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Radar de Propostas IA + InvestigaVoto | Planos de Governo & Auditoria de Gastos",
  description: "Plataforma cívica inteligente que utiliza IA (RAG) e análise forense de dados para comparar, auditar e consultar planos de governo e prestações de contas oficiais do TSE.",
  keywords: ["Eleições", "Planos de Governo", "RAG", "InvestigaVoto", "Prestação de Contas", "TSE", "Inteligência Artificial"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`dark ${comfortaa.variable}`}>
      <body className={`${comfortaa.className} bg-[#090D16] text-slate-100 min-h-screen flex flex-col antialiased font-sans`}>
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
