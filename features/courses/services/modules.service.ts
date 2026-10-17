import { apiClient } from "@/services/api";
import { Module } from "../types/course";
import { mockCourseDetails } from "./courses.mock";

export const modulesService = {
  /**
   * Obtém detalhes de um módulo via Axios (GET /modules/:id).
   */
  async getById(id: string | number): Promise<Module> {
    const safeId = encodeURIComponent(String(id).trim());
    const response = await apiClient.get<Module>(`/modules/${safeId}`);
    return response.data;
  },

  /**
   * Cria um novo módulo via Axios (POST /modules).
   */
  async create(data: { courseId: number; title: string; order?: number }): Promise<Module> {
    try {
      const response = await apiClient.post<Module>("/modules", {
        courseId: Number(data.courseId),
        title: data.title,
        order: Number(data.order || 1),
      });
      return response.data;
    } catch (error) {
      console.warn("Falha na API ao criar módulo. Aplicando fallback:", error);
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
  },

  /**
   * Exclui um módulo via Axios (DELETE /modules/:id).
   */
  async delete(id: string | number): Promise<void> {
    const safeId = encodeURIComponent(String(id).trim());
    await apiClient.delete(`/modules/${safeId}`);
  },
};
