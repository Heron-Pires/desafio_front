import { apiClient } from "@/services/api";
import { Lesson, CreateLessonDTO, UpdateLessonDTO } from "../types/course";
import { mockCourseDetails } from "./courses.mock";

export const lessonsService = {
  /**
   * Obtém detalhes de uma aula/vídeo específica via Axios (GET /lessons/:id).
   */
  async getById(id: string | number): Promise<Lesson> {
    const safeId = encodeURIComponent(String(id).trim());
    try {
      const response = await apiClient.get<Lesson>(`/lessons/${safeId}`);
      return response.data;
    } catch (error) {
      // Busca no mock se o backend falhar
      for (const course of Object.values(mockCourseDetails)) {
        for (const mod of course.modules) {
          const found = mod.lessons.find((l) => String(l.id) === String(id));
          if (found) return found;
        }
      }
      throw error;
    }
  },

  /**
   * Cadastra uma nova aula/vídeo via Axios (POST /lessons).
   */
  async create(data: CreateLessonDTO): Promise<Lesson> {
    try {
      const payload = {
        moduleId: Number(data.moduleId),
        title: data.title.trim(),
        description: data.description || undefined,
        duration: Number(data.duration) || 10,
        position: Number(data.position || data.order || 1),
      };

      const response = await apiClient.post<Lesson>("/lessons", payload);
      return response.data;
    } catch (error) {
      console.warn("Falha na API ao criar vídeo/aula. Aplicando fallback:", error);
      const newLesson: Lesson = {
        id: String(Date.now()),
        moduleId: String(data.moduleId),
        title: data.title,
        description: data.description || "",
        duration: data.duration,
        order: data.position || data.order || 1,
        videoUrl: data.videoUrl,
      };

      // Adiciona ao mock
      for (const course of Object.values(mockCourseDetails)) {
        for (const mod of course.modules) {
          if (String(mod.id) === String(data.moduleId)) {
            mod.lessons.push(newLesson);
          }
        }
      }

      return newLesson;
    }
  },

  /**
   * Atualiza uma aula/vídeo existente via Axios (PUT /lessons/:id).
   */
  async update(id: string | number, data: UpdateLessonDTO): Promise<Lesson> {
    const safeId = encodeURIComponent(String(id).trim());
    try {
      const payload: Record<string, unknown> = {};
      if (data.title !== undefined) payload.title = data.title.trim();
      if (data.description !== undefined) payload.description = data.description;
      if (data.duration !== undefined) payload.duration = Number(data.duration);
      if (data.position !== undefined || data.order !== undefined) {
        payload.position = Number(data.position || data.order);
      }
      if (data.moduleId !== undefined) payload.moduleId = Number(data.moduleId);

      const response = await apiClient.put<Lesson>(`/lessons/${safeId}`, payload);
      return response.data;
    } catch (error) {
      console.warn("Falha na API ao atualizar vídeo/aula. Aplicando fallback:", error);
      for (const course of Object.values(mockCourseDetails)) {
        for (const mod of course.modules) {
          const lesson = mod.lessons.find((l) => String(l.id) === String(id));
          if (lesson) {
            if (data.title !== undefined) lesson.title = data.title;
            if (data.description !== undefined) lesson.description = data.description;
            if (data.duration !== undefined) lesson.duration = data.duration;
            if (data.videoUrl !== undefined) lesson.videoUrl = data.videoUrl;
            return lesson;
          }
        }
      }
      throw error;
    }
  },

  /**
   * Exclui uma aula/vídeo via Axios (DELETE /lessons/:id).
   */
  async delete(id: string | number): Promise<void> {
    const safeId = encodeURIComponent(String(id).trim());
    try {
      await apiClient.delete(`/lessons/${safeId}`);
    } catch (error) {
      console.warn("Falha na API ao deletar vídeo/aula. Aplicando fallback:", error);
      for (const course of Object.values(mockCourseDetails)) {
        for (const mod of course.modules) {
          const index = mod.lessons.findIndex((l) => String(l.id) === String(id));
          if (index !== -1) {
            mod.lessons.splice(index, 1);
            return;
          }
        }
      }
    }
  },
};
