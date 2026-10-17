"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authService, User } from "@/services/auth.service";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser(authService.getCurrentUser());
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    router.push("/login");
  };

  return (
    <header className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-semibold tracking-wider text-neutral-100 group"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 font-black text-xs transition-transform group-hover:scale-105">
              C
            </span>
            <span>COMANDO</span>
          </Link>

          {/* Links Principais */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-neutral-400">
            <Link
              href="/"
              className={`transition-colors hover:text-neutral-100 ${
                pathname === "/" ? "text-neutral-100 font-semibold" : ""
              }`}
            >
              Início
            </Link>
            <Link
              href="/courses"
              className={`transition-colors hover:text-neutral-100 ${
                pathname.startsWith("/courses") ? "text-neutral-100 font-semibold" : ""
              }`}
            >
              Cursos
            </Link>
            <Link
              href="/videos"
              className={`transition-colors hover:text-neutral-100 ${
                pathname.startsWith("/videos") ? "text-neutral-100 font-semibold" : ""
              }`}
            >
              Gerenciar Vídeos
            </Link>
          </nav>
        </div>

        {/* Área do Usuário / Autenticação */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-xs text-neutral-400">
                Olá, <span className="font-medium text-neutral-200">{user.name}</span>
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`inline-flex items-center justify-center rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                pathname === "/login"
                  ? "bg-neutral-800 text-neutral-100"
                  : "bg-neutral-100 text-neutral-950 hover:bg-neutral-200 active:scale-95"
              }`}
            >
              Entrar
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
export default Navbar;
