import { Module } from "../types/course";
import { LessonItem } from "./LessonItem";

interface ModuleItemProps {
  module: Module;
  index: number;
}

export function ModuleItem({ module, index }: ModuleItemProps) {
  return (
    <details
      open
      className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 transition-all [&_summary::-webkit-details-marker]:hidden"
    >
      <summary className="flex cursor-pointer items-center justify-between p-5 select-none transition-colors hover:bg-neutral-800/40">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
            Módulo {index + 1}
          </span>
          <h3 className="text-base font-semibold text-neutral-100">
            {module.title}
          </h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-neutral-400">
          <span>{module.lessons.length} aulas</span>
          <svg
            className="h-4 w-4 transition-transform duration-300 group-open:-rotate-180"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </summary>

      <div className="border-t border-neutral-800/80 p-5 pt-3">
        <ul className="space-y-2">
          {module.lessons.map((lesson, lessonIndex) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              index={lessonIndex}
            />
          ))}
        </ul>
      </div>
    </details>
  );
}
