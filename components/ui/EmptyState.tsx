interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "Nenhum curso disponível.",
  description = "Novos conteúdos serão adicionados em breve pelo catálogo.",
}: EmptyStateProps) {
  return (
    <div className="flex min-h-[300px] w-full flex-col items-center justify-center rounded-xl border border-dashed border-neutral-800 bg-neutral-900/30 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-800 text-neutral-400">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-base font-semibold text-neutral-200">{title}</h3>
      <p className="mt-1 text-sm text-neutral-400 max-w-sm">{description}</p>
    </div>
  );
}
