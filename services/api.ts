import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const BASE_URL = rawBaseUrl.replace(/\/+$/, "");

if (!process.env.NEXT_PUBLIC_API_URL && typeof window !== "undefined") {
  console.warn("Aviso: NEXT_PUBLIC_API_URL não está configurada no ambiente.");
}

export { BASE_URL as API_URL };

export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Instância global configurada do Axios para toda a aplicação.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para injetar token de autenticação se disponível
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("comando_auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

interface RequestOptions extends AxiosRequestConfig {
  params?: Record<string, string | number>;
  timeoutMs?: number;
}

/**
 * Cliente HTTP unificado utilizando Axios para compatibilidade e requisições seguras.
 */
export async function httpClient<T>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 8000, ...customConfig } = options;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  try {
    const response = await apiClient.request<T>({
      url: cleanEndpoint,
      timeout: timeoutMs,
      ...customConfig,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ message?: string }>;
      const status = axiosError.response?.status || 500;
      const serverMessage = axiosError.response?.data?.message;

      if (status === 404) {
        throw new ApiError(serverMessage || "Recurso não encontrado.", 404);
      }

      if (axiosError.code === "ECONNABORTED") {
        throw new ApiError("Tempo limite de conexão excedido.", 504, { cause: error });
      }

      const message =
        serverMessage ||
        axiosError.message ||
        "Falha na comunicação com o servidor.";

      throw new ApiError(message, status, { cause: error });
    }

    if (error instanceof ApiError) {
      throw error;
    }

    throw new ApiError("Falha na comunicação com o servidor.", 500, { cause: error });
  }
}

export default apiClient;
