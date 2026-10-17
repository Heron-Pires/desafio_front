import { Metadata } from "next";
import { coursesService } from "@/features/courses/services/courses.service";
import { CoursesCatalogManager } from "@/features/courses/components/CoursesCatalogManager";
import { CourseSummary } from "@/features/courses/types/course";
import Navbar from "@/components/common/Navbar";

export const metadata: Metadata = {
  title: "Catálogo de Cursos & Vídeos | Plataforma Comando",
  description: "Explore, crie e gerencie todos os cursos e trilhas disponíveis na Plataforma Comando.",
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-12 w-full flex-1">
        <CoursesCatalogManager initialCourses={courses} initialError={error} />
      </main>
    </div>
  );
}
