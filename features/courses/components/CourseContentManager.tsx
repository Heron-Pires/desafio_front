"use client";

import React, { useState } from "react";
import { Module, Lesson } from "../types/course";
import { lessonsService } from "../services/lessons.service";
import ImageUpload from "@/components/ui/ImageUpload";

interface CourseContentManagerProps {
  courseId?: string | number;
  initialModules: Module[];
}

export function CourseContentManager({
  courseId,
  initialModules,
}: CourseContentManagerProps) {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string | number | null>(null);
  const [targetLessonId, setTargetLessonId] = useState<string | number | null>(null);

  // Formulário do vídeo
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(15);
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const openAddModal = (modId: string | number) => {
    setIsEditing(false);
    setTargetModuleId(modId);
    setTargetLessonId(null);
    setTitle("");
    setDuration(15);
    setDescription("");
    setVideoUrl("");
    setThumbnail("");
    setModalOpen(true);
  };

  const openEditModal = (modId: string | number, lesson: Lesson) => {
    setIsEditing(true);
    setTargetModuleId(modId);
    setTargetLessonId(lesson.id);
    setTitle(lesson.title);
    setDuration(lesson.duration || 15);
    setDescription(lesson.description || "");
    setVideoUrl(lesson.videoUrl || "");
    setThumbnail("");
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !targetModuleId) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      if (isEditing && targetLessonId) {
        // Atualiza vídeo via Axios (PUT /lessons/:id)
        const updated = await lessonsService.update(targetLessonId, {
          title: title.trim(),
          duration: Number(duration),
          description: description,
          moduleId: Number(targetModuleId),
          videoUrl: videoUrl,
        });

        setModules((prev) =>
          prev.map((mod) => {
            if (String(mod.id) === String(targetModuleId)) {
              return {
                ...mod,
                lessons: mod.lessons.map((l) =>
                  String(l.id) === String(targetLessonId) ? { ...l, ...updated } : l
                ),
              };
            }
            return mod;
          })
        );
        setFeedback({ type: "success", text: "Vídeo atualizado com sucesso via Axios!" });
      } else {
        // Cria novo vídeo via Axios (POST /lessons)
        const created = await lessonsService.create({
          moduleId: Number(targetModuleId),
          title: title.trim(),
          duration: Number(duration),
          description: description,
          videoUrl: videoUrl,
          position: 1,
        });

        setModules((prev) =>
          prev.map((mod) => {
            if (String(mod.id) === String(targetModuleId)) {
              return {
                ...mod,
                lessons: [...mod.lessons, created],
              };
            }
            return mod;
          })
        );
        setFeedback({ type: "success", text: "Novo vídeo cadastrado com sucesso via Axios!" });
      }
      setModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao processar vídeo.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (lessonId: string | number, lessonTitle: string) => {
    const ok = window.confirm(`Deseja excluir o vídeo "${lessonTitle}"?`);
    if (!ok) return;

    try {
      // Exclui vídeo via Axios (DELETE /lessons/:id)
      await lessonsService.delete(lessonId);

      setModules((prev) =>
        prev.map((mod) => ({
          ...mod,
          lessons: mod.lessons.filter((l) => String(l.id) !== String(lessonId)),
        }))
      );
      setFeedback({ type: "success", text: `Vídeo "${lessonTitle}" removido com sucesso.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao deletar vídeo.";
      setFeedback({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-6" data-course-id={courseId}>
      {feedback && (
        <div
          className={`rounded-xl border p-4 text-xs font-medium flex items-center justify-between ${
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

      {modules.length > 0 ? (
        modules.map((module, mIdx) => (
          <details
            key={module.id || mIdx}
            open
            className="group overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 transition-all [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="flex cursor-pointer items-center justify-between p-5 select-none transition-colors hover:bg-neutral-800/40">
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Módulo {mIdx + 1}
                </span>
                <h3 className="text-base font-semibold text-neutral-100">
                  {module.title}
                </h3>
              </div>

              <div className="flex items-center gap-4 text-xs text-neutral-400">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddModal(module.id);
                  }}
                  className="rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 font-medium text-neutral-200 hover:bg-neutral-700 hover:text-neutral-100 transition-colors inline-flex items-center gap-1.5"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Adicionar Vídeo
                </button>

                <span>
                  {module.lessons.length} {module.lessons.length === 1 ? "vídeo" : "vídeos"}
                </span>

                <svg
                  className="h-4 w-4 transition-transform duration-300 group-open:-rotate-180"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>

            <div className="border-t border-neutral-800/80 p-5 pt-3">
              {module.lessons.length > 0 ? (
                <ul className="space-y-2">
                  {module.lessons.map((lesson, lIdx) => (
                    <li
                      key={lesson.id || lIdx}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-neutral-800/60 bg-neutral-900/40 px-4 py-3 transition-colors hover:border-neutral-700"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-neutral-300">
                          {lIdx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-neutral-200">
                              {lesson.title}
                            </span>
                            {lesson.duration && (
                              <span className="text-[11px] text-neutral-400">
                                ({lesson.duration} min)
                              </span>
                            )}
                          </div>
                          {lesson.description && (
                            <p className="text-xs text-neutral-400 mt-0.5">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          type="button"
                          onClick={() => openEditModal(module.id, lesson)}
                          className="rounded-md border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(lesson.id, lesson.title)}
                          className="rounded-md border border-red-900/60 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-300 hover:bg-red-900/60 hover:text-red-100 transition-colors"
                        >
                          Excluir
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="py-4 text-center text-xs text-neutral-500">
                  Nenhum vídeo cadastrado neste módulo.
                </div>
              )}
            </div>
          </details>
        ))
      ) : (
        <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center text-xs text-neutral-400">
          Nenhum módulo cadastrado para este curso.
        </div>
      )}

      {/* Modal de Criação / Edição de Vídeo */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-neutral-100">
                {isEditing ? "Editar Vídeo / Aula" : "Adicionar Vídeo ao Módulo"}
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
                  Título do Vídeo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Introdução Prática"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                    Duração (minutos) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                    URL do Vídeo (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                  Descrição
                </label>
                <textarea
                  rows={3}
                  placeholder="Conteúdo abordado..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                />
              </div>

              {/* Upload de Imagem com Media Query e Filtro de Arquivo */}
              <div>
                <ImageUpload
                  label="Capa do Vídeo (Thumbnail)"
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
                  {submitting ? "Processando com Axios..." : isEditing ? "Salvar" : "Adicionar Vídeo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
export default CourseContentManager;
