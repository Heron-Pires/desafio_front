import Link from "next/link";
import { coursesService } from "@/features/courses/services/courses.service";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { CourseSummary } from "@/features/courses/types/course";

export default async function HomePage() {
  let courses: CourseSummary[] = [];

  try {
    courses = await coursesService.getAll();
  } catch {
    courses = [];
  }

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      {/* Navbar de Navegação */}
      <header className="sticky top-0 z-50 border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 font-black text-sm shadow-sm">
              C
            </span>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-wider text-neutral-100">
                COMANDO
              </span>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                Academy
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-medium text-neutral-400 md:flex">
            <Link
              href="#cursos"
              className="transition-colors hover:text-neutral-100"
            >
              Cursos
            </Link>
            <Link
              href="#metodologia"
              className="transition-colors hover:text-neutral-100"
            >
              Metodologia
            </Link>
            <Link
              href="#diferenciais"
              className="transition-colors hover:text-neutral-100"
            >
              Diferenciais
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center rounded-lg bg-neutral-100 px-4 py-2 text-xs font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95"
            >
              Ver Catálogo &rarr;
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-neutral-800/60 px-6 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-neutral-950 to-neutral-950 pointer-events-none" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/80 px-3.5 py-1.5 text-xs font-medium text-neutral-300">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Nova Plataforma de Aprendizado
          </div>

          <h1 className="mt-8 text-4xl font-extrabold tracking-tight text-neutral-100 sm:text-6xl sm:leading-[1.15]">
            Evolua suas habilidades com a experiência de ensino definitiva.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Cursos objetivos, arquitetura moderna e navegação inspirada em
            plataformas de streaming. Aprenda com módulos práticos e acelere seu
            domínio em desenvolvimento de software.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="#cursos"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-neutral-100 px-6 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95 sm:w-auto"
            >
              Explorar Cursos
            </Link>
            <Link
              href="#metodologia"
              className="inline-flex h-12 w-full items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900/60 px-6 text-sm font-medium text-neutral-300 transition-colors hover:border-neutral-700 hover:bg-neutral-800 sm:w-auto"
            >
              Conhecer a Metodologia
            </Link>
          </div>

          {/* Destaques Rápidos */}
          <div className="mt-16 grid grid-cols-1 gap-6 border-t border-neutral-900 pt-10 sm:grid-cols-3">
            <div className="text-center">
              <span className="text-2xl font-bold text-neutral-100">100%</span>
              <p className="mt-1 text-xs text-neutral-400">
                Foco prático e direto ao ponto
              </p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-neutral-100">Streaming</span>
              <p className="mt-1 text-xs text-neutral-400">
                Interface imersiva e responsiva
              </p>
            </div>
            <div className="text-center">
              <span className="text-2xl font-bold text-neutral-100">Modular</span>
              <p className="mt-1 text-xs text-neutral-400">
                Aulas sequenciais e organizadas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Cursos em Destaque */}
      <section id="cursos" className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 border-b border-neutral-800/80 pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
                Catálogo em Destaque
              </span>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">
                Cursos Disponíveis
              </h2>
              <p className="mt-1 text-sm text-neutral-400">
                Selecione um curso para explorar a grade de módulos e aulas.
              </p>
            </div>
            <Link
              href="/courses"
              className="text-xs font-medium text-neutral-300 transition-colors hover:text-white hover:underline"
            >
              Ver todos os cursos &rarr;
            </Link>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.length > 0 ? (
              courses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-neutral-400">
                <p>Nenhum curso disponível no momento.</p>
                <Link
                  href="/courses"
                  className="mt-2 inline-block text-xs text-neutral-300 underline"
                >
                  Ir para o catálogo completo
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Seção de Metodologia e Diferenciais */}
      <section
        id="metodologia"
        className="border-t border-neutral-800/80 bg-neutral-900/40 px-6 py-20 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
              Como Funciona
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
              Projetado para o seu aprendizado contínuo
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-neutral-400">
              Combinamos arquitetura de alta performance com design centrado na
              melhor retenção de conteúdo.
            </p>
          </div>

          <div id="diferenciais" className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 transition-all hover:border-neutral-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Layout Estilo Streaming
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Visual escuro elegante, cards intuitivos e transições suaves que
                proporcionam uma experiência de visualização imersiva.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 transition-all hover:border-neutral-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 10h16M4 14h16M4 18h16"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Módulos Hierárquicos
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Conteúdos divididos em módulos e aulas interativas para você
                acompanhar sua evolução passo a passo sem se perder.
              </p>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 transition-all hover:border-neutral-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-200">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-neutral-100">
                Alta Performance com SSR
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Construído em Next.js App Router com React Server Components,
                garantindo carregamento instantâneo e excelente indexação.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-20 lg:px-12">
        <div className="mx-auto max-w-5xl rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">
            Pronto para dar o próximo passo na sua carreira?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-neutral-400">
            Acesse agora nossa seleção de cursos e comece a estudar na
            Plataforma Comando.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href="/courses"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-100 px-6 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95"
            >
              Acessar Catálogo de Cursos &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-800/80 bg-neutral-950 px-6 py-10 lg:px-12">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-neutral-100 text-[10px] font-black text-neutral-950">
              C
            </span>
            <span className="text-xs font-semibold tracking-wider text-neutral-300">
              PLATAFORMA COMANDO
            </span>
          </div>

          <p className="text-xs text-neutral-400">
            &copy; {new Date().getFullYear()} Plataforma Comando. Todos os direitos reservados.
          </p>

          <div className="flex items-center gap-6 text-xs text-neutral-400">
            <Link href="/courses" className="transition-colors hover:text-neutral-200">
              Cursos
            </Link>
            <Link href="#metodologia" className="transition-colors hover:text-neutral-200">
              Sobre
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
