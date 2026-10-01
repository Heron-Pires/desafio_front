import Link from "next/link";

interface HeaderProps {
  currentRoute?: "courses" | "detail" | "home";
}

export function Header({ currentRoute = "courses" }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#262833] bg-[#0B0C10]/90 backdrop-blur-md">
      {/* Faixa técnica superior com telemetria militar */}
      <div className="border-b border-[#181920] bg-[#111217]/80 px-6 py-1 text-[10px] font-mono text-[#64748B]">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#A855F7]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#8B5CF6]" />
              SYS_STATUS: ONLINE // CANAL ATIVO
            </span>
            <span className="hidden sm:inline text-[#2E303E]">|</span>
            <span className="hidden sm:inline">SEC_GRID: 48.09 // LAT_02</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#94A3B8]">COMANDO TACTICAL CORE v2.4</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal do Header */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        <Link
          href="/courses"
          className="group flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          {/* Logo Militar com canto chanfrado e acento violeta */}
          <div className="relative flex h-9 w-9 items-center justify-center border border-[#8B5CF6] bg-[#181920] text-white font-mono font-black text-sm shadow-[0_0_12px_rgba(139,92,246,0.3)] chamfer-tag">
            <span className="text-[#8B5CF6] group-hover:text-white transition-colors">
              ⌘
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold tracking-widest text-white">
                COMANDO
              </span>
              <span className="text-[10px] font-mono text-[#8B5CF6] border border-[#8B5CF6]/40 px-1 py-0.2 rounded-xs">
                TAC_EDU
              </span>
            </div>
            <span className="text-[10px] font-mono tracking-wider text-[#64748B]">
              PLATAFORMA DE ENSINO TÁTICO
            </span>
          </div>
        </Link>

        {/* Navegação e Links */}
        <nav className="flex items-center gap-4">
          <Link
            href="/courses"
            className={`font-mono text-xs tracking-wider transition-colors px-3 py-1.5 border ${
              currentRoute === "courses"
                ? "border-[#8B5CF6] text-white bg-[#8B5CF6]/15 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                : "border-transparent text-[#94A3B8] hover:text-white hover:border-[#262833]"
            }`}
          >
            [ CATÁLOGO DE CURSOS ]
          </Link>
        </nav>
      </div>
    </header>
  );
}
