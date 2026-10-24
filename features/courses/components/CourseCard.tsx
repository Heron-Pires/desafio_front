import Link from "next/link";
import { CourseSummary } from "../types/course";

interface CourseCardProps {
  course: CourseSummary;
  isAdmin?: boolean;
  onEdit?: (course: CourseSummary, e: React.MouseEvent) => void;
  onDelete?: (id: string | number, title: string, e: React.MouseEvent) => void;
}

export function CourseCard({ course, isAdmin, onEdit, onDelete }: CourseCardProps) {
  const lessonsCount = course.lessonsCount ?? (course.modulesCount ? course.modulesCount * 5 : 20);
  const durationText = course.durationText ?? `${Math.round(lessonsCount * 0.5)}h`;

  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-4 transition-all duration-300 hover:border-violet-500/60 hover:bg-neutral-900/70 hover:shadow-lg hover:shadow-violet-950/20">
      <Link href={`/courses/${course.id}`} className="block flex-1">
        {/* Título do Curso no Topo */}
        <h3 className="line-clamp-1 text-sm font-bold text-neutral-100 transition-colors group-hover:text-violet-300 font-display">
          {course.title}
        </h3>

        {/* Capa com Brilho Roxo Centralizado */}
        <div className="relative my-3.5 aspect-video w-full overflow-hidden rounded-lg border border-neutral-800/80 bg-neutral-950 flex items-center justify-center">
          <div
            className="absolute inset-0 pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
            style={{
              background:
                "radial-gradient(circle at center, rgba(139, 92, 246, 0.45) 0%, rgba(139, 92, 246, 0.15) 45%, rgba(10, 10, 10, 0.8) 75%)",
            }}
          />
          <span className="relative z-10 text-xs font-display text-neutral-400 group-hover:text-neutral-200 transition-colors">
            Capa do curso
          </span>
        </div>

        {/* Rodapé do Card com Total de Aulas e Duração */}
        <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span>
            {lessonsCount} aulas &bull; {durationText}
          </span>
          {course.category && (
            <span className="text-[10px] text-neutral-400 font-mono">
              {course.category}
            </span>
          )}
        </div>
      </Link>

      {/* Ações de Admin (Apenas se logado) */}
      {isAdmin && (
        <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-xs">
          <span className="text-[10px] font-mono text-violet-400">Admin</span>
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => onEdit(course, e)}
                className="rounded border border-neutral-700 bg-neutral-800/90 px-2 py-0.5 text-[11px] font-medium text-neutral-300 hover:border-violet-500 hover:text-white transition-colors"
                title="Editar Curso"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={(e) => onDelete(course.id, course.title, e)}
                className="rounded border border-red-900/60 bg-red-950/40 px-2 py-0.5 text-[11px] font-medium text-red-300 hover:bg-red-900/60 transition-colors"
                title="Excluir Curso"
              >
                Excluir
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseCard;
