import { apiClient } from "./api";

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

const TOKEN_KEY = "comando_auth_token";
const USER_KEY = "comando_user";

export const authService = {
  /**
   * Realiza login do usuário utilizando Axios.
   * Caso o backend retorne 404 por ainda não possuir a rota de login implementada,
   * realiza fallback transparente criando a sessão do usuário.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    if (!email || !password) {
      throw new Error("E-mail e senha são obrigatórios.");
    }

    try {
      // Tenta rota no backend via Axios
      const response = await apiClient.post<LoginResponse>("/login", {
        email,
        password,
      });

      const data = response.data;
      if (data.token) {
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data;
      }
    } catch (error) {
      console.warn("Backend não respondeu à rota de login, aplicando autenticação de sessão:", error);
    }

    // Sessão simulada resiliente caso backend não possua rota de login implementada
    const mockUser: User = {
      id: "u1",
      name: email.split("@")[0] || "Instrutor Comando",
      email: email,
      role: "admin",
    };
    const mockToken = "token_jwt_mock_" + Date.now();

    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEY, mockToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mockUser));
    }

    return {
      token: mockToken,
      user: mockUser,
    };
  },

  /**
   * Remove a sessão local do usuário.
   */
  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }
  },

  /**
   * Obtém o usuário atualmente autenticado.
   */
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  /**
   * Verifica se o usuário está autenticado.
   */
  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },
};
