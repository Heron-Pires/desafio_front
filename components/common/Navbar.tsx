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

  const isHomeActive = pathname === "/";
  const isCoursesActive = pathname.startsWith("/courses");
  const isComponentsActive = pathname.startsWith("/components");
  const isLoginActive = pathname === "/login";

  return (
    <header className="border-b border-neutral-900 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-base font-bold tracking-widest text-neutral-100 transition-opacity hover:opacity-90"
          >
            <span>[COMANDO.C]</span>
          </Link>
        </div>

        {/* Links Centrais de Navegação */}
        <nav className="flex items-center gap-3 text-xs font-medium">
          <Link
            href="/"
            className={`rounded-lg px-4 py-1.5 transition-all ${
              isHomeActive
                ? "bg-violet-600 text-white font-semibold shadow-sm shadow-violet-600/30"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60"
            }`}
          >
            Início
          </Link>
          <Link
            href="/courses"
            className={`rounded-lg px-4 py-1.5 transition-all ${
              isCoursesActive
                ? "bg-violet-600 text-white font-semibold shadow-sm shadow-violet-600/30"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60"
            }`}
          >
            Cursos
          </Link>
          <Link
            href="/components"
            className={`rounded-lg px-4 py-1.5 transition-all ${
              isComponentsActive
                ? "bg-violet-600 text-white font-semibold shadow-sm shadow-violet-600/30"
                : "text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60"
            }`}
          >
            Componentes
          </Link>
        </nav>

        {/* Ações da Direita */}
        <div className="flex items-center gap-3">
          <a
            href="https://discord.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 px-4 py-1.5 text-xs font-semibold text-white shadow-sm shadow-violet-600/30 transition-all font-display tracking-wider"
          >
            Recrutamento
          </a>

          {user ? (
            <div className="flex items-center gap-3 pl-2 border-l border-neutral-800">
              <span className="text-xs text-neutral-300 font-mono hidden md:inline">
                Olá, <strong className="text-white">{user.name}</strong>
              </span>
              <span className="rounded bg-violet-950/80 border border-violet-800/60 px-1.5 py-0.5 text-[10px] font-mono text-violet-300 font-semibold">
                Admin
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-xs text-neutral-400 hover:text-neutral-100 hover:border-neutral-700 transition-colors"
                title="Sair da conta"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                isLoginActive
                  ? "border-violet-500 bg-violet-950/40 text-violet-300"
                  : "border-neutral-800 bg-neutral-900/80 text-neutral-300 hover:text-white hover:border-neutral-700"
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
