import { Lesson } from "../types/course";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
}

export function LessonItem({ lesson, index }: LessonItemProps) {
  return (
    <li className="flex items-center justify-between rounded-lg border border-neutral-800/60 bg-neutral-900/40 px-4 py-3 transition-colors hover:border-neutral-700">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-neutral-400">
          {index + 1}
        </span>
        <span className="text-sm font-medium text-neutral-200">
          {lesson.title}
        </span>
      </div>
      <span className="text-xs text-neutral-500">Aula</span>
    </li>
  );
}
