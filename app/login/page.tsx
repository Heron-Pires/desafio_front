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
   * Submissão do formulário de login utilizando Axios (via authService).
   * Sem Promises em JS puro (async/await estruturado com try/catch).
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
        router.push("/videos");
      }, 800);
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
    <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-neutral-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Card de Login com o mesmo tema do resto do site */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-8 shadow-2xl backdrop-blur-md">
            {/* Cabeçalho do Card */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 text-neutral-950 font-black text-sm">
                  C
                </span>
                <span className="text-sm font-bold tracking-wider text-neutral-100">
                  PLATAFORMA COMANDO
                </span>
              </div>

              <div>
                <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
                  Área do Aluno & Instrutor
                </span>
              </div>

              <h1 className="mt-3 text-2xl font-bold tracking-tight text-neutral-100">
                Acesse sua conta
              </h1>
              <p className="mt-1.5 text-xs text-neutral-400">
                Entre para assistir às aulas e gerenciar os vídeos da plataforma.
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
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1.5"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="exemplo@comando.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium uppercase tracking-wider text-neutral-300"
                  >
                    Senha
                  </label>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Para testes, utilize qualquer senha ou o botão de preenchimento rápido.");
                    }}
                    className="text-[11px] text-neutral-400 hover:text-neutral-200 transition-colors"
                  >
                    Esqueceu a senha?
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
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 transition-colors focus:border-neutral-500 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-neutral-100 accent-neutral-200"
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
                  Preencher dados de teste
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 inline-flex h-11 items-center justify-center rounded-xl bg-neutral-100 px-6 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg
                      className="h-4 w-4 animate-spin text-neutral-950"
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
              Precisa de ajuda?{" "}
              <Link href="/courses" className="text-neutral-200 hover:underline">
                Acesse o catálogo público
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer simples */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 px-6 py-6 text-center text-xs text-neutral-500">
        &copy; {new Date().getFullYear()} Plataforma Comando. Todos os direitos reservados.
      </footer>
    </div>
  );
}
