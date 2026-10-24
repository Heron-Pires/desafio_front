"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import ImageUpload from "@/components/ui/ImageUpload";
import { lessonsService } from "@/features/courses/services/lessons.service";
import { coursesService } from "@/features/courses/services/courses.service";
import { authService } from "@/services/auth.service";
import { Course, Module } from "@/features/courses/types/course";

interface VideoItemDisplay {
  id: string | number;
  title: string;
  duration?: number;
  videoUrl?: string;
  thumbnail?: string;
  description?: string;
  moduleId: string | number;
  moduleTitle: string;
  courseId: string | number;
  courseTitle: string;
}

export default function VideosManagementPage() {
  const [videos, setVideos] = useState<VideoItemDisplay[]>([]);
  const [courses, setCourses] = useState<{ id: string | number; title: string }[]>([]);
  const [fullCourses, setFullCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Filtros
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal de Criação / Edição
  const [modalOpen, setModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Permissões
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAdmin(authService.isAuthenticated());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    duration: 10,
    videoUrl: "",
    thumbnail: "",
    description: "",
    courseId: "",
    moduleId: "",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const coursesList = await coursesService.getAll();
      setCourses(coursesList.map((c) => ({ id: c.id, title: c.title })));

      const detailedCourses: Course[] = [];
      const extractedVideos: VideoItemDisplay[] = [];

      for (const c of coursesList) {
        try {
          const detail = await coursesService.getById(c.id);
          detailedCourses.push(detail);

          detail.modules?.forEach((m) => {
            m.lessons?.forEach((l) => {
              extractedVideos.push({
                id: l.id,
                title: l.title,
                duration: l.duration,
                videoUrl: l.videoUrl || undefined,
                thumbnail: l.thumbnail || undefined,
                description: l.description || undefined,
                moduleId: m.id,
                moduleTitle: m.title,
                courseId: detail.id,
                courseTitle: detail.title,
              });
            });
          });
        } catch {
          // Fallback gracioso caso algum curso falhe individualmente
        }
      }

      setFullCourses(detailedCourses);
      setVideos(extractedVideos);

      if (detailedCourses.length > 0 && detailedCourses[0].modules?.length) {
        setFormData((prev) => ({
          ...prev,
          courseId: String(detailedCourses[0].id),
          moduleId: String(detailedCourses[0].modules[0].id),
        }));
      }
    } catch {
      setErrorMessage("Erro ao carregar vídeos da plataforma. Verifique a conexão com o servidor.");
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
    const initialCourse = fullCourses[0];
    const initialModule = initialCourse?.modules?.[0];

    setFormData({
      title: "",
      duration: 10,
      videoUrl: "",
      thumbnail: "",
      description: "",
      courseId: initialCourse ? String(initialCourse.id) : "",
      moduleId: initialModule ? String(initialModule.id) : "",
    });
    setModalOpen(true);
  };

  const openEditModal = (video: VideoItemDisplay) => {
    setIsEditing(true);
    setCurrentVideoId(video.id);
    setFormData({
      title: video.title,
      duration: video.duration || 10,
      videoUrl: video.videoUrl || "",
      thumbnail: video.thumbnail || "",
      description: video.description || "",
      courseId: String(video.courseId),
      moduleId: String(video.moduleId),
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.moduleId) {
      setFeedback({ type: "error", text: "Preencha o título e selecione o módulo correspondente." });
      return;
    }

    try {
      setSubmitting(true);

      if (isEditing && currentVideoId) {
        await lessonsService.update(currentVideoId, {
          title: formData.title,
          duration: Number(formData.duration),
          videoUrl: formData.videoUrl || undefined,
          description: formData.description || undefined,
        });

        setFeedback({ type: "success", text: "Vídeo atualizado com sucesso!" });
      } else {
        const existingInModule = videos.filter((v) => String(v.moduleId) === String(formData.moduleId));
        const nextPosition = existingInModule.length + 1;

        await lessonsService.create({
          moduleId: Number(formData.moduleId),
          title: formData.title,
          duration: Number(formData.duration),
          videoUrl: formData.videoUrl || undefined,
          description: formData.description || undefined,
          position: nextPosition,
          order: nextPosition,
        });

        setFeedback({ type: "success", text: "Novo vídeo cadastrado com sucesso!" });
      }

      setModalOpen(false);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao persistir o vídeo.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id: string | number, title: string) => {
    const confirmed = window.confirm(`Tem certeza que deseja excluir o vídeo "${title}"?`);
    if (!confirmed) return;

    try {
      await lessonsService.delete(id);
      setFeedback({ type: "success", text: `Vídeo "${title}" excluído com sucesso.` });
      setVideos((prev) => prev.filter((v) => String(v.id) !== String(id)));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir o vídeo.";
      setFeedback({ type: "error", text: msg });
    }
  };

  const availableModules: Module[] =
    fullCourses.find((c) => String(c.id) === String(formData.courseId))?.modules || [];

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
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8 w-full flex-1">
        {/* Breadcrumb */}
        <nav className="mb-4 text-xs text-neutral-400 font-mono">
          <Link href="/" className="hover:text-neutral-200">Home</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-neutral-300">Gerenciamento de Vídeos</span>
        </nav>

        {/* Cabeçalho da Página */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-900 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-xs font-mono text-neutral-300 mb-2">
              Painel de Gestão &bull; Aulas &amp; Vídeos
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-100 font-mono">
              Gerenciamento de Vídeos
            </h1>
            <p className="mt-1 text-xs text-neutral-400">
              Crie, edite e organize aulas nos módulos dos cursos com persistência direta no banco.
            </p>
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/30 transition-all"
            >
              <span className="font-bold">+</span>
              <span>Criar Novo Vídeo</span>
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-semibold text-neutral-300 hover:text-white hover:border-violet-500 transition-all"
            >
              Faça login para editar
            </Link>
          )}
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div
            className={`mt-6 rounded-xl border p-3.5 text-xs font-medium flex items-center justify-between ${
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

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-900/60 bg-red-950/40 p-3.5 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Barra de Filtros e Busca */}
        <div className="mt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Buscar por título ou módulo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-neutral-800 bg-neutral-900/80 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-violet-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <span className="text-xs text-neutral-400 whitespace-nowrap font-mono">Curso:</span>
            <select
              value={selectedCourseFilter}
              onChange={(e) => setSelectedCourseFilter(e.target.value)}
              className="w-full md:w-auto rounded-lg border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-neutral-200 focus:border-violet-500 focus:outline-none"
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
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-violet-500 border-r-transparent" />
              <p className="mt-3 text-xs text-neutral-400">Carregando catálogo de vídeos...</p>
            </div>
          ) : filteredVideos.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-800 p-12 text-center bg-neutral-900/20">
              <h3 className="text-xs font-semibold text-neutral-200">Nenhum vídeo encontrado</h3>
              <p className="mt-1 text-xs text-neutral-500">
                Comece criando uma nova aula/vídeo para disponibilizar na plataforma.
              </p>
              {isAdmin && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm"
                >
                  + Adicionar primeiro vídeo
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredVideos.map((video) => (
                <div
                  key={`${video.courseId}-${video.moduleId}-${video.id}`}
                  className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-5 transition-all hover:border-violet-500/50 hover:bg-neutral-900/60 shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="rounded bg-neutral-950 border border-neutral-800 px-2 py-0.5 text-[10px] font-mono text-neutral-300">
                        {video.courseTitle}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-400">
                        {video.duration || 10} min
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-100 group-hover:text-violet-300 transition-colors font-sans">
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

                  {isAdmin && (
                    <div className="mt-5 flex items-center justify-end gap-2 border-t border-neutral-800/60 pt-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(video)}
                        className="rounded border border-neutral-700 bg-neutral-800 px-2.5 py-1 text-xs text-neutral-300 hover:border-violet-500 hover:text-white transition-colors"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteVideo(video.id, video.title)}
                        className="rounded border border-red-900/60 bg-red-950/30 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900/60 transition-colors"
                      >
                        Excluir
                      </button>
                    </div>
                  )}
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
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-100 font-mono">
                  {isEditing ? "Editar Vídeo / Aula" : "Criar Novo Vídeo"}
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
                    Título do Vídeo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Introdução à Alocação de Memória"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                      Curso *
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => {
                        const newCourseId = e.target.value;
                        const firstMod = fullCourses.find((c) => String(c.id) === newCourseId)?.modules?.[0];
                        setFormData({
                          ...formData,
                          courseId: newCourseId,
                          moduleId: firstMod ? String(firstMod.id) : "",
                        });
                      }}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                    >
                      {fullCourses.map((c) => (
                        <option key={c.id} value={String(c.id)}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                      Módulo Associado *
                    </label>
                    <select
                      value={formData.moduleId}
                      onChange={(e) => setFormData({ ...formData, moduleId: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                    >
                      {availableModules.map((m: Module) => (
                        <option key={m.id} value={String(m.id)}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                      Duração (minutos) *
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                      URL do Vídeo
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 placeholder-neutral-600 focus:border-violet-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                    Descrição
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Explicação sobre os conceitos apresentados nesta aula..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs text-neutral-100 placeholder-neutral-600 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <ImageUpload
                    label="Miniatura do Vídeo (Thumbnail)"
                    value={formData.thumbnail}
                    onChange={(val) => setFormData({ ...formData, thumbnail: val })}
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
                    {submitting ? "Processando..." : isEditing ? "Salvar Alterações" : "Criar Vídeo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto border-t border-neutral-900 bg-neutral-950 py-6 px-6 text-center text-xs text-neutral-400">
        &copy; 2026 [Comando.C] | Aprenda tecnologia com foco em alta performance
      </footer>
    </div>
  );
}
