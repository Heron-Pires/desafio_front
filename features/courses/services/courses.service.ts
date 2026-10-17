import { apiClient, ApiError } from "@/services/api";
import {
  CourseSummary,
  CourseDetail,
  CreateCourseDTO,
  UpdateCourseDTO,
} from "../types/course";
import { mockCourses, getMockCourseById } from "./courses.mock";

const shouldForceMock = () => process.env.NEXT_PUBLIC_USE_MOCK === "true";

export const coursesService = {
  /**
   * Obtém a lista de cursos disponíveis via Axios (GET /courses).
   * Recorre defensivamente ao mock se a API estiver offline ou configurado.
   */
  async getAll(): Promise<CourseSummary[]> {
    if (shouldForceMock()) {
      return mockCourses;
    }

    try {
      const response = await apiClient.get<CourseSummary[]>("/courses");
      return response.data;
    } catch (error) {
      console.warn(
        "API backend indisponível. Recorrendo aos dados mockados de courses.mock.ts:",
        error
      );
      return mockCourses;
    }
  },

  /**
   * Obtém os detalhes de um curso por ID via Axios (GET /courses/:id).
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
      const response = await apiClient.get<CourseDetail>(`/courses/${safeId}`);
      return response.data;
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw error;
      }

      const mock = getMockCourseById(cleanId);
      if (mock) {
        console.warn(
          `API backend indisponível. Utilizando dados mockados para o curso ${cleanId}.`
        );
        return mock;
      }

      throw new ApiError("Recurso não encontrado.", 404);
    }
  },

  /**
   * Cria um novo curso via Axios (POST /courses).
   * Persiste diretamente no banco de dados PostgreSQL via backend.
   */
  async create(data: CreateCourseDTO): Promise<CourseSummary> {
    if (shouldForceMock()) {
      const newCourse: CourseSummary = {
        id: String(Date.now()),
        title: data.title,
        category: data.category || "Geral",
        shortDescription: data.description || "",
        thumbnail: data.thumbnail || "",
        modulesCount: 0,
      };
      mockCourses.push(newCourse);
      return newCourse;
    }

    try {
      const response = await apiClient.post<CourseSummary & { description?: string }>("/courses", data);
      return {
        id: String(response.data.id),
        title: response.data.title,
        category: response.data.category || data.category || "Geral",
        shortDescription: response.data.shortDescription || response.data.description || data.description || "",
        thumbnail: response.data.thumbnail || data.thumbnail || "",
        modulesCount: response.data.modulesCount ?? 0,
      };
    } catch (error) {
      console.error("Falha ao salvar curso na API backend:", error);
      throw error;
    }
  },

  /**
   * Atualiza os dados de um curso via Axios (PUT /courses/:id).
   * Atualiza os dados persistidos no PostgreSQL.
   */
  async update(id: string | number, data: UpdateCourseDTO): Promise<CourseSummary> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      const existing = mockCourses.find((c) => String(c.id) === String(id));
      if (existing) {
        if (data.title !== undefined) existing.title = data.title;
        if (data.category !== undefined) existing.category = data.category;
        if (data.description !== undefined) existing.shortDescription = data.description;
        if (data.thumbnail !== undefined) existing.thumbnail = data.thumbnail;
        return existing;
      }
      throw new ApiError("Curso não encontrado no mock.", 404);
    }

    try {
      const response = await apiClient.put<CourseSummary & { description?: string }>(`/courses/${safeId}`, data);
      return {
        id: String(response.data.id),
        title: response.data.title,
        category: response.data.category || data.category || "Geral",
        shortDescription: response.data.shortDescription || response.data.description || data.description || "",
        thumbnail: response.data.thumbnail || data.thumbnail || "",
        modulesCount: response.data.modulesCount ?? 0,
      };
    } catch (error) {
      console.error("Falha ao atualizar curso na API backend:", error);
      throw error;
    }
  },

  /**
   * Remove um curso via Axios (DELETE /courses/:id).
   * Remove do PostgreSQL com deleção em cascata dos módulos e aulas.
   */
  async delete(id: string | number): Promise<void> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      const index = mockCourses.findIndex((c) => String(c.id) === String(id));
      if (index !== -1) {
        mockCourses.splice(index, 1);
      }
      return;
    }

    try {
      await apiClient.delete(`/courses/${safeId}`);
    } catch (error) {
      console.error("Falha ao excluir curso na API backend:", error);
      throw error;
    }
  },
};
