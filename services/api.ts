// services/api.ts
import {
  Course,
  CourseDetail,
  Module,
  Lesson,
} from "@/features/courses/types/course";
import {
  mockCourses,
  mockCourseDetails,
} from "@/features/courses/services/courses.mock";

export type { Course, CourseDetail, Module, Lesson };

export class ApiError extends Error {
  public status: number;
  public details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const DEFAULT_API_URL = "http://localhost:3001";
export const API_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
  useMockFallback?: boolean;
}

/**
 * Cliente HTTP Base com tipagem estrita e tratamento de erros
 */
export async function httpClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, useMockFallback = true, ...customConfig } = options;

  let url = `${API_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    );
    url += `?${searchParams.toString()}`;
  }

  const config: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...customConfig.headers,
    },
    ...customConfig,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError("Recurso não encontrado nos bancos da Comando.", 404);
      }
      throw new ApiError(
        `FALHA DE COMUNICAÇÃO // Erro ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Se o backend não estiver respondendo no ambiente e useMockFallback for verdadeiro:
    if (useMockFallback) {
      if (endpoint === "/courses") {
        return mockCourses as unknown as T;
      }
      const courseMatch = endpoint.match(/^\/courses\/([^/?]+)/);
      if (courseMatch) {
        const id = courseMatch[1];
        // Se for um id inválido de teste como 999999, lança 404 para testar a rota not-found
        if (id === "999999" || id === "not-found") {
          throw new ApiError("Curso não encontrado nos registros do sistema.", 404);
        }
        if (mockCourseDetails[id]) {
          return mockCourseDetails[id] as unknown as T;
        }
      }
    }

    throw new ApiError(
      "FALHA DE COMUNICAÇÃO // Não foi possível conectar ao servidor da Plataforma Comando.",
      500,
      error
    );
  }
}

/**
 * Funções especializadas centralizadas da camada de API
 */
export async function getCourses(): Promise<Course[]> {
  return httpClient<Course[]>("/courses");
}

export async function getCourseById(id: string | number): Promise<CourseDetail> {
  return httpClient<CourseDetail>(`/courses/${id}`);
}

export const api = {
  getCourses,
  getCourseById,
  httpClient,
};
