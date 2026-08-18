// Se existir um .env.local com EXPO_PUBLIC_API_URL, ele tem prioridade.
// Sem esse arquivo, vale o endereço abaixo (mesmo comportamento de antes).
// Veja .env.example e mock/README.md.
export const API_URL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://192.168.0.161:8080";

export const STORAGE_KEY = "token";
