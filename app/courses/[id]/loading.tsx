import { Skeleton } from "@/components/ui/Skeleton";

export default function CourseDetailLoading() {
  return (
    <main className="min-h-screen bg-neutral-950 px-6 py-10 lg:px-12">
      <Skeleton className="h-4 w-32 rounded" />
      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-6 w-24 rounded" />
          <Skeleton className="h-10 w-3/4 rounded" />
          <Skeleton className="h-20 w-full rounded" />
          <div className="mt-8 space-y-3 pt-6">
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </div>
        </div>
        <div>
          <Skeleton className="aspect-video w-full rounded-xl" />
        </div>
      </div>
    </main>
  );
}
