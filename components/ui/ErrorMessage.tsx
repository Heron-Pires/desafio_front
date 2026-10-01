"use client";

import { ErrorState } from "@/components/common/ErrorState";

export function ErrorMessage({
  message = "Não foi possível carregar os cursos.",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return <ErrorState message={message} onRetry={onRetry} />;
}

export { ErrorState };
