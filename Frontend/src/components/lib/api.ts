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

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API}${path}`);
  if (!res.ok) throw new Error(`API ${res.status}: ${path}`);
  const json = await res.json();
  return json.data as T;
}

export async function fetchOverall(): Promise<OverallResponse> {
  return get<OverallResponse>("/api/overall");
}

export async function fetchOfficer(name: string): Promise<{ name: string; weekly: WeeklyPoint[] }> {
  const q = encodeURIComponent(name);
  return get<{ name: string; weekly: WeeklyPoint[] }>(`/api/officer?name=${q}`);
}

export const exportUrls = {
  csv: `${API}/api/export/overall.csv`,
  excel: `${API}/api/export?format=excel`,
  json: `${API}/api/export?format=json`,
};
