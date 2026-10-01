import { Metadata } from "next";
import { getCourses } from "@/services/api";
import { Course } from "@/features/courses/types/course";
import { CourseGrid } from "@/features/courses/components/CourseGrid";
import { Header } from "@/components/common/Header";
import { ErrorState } from "@/components/common/ErrorState";

export const metadata: Metadata = {
  title: "CATÁLOGO TÁTICO // PLATAFORMA COMANDO",
  description:
    "Diretório operacional de cursos técnicos da Plataforma Comando. Explore especializações com foco prático.",
};

export const revalidate = 60;

export default async function CoursesPage() {
  let courses: Course[] = [];
  let error: string | null = null;

  try {
    courses = await getCourses();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Não foi possível carregar os cursos";
    error = message;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#CBD5E1]">
      <Header currentRoute="courses" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-6 py-10">
        {/* Banner Tático de Cabeçalho */}
        <div className="relative mb-10 overflow-hidden border border-[#262833] bg-[#111217] p-6 chamfer-card sm:p-8">
          <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-[#8B5CF6]/10 to-transparent pointer-events-none" />

          {/* Marcadores de Mira */}
          <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-[9px] text-[#8B5CF6]/40 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-[9px] text-[#8B5CF6]/40 select-none">
            +
          </span>

          <div className="relative z-10">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-[#8B5CF6]">
              <span className="border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 px-2 py-0.5">
                SEC_DIR {"//"} 01
              </span>
              <span className="text-[#64748B]">{"///"}</span>
              <span className="text-[#94A3B8]">CATÁLOGO OPERACIONAL DE TREINAMENTO</span>
            </div>

            <h1 className="mt-3 font-sans text-3xl font-black tracking-tight text-white sm:text-4xl">
              CURSOS DISPONÍVEIS
            </h1>

            <p className="mt-2 max-w-2xl text-xs sm:text-sm leading-relaxed text-[#94A3B8]">
              Selecione uma especialização técnica militarizada para acessar os módulos
              de instrução tática, diretrizes de código e telemetria de aprendizado.
            </p>

            {/* Metadados de Telemetria */}
            <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-[#262833] pt-4 font-mono text-[11px] text-[#64748B]">
              <div>
                STATUS DA BASE:{" "}
                <span className="text-emerald-400 font-semibold">SINCRONIZADO</span>
              </div>
              <div className="hidden sm:block text-[#262833]">|</div>
              <div>
                CURSOS ATIVOS:{" "}
                <span className="text-[#A855F7] font-semibold">
                  {courses ? String(courses.length).padStart(2, "0") : "00"} PROGRAMAS
                </span>
              </div>
              <div className="hidden sm:block text-[#262833]">|</div>
              <div>
                PROTOCOLO: <span className="text-[#CBD5E1]">REST / NEXT 16 SSR</span>
              </div>
            </div>
          </div>
        </div>

        {/* Grade de Cursos ou Tratamento de Estados */}
        {error ? (
          <ErrorState
            title="FALHA DE COMUNICAÇÃO"
            message="Não foi possível carregar os cursos"
          />
        ) : (
          <CourseGrid courses={courses} />
        )}
      </main>

      {/* Footer Tático */}
      <footer className="mt-auto border-t border-[#262833] bg-[#0B0C10] px-6 py-6 font-mono text-xs text-[#64748B]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-[#8B5CF6]">⌘</span>
            <span className="text-[#94A3B8]">COMANDO INDUSTRIAL OPERATING SYSTEM</span>
          </div>
          <div>ESTADO: CODIFICADO {"//"} GRAU DE SEGURANÇA 4</div>
        </div>
      </footer>
    </div>
  );
}
