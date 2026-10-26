"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CourseDetail, Lesson, Module } from "../types/course";
import { coursesService } from "../services/courses.service";
import { modulesService } from "../services/modules.service";
import { lessonsService } from "../services/lessons.service";
import { authService } from "@/services/auth.service";
import ImageUpload from "@/components/ui/ImageUpload";

interface CourseDetailClientProps {
  course: CourseDetail;
  initialLessonId?: string;
}

export function CourseDetailClient({
  course: initialCourse,
  initialLessonId,
}: CourseDetailClientProps) {
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail>(initialCourse);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAdmin(authService.isAuthenticated());
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Encontra todas as aulas para a navegação linear
  const allLessons = useMemo(() => {
    const list: { lesson: Lesson; module: Module; mIndex: number }[] = [];
    (course.modules || []).forEach((mod, mIdx) => {
      (mod.lessons || []).forEach((les) => {
        list.push({ lesson: les, module: mod, mIndex: mIdx + 1 });
      });
    });
    return list;
  }, [course]);

  // Modo: 'overview' (Tela 3) ou 'player' (Tela 4)
  const [viewMode, setViewMode] = useState<"overview" | "player">(
    initialLessonId ? "player" : "overview"
  );

  const [selectedLessonId, setSelectedLessonId] = useState<string | number>(
    initialLessonId || allLessons[0]?.lesson.id || "l1"
  );

  // Módulos abertos/colapsados
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    m1: true,
    m2: false,
    m3: false,
    m4: false,
  });

  // Estado do Player
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>({});
  const [activeTab, setActiveTab] = useState<"overview" | "code" | "resources" | "notes">("overview");
  const [studentNotes, setStudentNotes] = useState("");
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ==========================================
  // ESTADOS DE MODAL (CRUD ADMIN)
  // ==========================================
  // Modal de Curso
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseCategory, setCourseCategory] = useState("");
  const [courseLevel, setCourseLevel] = useState("Médio");
  const [courseDesc, setCourseDesc] = useState("");
  const [courseThumb, setCourseThumb] = useState("");
  const [courseThumbFile, setCourseThumbFile] = useState<File | null>(null);
  const [failedPreviewSrc, setFailedPreviewSrc] = useState<string | null>(null);

  // Modal de Módulo (Criação / Edição)
  const [moduleModalOpen, setModuleModalOpen] = useState(false);
  const [isEditingModule, setIsEditingModule] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState<string | number | null>(null);
  const [moduleTitle, setModuleTitle] = useState("");
  // Primeiro vídeo obrigatório na criação de módulo ("cada módulo tem 1 ou mais vídeos")
  const [firstVideoTitle, setFirstVideoTitle] = useState("");
  const [firstVideoDuration, setFirstVideoDuration] = useState(15);
  const [firstVideoDesc, setFirstVideoDesc] = useState("");

  // Modal de Vídeo / Aula
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [isEditingLesson, setIsEditingLesson] = useState(false);
  const [targetLessonModuleId, setTargetLessonModuleId] = useState<string | number | null>(null);
  const [targetLessonId, setTargetLessonId] = useState<string | number | null>(null);
  const [lessonTitle, setLessonTitle] = useState("");
  const [lessonDuration, setLessonDuration] = useState(15);
  const [lessonDesc, setLessonDesc] = useState("");
  const [lessonVideoUrl, setLessonVideoUrl] = useState("");
  const [lessonSnippet, setLessonSnippet] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Aula selecionada atualmente
  const currentItem = useMemo(() => {
    return (
      allLessons.find((item) => String(item.lesson.id) === String(selectedLessonId)) ??
      allLessons[0]
    );
  }, [allLessons, selectedLessonId]);

  const toggleModule = (modId: string | number) => {
    setOpenModules((prev) => ({
      ...prev,
      [String(modId)]: !prev[String(modId)],
    }));
  };

  const handleSelectLesson = (lessonId: string | number) => {
    setSelectedLessonId(lessonId);
    setViewMode("player");
    setIsPlaying(false);
  };

  const handleNextLesson = () => {
    const currentIndex = allLessons.findIndex(
      (item) => String(item.lesson.id) === String(selectedLessonId)
    );
    if (currentIndex >= 0 && currentIndex < allLessons.length - 1) {
      setSelectedLessonId(allLessons[currentIndex + 1].lesson.id);
      setIsPlaying(false);
    }
  };

  const toggleCompleted = () => {
    if (!currentItem) return;
    const lId = String(currentItem.lesson.id);
    setCompletedLessons((prev) => ({
      ...prev,
      [lId]: !prev[lId],
    }));
  };

  const isCurrentCompleted = currentItem ? !!completedLessons[String(currentItem.lesson.id)] : false;

  const handleCopyCode = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ==========================================
  // HANDLERS DE CRUD DE CURSO
  // ==========================================
  const openEditCourseModal = () => {
    setCourseTitle(course.title);
    setCourseCategory(course.category || "");
    setCourseLevel(course.level || "Médio");
    setCourseDesc(course.description || "");
    setCourseThumb(course.thumbnail || "");
    setCourseThumbFile(null);
    setCourseModalOpen(true);
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseTitle.trim()) return;
    setSubmitting(true);
    setFeedback(null);
    try {
      const chosenThumbnail = courseThumbFile || (courseThumb.trim() ? courseThumb.trim() : null);
      const updated = await coursesService.update(course.id, {
        title: courseTitle.trim(),
        category: courseCategory.trim(),
        description: courseDesc.trim(),
        thumbnail: chosenThumbnail,
        fallbackThumbnail: courseThumb.trim() || undefined,
        level: courseLevel,
      });
      setCourse((prev) => ({
        ...prev,
        title: updated.title,
        category: updated.category,
        description: courseDesc.trim(),
        shortDescription: courseDesc.trim(),
        thumbnail: updated.thumbnail ?? "",
        level: courseLevel,
      }));
      setCourseModalOpen(false);
      setFeedback({ type: "success", text: "Curso atualizado com sucesso!" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao atualizar curso.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async () => {
    const ok = window.confirm(`Deseja realmente remover o curso "${course.title}"?`);
    if (!ok) return;
    try {
      await coursesService.delete(course.id);
      router.push("/courses");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir curso.";
      setFeedback({ type: "error", text: msg });
    }
  };

  // ==========================================
  // HANDLERS DE CRUD DE MÓDULO
  // ==========================================
  const openAddModuleModal = () => {
    setIsEditingModule(false);
    setTargetModuleId(null);
    setModuleTitle("");
    setFirstVideoTitle("");
    setFirstVideoDuration(15);
    setFirstVideoDesc("");
    setModuleModalOpen(true);
  };

  const openEditModuleModal = (mod: Module, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditingModule(true);
    setTargetModuleId(mod.id);
    setModuleTitle(mod.title);
    setModuleModalOpen(true);
  };

  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) return;
    setSubmitting(true);
    setFeedback(null);

    try {
      if (isEditingModule && targetModuleId) {
        await modulesService.update(targetModuleId, {
          title: moduleTitle.trim(),
        });

        setCourse((prev) => ({
          ...prev,
          modules: prev.modules.map((m) =>
            String(m.id) === String(targetModuleId)
              ? { ...m, title: moduleTitle.trim() }
              : m
          ),
        }));
        setFeedback({ type: "success", text: "Módulo atualizado com sucesso!" });
      } else {
        const createdModule = await modulesService.create({
          courseId: Number(course.id),
          title: moduleTitle.trim(),
          order: course.modules.length + 1,
        });

        let initialLessons: Lesson[] = [];

        if (firstVideoTitle.trim()) {
          const createdFirstLesson = await lessonsService.create({
            moduleId: Number(createdModule.id),
            title: firstVideoTitle.trim(),
            duration: Number(firstVideoDuration) || 15,
            description: firstVideoDesc.trim(),
            position: 1,
          });
          initialLessons = [
            {
              ...createdFirstLesson,
              durationFormatted: `${firstVideoDuration}:00`,
            },
          ];
        }

        const newModuleObj: Module = {
          ...createdModule,
          lessons: initialLessons,
        };

        setCourse((prev) => ({
          ...prev,
          modules: [...prev.modules, newModuleObj],
        }));

        setOpenModules((prev) => ({
          ...prev,
          [String(createdModule.id)]: true,
        }));

        setFeedback({
          type: "success",
          text: "Módulo e vídeo cadastrados com sucesso!",
        });
      }
      setModuleModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao processar módulo.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteModule = async (moduleId: string | number, modTitle: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const ok = window.confirm(`Deseja remover o módulo "${modTitle}" e todos os seus vídeos?`);
    if (!ok) return;

    try {
      await modulesService.delete(moduleId);
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.filter((m) => String(m.id) !== String(moduleId)),
      }));
      setFeedback({ type: "success", text: `Módulo "${modTitle}" excluído com sucesso.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao excluir módulo.";
      setFeedback({ type: "error", text: msg });
    }
  };

  // ==========================================
  // HANDLERS DE CRUD DE VÍDEO / AULA
  // ==========================================
  const openAddLessonModal = (moduleId: string | number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditingLesson(false);
    setTargetLessonModuleId(moduleId);
    setTargetLessonId(null);
    setLessonTitle("");
    setLessonDuration(15);
    setLessonDesc("");
    setLessonVideoUrl("");
    setLessonSnippet("");
    setLessonModalOpen(true);
  };

  const openEditLessonModal = (moduleId: string | number, lesson: Lesson, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditingLesson(true);
    setTargetLessonModuleId(moduleId);
    setTargetLessonId(lesson.id);
    setLessonTitle(lesson.title);
    setLessonDuration(lesson.duration || 15);
    setLessonDesc(lesson.description || "");
    setLessonVideoUrl(lesson.videoUrl || "");
    setLessonSnippet(lesson.codeSnippet || "");
    setLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim() || !targetLessonModuleId) return;

    setSubmitting(true);
    setFeedback(null);

    try {
      if (isEditingLesson && targetLessonId) {
        const updated = await lessonsService.update(targetLessonId, {
          moduleId: Number(targetLessonModuleId),
          title: lessonTitle.trim(),
          duration: Number(lessonDuration),
          description: lessonDesc.trim(),
          videoUrl: lessonVideoUrl.trim(),
        });

        setCourse((prev) => ({
          ...prev,
          modules: prev.modules.map((mod) => {
            if (String(mod.id) === String(targetLessonModuleId)) {
              return {
                ...mod,
                lessons: mod.lessons.map((l) =>
                  String(l.id) === String(targetLessonId)
                    ? {
                        ...l,
                        ...updated,
                        title: lessonTitle.trim(),
                        duration: Number(lessonDuration),
                        durationFormatted: `${lessonDuration}:00`,
                        description: lessonDesc.trim(),
                        codeSnippet: lessonSnippet || l.codeSnippet,
                      }
                    : l
                ),
              };
            }
            return mod;
          }),
        }));
        setFeedback({ type: "success", text: "Vídeo atualizado com sucesso!" });
      } else {
        const created = await lessonsService.create({
          moduleId: Number(targetLessonModuleId),
          title: lessonTitle.trim(),
          duration: Number(lessonDuration),
          description: lessonDesc.trim(),
          videoUrl: lessonVideoUrl.trim(),
          position: 1,
        });

        const newLessonObj: Lesson = {
          ...created,
          title: lessonTitle.trim(),
          duration: Number(lessonDuration),
          durationFormatted: `${lessonDuration}:00`,
          description: lessonDesc.trim(),
          codeSnippet: lessonSnippet,
        };

        setCourse((prev) => ({
          ...prev,
          modules: prev.modules.map((mod) => {
            if (String(mod.id) === String(targetLessonModuleId)) {
              return {
                ...mod,
                lessons: [...mod.lessons, newLessonObj],
              };
            }
            return mod;
          }),
        }));
        setFeedback({ type: "success", text: "Novo vídeo adicionado ao módulo!" });
      }
      setLessonModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar vídeo.";
      setFeedback({ type: "error", text: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteLesson = async (
    moduleId: string | number,
    lessonId: string | number,
    lesTitle: string,
    e?: React.MouseEvent
  ) => {
    if (e) e.stopPropagation();
    const ok = window.confirm(`Deseja remover o vídeo "${lesTitle}"?`);
    if (!ok) return;

    try {
      await lessonsService.delete(lessonId);
      setCourse((prev) => ({
        ...prev,
        modules: prev.modules.map((mod) => {
          if (String(mod.id) === String(moduleId)) {
            return {
              ...mod,
              lessons: mod.lessons.filter((l) => String(l.id) !== String(lessonId)),
            };
          }
          return mod;
        }),
      }));
      setFeedback({ type: "success", text: `Vídeo "${lesTitle}" excluído com sucesso.` });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erro ao deletar vídeo.";
      setFeedback({ type: "error", text: msg });
    }
  };

  /* =========================================================================
     TELA 4: PLAYER INTERATIVO DE AULA
     ========================================================================= */
  if (viewMode === "player" && currentItem) {
    const { lesson, mIndex } = currentItem;

    return (
      <div className="w-full">
        {feedback && (
          <div
            className={`mb-4 rounded-xl border p-3.5 text-xs font-medium flex items-center justify-between ${
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Esquerda: Navegação de Módulos e Aulas */}
          <aside className="lg:col-span-3 rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-4 h-fit">
            <div className="mb-4 pb-3 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-neutral-100 font-sans">
                  {course.title}
                </h2>
                <span className="text-[11px] font-mono text-neutral-400">Conteúdo</span>
              </div>
              <button
                type="button"
                onClick={() => setViewMode("overview")}
                className="text-xs font-mono text-violet-400 hover:text-violet-300"
                title="Voltar para Detalhes do Curso"
              >
                &larr; Visão Geral
              </button>
            </div>

            {/* Lista Accordion de Módulos */}
            <div className="space-y-3">
              {course.modules.map((mod, modIdx) => {
                const isOpen = openModules[String(mod.id)] ?? modIdx === 0;
                return (
                  <div
                    key={mod.id || modIdx}
                    className="rounded-lg border border-neutral-800/80 bg-neutral-950/60 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => toggleModule(mod.id)}
                      className="w-full flex items-center justify-between p-3 text-left hover:bg-neutral-800/40 transition-colors"
                    >
                      <span className="text-xs font-bold text-neutral-200 line-clamp-1">
                        {isOpen ? "▼ " : "▶ "}
                        {mod.title}
                      </span>
                    </button>

                    {isOpen && (
                      <div className="p-2 pt-0 space-y-1 border-t border-neutral-900">
                        {mod.lessons.map((les) => {
                          const isSelected = String(les.id) === String(selectedLessonId);
                          const isDone = !!completedLessons[String(les.id)];
                          return (
                            <button
                              key={les.id}
                              type="button"
                              onClick={() => handleSelectLesson(les.id)}
                              className={`w-full text-left px-2.5 py-2 rounded-md text-xs transition-all flex items-center justify-between ${
                                isSelected
                                  ? "border border-violet-500 bg-violet-950/40 text-violet-200 font-semibold shadow-sm"
                                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900/60"
                              }`}
                            >
                              <span className="line-clamp-1">
                                {isDone ? "✓ " : ""}{les.title}
                              </span>
                              {les.durationFormatted && (
                                <span className="text-[10px] text-neutral-400 shrink-0 ml-1">
                                  {les.durationFormatted}
                                </span>
                              )}
                            </button>
                          );
                        })}

                        {/* Ação de Admin: Adicionar Vídeo ao Módulo */}
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={(e) => openAddLessonModal(mod.id, e)}
                            className="w-full mt-1.5 py-1.5 text-center text-[11px] font-mono text-violet-400 hover:text-violet-300 hover:bg-violet-950/20 rounded border border-dashed border-violet-800/50"
                          >
                            + Adicionar Vídeo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Ação de Admin: Adicionar Módulo */}
              {isAdmin && (
                <button
                  type="button"
                  onClick={openAddModuleModal}
                  className="w-full py-2 text-center text-xs font-semibold text-violet-300 bg-violet-950/40 hover:bg-violet-950/70 border border-violet-800/60 rounded-lg transition-all"
                >
                  + Adicionar Módulo
                </button>
              )}
            </div>
          </aside>

          {/* Área Principal: Vídeo, Controles e Abas */}
          <main className="lg:col-span-9 flex flex-col space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                <nav className="text-xs text-neutral-400 font-mono">
                  <Link href="/" className="hover:text-neutral-200">Home</Link>
                  <span className="mx-1.5">&gt;</span>
                  <Link href="/courses" className="hover:text-neutral-200">Cursos</Link>
                  <span className="mx-1.5">&gt;</span>
                  <span className="hover:text-neutral-200 cursor-pointer" onClick={() => setViewMode("overview")}>
                    {course.title}
                  </span>
                  <span className="mx-1.5">&gt;</span>
                  <span className="text-neutral-400">Módulo {mIndex}</span>
                  <span className="mx-1.5">&gt;</span>
                  <span className="text-neutral-200">Aula</span>
                </nav>

                {/* Ações de Admin no Vídeo Ativo */}
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditLessonModal(lesson.moduleId || currentItem?.module?.id || "1", lesson)}
                      className="rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-[11px] font-medium text-neutral-300 hover:border-violet-500 hover:text-white"
                    >
                      Editar Vídeo
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteLesson(lesson.moduleId || currentItem?.module?.id || "1", lesson.id, lesson.title)}
                      className="rounded border border-red-900/60 bg-red-950/30 px-2 py-1 text-[11px] font-medium text-red-300 hover:bg-red-900/60"
                    >
                      Excluir Vídeo
                    </button>
                  </div>
                )}
              </div>

              <h1 className="text-xl sm:text-2xl font-bold text-neutral-100 font-sans">
                {lesson.title}
              </h1>

              <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                <span>Instrutor: {lesson.instructor || "Henrique Silva"}</span>
                <span>&bull;</span>
                <span>Duração: {lesson.durationFormatted || `${lesson.duration || 15}:30`}</span>
                <span>&bull;</span>
                <span>Nível: {lesson.level || course.level || "Médio"}</span>
              </div>
            </div>

            {/* Container do Player de Vídeo */}
            <div className="relative aspect-video w-full rounded-xl border border-neutral-800 bg-[#0d0d11] overflow-hidden flex flex-col justify-between shadow-2xl">
              <div className="p-5 font-mono text-xs sm:text-sm text-neutral-300 leading-relaxed overflow-x-auto flex-1 select-none">
                <div className="flex items-center gap-2 mb-3 text-neutral-400 text-xs">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
                  <span className="ml-2 text-neutral-400">main.c &mdash; GCC Terminal</span>
                </div>

                <pre className="text-emerald-400">
                  {lesson.codeSnippet || `#include <stdio.h>

int main(int argc, char *argv[]) {
    printf("Bem-vindo ao curso de C!\\n");
    return 0;
}`}
                </pre>

                <div className="mt-4 pt-3 border-t border-neutral-800 text-neutral-400 text-xs">
                  <p className="text-neutral-400"># Compilação e Execução direta no terminal:</p>
                  <p className="text-neutral-300">$ gcc -Wall main.c -o c_prog &amp;&amp; ./c_prog</p>
                  <p className="text-violet-400 font-bold">Bem-vindo ao curso de C!</p>
                </div>
              </div>

              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="pointer-events-auto h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-violet-600 hover:bg-violet-500 active:scale-95 text-white flex items-center justify-center shadow-xl shadow-violet-600/50 transition-all"
                  aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                >
                  {isPlaying ? (
                    <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                  ) : (
                    <svg className="h-8 w-8 ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
              </div>

              <div className="bg-neutral-950/90 backdrop-blur border-t border-neutral-800/80 px-4 py-2.5 flex items-center justify-between text-xs text-neutral-400">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-neutral-300 hover:text-white"
                  >
                    {isPlaying ? "❚❚" : "▶"}
                  </button>
                  <span className="font-mono text-[11px] text-neutral-300">
                    05:18 / {lesson.durationFormatted || "15:30"}
                  </span>
                </div>

                <div className="flex-1 mx-4 h-1.5 rounded-full bg-neutral-800 overflow-hidden relative cursor-pointer">
                  <div className="h-full bg-violet-600 rounded-full" style={{ width: "35%" }} />
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-neutral-400">1080p</span>
                  <button type="button" className="text-neutral-300 hover:text-white" title="Tela Cheia">
                    ⛶
                  </button>
                </div>
              </div>
            </div>

            {/* Ações Abaixo do Player */}
            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={toggleCompleted}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-semibold transition-all ${
                  isCurrentCompleted
                    ? "border-emerald-700 bg-emerald-950/40 text-emerald-300"
                    : "border-neutral-800 bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                }`}
              >
                <span>{isCurrentCompleted ? "✓ Concluída" : "✓ Marcar como Concluída"}</span>
              </button>

              <button
                type="button"
                onClick={handleNextLesson}
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 px-4 py-2 text-xs font-semibold text-white shadow-sm shadow-violet-600/30 transition-all"
              >
                <span>Próxima Aula</span>
                <span>&gt;</span>
              </button>
            </div>

            {/* Barra de Abas */}
            <div className="border-b border-neutral-800/80 flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                  activeTab === "overview"
                    ? "border-violet-500 text-white bg-neutral-900/60"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Visão Geral
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("code")}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                  activeTab === "code"
                    ? "border-violet-500 text-white bg-neutral-900/60"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Código-Fonte
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("resources")}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                  activeTab === "resources"
                    ? "border-violet-500 text-white bg-neutral-900/60"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Recursos (2)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("notes")}
                className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                  activeTab === "notes"
                    ? "border-violet-500 text-white bg-neutral-900/60"
                    : "border-transparent text-neutral-400 hover:text-neutral-200"
                }`}
              >
                Anotações
              </button>
            </div>

            {/* Conteúdo das Abas */}
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-5">
              {activeTab === "overview" && (
                <div className="space-y-5 text-xs text-neutral-300">
                  <div>
                    <h3 className="text-sm font-bold text-neutral-100 mb-1.5">
                      Objetivo da Aula
                    </h3>
                    <p className="leading-relaxed text-neutral-400">
                      {lesson.overview ||
                        "Nesta primeira aula vamos preparar o seu ambiente de desenvolvimento para programar em C, instalando o compilador GCC no Linux/WSL (ou MinGW/Clang), configurando o editor e entendendo como o código é compilado, ligado e executado na máquina real."}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-neutral-100 mb-2">
                      Conceitos Fundamentais Abordados
                    </h3>
                    <ul className="space-y-1.5 text-neutral-400 list-disc list-inside">
                      {lesson.fundamentalConcepts ? (
                        lesson.fundamentalConcepts.map((item, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {item}
                          </li>
                        ))
                      ) : (
                        <>
                          <li>Estrutura de um fonte C, headers (#include &lt;stdio.h&gt;), compilação, montagem e linking.</li>
                          <li>Execução do primeiro binário gerado pelo GCC, entendendo standard output e códigos de retorno.</li>
                          <li>Compilando pela linha de comando com flags recomendadas: gcc -Wall -Wextra main.c -o main</li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-neutral-500 mb-1">
                      <span># Execução no terminal:</span>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopyCode(
                            lesson.terminalExecution ||
                              "$ gcc -Wall -Wextra main.c -o programa && ./programa\nBem-vindo ao curso de C!"
                          )
                        }
                        className="text-violet-400 hover:text-violet-300"
                      >
                        {copied ? "Copiado!" : "Copiar"}
                      </button>
                    </div>
                    <pre className="text-neutral-200">
                      {lesson.terminalExecution ||
                        "$ gcc -Wall -Wextra main.c -o programa && ./programa\nBem-vindo ao curso de C!"}
                    </pre>
                  </div>
                </div>
              )}

              {activeTab === "code" && (
                <div className="space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>main.c</span>
                    <button
                      type="button"
                      onClick={() => handleCopyCode(lesson.codeSnippet || "")}
                      className="text-violet-400 hover:text-violet-300"
                    >
                      {copied ? "Copiado!" : "Copiar Código"}
                    </button>
                  </div>
                  <pre className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 text-emerald-400 overflow-x-auto leading-relaxed">
                    {lesson.codeSnippet ||
                      `#include <stdio.h>\n\nint main(int argc, char *argv[]) {\n    printf("Bem-vindo ao curso de C!\\n");\n    return 0;\n}`}
                  </pre>
                </div>
              )}

              {activeTab === "resources" && (
                <div className="space-y-2 text-xs">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:border-violet-500/50 transition-colors"
                  >
                    <span>Ementa Completa e Slides em PDF</span>
                    <span className="text-violet-400">Download &darr;</span>
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="flex items-center justify-between p-3 rounded-lg border border-neutral-800 bg-neutral-950 hover:border-violet-500/50 transition-colors"
                  >
                    <span>Repositório de Exemplos no GitHub</span>
                    <span className="text-violet-400">Acessar &rarr;</span>
                  </a>
                </div>
              )}

              {activeTab === "notes" && (
                <div className="space-y-2 text-xs">
                  <p className="text-neutral-400">
                    Faça suas anotações pessoais durante a aula (salvas no navegador):
                  </p>
                  <textarea
                    rows={4}
                    value={studentNotes}
                    onChange={(e) => setStudentNotes(e.target.value)}
                    placeholder="Escreva aqui suas anotações sobre compilador, ponteiros e GCC..."
                    className="w-full rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-100 placeholder-neutral-600 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* =========================================================================
     TELA 3: DETALHES DO CURSO (VISÃO GERAL)
     ========================================================================= */
  const lessonsTotal = allLessons.length;
  const durationTotal = course.durationText ?? `${Math.round(lessonsTotal * 0.5)}h`;

  return (
    <div className="w-full">
      {feedback && (
        <div
          className={`mb-4 rounded-xl border p-3.5 text-xs font-medium flex items-center justify-between ${
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

      {/* Breadcrumb Superior */}
      <nav className="mb-4 text-xs text-neutral-400 font-mono">
        <Link href="/" className="hover:text-neutral-200">Home</Link>
        <span className="mx-2">&gt;</span>
        <Link href="/courses" className="hover:text-neutral-200">Cursos</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-neutral-300">{course.title}</span>
      </nav>

      {/* Cabeçalho do Curso com Badges no Topo Direito e Ações de Admin */}
      <div className="mb-8 border-b border-neutral-900 pb-6 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono tracking-tight">
            {course.title}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-400 max-w-2xl leading-relaxed">
            {course.shortDescription || course.description ||
              "Domine a base da computação: ponteiros, alocação dinâmica, structs e sistemas de baixo nível."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs font-mono text-neutral-300">
              Nível: {course.level || "Médio"}
            </span>
            <span className="rounded-md border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-xs font-mono text-neutral-300">
              {lessonsTotal} aulas &bull; {durationTotal}
            </span>
          </div>

          {/* Botões de Ação do Curso (Admin) */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openEditCourseModal}
                className="rounded-md border border-neutral-700 bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 hover:border-violet-500 hover:text-white transition-all"
              >
                Editar Curso
              </button>
              <button
                type="button"
                onClick={handleDeleteCourse}
                className="rounded-md border border-red-900/60 bg-red-950/40 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-900/60 hover:text-red-100 transition-all"
              >
                Excluir Curso
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Layout de 2 Colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Coluna Esquerda: Visão Geral e Grade Curricular */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono mb-3">
              Visão Geral do Curso
            </h2>
            <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/40 p-5 text-xs sm:text-sm text-neutral-300 leading-relaxed">
              <p>
                {course.description ||
                  "A Linguagem C é a espinha dorsal da engenharia de software de alta performance, sistemas operacionais e computação embarcada."}
              </p>
            </div>
          </section>

          {/* Grade Curricular & Módulos */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-200 font-mono">
                Grade Curricular &amp; Módulos ({course.modules.length} módulos &bull; {lessonsTotal} aulas)
              </h2>

              {isAdmin && (
                <button
                  type="button"
                  onClick={openAddModuleModal}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-violet-600/30 transition-all"
                >
                  <span className="font-bold">+</span>
                  <span>Adicionar Módulo</span>
                </button>
              )}
            </div>

            {course.modules.length === 0 ? (
              <div className="rounded-xl border border-dashed border-neutral-800 p-8 text-center text-xs text-neutral-400">
                <p>Nenhum módulo cadastrado neste curso ainda.</p>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={openAddModuleModal}
                    className="mt-3 inline-flex items-center gap-1 rounded bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white"
                  >
                    + Criar primeiro módulo
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {course.modules.map((mod, modIdx) => {
                  const isOpen = openModules[String(mod.id)] ?? modIdx === 0;
                  return (
                    <div
                      key={mod.id || modIdx}
                      className="rounded-xl border border-neutral-800/80 bg-neutral-900/30 overflow-hidden"
                    >
                      <div
                        onClick={() => toggleModule(mod.id)}
                        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/30 transition-colors select-none"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-neutral-200">
                            {isOpen ? "▼ " : "▶ "}
                            {mod.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span className="rounded border border-neutral-800 bg-neutral-950 px-2.5 py-1 text-[11px] font-mono text-neutral-400">
                            {mod.lessons.length} {mod.lessons.length === 1 ? "aula" : "aulas"}
                          </span>

                          {isAdmin && (
                            <div className="flex items-center gap-1.5 ml-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={(e) => openAddLessonModal(mod.id, e)}
                                title="Adicionar Vídeo a este Módulo"
                                className="rounded border border-violet-800/60 bg-violet-950/40 px-2 py-1 text-[10px] font-mono text-violet-300 hover:bg-violet-900/60"
                              >
                                + Vídeo
                              </button>
                              <button
                                type="button"
                                onClick={(e) => openEditModuleModal(mod, e)}
                                title="Editar Nome do Módulo"
                                className="rounded border border-neutral-700 bg-neutral-800 px-2 py-1 text-[10px] text-neutral-300 hover:border-violet-500 hover:text-white"
                              >
                                Editar
                              </button>
                              <button
                                type="button"
                                onClick={(e) => handleDeleteModule(mod.id, mod.title, e)}
                                title="Excluir Módulo"
                                className="rounded border border-red-900/60 bg-red-950/30 px-2 py-1 text-[10px] text-red-300 hover:bg-red-900/60"
                              >
                                Excluir
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {isOpen && (
                        <div className="p-3 pt-0 border-t border-neutral-800/60 divide-y divide-neutral-900">
                          {mod.lessons.length > 0 ? (
                            mod.lessons.map((les) => (
                              <div
                                key={les.id}
                                className="flex items-center justify-between py-2.5 px-3 rounded hover:bg-neutral-800/40 text-left transition-colors group"
                              >
                                <button
                                  type="button"
                                  onClick={() => handleSelectLesson(les.id)}
                                  className="flex-1 flex items-center justify-between text-left mr-3"
                                >
                                  <span className="text-xs text-neutral-300 group-hover:text-violet-300 transition-colors">
                                    {les.title}
                                  </span>
                                  <span className="text-[11px] font-mono text-neutral-400 group-hover:text-neutral-300">
                                    {les.durationFormatted || `${les.duration || 15}:00`}
                                  </span>
                                </button>

                                {isAdmin && (
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <button
                                      type="button"
                                      onClick={(e) => openEditLessonModal(mod.id, les, e)}
                                      className="rounded border border-neutral-700 bg-neutral-800/80 px-2 py-0.5 text-[10px] text-neutral-300 hover:text-white hover:border-violet-500"
                                    >
                                      Editar
                                    </button>
                                    <button
                                      type="button"
                                      onClick={(e) => handleDeleteLesson(mod.id, les.id, les.title, e)}
                                      className="rounded border border-red-900/60 bg-red-950/30 px-2 py-0.5 text-[10px] text-red-300 hover:bg-red-900/60"
                                    >
                                      Excluir
                                    </button>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="py-3 text-center text-xs text-neutral-400">
                              Nenhum vídeo cadastrado neste módulo.
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={(e) => openAddLessonModal(mod.id, e)}
                                  className="ml-2 text-violet-400 hover:underline"
                                >
                                  + Adicionar primeiro vídeo
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Coluna Direita */}
        <div className="lg:col-span-4 space-y-6">
          <div
            onClick={() => handleSelectLesson(allLessons[0]?.lesson.id || "l1")}
            className="group cursor-pointer rounded-xl border border-neutral-800/80 bg-neutral-950 p-4 transition-all hover:border-violet-500/60 relative overflow-hidden"
          >
            <div className="aspect-video w-full rounded-lg bg-[#0e0e12] border border-neutral-800/80 p-3 font-mono text-[11px] text-neutral-300 flex flex-col justify-between relative overflow-hidden select-none">
              {course.thumbnail && failedPreviewSrc !== course.thumbnail && (
                <Image
                  src={course.thumbnail}
                  alt={course.title}
                  fill
                  unoptimized
                  onError={() => setFailedPreviewSrc(course.thumbnail as string)}
                  className="object-cover opacity-40 group-hover:opacity-55 transition-opacity pointer-events-none"
                />
              )}
              <div className="flex items-center gap-1.5 text-neutral-400 text-[10px] relative z-10">
                <span className="h-2 w-2 rounded-full bg-red-500/70" />
                <span className="h-2 w-2 rounded-full bg-yellow-500/70" />
                <span className="h-2 w-2 rounded-full bg-green-500/70" />
                <span className="ml-1 text-neutral-400">preview.c</span>
              </div>

              <pre className="text-violet-300/90 text-[11px] my-auto">
{`int main(int argc, char *argv[]) {
    printf("Bem-vindo ao Comando.C!\\n");
    return 0;
}`}
              </pre>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-violet-600 group-hover:bg-violet-500 text-white flex items-center justify-center shadow-lg shadow-violet-600/50 group-hover:scale-105 transition-all">
                  <svg className="h-6 w-6 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <p className="mt-3 text-center text-xs font-mono text-neutral-400 group-hover:text-neutral-200 transition-colors">
              Preview do Curso ({course.previewDuration || "03:45"})
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/50 p-5 space-y-4">
            <div>
              <h3 className="text-base font-bold text-neutral-100 font-sans">
                Acesso Imediato
              </h3>
              <p className="mt-1 text-xs text-neutral-400">
                Curso Completo com {lessonsTotal} aulas em {course.modules.length} módulos
              </p>
            </div>

            <button
              type="button"
              disabled={allLessons.length === 0}
              onClick={() => {
                if (allLessons.length > 0) {
                  handleSelectLesson(allLessons[0].lesson.id);
                }
              }}
              className={`w-full inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 hover:bg-violet-500 active:scale-95 py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-violet-600/30 transition-all font-display ${allLessons.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <span>{allLessons.length > 0 ? "> Começar a Assistir Agora" : "Curso em Breve"}</span>
            </button>

            <button
              type="button"
              onClick={() => alert("Ementa em PDF enviada para download.")}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 py-2.5 text-xs font-medium text-neutral-300 transition-all"
            >
              <span>Baixar Ementa Completa (PDF)</span>
            </button>

            <ul className="pt-2 border-t border-neutral-800/80 space-y-2 text-xs text-neutral-400">
              <li className="flex items-center gap-2">
                <span className="text-violet-400">✓</span>
                <span>{lessonsTotal} aulas práticas em vídeo (1080p)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-400">✓</span>
                <span>4 projetos práticos no portfólio</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-400">✓</span>
                <span>Código-fonte completo no GitHub</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-400">✓</span>
                <span>Suporte técnico e dúvidas na comunidade</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-violet-400">✓</span>
                <span>Certificado digital verificado</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODAIS ADMINISTRATIVOS (CRUD COMPLETO)
         ========================================================================= */}

      {/* 1. Modal de Edição de Curso */}
      {courseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-100 font-mono">
                Editar Informações do Curso
              </h2>
              <button
                type="button"
                onClick={() => setCourseModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-200"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                  Título do Curso *
                </label>
                <input
                  type="text"
                  required
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                    Categoria
                  </label>
                  <input
                    type="text"
                    value={courseCategory}
                    onChange={(e) => setCourseCategory(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                    Nível do Curso *
                  </label>
                  <select
                    value={courseLevel}
                    onChange={(e) => setCourseLevel(e.target.value)}
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
                  Descrição do Curso
                </label>
                <textarea
                  rows={3}
                  value={courseDesc}
                  onChange={(e) => setCourseDesc(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <ImageUpload
                  label="Miniatura do Curso (Capa)"
                  value={courseThumb}
                  onChange={(val) => setCourseThumb(val)}
                  onFileChange={(file) => setCourseThumbFile(file)}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setCourseModalOpen(false)}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2 text-xs font-semibold text-white transition-all disabled:opacity-50"
                >
                  {submitting ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Modal de Criar / Editar Módulo */}
      {moduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-100 font-mono">
                {isEditingModule ? "Editar Nome do Módulo" : "Adicionar Novo Módulo"}
              </h2>
              <button
                type="button"
                onClick={() => setModuleModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-200"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveModule} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                  Título do Módulo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Módulo 5: Testes & Integração"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                />
              </div>

              {!isEditingModule && (
                <div className="p-4 rounded-xl border border-neutral-800/80 bg-neutral-950/60 space-y-3">
                  <div className="text-xs font-mono text-violet-400 font-bold">
                    Primeiro Vídeo do Módulo (Obrigatório)
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                      Título da Aula *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: 01. Introdução ao Módulo"
                      value={firstVideoTitle}
                      onChange={(e) => setFirstVideoTitle(e.target.value)}
                      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Duração (min) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={firstVideoDuration}
                        onChange={(e) => setFirstVideoDuration(Number(e.target.value))}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-mono text-neutral-400 mb-1">
                        Descrição (Opcional)
                      </label>
                      <input
                        type="text"
                        placeholder="Visão geral da aula..."
                        value={firstVideoDesc}
                        onChange={(e) => setFirstVideoDesc(e.target.value)}
                        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setModuleModalOpen(false)}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2 text-xs font-semibold text-white transition-all disabled:opacity-50"
                >
                  {submitting ? "Processando..." : isEditingModule ? "Salvar Módulo" : "Criar Módulo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Modal de Criar / Editar Vídeo (Aula) */}
      {lessonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 sm:p-8 shadow-2xl my-8">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-100 font-mono">
                {isEditingLesson ? "Editar Vídeo / Aula" : "Adicionar Vídeo ao Módulo"}
              </h2>
              <button
                type="button"
                onClick={() => setLessonModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:text-neutral-200"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                  Título do Vídeo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: 05. Alocação Dinâmica com calloc"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                />
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
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(Number(e.target.value))}
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
                    value={lessonVideoUrl}
                    onChange={(e) => setLessonVideoUrl(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                  Descrição
                </label>
                <textarea
                  rows={2}
                  placeholder="Conteúdo abordado nesta aula..."
                  value={lessonDesc}
                  onChange={(e) => setLessonDesc(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs text-neutral-100 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-neutral-300 mb-1 font-mono">
                  Código-Fonte de Demonstração (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="#include <stdio.h>..."
                  value={lessonSnippet}
                  onChange={(e) => setLessonSnippet(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-mono text-emerald-400 focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setLessonModalOpen(false)}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-xl bg-violet-600 hover:bg-violet-500 px-5 py-2 text-xs font-semibold text-white transition-all disabled:opacity-50"
                >
                  {submitting ? "Processando..." : isEditingLesson ? "Salvar Vídeo" : "Adicionar Vídeo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetailClient;
