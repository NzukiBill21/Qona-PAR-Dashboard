// src/services/api.ts
const API_BASE = "http://127.0.0.1:8050/api"; // your Flask backend

// Fetch overall portfolio data
export async function fetchOverall() {
  const res = await fetch(`${API_BASE}/overall`);
  if (!res.ok) throw new Error("Failed to fetch overall data");
  return await res.json();
}

// Fetch officer data
export async function fetchOfficer(name: string) {
  const res = await fetch(`${API_BASE}/officer?name=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Failed to fetch data for officer: ${name}`);
  return await res.json();
}

// Export URLs (for PDF, PNG, Excel downloads)
export const exportUrls = {
  pdf: `${API_BASE}/export/pdf`,
  png: `${API_BASE}/export/png`,
  excel: `${API_BASE}/export/excel`,
};
