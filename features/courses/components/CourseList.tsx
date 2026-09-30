import { CourseSummary } from "../types/course";
import { CourseCard } from "./CourseCard";
import { CourseCardSkeleton } from "./CourseCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

interface CourseListProps {
  courses: CourseSummary[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export function CourseList({
  courses,
  isLoading = false,
  error = null,
  onRetry,
}: CourseListProps) {
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        aria-label="Carregando cursos..."
      >
        {Array.from({ length: 8 }).map((_, index) => (
          <CourseCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={onRetry} />;
  }

  if (courses.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </section>
  );
}
