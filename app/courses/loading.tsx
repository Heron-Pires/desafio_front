import { Header } from "@/components/common/Header";
import { CourseCardSkeleton } from "@/features/courses/components/CourseCardSkeleton";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CoursesLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#CBD5E1]">
      <Header currentRoute="courses" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-6 py-10">
        {/* Banner Skeleton */}
        <div className="relative mb-10 overflow-hidden border border-[#262833] bg-[#111217] p-6 chamfer-card sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-10 w-2/3 max-w-md mb-3" />
          <Skeleton className="h-4 w-full max-w-xl mb-6" />

          <div className="border-t border-[#262833] pt-4 flex gap-6">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        {/* Indicador de decodificação de sistema */}
        <div className="mb-6 flex items-center gap-3 font-mono text-xs text-[#8B5CF6]">
          <span className="h-2 w-2 animate-ping rounded-full bg-[#8B5CF6]" />
          <span>DECODIFICANDO TELEMETRIA DO SISTEMA // AGUARDE...</span>
        </div>

        {/* Grid de Skeletons com Scanline */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <CourseCardSkeleton key={index} />
          ))}
        </div>
      </main>
    </div>
  );
}
