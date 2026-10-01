import { Header } from "@/components/common/Header";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CourseDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#CBD5E1]">
      <Header currentRoute="detail" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-6 py-8">
        {/* Return Button Skeleton */}
        <div className="mb-6 flex items-center justify-between">
          <Skeleton className="h-9 w-48 chamfer-btn" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Hero Card Skeleton */}
        <div className="relative mb-12 overflow-hidden border border-[#262833] bg-[#111217] p-6 chamfer-card lg:p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex gap-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-6 w-24" />
              </div>
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />

              <div className="border-t border-[#262833] pt-4 flex gap-6">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>

            <div className="lg:col-span-5">
              <Skeleton className="aspect-video w-full rounded-none" />
            </div>
          </div>
        </div>

        {/* Indicador de telemetria de carregamento */}
        <div className="mb-6 flex items-center gap-3 font-mono text-xs text-[#8B5CF6]">
          <span className="h-2 w-2 animate-ping rounded-full bg-[#8B5CF6]" />
          <span>DECODIFICANDO ESTRUTURA DE MÓDULOS E AULAS...</span>
        </div>

        {/* Modules Skeletons */}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="border border-[#262833] bg-[#181920] p-5 chamfer-card space-y-3"
            >
              <div className="flex justify-between items-center">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
