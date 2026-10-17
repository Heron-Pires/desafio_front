"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/common/Navbar";
import { coursesService } from "@/features/courses/services/courses.service";
import { lessonsService } from "@/features/courses/services/lessons.service";
import { CourseDetail, Lesson, CourseSummary } from "@/features/courses/types/course";
import ImageUpload from "@/components/ui/ImageUpload";

interface VideoItemWithMeta extends Lesson {
  courseId: string;
  courseTitle: string;
  moduleId: string;
  moduleTitle: string;
}

export default function VideosManagementPage() {
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [fullCourses, setFullCourses] = useState<CourseDetail[]>([]);
  const [videos, setVideos] = useState<VideoItemWithMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filtros
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Estado do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | number | null>(null);

  // Campos do formulário de vídeo
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    moduleId: "",
    duration: 15,
    description: "",
    videoUrl: "",
    thumbnail: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // Carrega cursos e todas as aulas/vídeos via Axios
  const loadData = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const coursesSummary = await coursesService.getAll();
      setCourses(coursesSummary);

      const detailsList: CourseDetail[] = [];
      const allVideos: VideoItemWithMeta[] = [];

      for (const summary of coursesSummary) {
        try {
          const detail = await coursesService.getById(summary.id);
          detailsList.push(detail);

          if (detail.modules) {
            for (const mod of detail.modules) {
              if (mod.lessons) {
                for (const lesson of mod.lessons) {
                  allVideos.push({
                    ...lesson,
                    courseId: String(detail.id),
                    courseTitle: detail.title,
                    moduleId: String(mod.id),
                    moduleTitle: mod.title,
                  });
                }
              }
            }
          }
        } catch (detailErr) {
          console.warn(`Erro ao carregar detalhes do curso ${summary.id}:`, detailErr);
        }
      }

      setFullCourses(detailsList);
      setVideos(allVideos);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("Não foi possível carregar a lista de vídeos.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentVideoId(null);

    const defaultCourse = fullCourses[0];
    const defaultModule = defaultCourse?.modules[0];

    setFormData({
      title: "",
      courseId: defaultCourse ? String(defaultCourse.id) : "",
      moduleId: defaultModule ? String(defaultModule.id) : "",
      duration: 15,
      description: "",
      videoUrl: "",
      thumbnail: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (video: VideoItemWithMeta) => {
    setIsEditing(true);
    setCurrentVideoId(video.id);

    setFormData({
      title: video.title || "",
      courseId: String(video.courseId),
      moduleId: String(video.moduleId),
      duration: Number(video.duration) || 15,
      description: video.description || "",
      videoUrl: video.videoUrl || "",
      thumbnail: "",
    });
    setModalOpen(true);
  };

  // Submissão do formulário: Criar ou Editar Vídeo usando Axios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFeedback({ type: "error", text: "O título do vídeo é obrigatório." });
      return;
    }
    if (!formData.moduleId) {
      setFeedback({ type: "error", text: "Selecione um módulo para o vídeo." });
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      if (isEditing && currentVideoId !== null) {
        // Atualizar Vídeo via Axios (PUT /lessons/:id)
        await lessonsService.update(currentVideoId, {
          title: formData.title.trim(),
          description: formData.description,
          duration: Number(formData.duration),
          moduleId: Number(formData.moduleId),
          videoUrl: formData.videoUrl,
        });
        setFeedback({ type: "success", text: "Vídeo atualizado com sucesso via Axios!" });
      } else {
        // Criar Vídeo via Axios (POST /lessons)
        await lessonsService.create({
          moduleId: Number(formData.moduleId),
          title: formData.title.trim(),
          description: formData.description,
          duration: Number(formData.duration),
          videoUrl: formData.videoUrl,
          position: videos.length + 1,
        });
        setFeedback({ type: "success", text: "Novo vídeo criado com sucesso via Axios!" });
      }

      setModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar vídeo.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  // Excluir Vídeo usando Axios (DELETE /lessons/:id)
  const handleDeleteVideo = async (id: string | number, title: string) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir o vídeo "${title}"?`);
    if (!confirmed) return;

    try {
      await lessonsService.delete(id);
      setFeedback({ type: "success", text: `Vídeo "${title}" excluído com sucesso via Axios.` });
      // Atualização imediata do estado local
      setVideos((prev) => prev.filter((v) => String(v.id) !== String(id)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir o vídeo.";
      setFeedback({ type: "error", text: msg });
    }
  };

  // Cursos e Módulos disponíveis para o formulário
  const availableModules = fullCourses.find(
    (c) => String(c.id) === String(formData.courseId)
  )?.modules || [];

  // Filtro de vídeos
  const filteredVideos = videos.filter((video) => {
    const matchesCourse =
      selectedCourseFilter === "all" || String(video.courseId) === selectedCourseFilter;
    const matchesSearch =
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (video.description && video.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCourse && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 w-full flex-1">
        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-800/80 pb-6">
          <div>
            <span className="rounded-md bg-neutral-800 px-2.5 py-1 text-xs font-medium text-neutral-300">
              Painel de Gestão de Conteúdo
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-neutral-100 sm:text-4xl">
              Gerenciamento de Vídeos
            </h1>
            <p className="mt-1 text-sm text-neutral-400">
              Crie, edite e remova aulas e vídeos da Plataforma Comando utilizando integração via Axios.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-100 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition-all hover:bg-neutral-200 active:scale-95 shadow-md"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Criar Novo Vídeo
          </button>
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div
            className={`mt-6 rounded-xl border p-4 text-xs font-medium flex items-center justify-between ${
              feedback.type === "success"
                ? "border-emerald-900/60 bg-emerald-950/40 text-emerald-300"
                : "border-red-900/60 bg-red-950/40 text-red-300"
            }`}
          >
            <span>{feedback.text}</span>
            <button
              onClick={() => setFeedback(null)}
              className="text-neutral-400 hover:text-neutral-200"
            >
              &times;
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/40 p-4 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Barra de Filtros e Busca */}
        <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900/50 p-4">
          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Buscar por título ou descrição..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 transition-colors focus:border-neutral-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-neutral-400 whitespace-nowrap">Filtrar por Curso:</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full md:w-auto rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 focus:border-neutral-500 focus:outline-none"
            >
              <option value="all">Todos os Cursos</option>
              {courses.map((course) => (
                <option key={course.id} value={String(course.id)}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Listagem de Vídeos */}
        <section className="mt-8">
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-neutral-100 border-r-transparent align-[-0.125em]" />
              <p className="mt-4 text-xs text-neutral-400">Carregando catálogo de vídeos...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center bg-neutral-900/30">
              <svg className="mx-auto h-12 w-12 text-neutral-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <h3 className="text-sm font-semibold text-neutral-200">Nenhum vídeo encontrado</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Comece criando uma nova aula/vídeo para disponibilizar na plataforma.
              </p>
              <button
                type="button"
                onClick={openCreateModal}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
              >
                + Adicionar primeiro vídeo
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <div
                  key={`${video.courseId}-${video.moduleId}-${video.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition-all hover:border-neutral-700 hover:bg-neutral-900/80 shadow-md"
                >
                  <div>
                    {/* Header do Card */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-neutral-300 uppercase">
                        {video.courseTitle}
                      </span>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        {video.duration || 10} min
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-neutral-100 group-hover:text-white transition-colors">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-400">
                      Módulo: <span className="text-neutral-300">{video.moduleTitle}</span>
                    </p>

                    {video.description && (
                      <p className="mt-2 text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  {/* Ações: Editar e Excluir */}
                  <div className="mt-6 flex items-center justify-end gap-2 border-t border-neutral-800/80 pt-4">
                    <button
                      type="button"
                      onClick={() => openEditModal(video)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-medium text-neutral-200 transition-colors hover:bg-neutral-700 hover:text-neutral-100"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteVideo(video.id, video.title)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-900/60 bg-red-950/30 px-3 py-1.5 text-xs font-medium text-red-300 transition-colors hover:bg-red-900/50 hover:text-red-100"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Modal para Criar ou Editar Vídeo */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <h2 className="text-lg font-bold text-neutral-100">
                  {isEditing ? "Editar Vídeo / Aula" : "Criar Novo Vídeo"}
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
                {/* Título */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                    Título do Vídeo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Introdução ao Next.js e Arquitetura"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                {/* Seleção de Curso e Módulo */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                      Curso *
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => {
                        const newCourseId = e.target.value;
                        const firstMod = fullCourses.find((c) => String(c.id) === newCourseId)?.modules[0];
                        setFormData({
                          ...formData,
                          courseId: newCourseId,
                          moduleId: firstMod ? String(firstMod.id) : "",
                        });
                      }}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 focus:border-neutral-500 focus:outline-none"
                    >
                      {fullCourses.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                      Módulo Associado *
                    </label>
                    <select
                      value={formData.moduleId}
                      onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 focus:border-neutral-500 focus:outline-none"
                    >
                      {availableModules.map((m) => (
                        <option key={m.id} value={String(m.id)}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Duração e URL */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                      Duração (minutos) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                      URL do Vídeo (Embed / Stream)
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1">
                    Descrição do Conteúdo
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Explicação sobre os conceitos apresentados nesta aula..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 focus:outline-none"
                  />
                </div>

                {/* Componente de Upload de Imagens com Media Query e Filtro de Arquivo */}
                <div>
                  <ImageUpload
                    label="Miniatura do Vídeo (Thumbnail)"
                    value={formData.thumbnail}
                    onChange={(val) => setFormData({ ...formData, thumbnail: val })}
                  />
                </div>

                {/* Botões do Modal */}
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
                    {submitting ? "Processando com Axios..." : isEditing ? "Salvar Alterações" : "Criar Vídeo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
