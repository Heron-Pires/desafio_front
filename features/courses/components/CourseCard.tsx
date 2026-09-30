import Link from "next/link";
import { CourseSummary } from "../types/course";

interface CourseCardProps {
  course: CourseSummary;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/50 focus:outline-none focus:ring-2 focus:ring-neutral-400"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
        <img
          src={course.thumbnail}
          alt={course.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-medium text-neutral-200 backdrop-blur-md">
          {course.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-neutral-100 transition-colors group-hover:text-white">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-neutral-400">
            {course.shortDescription}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-neutral-800/80 pt-3 text-xs text-neutral-400">
          <span>
            {course.modulesCount} {course.modulesCount === 1 ? "módulo" : "módulos"}
          </span>
          <span className="font-medium text-neutral-200 group-hover:underline">
            Ver detalhes &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}
