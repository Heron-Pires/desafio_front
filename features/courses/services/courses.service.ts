import { httpClient, ApiError } from "@/services/api";
import { CourseSummary, CourseDetail } from "../types/course";
import { mockCourses, getMockCourseById } from "./courses.mock";

const shouldForceMock = () => process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const coursesService = {
  /**
   * Obtém a lista de cursos disponíveis.
   * Consome a rota GET /courses da API e recorre ao courses.mock.ts
   * caso a API esteja indisponível ou NEXT_PUBLIC_USE_MOCK esteja ativo.
   */
  async getAll(): Promise<CourseSummary[]> {
    if (shouldForceMock()) {
      return mockCourses;
    }

    try {
      const data = await httpClient<CourseSummary[]>("/courses", {
        next: { revalidate: 60 },
      });
      return data;
    } catch (error) {
      // Fallback para mock caso a API backend esteja offline ou inacessível
      console.warn(
        "API indisponível. Recorrendo a dados mockados de courses.mock.ts:",
        error
      );
      return mockCourses;
    }
  },

  /**
   * Obtém os detalhes do curso e sua grade de módulos/aulas.
   * Consome a rota GET /courses/:id da API e recorre ao courses.mock.ts
   * caso a API esteja indisponível ou NEXT_PUBLIC_USE_MOCK esteja ativo.
   */
  async getById(id: string | number): Promise<CourseDetail> {
    const cleanId = String(id).trim();

    if (shouldForceMock()) {
      const mock = getMockCourseById(cleanId);
      if (!mock) {
        throw new ApiError("Recurso não encontrado.", 404);
      }
      return mock;
    }

    const safeId = encodeURIComponent(cleanId);
    try {
      return await httpClient<CourseDetail>(`/courses/${safeId}`, {
        next: { revalidate: 60 },
      });
    } catch (error) {
      // Se a API respondeu 404 com status explícito, propaga o erro de 'não encontrado'
      if (error instanceof ApiError && error.status === 404) {
        throw error;
      }

      // Se a API estiver offline/erro de conexão, busca nos dados mockados
      const mock = getMockCourseById(cleanId);
      if (mock) {
        console.warn(
          `API indisponível. Utilizando dados mockados para o curso ${cleanId}.`
        );
        return mock;
      }

      // Se o ID não existe sequer no mock (ex: /courses/999999), lança 404
      throw new ApiError("Recurso não encontrado.", 404);
    }
  },
};
