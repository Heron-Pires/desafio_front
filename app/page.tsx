import Link from "next/link";
import Navbar from "@/components/common/Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center px-6 py-16 sm:py-24">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-neutral-100 uppercase leading-tight font-display">
            APRENDA TECNOLOGIA
            <br />
            COM FOCO EM ALTA
            <br />
            PERFORMANCE
          </h1>

          <p className="mt-6 max-w-2xl text-xs sm:text-sm text-neutral-400 leading-relaxed font-mono">
            Conteúdo técnico de ponta, estruturado em módulos práticos e código executado diretamente na plataforma.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 px-6 py-2.5 text-xs sm:text-sm font-medium text-white shadow-lg shadow-violet-600/30 transition-all font-display tracking-wider"
            >
              Ver Catálogo de Cursos
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-lg border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:text-white px-6 py-2.5 text-xs sm:text-sm font-medium text-neutral-300 transition-all font-display tracking-wider"
            >
              Sobre o Comando &gt;
            </a>
          </div>
        </div>

        {/* Seção Como Funciona */}
        <section id="como-funciona" className="w-full max-w-5xl mx-auto mt-24">
          <div className="text-center">
            <h2 className="text-base sm:text-lg font-bold uppercase tracking-wider text-neutral-100 font-display">
              COMO FUNCIONA
            </h2>
            <p className="mt-1 text-xs text-neutral-400 font-mono">
              Em quatro passos você sai do catálogo e chega direto na aula
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 01 */}
            <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/40 p-5 hover:border-violet-500/40 transition-all">
              <span className="font-display text-2xl font-black text-violet-500">01</span>
              <h3 className="mt-2 text-sm font-bold text-neutral-200 font-display">Escolha um curso</h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed font-mono">
                Explore o catálogo e clique por área ou nível de conhecimento.
              </p>
            </div>

            {/* Card 02 */}
            <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/40 p-5 hover:border-violet-500/40 transition-all">
              <span className="font-display text-2xl font-black text-violet-500">02</span>
              <h3 className="mt-2 text-sm font-bold text-neutral-200 font-display">Veja os detalhes</h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed font-mono">
                Conheça o conteúdo, a ementa e os objetivos do curso.
              </p>
            </div>

            {/* Card 03 */}
            <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/40 p-5 hover:border-violet-500/40 transition-all">
              <span className="font-display text-2xl font-black text-violet-500">03</span>
              <h3 className="mt-2 text-sm font-bold text-neutral-200 font-display">Veja os módulos</h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed font-mono">
                Cada curso é dividido em módulos práticos e organizados.
              </p>
            </div>

            {/* Card 04 */}
            <div className="rounded-xl border border-neutral-800/90 bg-neutral-900/40 p-5 hover:border-violet-500/40 transition-all">
              <span className="font-display text-2xl font-black text-violet-500">04</span>
              <h3 className="mt-2 text-sm font-bold text-neutral-200 font-display">Assista às aulas</h3>
              <p className="mt-1.5 text-xs text-neutral-400 leading-relaxed font-mono">
                Acesse as aulas em vídeo de cada módulo no seu ritmo.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Rodapé Minimalista */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 px-6 text-center text-xs text-neutral-400 font-mono">
        &copy; 2026 [Comando.C] | Aprenda tecnologia com foco em alta performance
      </footer>
    </div>
  );
}
