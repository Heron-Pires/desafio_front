"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/common/ErrorState";
import { Header } from "@/components/common/Header";

export default function CoursesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Courses Error Boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#CBD5E1]">
      <Header currentRoute="courses" />
      <main className="mx-auto flex-1 w-full max-w-7xl px-6 py-12 flex items-center justify-center">
        <ErrorState
          title="FALHA DE COMUNICAÇÃO"
          message="Não foi possível carregar os cursos"
          errorCode={error.digest || "ERR_SYS_ABORT"}
          onRetry={() => reset()}
        />
      </main>
    </div>
  );
}
