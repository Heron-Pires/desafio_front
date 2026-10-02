import { Metadata } from "next";
import Link from "next/link";
import { coursesService } from "@/features/courses/services/courses.service";
import { CourseList } from "@/features/courses/components/CourseList";
import { CourseSummary } from "@/features/courses/types/course";

export const metadata: Metadata = {
  title: "Catálogo de Cursos | Plataforma Comando",
  description: "Explore todos os cursos e trilhas disponíveis na Plataforma Comando.",
};

export default async function CoursesPage() {
  let courses: CourseSummary[] = [];
  let error: string | null = null;

  try {
    courses = await coursesService.getAll();
  } catch {
    error = "Não foi possível carregar os cursos.";
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Header simplificado */}
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-wider text-neutral-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 font-black text-xs">
              C
            </span>
            COMANDO
          </Link>
          <Link
            href="/"
            className="text-xs text-neutral-400 transition-colors hover:text-neutral-200"
          >
            &larr; Voltar para o início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
            Catálogo Completo
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
            Cursos Disponíveis
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Escolha uma formação e aprofunde seus conhecimentos práticos.
          </p>
        </div>

        <CourseList courses={courses} error={error} />
      </main>
    </div>
  );
}
