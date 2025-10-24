// src/services/api.ts
// Detect backend automatically (local vs production)
const API_BASE =
  window.location.hostname === "localhost"
    ? "http://127.0.0.1:10000/api" // ✅ your local Flask port
    : "https://qona-par-dashboard-production.up.railway.app/api"; // ✅ deployed backend

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  return await res.json();
}

export async function fetchOverall(): Promise<any> {
  return get("/overall");
}

export async function fetchOfficer(name: string): Promise<any> {
  const q = encodeURIComponent(name);
  return get(`/officer?name=${q}`);
}

export const exportUrls = {
  pdf: `${API_BASE}/export/pdf`,
  png: `${API_BASE}/export/png`,
  excel: `${API_BASE}/export/excel`,
};
