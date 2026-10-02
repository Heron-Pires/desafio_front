// services/api.ts

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

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
  timeoutMs?: number;
}

export async function httpClient<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, timeoutMs = 8000, signal, ...customConfig } = options;

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${BASE_URL}${cleanEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)])
    );
    url += `?${searchParams.toString()}`;
  }

  const timeoutSignal = AbortSignal.timeout(timeoutMs);
  const combinedSignal = signal
    ? typeof AbortSignal.any === "function"
      ? AbortSignal.any([signal, timeoutSignal])
      : signal
    : timeoutSignal;

  const config: RequestInit = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...customConfig.headers,
    },
    signal: combinedSignal,
    ...customConfig,
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      if (response.status === 404) {
        throw new ApiError("Recurso não encontrado.", 404);
      }
      throw new ApiError(
        `Erro na requisição: ${response.statusText || response.status}`,
        response.status
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const isTimeout =
      error instanceof DOMException && error.name === "TimeoutError";
    const message = isTimeout
      ? "Tempo limite de conexão excedido."
      : "Falha na comunicação com o servidor.";

    throw new ApiError(message, 500, { cause: error });
  }
}
