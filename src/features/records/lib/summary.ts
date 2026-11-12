import type { Result, Run, Hit } from "../../../shared/session";
export function makeResult(
  run: Run,
  hits: Hit[],
  stats: { score: number; accuracy: number; maxCombo: number },
): Result {
  return {
    id: run.id,
    trackId: run.track.id,
    title: run.track.title,
    at: Date.now(),
    ...stats,
    hits: [...hits],
    practice: run.practice,
    speed: run.speed,
  };
}
export function rank(accuracy: number) {
  return accuracy >= 98
    ? "S"
    : accuracy >= 90
      ? "A"
      : accuracy >= 75
        ? "B"
        : "C";
}
export function bestFor(records: Result[], trackId: string) {
  return records
    .filter((r) => r.trackId === trackId && !r.practice)
    .sort((a, b) => b.score - a.score)[0];
}
