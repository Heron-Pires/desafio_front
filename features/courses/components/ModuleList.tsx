"use client";

import { useState } from "react";
import { Module } from "../types/course";
import { LessonItem } from "./LessonItem";
import { Badge } from "@/components/ui/Badge";

interface ModuleListProps {
  modules: Module[];
}

export function ModuleList({ modules }: ModuleListProps) {
  // Abre o primeiro módulo por padrão
  const [openModules, setOpenModules] = useState<Record<string | number, boolean>>(() => {
    const initial: Record<string | number, boolean> = {};
    modules.forEach((mod, index) => {
      initial[mod.id] = index === 0;
    });
    return initial;
  });

  const toggleModule = (id: string | number) => {
    setOpenModules((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (!modules || modules.length === 0) {
    return (
      <div className="border border-[#262833] bg-[#181920] p-6 text-center font-mono text-xs text-[#94A3B8]">
        NENHUM MÓDULO CADASTRADO NESTE PROTOCOLO.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modules.map((mod, index) => {
        const isOpen = !!openModules[mod.id];
        const modNumber = String(mod.order ?? index + 1).padStart(2, "0");
        const lessonCount = String(mod.lessons?.length || 0).padStart(2, "0");

        return (
          <div
            key={mod.id}
            className="overflow-hidden border border-[#262833] bg-[#181920] transition-all duration-200 hover:border-[#2E303E] chamfer-card"
          >
            {/* Header do Módulo (Accordion Trigger) */}
            <button
              type="button"
              onClick={() => toggleModule(mod.id)}
              className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[#1F2029] focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50 cursor-pointer"
              aria-expanded={isOpen}
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3">
                <span className="font-mono text-xs font-bold tracking-wider text-[#8B5CF6]">
                  {"// MOD_"}{modNumber}
                </span>
                <h3 className="font-sans text-sm font-bold text-white sm:text-base">
                  {mod.title}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                {/* Badge com contagem de aulas */}
                <Badge variant="steel" size="sm">
                  [ {lessonCount} AULAS ]
                </Badge>

                {/* Indicador de expansão tático */}
                <div
                  className={`flex h-6 w-6 items-center justify-center border border-[#2E303E] bg-[#111217] font-mono text-xs text-[#CBD5E1] transition-transform duration-200 ${
                    isOpen ? "rotate-180 border-[#8B5CF6] text-[#8B5CF6]" : ""
                  }`}
                >
                  ▼
                </div>
              </div>
            </button>

            {/* Conteúdo do Módulo / Lista de Aulas */}
            {isOpen && (
              <div className="border-t border-[#262833] bg-[#0B0C10]/60 p-4">
                <div className="mb-2 font-mono text-[10px] text-[#64748B] uppercase tracking-wider">
                  GRADE DE EXECUÇÃO DO MÓDULO {"//"} SEQUÊNCIA OPERACIONAL
                </div>
                <ul className="space-y-2">
                  {mod.lessons?.map((lesson, lessonIndex) => (
                    <LessonItem
                      key={lesson.id}
                      lesson={lesson}
                      index={lessonIndex}
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
