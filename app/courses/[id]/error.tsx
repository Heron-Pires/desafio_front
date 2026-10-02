'use client';

import Link from "next/link";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function CourseDetailError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-12">
      <div className="w-full max-w-md">
        <ErrorMessage
          message="Não foi possível carregar as informações do curso."
          onRetry={reset}
        />
        <div className="mt-4 text-center">
          <Link
            href="/courses"
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            &larr; Voltar para o catálogo de cursos
          </Link>
        </div>
      </div>
    </main>
  );
}
