// services/api.ts
// validador simples em services/api.ts
// para capturar ausências de configuração
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("Aviso: NEXT_PUBLIC_API_URL não foi definida no ambiente.");
}

export { API_URL };

// Cliente HTTP Base e Tratamento Centralizado de Erros

export class ApiError extends Error {
  public status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

if (!BASE_URL && typeof window !== "undefined") {
  console.warn("Aviso: NEXT_PUBLIC_API_URL não está configurada.");
}

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export async function httpClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...customConfig } = options;

  let url = `${BASE_URL}${endpoint}`;
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
      ...customConfig.headers,
    },
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError("Recurso não encontrado.", 404);
      }
      throw new ApiError(
        `Erro na requisição: ${response.statusText}`,
        response.status
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("Falha na comunicação com o servidor.", 500);
  }
}
