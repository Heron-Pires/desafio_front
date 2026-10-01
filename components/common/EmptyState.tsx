import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  description?: string;
}

export function EmptyState({
  title = "SISTEMA PRONTO",
  message = "Nenhum curso disponível no momento",
  description = "Aguardando transmissão de novas diretrizes operacionais e módulos de instrução técnica pelo alto comando.",
}: EmptyStateProps) {
  return (
    <div className="relative mx-auto my-12 w-full max-w-2xl overflow-hidden border border-[#262833] bg-[#181920]/80 p-10 text-center shadow-[0_0_25px_rgba(0,0,0,0.5)] chamfer-card">
      {/* Detalhes de Mira nos Cantos */}
      <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-xs text-[#8B5CF6]/50 select-none">
        +
      </span>
      <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-xs text-[#8B5CF6]/50 select-none">
        +
      </span>

      {/* Header técnico */}
      <div className="mb-6 flex items-center justify-between border-b border-[#262833] pb-3 font-mono text-[10px] text-[#64748B]">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          RADAR DE FREQUÊNCIA: LIMPO
        </span>
        <span>SECTOR {"//"} 00-NULL</span>
      </div>

      {/* Radar tático estético */}
      <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[#2E303E] bg-[#111217]">
        <div className="absolute inset-2 rounded-full border border-dashed border-[#8B5CF6]/30" />
        <div className="absolute inset-5 rounded-full border border-[#8B5CF6]/20" />
        <span className="font-mono text-lg text-[#8B5CF6]">◎</span>
      </div>

      <h3 className="font-mono text-base font-bold tracking-wider text-white sm:text-lg">
        {title} {"//"} {message}
      </h3>

      <p className="mx-auto mt-2 max-w-md font-sans text-xs leading-relaxed text-[#94A3B8]">
        {description}
      </p>

      <div className="mt-6 flex justify-center">
        <Link href="/courses">
          <Button variant="outline" size="sm">
            ATUALIZAR RADAR DE BUSCA
          </Button>
        </Link>
      </div>
    </div>
  );
}
