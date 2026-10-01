import React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  chamfer?: boolean;
  withCorners?: boolean;
  hoverEffect?: boolean;
}

export function Card({
  children,
  chamfer = false,
  withCorners = true,
  hoverEffect = false,
  className = "",
  ...props
}: CardProps) {
  return (
    <div
      className={`relative bg-[#181920] border border-[#262833] text-[#CBD5E1] transition-all duration-300 ${
        chamfer ? "chamfer-card" : ""
      } ${
        hoverEffect
          ? "hover:border-[#8B5CF6]/50 hover:bg-[#1F2029] hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]"
          : ""
      } ${className}`}
      {...props}
    >
      {withCorners && (
        <>
          <span className="pointer-events-none absolute -top-1 -left-1 text-[9px] font-mono leading-none text-[#8B5CF6]/40 select-none">
            +
          </span>
          <span className="pointer-events-none absolute -bottom-1 -right-1 text-[9px] font-mono leading-none text-[#8B5CF6]/40 select-none">
            +
          </span>
        </>
      )}
      {children}
    </div>
  );
}
