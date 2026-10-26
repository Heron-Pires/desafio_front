"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { CourseSummary } from "../types/course";
import { coursesService } from "../services/courses.service";
import { authService } from "@/services/auth.service";
import { CourseCard } from "./CourseCard";
import ImageUpload from "@/components/ui/ImageUpload";

interface CoursesCatalogManagerProps {
  initialCourses: CourseSummary[];
  initialError: string | null;
}

export function CoursesCatalogManager({
  initialCourses,
  initialError,
}: CoursesCatalogManagerProps) {
  const [courses, setCourses] = useState<CourseSummary[]>(initialCourses);
  const [isAdmin, setIsAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [areaFilter, setAreaFilter] = useState("Todas");
  const [levelFilter, setLevelFilter] = useState("Todos");
  const [orderFilter, setOrderFilter] = useState("Recentes");

  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | number | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Programação");
  const [level, setLevel] = useState("Iniciante");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const refreshCourses = useCallback(async () => {
    try {
      const data = await coursesService.getAll();
      setCourses(data);
    } catch (err) {
      console.warn("Erro ao sincronizar catálogo de cursos:", err);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      refreshCourses();
      setIsAdmin(authService.isAuthenticated());
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshCourses]);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentCourseId(null);
    setTitle("");
    setCategory("Programação");
    setLevel("Iniciante");
    setDescription("");
    setThumbnail("");
    setThumbnailFile(null);
    setModalOpen(true);
  };

  const openEditModal = (course: CourseSummary, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setCurrentCourseId(course.id);
    setTitle(course.title);
    setCategory(course.category || "Programação");
    setLevel(course.level || "Iniciante");
    setDescription(course.shortDescription || "");
    setThumbnail(course.thumbnail || "");
    setThumbnailFile(null);
    setModalOpen(true);
  };

  const handleDeleteCourse = async (id: string | number, courseTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ok = window.confirm(`Deseja realmente remover o curso "${courseTitle}"?`);
    if (!ok) return;

    try {
      await coursesService.delete(id);
      await refreshCourses();
      setFeedback({ type: "success", text: `Curso "${courseTitle}" removido com sucesso.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir curso.";
      setFeedback({ type: "error", text: msg });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const chosenThumbnail = thumbnailFile || (thumbnail.trim() ? thumbnail.trim() : undefined);

      if (isEditing && currentCourseId) {
        await coursesService.update(currentCourseId, {
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          thumbnail: chosenThumbnail,
          level: level,
        });
        await refreshCourses();
        setFeedback({ type: "success", text: "Curso atualizado com sucesso no banco de dados!" });
      } else {
        await coursesService.create({
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          thumbnail: chosenThumbnail,
          level: level,
        });
        await refreshCourses();
        setFeedback({ type: "success", text: "Novo curso persistido com sucesso no banco de dados!" });
      }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Erro ao salvar no banco de dados. Verifique se o backend está ativo.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Filtragem e ordenação reativa
  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(search.toLowerCase()) ||
          (c.shortDescription && c.shortDescription.toLowerCase().includes(search.toLowerCase()));

        const matchesArea =
          areaFilter === "Todas" ||
          (c.category && c.category.toLowerCase().includes(areaFilter.toLowerCase()));

        const matchesLevel =
          levelFilter === "Todos" ||
          (c.level && c.level.toLowerCase() === levelFilter.toLowerCase());

        return matchesSearch && matchesArea && matchesLevel;
      })
      .sort((a, b) => {
        if (orderFilter === "A-Z") {
          return a.title.localeCompare(b.title);
        }
        if (orderFilter === "Aulas") {
          return (b.lessonsCount ?? 0) - (a.lessonsCount ?? 0);
        }
        return 0; // Ordem Recentes (padrão)
      });
  }, [courses, search, areaFilter, levelFilter, orderFilter]);

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <nav className="mb-4 text-xs text-neutral-400 font-mono">
        <span>Cursos</span>
        <span className="mx-2">&gt;</span>
        <span className="text-neutral-300">Todos os Cursos</span>
      </nav>

      {/* Cabeçalho Dividido */}
      <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-6 border-b border-neutral-900 pb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-neutral-100 font-display">
            ESCOLHA O SEU PRÓXIMO PASSO.
          </h1>
          {isAdmin && (
            <div className="mt-2 inline-flex items-center gap-2 rounded-md border border-violet-800/80 bg-violet-950/40 px-2.5 py-1 text-[11px] font-mono text-violet-300">
              <span className="h-2 w-2 rounded-full bg-violet-400 animate-pulse" />
              Modo Administrador Ativo (CRUD Habilitado)
            </div>
          )}
        </div>

        <div className="md:max-w-md text-xs text-neutral-400 leading-relaxed">
          <p>
            Explore as opções abaixo e selecione o curso que melhor se alinha aos seus objetivos de aprendizado e carreira. Você pode filtrar por área ou nível de conhecimento.
          </p>
        </div>
      </div>

      {/* Barra de Filtros e Busca */}
      <div className="mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Campo de Busca */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Buscar curso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 px-3.5 py-2 pl-9 text-xs text-neutral-100 placeholder-neutral-500 focus:border-violet-500 focus:outline-none"
          />
          <svg
            className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Dropdowns de Filtro */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            aria-label="Filtrar por Área"
            className="rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-neutral-300 focus:border-violet-500 focus:outline-none"
          >
            <option value="Todas">Área: Todas</option>
            <option value="Sistemas">Sistemas &amp; Baixo Nível</option>
            <option value="Programação">Programação</option>
            <option value="Banco de Dados">Banco de Dados</option>
            <option value="Infraestrutura">Infraestrutura</option>
            <option value="Ferramentas">Ferramentas</option>
            <option value="Segurança">Segurança</option>
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            aria-label="Filtrar por Nível"
            className="rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-neutral-300 focus:border-violet-500 focus:outline-none"
          >
            <option value="Todos">Nível: Todos</option>
            <option value="Iniciante">Iniciante</option>
            <option value="Médio">Médio</option>
            <option value="Avançado">Avançado</option>
          </select>

          <select
            value={orderFilter}
            onChange={(e) => setOrderFilter(e.target.value)}
            aria-label="Ordenar Cursos"
            className="rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-neutral-300 focus:border-violet-500 focus:outline-none"
          >
            <option value="Recentes">Ordem: Recentes</option>
            <option value="A-Z">Ordem: A-Z</option>
            <option value="Aulas">Ordem: Carga Horária</option>
          </select>

          {/* Botão de Criação de Curso (apenas se logado como Admin) */}
          {isAdmin && (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/30 transition-all ml-auto"
            >
              <span className="font-bold">+</span>
              <span>Novo Curso</span>
            </button>
          )}
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-xl border p-3.5 text-xs font-medium flex items-center justify-between ${
            feedback.type === "success"
              ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-300"
              : "border-red-900/60 bg-red-950/40 text-red-300"
          }`}
        >
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-neutral-400 hover:text-neutral-200"
          >
            &times;
          </button>
        </div>
      )}

      {initialError && courses.length === 0 ? (
        <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-center text-xs text-red-300">
          {initialError}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center bg-neutral-900/20">
          <p className="text-xs text-neutral-400">Nenhum curso encontrado para os filtros selecionados.</p>
        </div>
      ) : (
        /* Grid de Cursos */
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              isAdmin={isAdmin}
              onEdit={openEditModal}
              onDelete={handleDeleteCourse}
            />
          ))}
        </section>
      )}

      {/* Modal para Criar / Editar Curso */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-100 font-mono">
                {isEditing ? "Editar Curso" : "Criar Novo Curso"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-200"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                  Título do Curso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Engenharia Reversa"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                    Categoria
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Sistemas & Baixo Nível"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                    Nível do Curso *
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none font-mono"
                  >
                    <option value="Iniciante">Iniciante</option>
                    <option value="Médio">Médio</option>
                    <option value="Avançado">Avançado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  placeholder="Visão geral dos conceitos abordados no curso..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <ImageUpload
                  label="Miniatura do Curso (Capa)"
                  value={thumbnail}
                  onChange={(val) => setThumbnail(val)}
                  onFileChange={(file) => setThumbnailFile(file)}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2 text-xs font-semibold text-white transition-all disabled:opacity-50"
                >
                  {submitting ? "Processando..." : isEditing ? "Salvar Curso" : "Criar Curso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default CoursesCatalogManager;
