'use client';

import { useRouter } from "next/navigation";

interface ErrorMessageProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorMessage({
  message = "Não foi possível carregar os cursos.",
  onRetry,
}: ErrorMessageProps) {
  const router = useRouter();
  const handleRetry = onRetry ?? (() => router.refresh());

  return (
    <div
      role="alert"
      className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-xl border border-red-900/40 bg-red-950/20 p-6 text-center"
    >
      <p className="text-sm font-medium text-red-400">{message}</p>
      <button
        onClick={handleRetry}
        type="button"
        className="mt-4 rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-100 transition-colors hover:bg-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-500 active:scale-95"
      >
        Tentar novamente
      </button>
    </div>
  );
}
