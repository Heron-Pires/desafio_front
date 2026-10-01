import Link from "next/link";

interface ReturnButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function ReturnButton({
  href = "/courses",
  label = "← RETORNAR AO CATÁLOGO",
  className = "",
}: ReturnButtonProps) {
  return (
    <Link
      href={href}
      className={`group relative inline-flex items-center gap-2 border border-[#2E303E] bg-[#181920] px-4 py-2 font-mono text-xs tracking-wider text-[#94A3B8] transition-all duration-200 hover:border-[#8B5CF6] hover:bg-[#1F2029] hover:text-white hover:shadow-[0_0_12px_rgba(139,92,246,0.2)] chamfer-btn ${className}`}
    >
      <span className="text-[#8B5CF6] transition-transform duration-200 group-hover:-translate-x-1">
        ←
      </span>
      <span>{label.replace(/^←\s*/, "")}</span>
      <span className="ml-1 text-[10px] text-[#64748B] group-hover:text-[#A855F7]">
        [ESC]
      </span>
    </Link>
  );
}
