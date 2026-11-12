import type { Grade, Hit } from "../../../shared/session";
export const WINDOWS = { perfect: 0.045, great: 0.09, good: 0.15 };
export function grade(delta: number): Grade {
  const d = Math.abs(delta);
  return d <= WINDOWS.perfect
    ? "PERFECT"
    : d <= WINDOWS.great
      ? "GREAT"
      : d <= WINDOWS.good
        ? "GOOD"
        : "MISS";
}
export const weight: Record<Grade, number> = {
  PERFECT: 1,
  GREAT: 0.75,
  GOOD: 0.4,
  MISS: 0,
};
export function statistics(hits: Hit[], total: number) {
  let combo = 0,
    maxCombo = 0,
    points = 0;
  for (const hit of hits) {
    combo = hit.grade === "MISS" ? 0 : combo + 1;
    maxCombo = Math.max(maxCombo, combo);
    points += weight[hit.grade];
  }
  return {
    combo,
    maxCombo,
    score: Math.round((points / Math.max(1, total)) * 1000000),
    accuracy: hits.length ? (points / hits.length) * 100 : 100,
  };
}
