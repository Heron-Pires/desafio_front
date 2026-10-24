import { Metadata } from "next";
import { notFound } from "next/navigation";
import { coursesService } from "@/features/courses/services/courses.service";
import { CourseDetailClient } from "@/features/courses/components/CourseDetailClient";
import { ApiError } from "@/services/api";
import Navbar from "@/components/common/Navbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ lesson?: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const course = await coursesService.getById(id);
    return {
      title: `${course.title} | [Comando.C]`,
      description: course.description,
    };
  } catch {
    return {
      title: "Detalhes do Curso | [Comando.C]",
    };
  }
}

export default async function CourseDetailPage({
  params,
  searchParams,
}: CourseDetailPageProps) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};

  let course;
  try {
    course = await coursesService.getById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 w-full flex-1">
        <CourseDetailClient course={course} initialLessonId={query.lesson} />
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
