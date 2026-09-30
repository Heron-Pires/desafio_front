// services/api.ts
// validador simples em services/api.ts
// para capturar ausências de configuração
const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn("Aviso: NEXT_PUBLIC_API_URL não foi definida no ambiente.");
}

export { API_URL };
