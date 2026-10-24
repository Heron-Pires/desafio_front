"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import Navbar from "@/components/common/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Submissão do formulário de login via authService.
   */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Por favor, preencha todos os campos.");
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(email.trim(), password);
      setSuccessMessage(`Bem-vindo(a), ${response.user.name}! Redirecionando...`);
      setTimeout(() => {
        router.push("/courses");
      }, 700);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Erro ao autenticar. Verifique suas credenciais.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@comando.com.br");
    setPassword("comando123");
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-neutral-50 font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card de Login alinhado com o tema dark e violeta de [COMANDO.C] */}
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-8 shadow-2xl backdrop-blur-md relative overflow-hidden">
            {/* Glow sutil roxo no topo do card */}
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none rounded-full opacity-30"
              style={{
                background: "radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%)",
              }}
            />

            {/* Cabeçalho do Card */}
            <div className="text-center relative z-10">
              <div className="font-mono text-base font-bold tracking-wider text-neutral-100 mb-2">
                <span>[COMANDO.C]</span>
              </div>

              <div>
                <span className="rounded-md border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-xs font-mono text-neutral-300">
                  Área de Acesso
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-100 font-mono">
                Acesse sua conta
              </h1>
              <p className="mt-1.5 text-xs text-neutral-400">
                Entre para assistir às aulas e gerenciar seu aprendizado.
              </p>
            </div>

            {/* Alertas */}
            {errorMessage && (
              <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-300">
                <p className="font-semibold">Erro de autenticação</p>
                <p className="mt-0.5">{errorMessage}</p>
              </div>
            )}

            {successMessage && (
              <div className="mt-6 rounded-xl border border-emerald-900/60 bg-emerald-950/40 p-3.5 text-xs text-emerald-300">
                <p className="font-semibold">{successMessage}</p>
              </div>
            )}

            {/* Formulário */}
            <form onSubmit={handleLogin} className="mt-6 space-y-4 relative z-10">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1.5 font-mono"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="admin@comando.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 transition-colors focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-wider text-neutral-300 font-mono"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickFill();
                    }}
                    className="text-[11px] text-violet-400 hover:text-violet-300 transition-colors"
                  >
                    Preencher teste
                  </a>
                </div>
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 transition-colors focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 rounded border-neutral-700 bg-neutral-900 text-violet-600 accent-violet-600"
                  />
                  <span className="text-xs text-neutral-400">
                    Lembrar de mim
                  </span>
                </label>

                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] text-neutral-400 underline hover:text-neutral-200"
                >
                  admin@comando.com.br
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-95 px-6 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Autenticando...
                  </span>
                ) : (
                  "Entrar na Plataforma"
                )}
              </button>
            </form>

            {/* Rodapé do Card */}
            <div className="mt-6 border-t border-neutral-800/80 pt-5 text-center text-xs text-neutral-400">
              Quer conhecer o catálogo?{" "}
              <Link href="/courses" className="text-violet-400 hover:text-violet-300 hover:underline">
                Acesse todos os cursos
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer unificado */}
      <footer className="border-t border-neutral-900 bg-neutral-950 py-6 px-6 text-center text-xs text-neutral-400">
        &copy; 2026 [Comando.C] | Aprenda tecnologia com foco em alta performance
      </footer>
    </div>
  );
}
