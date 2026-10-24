import { apiClient } from "@/services/api";
import { Module } from "../types/course";
import { mockCourseDetails } from "./courses.mock";

function shouldForceMock(): boolean {
  return process.env.NEXT_PUBLIC_FORCE_MOCK === "true";
}

export const modulesService = {
  /**
   * Obtém detalhes de um módulo via Axios (GET /modules/:id).
   */
  async getById(id: string | number): Promise<Module> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      for (const course of Object.values(mockCourseDetails)) {
        const mod = course.modules.find((m) => String(m.id) === String(id));
        if (mod) return mod;
      }
      throw new Error("Módulo não encontrado no mock.");
    }

    try {
      const response = await apiClient.get<Module>(`/modules/${safeId}`);
      return response.data;
    } catch (error) {
      for (const course of Object.values(mockCourseDetails)) {
        const mod = course.modules.find((m) => String(m.id) === String(id));
        if (mod) return mod;
      }
      throw error;
    }
  },

  /**
   * Cria um novo módulo via Axios (POST /modules).
   * Persiste os dados diretamente no PostgreSQL.
   */
  async create(data: { courseId: number; title: string; order?: number }): Promise<Module> {
    if (shouldForceMock()) {
      const newModule: Module = {
        id: String(Date.now()),
        courseId: String(data.courseId),
        title: data.title,
        order: data.order || 1,
        lessons: [],
      };
      const course = mockCourseDetails[String(data.courseId)];
      if (course) {
        course.modules.push(newModule);
      }
      return newModule;
    }

    try {
      const response = await apiClient.post<Module>("/modules", {
        courseId: Number(data.courseId),
        title: data.title.trim(),
        order: Number(data.order || 1),
      });
      return {
        ...response.data,
        lessons: response.data.lessons || [],
      };
    } catch (error) {
      console.error("Falha na API ao criar módulo:", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de um módulo via Axios (PUT /modules/:id).
   */
  async update(id: string | number, data: { title?: string; order?: number }): Promise<Module> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      for (const course of Object.values(mockCourseDetails)) {
        const mod = course.modules.find((m) => String(m.id) === String(id));
        if (mod) {
          if (data.title !== undefined) mod.title = data.title;
          if (data.order !== undefined) mod.order = data.order;
          return mod;
        }
      }
      throw new Error("Módulo não encontrado no mock.");
    }

    try {
      const response = await apiClient.put<Module>(`/modules/${safeId}`, {
        ...(data.title !== undefined ? { title: data.title.trim() } : {}),
        ...(data.order !== undefined ? { order: Number(data.order) } : {}),
      });
      return response.data;
    } catch (error) {
      console.error("Falha na API ao atualizar módulo:", error);
      throw error;
    }
  },

  /**
   * Exclui um módulo via Axios (DELETE /modules/:id).
   */
  async delete(id: string | number): Promise<void> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      for (const course of Object.values(mockCourseDetails)) {
        const index = course.modules.findIndex((m) => String(m.id) === String(id));
        if (index !== -1) {
          course.modules.splice(index, 1);
          return;
        }
      }
      return;
    }

    try {
      await apiClient.delete(`/modules/${safeId}`);
    } catch (error) {
      console.error("Falha na API ao excluir módulo:", error);
      throw error;
    }
  },
};
