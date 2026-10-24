import { apiClient } from "@/services/api";
import {
  CourseSummary,
  CourseDetail,
  CreateCourseDTO,
  UpdateCourseDTO,
} from "../types/course";
import { mockCourses, mockCourseDetails } from "./courses.mock";
import { ApiError } from "@/services/api";

function shouldForceMock(): boolean {
  return process.env.NEXT_PUBLIC_FORCE_MOCK === "true";
}

export const coursesService = {
  /**
   * Obtém a lista sumarizada de cursos via Axios (GET /courses).
   * Caso a API backend esteja fora do ar, utiliza mock defensivo.
   */
  async getAll(): Promise<CourseSummary[]> {
    if (shouldForceMock()) {
      return [...mockCourses];
    }

    try {
      const response = await apiClient.get<CourseSummary[]>("/courses");
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
      return [...mockCourses];
    } catch {
      return [...mockCourses];
    }
  },

  /**
   * Obtém os detalhes completos do curso por ID via Axios (GET /courses/:id).
   */
  async getById(id: string | number): Promise<CourseDetail> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      const mockDetail = mockCourseDetails[safeId] || mockCourseDetails["1"];
      if (mockDetail) {
        return { ...mockDetail, id: safeId };
      }
      throw new ApiError("Curso não encontrado no mock.", 404);
    }

    try {
      const response = await apiClient.get<CourseDetail>(`/courses/${safeId}`);
      if (response.data && response.data.id) {
        const data = response.data;
        const normalizedModules = (data.modules || []).map((m) => ({
          ...m,
          lessons: (m.lessons || []).map((l) => ({
            ...l,
            moduleId: l.moduleId ?? m.id,
          })),
        }));
        return {
          ...data,
          modules: normalizedModules,
        };
      }
      throw new ApiError("Curso não encontrado.", 404);
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        throw error;
      }
      const mockDetail = mockCourseDetails[safeId] || mockCourseDetails["1"];
      if (mockDetail) {
        return { ...mockDetail, id: safeId };
      }
      throw error;
    }
  },

  /**
   * Cria um novo curso via Axios (POST /courses).
   * Persiste os dados diretamente no PostgreSQL.
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
        level: data.level || "Iniciante",
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
        ...(data.level || response.data.level ? { level: data.level || response.data.level } : {}),
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
        if (data.level !== undefined) existing.level = data.level;
        return existing;
      }
      throw new ApiError("Curso não encontrado no mock.", 404);
    }

    if (mockCourseDetails[String(id)]) {
      if (data.title !== undefined) mockCourseDetails[String(id)].title = data.title;
      if (data.category !== undefined) mockCourseDetails[String(id)].category = data.category;
      if (data.description !== undefined) mockCourseDetails[String(id)].description = data.description;
      if (data.thumbnail !== undefined) mockCourseDetails[String(id)].thumbnail = data.thumbnail;
      if (data.level !== undefined) mockCourseDetails[String(id)].level = data.level;
    }

    const existingMock = mockCourses.find((c) => String(c.id) === String(id));
    if (existingMock) {
      if (data.title !== undefined) existingMock.title = data.title;
      if (data.category !== undefined) existingMock.category = data.category;
      if (data.description !== undefined) existingMock.shortDescription = data.description;
      if (data.thumbnail !== undefined) existingMock.thumbnail = data.thumbnail;
      if (data.level !== undefined) existingMock.level = data.level;
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
        ...(data.level || response.data.level ? { level: data.level || response.data.level } : {}),
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
