import { Metadata } from "next";
import Navbar from "@/components/common/Navbar";

export const metadata: Metadata = {
  title: "Guia de Componentes | [Comando.C]",
  description: "Guia de módulos e componentes da interface da Plataforma Comando.",
};

export default function ComponentsGuidePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 w-full flex-1">
        {/* Cabeçalho da Página */}
        <div className="mb-8 border-b border-neutral-900 pb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-100 font-mono">
            Guia de Módulos &amp; Componentes da Interface
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400">
            Demonstração visual de componentes isolados: módulos de cursos, botões, preview de vídeo e badges de status.
          </p>
        </div>

        {/* Grid de 3 Colunas como na Imagem */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* =================================================================
              COLUNA 1: 01. MÓDULOS & ITENS DE AULA
             ================================================================= */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono border-b border-neutral-800 pb-2">
              01. MÓDULOS &amp; ITENS DE AULA
            </h2>

            {/* Módulo Colapsado */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300">
                ▶ Módulo 1: Fundamentos &amp; Sintaxe
              </span>
              <span className="rounded border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
                4 aulas
              </span>
            </div>

            {/* Módulo Expandido com Aulas */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 overflow-hidden">
              <div className="p-4 flex items-center justify-between border-b border-neutral-800/60">
                <span className="text-xs font-bold text-neutral-200">
                  ▼ Módulo 2: Ponteiros &amp; Memória
                </span>
                <span className="rounded border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[10px] font-mono text-neutral-400">
                  6 aulas
                </span>
              </div>

              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between p-2 rounded text-xs text-neutral-400 hover:bg-neutral-800/30">
                  <span>01. Variáveis e Tipos</span>
                  <span className="text-[10px] font-mono text-neutral-400">18:20</span>
                </div>

                {/* Aula Ativa / Selecionada */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-violet-500 bg-violet-950/40 text-violet-200 text-xs font-medium shadow-sm">
                  <span>▶ 01. Setup de Compilador GCC e Primeiro Programa em C</span>
                  <span className="text-[10px] font-mono text-violet-300">15:30</span>
                </div>
              </div>
            </div>

            {/* Seção Badges de Módulo */}
            <div className="pt-2">
              <h3 className="text-xs font-mono text-neutral-400 mb-2.5">
                Badges de Módulo:
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] text-neutral-400">
                  Inativo
                </span>
                <span className="rounded border border-emerald-900/60 bg-emerald-950/40 px-2.5 py-1 text-[11px] text-emerald-300">
                  Concluído
                </span>
                <span className="rounded border border-amber-900/60 bg-amber-950/40 px-2.5 py-1 text-[11px] text-amber-300">
                  Em Andamento
                </span>
                <span className="rounded border border-violet-900/60 bg-violet-950/40 px-2.5 py-1 text-[11px] text-violet-300">
                  4 de 4 Aulas
                </span>
              </div>
            </div>
          </section>

          {/* =================================================================
              COLUNA 2: 02. BOTÕES & CONTROLES
             ================================================================= */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono border-b border-neutral-800 pb-2">
              02. BOTÕES &amp; CONTROLES
            </h2>

            {/* Botão Primário CTA */}
            <div>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all"
              >
                <span>&gt; Começar a Assistir Agora</span>
              </button>
            </div>

            {/* Botão Secundário Outline */}
            <div>
              <button
                type="button"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 py-2.5 text-xs font-medium text-neutral-300 transition-all"
              >
                <span>Baixar Ementa Completa (PDF)</span>
              </button>
            </div>

            {/* Ação Próxima Aula */}
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all"
              >
                <span>+ Próxima Aula</span>
                <span>&gt;</span>
              </button>
            </div>

            {/* Ação Marcar como Concluída */}
            <div>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/80 px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white transition-all"
              >
                <span>✓ Marcar como Concluída</span>
              </button>
            </div>

            {/* Abas e Controles Pequenos */}
            <div className="pt-2">
              <h3 className="text-xs font-mono text-neutral-400 mb-2.5">
                Abas e Filtros de Estado:
              </h3>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-400">
                  Aba: Todos
                </span>
                <span className="rounded-md border border-violet-500 bg-violet-950/40 px-3 py-1.5 text-violet-200 font-semibold">
                  Abas: Ativo
                </span>
                <span className="rounded-md border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-neutral-400">
                  Desafio &gt;
                </span>
              </div>
            </div>
          </section>

          {/* =================================================================
              COLUNA 3: 03. PREVIEW DE VÍDEO & CARDS
             ================================================================= */}
          <section className="space-y-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-mono border-b border-neutral-800 pb-2">
              03. PREVIEW DE VÍDEO &amp; CARDS
            </h2>

            {/* Componente de Preview de Vídeo */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-950 p-3.5">
              <div className="aspect-video w-full rounded-lg bg-[#0e0e12] border border-neutral-800/80 p-2.5 font-mono text-[10px] text-neutral-300 flex flex-col justify-between relative overflow-hidden select-none">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <span className="h-2 w-2 rounded-full bg-red-500/70" />
                  <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                  <span className="h-2 w-2 rounded-full bg-green-500/70" />
                </div>
                <pre className="text-violet-300 text-[10px] my-auto">
{`int main() {
    printf("Comando.C");
}`}
                </pre>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full bg-violet-600 text-white flex items-center justify-center shadow-lg shadow-violet-600/50">
                    <svg className="h-4 w-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="mt-2 text-center text-[11px] font-mono text-neutral-400">
                Preview do Curso (03:45)
              </p>
            </div>

            {/* Mini Card de Curso */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-3.5">
              <h4 className="text-xs font-bold text-neutral-100 font-sans">
                Linguagem C
              </h4>
              <div className="relative my-2.5 aspect-video w-full overflow-hidden rounded-lg border border-neutral-800/80 bg-neutral-950 flex items-center justify-center">
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(139, 92, 246, 0.45) 0%, rgba(139, 92, 246, 0.15) 45%, rgba(10, 10, 10, 0.8) 75%)",
                  }}
                />
                <span className="relative z-10 text-[11px] font-mono text-neutral-400">
                  Capa do curso
                </span>
              </div>
              <p className="text-[10px] font-mono text-neutral-400">
                24 aulas &bull; 12h
              </p>
            </div>

            {/* Indicadores de Aulas e Módulos */}
            <div className="pt-2">
              <h3 className="text-xs font-mono text-neutral-400 mb-2.5">
                Indicadores de Aulas e Módulos:
              </h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] font-mono text-neutral-300">
                  Nível: Médio
                </span>
                <span className="rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] font-mono text-neutral-300">
                  24 aulas &bull; 12h
                </span>
                <span className="rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] font-mono text-neutral-300">
                  Módulo 1: Concluído
                </span>
                <span className="rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-[11px] font-mono text-neutral-300">
                  4 de 4 Aulas
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950 py-6 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
          <p className="text-xs text-neutral-400">
            &copy; 2026 [Comando.C] | Aprenda tecnologia com foco em alta performance
          </p>
        </div>
      </footer>
    </div>
  );
}
