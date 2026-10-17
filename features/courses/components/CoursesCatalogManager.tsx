"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { CourseSummary } from "../types/course";
import { coursesService } from "../services/courses.service";
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
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState<string | number | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Recarrega lista atualizada diretamente da API backend
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
    }, 0);
    return () => clearTimeout(timer);
  }, [refreshCourses]);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentCourseId(null);
    setTitle("");
    setCategory("Programação");
    setDescription("");
    setThumbnail("");
    setModalOpen(true);
  };

  const openEditModal = (course: CourseSummary, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setCurrentCourseId(course.id);
    setTitle(course.title);
    setCategory(course.category || "Programação");
    setDescription(course.shortDescription || "");
    setThumbnail(course.thumbnail || "");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      if (isEditing && currentCourseId) {
        // Atualiza curso no PostgreSQL via Axios (PUT /courses/:id)
        await coursesService.update(currentCourseId, {
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          thumbnail: thumbnail.trim(),
        });

        await refreshCourses();
        setFeedback({ type: "success", text: "Curso atualizado com sucesso no banco de dados!" });
      } else {
        // Cria curso no PostgreSQL via Axios (POST /courses)
        await coursesService.create({
          title: title.trim(),
          category: category.trim(),
          description: description.trim(),
          thumbnail: thumbnail.trim(),
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

  const handleDeleteCourse = async (id: string | number, courseTitle: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const ok = window.confirm(`Deseja realmente remover o curso "${courseTitle}" do banco de dados?`);
    if (!ok) return;

    try {
      // Exclui curso no PostgreSQL via Axios (DELETE /courses/:id)
      await coursesService.delete(id);
      await refreshCourses();
      setFeedback({ type: "success", text: `Curso "${courseTitle}" removido do banco de dados.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir curso do banco de dados.";
      setFeedback({ type: "error", text: msg });
    }
  };

  return (
    <div>
      {/* Barra de Ação Superior */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
            Catálogo Completo
          </span>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
            Cursos Disponíveis
          </h1>
          <p className="mt-2 text-sm text-neutral-400">
            Escolha uma formação ou crie e gerencie seus próprios cursos e vídeos gravados no PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/videos"
            className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-neutral-100 transition-colors"
          >
            Painel de Vídeos
          </Link>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-100 px-4 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 active:scale-95 transition-all shadow-md"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar Novo Curso
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`mb-6 rounded-xl border p-4 text-xs font-medium flex items-center justify-between ${
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
      ) : courses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center bg-neutral-900/30">
          <p className="text-sm text-neutral-400">Nenhum curso disponível no momento.</p>
          <button
            type="button"
            onClick={openCreateModal}
            className="mt-4 rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
          >
            + Criar primeiro curso
          </button>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/70 transition-all duration-300 hover:-translate-y-1 hover:border-neutral-700 hover:shadow-2xl hover:shadow-black/60"
            >
              <Link href={`/courses/${course.id}`} className="block">
                <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title || "Miniatura do curso"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      unoptimized
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-neutral-800 text-xs text-neutral-500">
                      Sem miniatura
                    </div>
                  )}
                  {course.category && (
                    <span className="absolute left-3 top-3 rounded-md bg-black/75 px-2.5 py-1 text-xs font-medium text-neutral-200 backdrop-blur-md">
                      {course.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="line-clamp-1 text-base font-semibold text-neutral-100 transition-colors group-hover:text-white">
                    {course.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-neutral-400">
                    {course.shortDescription || "Sem descrição informada."}
                  </p>
                </div>
              </Link>

              {/* Ações do Curso */}
              <div className="px-5 pb-5 pt-0">
                <div className="flex items-center justify-between border-t border-neutral-800/80 pt-3 text-xs">
                  <span className="text-neutral-400">
                    {course.modulesCount ?? 0} {course.modulesCount === 1 ? "módulo" : "módulos"}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => openEditModal(course, e)}
                      title="Editar curso"
                      className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-[11px] font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCourse(course.id, course.title, e)}
                      title="Excluir curso"
                      className="rounded border border-red-900/60 bg-red-950/30 px-2 py-1 text-[11px] font-medium text-red-300 hover:bg-red-900/60 hover:text-red-100 transition-colors"
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Modal para Criar / Editar Curso */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-neutral-100">
                {isEditing ? "Editar Curso" : "Criar Novo Curso"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                  Título do Curso *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Engenharia de Software Moderna"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                  Categoria
                </label>
                <input
                  type="text"
                  placeholder="Ex: Programação, Cloud, Design"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  placeholder="Visão geral dos conceitos abordados no curso..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              {/* Upload de Imagem responsivo via Media Query com Filtro de Arquivo */}
              <div>
                <ImageUpload
                  label="Miniatura do Curso (Capa)"
                  value={thumbnail}
                  onChange={(val) => setThumbnail(val)}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-neutral-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-neutral-100 px-5 py-2.5 text-xs font-semibold text-neutral-950 hover:bg-neutral-200 active:scale-95 disabled:opacity-50"
                >
                  {submitting ? "Processando com Axios..." : isEditing ? "Salvar Curso" : "Criar Curso"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
