import { Metadata } from "next";
import { coursesService } from "@/features/courses/services/courses.service";
import { CoursesCatalogManager } from "@/features/courses/components/CoursesCatalogManager";
import { CourseSummary } from "@/features/courses/types/course";
import Navbar from "@/components/common/Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Catálogo de Cursos | [Comando.C]",
  description: "Explore o catálogo de cursos de tecnologia com foco em alta performance.",
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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 w-full flex-1">
        <CoursesCatalogManager initialCourses={courses} initialError={error} />
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
