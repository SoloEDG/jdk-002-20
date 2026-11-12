import type { PracticeConfig } from "../../../shared/session";
export function normalize(
  config: PracticeConfig,
  beats: number,
): PracticeConfig {
  const start = Math.max(
    0,
    Math.min(beats - 4, Math.round(config.start / 4) * 4),
  );
  return {
    enabled: config.enabled,
    speed: Math.max(0.5, Math.min(1.25, config.speed)),
    start,
    end: Math.max(start + 4, Math.min(beats, Math.round(config.end / 4) * 4)),
  };
}
export function rangeLabel(start: number, end: number) {
  return `${Math.floor(start / 4) + 1} — ${Math.ceil(end / 4)} 小节`;
}
