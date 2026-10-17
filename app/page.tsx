import Link from "next/link";
import { coursesService } from "@/features/courses/services/courses.service";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { CourseSummary } from "@/features/courses/types/course";
import Navbar from "@/components/common/Navbar";

export default async function HomePage() {
  let courses: CourseSummary[] = [];
  try {
    courses = await coursesService.getAll();
  } catch (error) {
    console.warn("Falha ao buscar cursos para a landing page:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-neutral-50">
      {/* Header Unificado */}
      <Navbar />

      {/* Hero Section - Estilo Streaming */}
      <section className="relative overflow-hidden px-6 pt-16 pb-20 lg:px-12 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-800/20 via-neutral-950 to-neutral-950" />

        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-800 bg-neutral-900/60 px-3 py-1 text-xs text-neutral-300 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Plataforma Comando &bull; Hub de Aprendizado
          </div>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-neutral-100 sm:text-6xl lg:text-7xl">
            Aprenda tecnologia com foco em{" "}
            <span className="bg-gradient-to-r from-neutral-100 via-neutral-300 to-neutral-500 bg-clip-text text-transparent">
              alta performance
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-neutral-400 sm:text-lg">
            Conteúdo técnico de ponta, estruturado em módulos práticos e vídeos imersivos.
            Gerencie, crie e assista às aulas diretamente na plataforma.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/courses"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-neutral-100 px-6 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95 sm:w-auto"
            >
              Explorar Catálogo
            </Link>
            <Link
              href="/videos"
              className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 px-6 text-sm font-semibold text-neutral-300 transition-all hover:bg-neutral-800 hover:text-white sm:w-auto"
            >
              Gerenciar Vídeos
            </Link>
          </div>
        </div>
      </section>

      {/* Catálogo em Destaque */}
      <section className="px-6 py-12 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between border-b border-neutral-800/80 pb-4">
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
                Alta Performance com Axios & SSR
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                Construído em Next.js App Router integrado via Axios e React Server Components,
                garantindo carregamento instantâneo e robustez.
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
          <div className="mt-8 flex justify-center gap-4">
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
            <Link href="/videos" className="transition-colors hover:text-neutral-200">
              Vídeos
            </Link>
            <Link href="/login" className="transition-colors hover:text-neutral-200">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
