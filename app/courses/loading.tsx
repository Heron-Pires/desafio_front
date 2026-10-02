import { CourseCardSkeleton } from "@/features/courses/components/CourseCardSkeleton";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10 space-y-3">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-800" />
          <div className="h-10 w-64 animate-pulse rounded bg-neutral-800" />
          <div className="h-4 w-96 animate-pulse rounded bg-neutral-800" />
        </div>

        <div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          aria-label="Carregando cursos..."
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
