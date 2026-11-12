import type { Lane } from "../../../shared/chart";
const keys: Record<string, Lane> = {
  ArrowLeft: 0,
  ArrowDown: 1,
  ArrowUp: 2,
  ArrowRight: 3,
  KeyD: 0,
  KeyF: 1,
  KeyJ: 2,
  KeyK: 3,
};
export function bindInput(
  down: (lane: Lane) => void,
  up: (lane: Lane) => void,
  pause: () => void,
) {
  const onDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.closest("input,select,textarea"))
      return;
    if (e.code === "Space") {
      e.preventDefault();
      if (!e.repeat) pause();
      return;
    }
    const lane = keys[e.code];
    if (lane !== undefined) {
      e.preventDefault();
      if (!e.repeat) down(lane);
    }
  };
  const onUp = (e: KeyboardEvent) => {
    const lane = keys[e.code];
    if (lane !== undefined) up(lane);
  };
  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);
  return () => {
    window.removeEventListener("keydown", onDown);
    window.removeEventListener("keyup", onUp);
  };
}
