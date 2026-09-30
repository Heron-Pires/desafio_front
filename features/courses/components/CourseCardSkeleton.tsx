import { Skeleton } from "@/components/ui/Skeleton";

export function CourseCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
      <Skeleton className="aspect-video w-full rounded-none" />
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <Skeleton className="h-5 w-3/4 rounded" />
          <Skeleton className="mt-3 h-4 w-full rounded" />
          <Skeleton className="mt-1.5 h-4 w-2/3 rounded" />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-neutral-800/80 pt-3">
          <Skeleton className="h-4 w-20 rounded" />
          <Skeleton className="h-4 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}
