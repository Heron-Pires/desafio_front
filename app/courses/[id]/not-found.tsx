import Link from "next/link";

export default function CourseNotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-950 px-6 py-12 text-center">
      <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-semibold text-neutral-400">
        404
      </span>
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-neutral-100 sm:text-3xl">
        Curso não encontrado
      </h1>
      <p className="mt-2 text-sm text-neutral-400 max-w-sm">
        O curso que procura não existe ou foi removido da plataforma.
      </p>
      <Link
        href="/courses"
        className="mt-6 rounded-lg bg-neutral-100 px-5 py-2.5 text-xs font-semibold text-neutral-900 transition-colors hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400"
      >
        Voltar para a listagem
      </Link>
    </main>
  );
}
