import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { coursesService } from "@/features/courses/services/courses.service";
import { ModuleItem } from "@/features/courses/components/ModuleItem";
import { ApiError } from "@/services/api";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const course = await coursesService.getById(id);
    return {
      title: `${course.title} | Plataforma Comando`,
      description: course.description,
    };
  } catch {
    return {
      title: "Detalhes do Curso | Plataforma Comando",
    };
  }
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;

  let course;
  try {
    course = await coursesService.getById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  const modules = course.modules ?? [];

  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 lg:px-12">
      {/* Navegação de retorno */}
      <nav className="mb-8">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 transition-colors hover:text-neutral-100"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Voltar para os cursos
        </Link>
      </nav>

      {/* Visão Geral do Curso */}
      <section className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {course.category && (
            <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
              {course.category}
            </span>
          )}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
            {course.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-neutral-400">
            {course.description}
          </p>
        </div>

        <div>
          <div className="relative aspect-video overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-xl">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title || "Miniatura do curso"}
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                priority
                unoptimized
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-500">
                Sem miniatura
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Grade de Conteúdo (Módulos e Aulas) */}
      <section className="mt-12 border-t border-neutral-800/80 pt-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-neutral-100">
            Conteúdo do Curso
          </h2>
          <p className="mt-1 text-xs text-neutral-400">
            {modules.length} {modules.length === 1 ? "módulo" : "módulos"} disponível{modules.length === 1 ? "" : "s"}
          </p>
        </div>

        {modules.length > 0 ? (
          <div className="space-y-4">
            {modules.map((module, index) => (
              <ModuleItem
                key={module?.id ?? index}
                module={module}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center text-xs text-neutral-400">
            Nenhum módulo cadastrado para este curso.
          </div>
        )}
      </section>
    </main>
  );
}
