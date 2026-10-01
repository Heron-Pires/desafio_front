import { Header } from "@/components/common/Header";
import { ReturnButton } from "@/components/common/ReturnButton";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0C10] text-[#CBD5E1]">
      <Header currentRoute="courses" />

      <main className="mx-auto flex-1 w-full max-w-7xl px-6 py-16 flex items-center justify-center">
        <div className="relative mx-auto w-full max-w-xl overflow-hidden border border-[#262833] bg-[#111217] p-8 text-center shadow-[0_0_35px_rgba(0,0,0,0.7)] chamfer-card">
          <span className="pointer-events-none absolute -top-1 -left-1 font-mono text-xs text-[#8B5CF6]/50 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -bottom-1 -right-1 font-mono text-xs text-[#8B5CF6]/50 select-none">
            +
          </span>

          <div className="mb-6 flex items-center justify-between border-b border-[#262833] pb-3 font-mono text-[10px] text-[#64748B]">
            <span className="text-amber-400">SETOR INEXISTENTE</span>
            <span>STATUS: 404</span>
          </div>

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-amber-500/40 bg-amber-950/20 text-amber-400 font-mono text-xl font-black shadow-[0_0_15px_rgba(245,158,11,0.15)] chamfer-tag">
            404
          </div>

          <h1 className="font-mono text-xl font-bold tracking-wider text-white sm:text-2xl">
            ROTA NÃO LOCALIZADA
          </h1>

          <p className="mx-auto mt-3 max-w-md font-sans text-xs leading-relaxed text-[#94A3B8]">
            As coordenadas especificadas não existem nos sistemas da Plataforma Comando.
          </p>

          <div className="mt-8 flex justify-center">
            <ReturnButton label="← RETORNAR AO CATÁLOGO" />
          </div>
        </div>
      </main>
    </div>
  );
}
