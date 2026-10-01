import React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "violet" | "steel" | "emerald" | "amber" | "outline";
  size?: "sm" | "md";
  showDot?: boolean;
}

export function Badge({
  children,
  variant = "violet",
  size = "sm",
  showDot = false,
  className = "",
  ...props
}: BadgeProps) {
  const variantStyles = {
    violet:
      "border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#C4B5FD] shadow-[0_0_8px_rgba(139,92,246,0.15)]",
    steel:
      "border border-[#262833] bg-[#181920] text-[#94A3B8]",
    emerald:
      "border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.1)]",
    amber:
      "border border-amber-500/40 bg-amber-950/30 text-amber-400",
    outline:
      "border border-[#2E303E] bg-transparent text-[#CBD5E1]",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-medium chamfer-tag ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {showDot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            variant === "emerald"
              ? "bg-emerald-400 shadow-[0_0_4px_#34d399]"
              : variant === "violet"
              ? "bg-[#8B5CF6] shadow-[0_0_4px_#8b5cf6]"
              : variant === "amber"
              ? "bg-amber-400"
              : "bg-[#94A3B8]"
          }`}
        />
      )}
      {children}
    </span>
  );
}
