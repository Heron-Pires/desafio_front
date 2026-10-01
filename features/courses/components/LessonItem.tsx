import { Lesson } from "../types/course";
import { Badge } from "@/components/ui/Badge";

interface LessonItemProps {
  lesson: Lesson;
  index: number;
}

export function LessonItem({ lesson, index }: LessonItemProps) {
  const sequenceNumber = String(lesson.order ?? index + 1).padStart(2, "0");

  const getStatusBadge = () => {
    const status = lesson.status || "available";

    switch (status) {
      case "completed":
        return (
          <Badge variant="emerald" size="sm" showDot>
            CONCLUÍDO
          </Badge>
        );
      case "in_progress":
        return (
          <Badge variant="violet" size="sm" showDot>
            EM EXECUÇÃO
          </Badge>
        );
      case "locked":
        return (
          <Badge variant="steel" size="sm">
            BLOQUEADO
          </Badge>
        );
      case "available":
      default:
        return (
          <Badge variant="outline" size="sm">
            DISPONÍVEL
          </Badge>
        );
    }
  };

  return (
    <li className="group flex flex-col gap-3 rounded-none border border-[#262833] bg-[#111217] p-3.5 transition-all duration-200 hover:border-[#8B5CF6]/40 hover:bg-[#181920] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3.5">
        {/* Marcador de Ordem de Execução Sequencial */}
        <span className="flex h-7 w-8 shrink-0 items-center justify-center border border-[#2E303E] bg-[#181920] font-mono text-xs font-bold text-[#8B5CF6] group-hover:border-[#8B5CF6]/50">
          {sequenceNumber}
        </span>

        <div className="flex flex-col">
          <span className="font-sans text-xs font-semibold text-[#CBD5E1] transition-colors group-hover:text-white sm:text-sm">
            {lesson.title}
          </span>
          <span className="font-mono text-[10px] text-[#64748B]">
            DIRETRIZ DE TREINAMENTO // AULA {sequenceNumber}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 self-end sm:self-center">
        {lesson.duration && (
          <span className="font-mono text-[11px] text-[#94A3B8]">
            {lesson.duration}
          </span>
        )}
        {getStatusBadge()}
      </div>
    </li>
  );
}
