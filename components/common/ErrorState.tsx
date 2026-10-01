"use client";

import { Button } from "@/components/ui/Button";

export interface ErrorStateProps {
  title?: string;
  message?: string;
  errorCode?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "FALHA DE COMUNICAÇÃO",
  message = "Não foi possível carregar os cursos",
  errorCode = "ERR_NET_DISCONNECT_0x500",
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className="relative mx-auto my-12 w-full max-w-2xl overflow-hidden border border-red-900/60 bg-[#181920] p-8 text-center shadow-[0_0_30px_rgba(239,68,68,0.08)] chamfer-card"
    >
      {/* Marcadores de Mira nos cantos */}
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-xs text-red-500/60 select-none">
        +
      </span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-xs text-red-500/60 select-none">
        +
      </span>

      {/* Faixa técnica superior */}
      <div className="mb-6 flex items-center justify-between border-b border-red-900/30 pb-3 font-mono text-[10px] text-red-400/80">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-ping rounded-full bg-red-500" />
          ESTADO DO PROTOCOLO: INTERROMPIDO
        </span>
        <span>ID: {errorCode}</span>
      </div>

      {/* Ícone de alerta militar */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-red-500/30 bg-red-950/40 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)] chamfer-tag">
        <svg
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      <h2 className="font-mono text-lg font-bold tracking-wider text-red-400 sm:text-xl">
        {title} {"//"} {message}
      </h2>

      <p className="mx-auto mt-3 max-w-md font-sans text-xs leading-relaxed text-[#94A3B8]">
        A transmissão de dados táticos foi interrompida ou o servidor central não
        respondeu ao sinal de sincronização. Verifique a conectividade de rede do
        posto de comando.
      </p>

      {onRetry && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="primary"
            onClick={onRetry}
            className="flex items-center gap-2 bg-[#7C3AED] hover:bg-[#8B5CF6] text-white border-[#8B5CF6]"
          >
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            TENTAR NOVAMENTE
          </Button>
        </div>
      )}
    </div>
  );
}
