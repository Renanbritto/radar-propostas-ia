import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Radar de Propostas IA | Análise e Comparação com RAG de Planos de Governo",
  description: "Plataforma cívica inteligente que utiliza IA e RAG para comparar, auditar e consultar semanticamente os planos de governo oficiais dos candidatos com citações de página.",
  keywords: ["Eleições", "Planos de Governo", "RAG", "Inteligência Artificial", "TSE", "Comparador de Propostas"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={`${inter.className} bg-[#090D16] text-slate-100 min-h-screen flex flex-col antialiased`}>
        <Header />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
