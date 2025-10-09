export type Snapshot = {
  week: string;
  totalOutstanding: number;
  totalGrossProvision: number;
  overallPAR: number;
};

export type WeeklyPoint = {
  week: string;
  outstanding: number;
  provision: number;
  par: number;
};

export type OverallResponse = {
  snapshot: Snapshot;
  weekly: WeeklyPoint[];
  officers: string[];
};

const API = import.meta.env.VITE_API_BASE as string; 
// Example: "http://127.0.0.1:8050" (NO trailing /api here)

// --- Internal fetch wrapper ---
async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    headers: { "Accept": "application/json" },
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  const json = await res.json();

  // Handle both {data: ...} and raw object returns
  return (json.data ?? json) as T;
}

// --- API Calls ---
export async function fetchOverall(): Promise<OverallResponse> {
  return get<OverallResponse>("/api/overall");
}

export async function fetchOfficer(name: string): Promise<{ snapshot: Snapshot; weekly: WeeklyPoint[]; officers: string[] }> {
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
