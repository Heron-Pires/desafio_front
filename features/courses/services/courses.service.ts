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

/**
 * Converte e otimiza um objeto File para uma string Base64 DataURL compacta.
 * No navegador, redimensiona via Canvas para garantir que fique com segurança abaixo de 60KB,
 * respeitando o limite padrão de 100KB do Express body-parser (evitando erro 413 Payload Too Large).
 */
async function fileToDataUrl(file: File): Promise<string> {
  if (typeof window !== "undefined" && typeof document !== "undefined") {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const rawUrl = e.target?.result as string;
        if (!rawUrl) return resolve("");

        if (file.type === "image/svg+xml") {
          return resolve(rawUrl);
        }

        const img = new window.Image();
        img.onload = () => {
          const maxDim = 500;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) return resolve(rawUrl);
          ctx.drawImage(img, 0, 0, width, height);
          let quality = 0.75;
          let dataUrl = canvas.toDataURL("image/jpeg", quality);
          while (dataUrl.length > 60 * 1024 && quality > 0.25) {
            quality -= 0.15;
            dataUrl = canvas.toDataURL("image/jpeg", quality);
          }
          resolve(dataUrl);
        };
        img.onerror = () => resolve(rawUrl);
        img.src = rawUrl;
      };
      reader.onerror = () => resolve("");
      reader.readAsDataURL(file);
    });
  }

  // Node.js fallback (testes)
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const mimeType = file.type || "image/png";
    return `data:${mimeType};base64,${buffer.toString("base64")}`;
  } catch {
    return "";
  }
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
   * Tenta envio multipart/form-data com o binário se Supabase estiver configurado no backend.
   * Se o upload no Supabase falhar (500 ou indisponível), realiza fallback automático para JSON com Base64 otimizado (<60KB).
   */
  async create(data: CreateCourseDTO): Promise<CourseSummary> {
    if (shouldForceMock()) {
      const newCourse: CourseSummary = {
        id: String(Date.now()),
        title: data.title,
        category: data.category || "Geral",
        shortDescription: data.description || "",
        thumbnail: data.thumbnail === null || data.thumbnail === ""
          ? ""
          : (typeof data.thumbnail === "string" ? data.thumbnail : (data.fallbackThumbnail || "")),
        modulesCount: 0,
        level: data.level || "Iniciante",
      };
      mockCourses.push(newCourse);
      return newCourse;
    }

    if (typeof File !== "undefined" && data.thumbnail instanceof File) {
      try {
        const formData = new FormData();
        formData.append("title", data.title);
        if (data.category) formData.append("category", data.category);
        if (data.description) formData.append("description", data.description);
        if (data.level) formData.append("level", data.level);
        formData.append("thumbnail", data.thumbnail);

        const response = await apiClient.post<CourseSummary & { description?: string }>("/courses", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return {
          id: String(response.data.id),
          title: response.data.title,
          category: response.data.category || (typeof data.category === "string" ? data.category : "Geral"),
          shortDescription: response.data.shortDescription || response.data.description || (typeof data.description === "string" ? data.description : ""),
          thumbnail: response.data.thumbnail || "",
          modulesCount: response.data.modulesCount ?? 0,
          ...(data.level || response.data.level ? { level: data.level || response.data.level } : {}),
        };
      } catch (uploadError) {
        // Fallback defensivo: se o upload de arquivo falhar no backend (ex: Supabase não configurado / status 500),
        // persiste o curso via JSON enviando a imagem em formato Base64 otimizado (< 60KB, evitando status 413)
        let fallbackUrl = data.fallbackThumbnail;
        if (!fallbackUrl || (typeof window !== "undefined" && fallbackUrl.length > 65 * 1024)) {
          fallbackUrl = await fileToDataUrl(data.thumbnail);
        }

        if (fallbackUrl) {
          try {
            const jsonPayload = {
              title: data.title,
              category: data.category,
              description: data.description,
              thumbnail: fallbackUrl,
              level: data.level,
            };
            const response = await apiClient.post<CourseSummary & { description?: string }>("/courses", jsonPayload);
            return {
              id: String(response.data.id),
              title: response.data.title,
              category: response.data.category || (typeof data.category === "string" ? data.category : "Geral"),
              shortDescription: response.data.shortDescription || response.data.description || (typeof data.description === "string" ? data.description : ""),
              thumbnail: response.data.thumbnail || fallbackUrl,
              modulesCount: response.data.modulesCount ?? 0,
              ...(data.level || response.data.level ? { level: data.level || response.data.level } : {}),
            };
          } catch (jsonError) {
            console.error("Falha ao salvar curso na API backend via JSON após falha no upload:", jsonError);
            throw jsonError;
          }
        }
        console.error("Falha ao salvar curso na API backend:", uploadError);
        throw uploadError;
      }
    }

    try {
      const response = await apiClient.post<CourseSummary & { description?: string }>("/courses", data);
      return {
        id: String(response.data.id),
        title: response.data.title,
        category: response.data.category || (typeof data.category === "string" ? data.category : "Geral"),
        shortDescription: response.data.shortDescription || response.data.description || (typeof data.description === "string" ? data.description : ""),
        thumbnail: response.data.thumbnail || (typeof data.thumbnail === "string" ? data.thumbnail : ""),
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
   * Tenta envio multipart/form-data com o binário se Supabase estiver configurado no backend.
   * Se o upload no Supabase falhar (500 ou indisponível), realiza fallback automático para JSON com Base64 otimizado (<60KB).
   */
  async update(id: string | number, data: UpdateCourseDTO): Promise<CourseSummary> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      const existing = mockCourses.find((c) => String(c.id) === String(id));
      if (existing) {
        if (data.title !== undefined) existing.title = data.title;
        if (data.category !== undefined) existing.category = data.category;
        if (data.description !== undefined) existing.shortDescription = data.description;
        if (data.thumbnail !== undefined) {
          existing.thumbnail = data.thumbnail === null || data.thumbnail === ""
            ? ""
            : (typeof data.thumbnail === "string" ? data.thumbnail : (data.fallbackThumbnail || ""));
        }
        if (data.level !== undefined) existing.level = data.level;
        return existing;
      }
      throw new ApiError("Curso não encontrado no mock.", 404);
    }

    if (mockCourseDetails[String(id)]) {
      if (data.title !== undefined) mockCourseDetails[String(id)].title = data.title;
      if (data.category !== undefined) mockCourseDetails[String(id)].category = data.category;
      if (data.description !== undefined) mockCourseDetails[String(id)].description = data.description;
      if (data.thumbnail !== undefined) {
        mockCourseDetails[String(id)].thumbnail = data.thumbnail === null || data.thumbnail === ""
          ? ""
          : (typeof data.thumbnail === "string" ? data.thumbnail : (data.fallbackThumbnail || ""));
      }
      if (data.level !== undefined) mockCourseDetails[String(id)].level = data.level;
    }

    const existingMock = mockCourses.find((c) => String(c.id) === String(id));
    if (existingMock) {
      if (data.title !== undefined) existingMock.title = data.title;
      if (data.category !== undefined) existingMock.category = data.category;
      if (data.description !== undefined) existingMock.shortDescription = data.description;
      if (data.thumbnail !== undefined) {
        existingMock.thumbnail = data.thumbnail === null || data.thumbnail === ""
          ? ""
          : (typeof data.thumbnail === "string" ? data.thumbnail : (data.fallbackThumbnail || ""));
      }
      if (data.level !== undefined) existingMock.level = data.level;
    }

    if (typeof File !== "undefined" && data.thumbnail instanceof File) {
      try {
        const formData = new FormData();
        if (data.title !== undefined) formData.append("title", data.title);
        if (data.category !== undefined) formData.append("category", data.category);
        if (data.description !== undefined) formData.append("description", data.description);
        if (data.level !== undefined) formData.append("level", data.level);
        formData.append("thumbnail", data.thumbnail);

        const response = await apiClient.put<CourseSummary & { description?: string }>(`/courses/${safeId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        return {
          id: String(response.data.id),
          title: response.data.title,
          category: response.data.category || (typeof data.category === "string" ? data.category : "Geral"),
          shortDescription: response.data.shortDescription || response.data.description || (typeof data.description === "string" ? data.description : ""),
          thumbnail: response.data.thumbnail || "",
          modulesCount: response.data.modulesCount ?? 0,
          ...(data.level || response.data.level ? { level: data.level || response.data.level } : {}),
        };
      } catch (uploadError) {
        // Fallback defensivo: se o upload de arquivo falhar no backend (ex: Supabase não configurado / status 500),
        // atualiza o curso via JSON enviando a imagem em formato Base64 otimizado (< 60KB, evitando status 413)
        let fallbackUrl = data.fallbackThumbnail;
        if (!fallbackUrl || (typeof window !== "undefined" && fallbackUrl.length > 65 * 1024)) {
          fallbackUrl = await fileToDataUrl(data.thumbnail);
        }

        if (fallbackUrl) {
          try {
            const jsonPayload: Record<string, unknown> = {};
            if (data.title !== undefined) jsonPayload.title = data.title;
            if (data.category !== undefined) jsonPayload.category = data.category;
            if (data.description !== undefined) jsonPayload.description = data.description;
            if (data.level !== undefined) jsonPayload.level = data.level;
            jsonPayload.thumbnail = fallbackUrl;

            const response = await apiClient.put<CourseSummary & { description?: string }>(`/courses/${safeId}`, jsonPayload);
            return {
              id: String(response.data.id),
              title: response.data.title,
              category: response.data.category || (typeof data.category === "string" ? data.category : "Geral"),
              shortDescription: response.data.shortDescription || response.data.description || (typeof data.description === "string" ? data.description : ""),
              thumbnail: response.data.thumbnail || fallbackUrl,
              modulesCount: response.data.modulesCount ?? 0,
              ...(data.level || response.data.level ? { level: data.level || response.data.level } : {}),
            };
          } catch (jsonError) {
            console.error("Falha ao atualizar curso na API backend via JSON após falha no upload:", jsonError);
            throw jsonError;
          }
        }
        console.error("Falha ao atualizar curso na API backend:", uploadError);
        throw uploadError;
      }
    }

    try {
      const response = await apiClient.put<CourseSummary & { description?: string }>(`/courses/${safeId}`, data);
      return {
        id: String(response.data.id),
        title: response.data.title,
        category: response.data.category || (typeof data.category === "string" ? data.category : "Geral"),
        shortDescription: response.data.shortDescription || response.data.description || (typeof data.description === "string" ? data.description : ""),
        thumbnail: response.data.thumbnail ?? (typeof data.thumbnail === "string" ? data.thumbnail : ""),
        modulesCount: response.data.modulesCount ?? 0,
        ...(data.level || response.data.level ? { level: data.level || response.data.level } : {}),
      };
    } catch (error) {
      console.error("Falha ao atualizar curso na API backend:", error);
      throw error;
    }
  },

  /**
   * Atualiza exclusivamente a imagem de capa do curso via Axios (PATCH /courses/:id/thumbnail).
   * Envia o arquivo de imagem via multipart/form-data para upload no Supabase Storage.
   * Se Supabase não estiver configurado (500), realiza fallback para PUT com JSON.
   */
  async uploadThumbnail(id: string | number, file: File): Promise<CourseSummary> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      const existing = mockCourses.find((c) => String(c.id) === String(id));
      if (existing) {
        return existing;
      }
      throw new ApiError("Curso não encontrado no mock.", 404);
    }

    const formData = new FormData();
    formData.append("thumbnail", file);

    try {
      const response = await apiClient.patch<CourseSummary>(
        `/courses/${safeId}/thumbnail`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return {
        id: String(response.data.id),
        title: response.data.title,
        category: response.data.category || "Geral",
        shortDescription: response.data.shortDescription || "",
        thumbnail: response.data.thumbnail || "",
        modulesCount: response.data.modulesCount ?? 0,
      };
    } catch (uploadError) {
      const fallbackUrl = await fileToDataUrl(file);
      if (fallbackUrl) {
        try {
          return await this.update(id, { thumbnail: fallbackUrl });
        } catch (updateError) {
          console.error("Falha no fallback de upload de thumbnail:", updateError);
          throw updateError;
        }
      }
      throw uploadError;
    }
  },

  /**
   * Remove um curso via Axios (DELETE /courses/:id).
   */
  async delete(id: string | number): Promise<void> {
    const safeId = encodeURIComponent(String(id).trim());

    if (shouldForceMock()) {
      const index = mockCourses.findIndex((c) => String(c.id) === String(id));
      if (index !== -1) {
        mockCourses.splice(index, 1);
        delete mockCourseDetails[safeId];
        return;
      }
      throw new ApiError("Curso não encontrado no mock para exclusão.", 404);
    }

    try {
      await apiClient.delete(`/courses/${safeId}`);
      delete mockCourseDetails[safeId];
      const idx = mockCourses.findIndex((c) => String(c.id) === String(id));
      if (idx !== -1) {
        mockCourses.splice(idx, 1);
      }
    } catch (error) {
      console.error("Falha ao excluir curso na API backend:", error);
      throw error;
    }
  },
};

export default coursesService;
