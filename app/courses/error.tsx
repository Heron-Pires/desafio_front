'use client';

import Link from "next/link";
import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function CoursesError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-wider text-neutral-100"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 font-black text-xs">
              C
            </span>
            COMANDO
          </Link>
          <Link
            href="/"
            className="text-xs text-neutral-400 transition-colors hover:text-neutral-200"
          >
            &larr; Voltar para o início
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-24">
        <ErrorMessage
          message="Não foi possível carregar os cursos."
          onRetry={reset}
        />
        <div className="mt-4 text-center">
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-neutral-200"
          >
            &larr; Voltar para a página inicial
          </Link>
        </div>
      </main>
    </div>
  );
}
