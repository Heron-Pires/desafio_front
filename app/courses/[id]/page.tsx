import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getCourseById, ApiError } from "@/services/api";
import { Header } from "@/components/common/Header";
import { ReturnButton } from "@/components/common/ReturnButton";
import { Badge } from "@/components/ui/Badge";
import { ModuleList } from "@/features/courses/components/ModuleList";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: CourseDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const course = await getCourseById(id);
    return {
      title: `${course.title.toUpperCase()} // COMANDO TACTICAL`,
      description: course.description,
    };
  } catch {
    return {
      title: "PROTOCOLO DE CURSO // PLATAFORMA COMANDO",
    };
  }
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { id } = await params;

  let course;
  try {
    course = await getCourseById(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  }

  // Total de aulas calculadas a partir dos módulos
  const totalLessons = course.modules?.reduce(
    (acc, m) => acc + (m.lessons?.length || 0),
    0
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#CBD5E1]">
      <Header currentRoute="detail" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-6 py-8">
        {/* Navegação de Retorno Clara e Visível */}
        <div className="mb-6 flex items-center justify-between">
          <ReturnButton label="← RETORNAR AO CATÁLOGO" />
          <div className="hidden font-mono text-[11px] text-[#64748B] sm:flex items-center gap-2">
            <span>TERMINAL_NODE: 0x{id}</span>
            <span>{"//"}</span>
            <span className="text-emerald-400">STATUS: CONECTADO</span>
          </div>
        </div>

        {/* Visão Geral do Curso (Header Industrial & Thumbnail Cinematográfica) */}
        <div className="relative mb-12 overflow-hidden border border-[#262833] bg-[#111217] p-6 chamfer-card lg:p-8">
          {/* Marcadores de Mira nos cantos */}
          <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] text-[#8B5CF6]/50 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[9px] text-[#8B5CF6]/50 select-none">
            +
          </span>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            {/* Informações Textuais */}
            <div className="lg:col-span-7">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <Badge variant="violet" size="md">
                  [ {course.category.toUpperCase()} ]
                </Badge>
                <span className="font-mono text-xs text-[#64748B]">{"///"}</span>
                <span className="font-mono text-xs text-[#94A3B8]">
                  ID PROTOCOLO: #{String(course.id).padStart(2, "0")}
                </span>
              </div>

              {/* Título de Alto Impacto em Branco Puro */}
              <h1 className="font-sans text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl leading-tight">
                {course.title}
              </h1>

              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#94A3B8]">
                {course.description}
              </p>

              {/* Métricas e Telemetria do Curso */}
              <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 border-t border-[#262833] pt-4 font-mono text-xs text-[#64748B]">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8B5CF6]">◼</span>
                  <span>MÓDULOS:</span>
                  <span className="font-bold text-[#CBD5E1]">
                    {String(course.modules?.length || 0).padStart(2, "0")}
                  </span>
                </div>
                <div className="text-[#262833]">|</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#8B5CF6]">◼</span>
                  <span>AULAS TOTAIS:</span>
                  <span className="font-bold text-[#CBD5E1]">
                    {String(totalLessons).padStart(2, "0")}
                  </span>
                </div>
                <div className="text-[#262833]">|</div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400">●</span>
                  <span>ACESSO:</span>
                  <span className="font-bold text-emerald-400">LIBERADO</span>
                </div>
              </div>
            </div>

            {/* Thumbnail Cinematográfica com Moldura Tática */}
            <div className="lg:col-span-5">
              <div className="relative overflow-hidden border border-[#2E303E] bg-[#0B0C10] shadow-[0_0_25px_rgba(139,92,246,0.15)] chamfer-top-right">
                <div className="relative aspect-video w-full">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    unoptimized
                    priority
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111217]/90 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Overlay técnico com grade e cruz */}
                  <div className="pointer-events-none absolute bottom-2 left-3 font-mono text-[9px] text-[#A855F7] bg-[#0B0C10]/80 px-2 py-0.5 border border-[#8B5CF6]/30">
                    FEED_STREAM {"//"} HD 1080P
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Grade de Conteúdo (Estrutura Sanfonada de Módulos e Aulas) */}
        <section className="mb-12">
          <div className="mb-6 flex flex-col justify-between gap-2 border-b border-[#262833] pb-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#8B5CF6]">
                <span>{"// DIRETRIZES DE FORMAÇÃO"}</span>
              </div>
              <h2 className="mt-1 font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
                ESTRUTURA DE MÓDULOS E AULAS
              </h2>
            </div>
            <div className="font-mono text-xs text-[#94A3B8]">
              {course.modules?.length} {course.modules?.length === 1 ? "MÓDULO TÁTICO" : "MÓDULOS TÁTICOS"} REGISTRADOS
            </div>
          </div>

          <ModuleList modules={course.modules || []} />
        </section>

        {/* Botão de Retorno no rodapé para conveniência */}
        <div className="border-t border-[#262833] pt-6 flex justify-start">
          <ReturnButton label="← RETORNAR AO CATÁLOGO" />
        </div>
      </main>

      <footer className="mt-auto border-t border-[#262833] bg-[#0B0C10] px-6 py-6 font-mono text-xs text-[#64748B]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-[#8B5CF6]">⌘</span>
            <span className="text-[#94A3B8]">COMANDO INDUSTRIAL OPERATING SYSTEM</span>
          </div>
          <div>TERMINAL {"//"} CURSO #{id}</div>
        </div>
      </footer>
    </div>
  );
}
