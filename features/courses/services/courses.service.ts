import { httpClient } from "@/services/api";
import { CourseSummary, CourseDetail } from "../types/course";

export const coursesService = {
  /**
   * Obtém a lista de cursos disponíveis
   * Endpoint: GET /courses
   */
  async getAll(): Promise<CourseSummary[]> {
    return httpClient<CourseSummary[]>("/courses", {
      next: { revalidate: 60 }, // Cache incremental se executado no Server-Side
    });
  },

  /**
   * Obtém o detalhe do curso e sua grade de módulos/aulas
   * Endpoint: GET /courses/:id
   */
  async getById(id: string | number): Promise<CourseDetail> {
    return httpClient<CourseDetail>(`/courses/${id}`, {
      next: { revalidate: 60 },
    });
  },
};
