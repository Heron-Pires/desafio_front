import { getCourses, getCourseById } from "@/services/api";
import { Course, CourseDetail } from "../types/course";

export const coursesService = {
  /**
   * Obtém a lista de cursos disponíveis
   * Endpoint: GET /courses
   */
  async getAll(): Promise<Course[]> {
    return getCourses();
  },

  /**
   * Obtém o detalhe do curso e sua grade de módulos/aulas
   * Endpoint: GET /courses/:id
   */
  async getById(id: string | number): Promise<CourseDetail> {
    return getCourseById(id);
  },
};
