import React, { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  scanline?: boolean;
}

export function Skeleton({
  className = "",
  scanline = true,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden bg-[#1F2029] border border-[#262833]/80 animate-pulse ${
        scanline ? "animate-scanline" : ""
      } ${className}`}
      aria-hidden="true"
      {...props}
    >
      {/* Linha técnica sutil interna simulando escaneamento de decodificação */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8B5CF6]/5 to-transparent pointer-events-none" />
    </div>
  );
}
