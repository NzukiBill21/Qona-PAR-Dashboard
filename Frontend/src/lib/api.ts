// src/services/api.ts  ✅ fixed for your local + Render

const API =
  import.meta.env.VITE_API_BASE ||
  (window.location.hostname === "localhost"
    ? "http://127.0.0.1:10000"   // ✅ use the port shown in Flask logs
    : "");                       // empty → same origin on Render

// --- Internal fetch wrapper ---
async function get<T>(path: string): Promise<T> {
  const url = `${API}${path}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  const json = await res.json();
  return (json.data ?? json) as T;
}

// --- API Calls ---
export async function fetchOverall(): Promise<OverallResponse> {
  return get<OverallResponse>("/api/overall");
}

export async function fetchOfficer(
  name: string
): Promise<{ snapshot: Snapshot; weekly: WeeklyPoint[]; officers: string[] }>
{
  const q = encodeURIComponent(name);
  return get<{ snapshot: Snapshot; weekly: WeeklyPoint[]; officers: string[] }>(
    `/api/officer?name=${q}`
  );
}

export const exportUrls = {
  csv: `${API}/api/export/overall.csv`,
  excel: `${API}/api/export?format=excel`,
  json: `${API}/api/export?format=json`,
};
