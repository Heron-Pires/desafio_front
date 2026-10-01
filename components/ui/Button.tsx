import React, { forwardRef } from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isChamfered?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isChamfered = true,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-mono font-medium tracking-wider transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none active:scale-[0.98]";

    const chamferClass = isChamfered ? "chamfer-btn" : "rounded-sm";

    const variantStyles = {
      primary:
        "bg-[#7C3AED] hover:bg-[#8B5CF6] text-white shadow-[0_0_15px_rgba(124,58,237,0.35)] border border-[#8B5CF6] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]",
      secondary:
        "bg-[#1F2029] hover:bg-[#262833] text-[#CBD5E1] hover:text-white border border-[#2E303E] hover:border-[#8B5CF6]/60",
      outline:
        "bg-transparent hover:bg-[#8B5CF6]/10 text-[#C4B5FD] border border-[#8B5CF6]/50 hover:border-[#8B5CF6] shadow-[0_0_10px_rgba(139,92,246,0.1)]",
      ghost:
        "bg-transparent hover:bg-[#1F2029] text-[#94A3B8] hover:text-[#CBD5E1] border border-transparent",
      danger:
        "bg-red-950/40 hover:bg-red-900/50 text-red-300 border border-red-800/60 hover:border-red-600",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-xs",
      lg: "px-6 py-3 text-sm",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`${baseStyles} ${chamferClass} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
