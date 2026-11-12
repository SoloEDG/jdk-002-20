import type { Result } from "../../../shared/session";
const KEY = "pulse-records-v1";
export function loadRecords(): Result[] {
  try {
    const list: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    if (!Array.isArray(list)) return [];
    return list
      .filter(
        (r): r is Result =>
          r &&
          typeof r.id === "string" &&
          typeof r.score === "number" &&
          Array.isArray(r.hits),
      )
      .slice(0, 30);
  } catch {
    return [];
  }
}
export function saveRecords(records: Result[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(records.slice(0, 30)));
    return true;
  } catch {
    return false;
  }
}
