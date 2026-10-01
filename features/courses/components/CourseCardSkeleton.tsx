import { Skeleton } from "@/components/ui/Skeleton";

export function CourseCardSkeleton() {
  return (
    <div className="relative flex flex-col overflow-hidden border border-[#262833] bg-[#181920] chamfer-card">
      {/* Top telemetry bar skeleton */}
      <div className="flex items-center justify-between border-b border-[#262833] bg-[#111217] px-4 py-1.5">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>

      {/* Thumbnail skeleton */}
      <div className="relative aspect-video w-full">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content skeleton */}
      <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
        <div>
          <Skeleton className="h-5 w-4/5" />
          <Skeleton className="mt-3 h-3.5 w-full" />
          <Skeleton className="mt-1.5 h-3.5 w-3/4" />
        </div>

        <div className="border-t border-[#262833] pt-3.5 flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  );
}
