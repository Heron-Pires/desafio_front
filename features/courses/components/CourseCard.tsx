import Link from "next/link";
import Image from "next/image";
import { Course } from "../types/course";
import { Badge } from "@/components/ui/Badge";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  // Formata o ID com dois dígitos para estética de telemetria militar: ex "01", "04"
  const formattedId = String(course.id).padStart(2, "0");
  const formattedModules = String(course.modulesCount).padStart(2, "0");

  return (
    <Link
      href={`/courses/${course.id}`}
      prefetch={true}
      className="group relative flex flex-col overflow-hidden border border-[#262833] bg-[#181920] transition-all duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]/60 hover:bg-[#1F2029] hover:shadow-[0_0_25px_rgba(139,92,246,0.18)] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6] chamfer-card"
    >
      {/* Mira tática nos cantos do card */}
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] text-[#8B5CF6]/30 select-none group-hover:text-[#8B5CF6]/70 transition-colors">
        +
      </span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[9px] text-[#8B5CF6]/30 select-none group-hover:text-[#8B5CF6]/70 transition-colors">
        +
      </span>

      {/* Faixa técnica superior com metadados de telemetria */}
      <div className="flex items-center justify-between border-b border-[#262833] bg-[#111217] px-4 py-1.5 font-mono text-[10px] text-[#64748B]">
        <span className="flex items-center gap-1.5 text-[#94A3B8] group-hover:text-[#C4B5FD] transition-colors">
          <span className="h-1.5 w-1.5 rounded-full bg-[#8B5CF6]/60 group-hover:bg-[#8B5CF6] group-hover:shadow-[0_0_6px_#8b5cf6]" />
          {"// CMD_ID: "}{formattedId}
        </span>
        <span className="text-emerald-400/90 text-[9px] tracking-wider uppercase">
          STATUS: DISPONÍVEL
        </span>
      </div>

      {/* Thumbnail Cinematográfica com Máscara de Corte Tática */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0B0C10]">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:brightness-110 opacity-85 group-hover:opacity-100"
        />

        {/* Gradiente escuro para contraste técnico */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#181920] via-transparent to-transparent opacity-90 pointer-events-none" />

        {/* Linha técnica milimétrica sobre a imagem */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B5CF6]/40 to-transparent pointer-events-none" />

        {/* Badge da Categoria com Estilo Militar/Técnico */}
        <div className="absolute top-3 left-3 z-10">
          <Badge variant="violet" size="sm">
            [ {course.category.toUpperCase()} ]
          </Badge>
        </div>

        {/* Marcador de Grade Angular no canto inferior direito da imagem */}
        <div className="absolute bottom-2 right-3 z-10 font-mono text-[9px] text-[#CBD5E1]/60 bg-[#0B0C10]/80 px-1.5 py-0.5 border border-[#262833]">
          SEC_0{formattedId}
        </div>
      </div>

      {/* Conteúdo do Card */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h2 className="line-clamp-1 font-sans text-base font-bold tracking-tight text-[#CBD5E1] transition-colors group-hover:text-white">
            {course.title}
          </h2>
          <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-[#94A3B8]">
            {course.shortDescription}
          </p>
        </div>

        {/* Rodapé Tático com Divisor Milimétrico e Contador de Módulos */}
        <div className="mt-6 border-t border-[#262833] pt-3.5">
          <div className="flex items-center justify-between">
            {/* Quantidade de módulos solicitada: [06 MÓDULOS] */}
            <span className="font-mono text-xs font-semibold tracking-wider text-[#A855F7] bg-[#8B5CF6]/10 px-2.5 py-1 border border-[#8B5CF6]/30 chamfer-tag">
              [{formattedModules} MÓDULOS]
            </span>

            <span className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[#CBD5E1] transition-colors group-hover:text-[#C4B5FD]">
              <span>ACESSAR PROTOCOLO</span>
              <span className="text-[#8B5CF6] transition-transform duration-200 group-hover:translate-x-1">
                &rarr;
              </span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
