import type { Lane } from "../../../shared/chart";
import type { KeyMapping } from "../../keymap/lib/keymap";

// 方向键始终作为固定备用输入，不参与自定义
const arrowLanes: Record<string, Lane> = {
  ArrowLeft: 0,
  ArrowDown: 1,
  ArrowUp: 2,
  ArrowRight: 3,
};

export interface InputOptions {
  /** 读取当前已确认的字母键映射 */
  getMapping: () => KeyMapping;
  /** 采集态按键回调，返回 true 表示该按键已被采集消费 */
  capture?: (code: string) => boolean;
  down: (lane: Lane) => void;
  up: (lane: Lane) => void;
  pause: () => void;
}

function laneFor(code: string, mapping: KeyMapping): Lane | undefined {
  if (arrowLanes[code] !== undefined) return arrowLanes[code];
  const index = mapping.indexOf(code);
  return index === -1 ? undefined : (index as Lane);
}

export function bindInput(options: InputOptions) {
  const { getMapping, capture, down, up, pause } = options;
  // 记录仍处于按下状态的按键，供重开时清除
  const pressed = new Set<string>();

  const onDown = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.closest("input,select,textarea")) return;
    if (e.code === "Space") {
      e.preventDefault();
      if (!e.repeat) pause();
      return;
    }
    // 采集态优先消费按键，避免采集时误触演奏
    if (capture?.(e.code)) {
      e.preventDefault();
      return;
    }
    const lane = laneFor(e.code, getMapping());
    if (lane !== undefined) {
      e.preventDefault();
      if (!e.repeat) {
        pressed.add(e.code);
        down(lane);
      }
    }
  };

  const onUp = (e: KeyboardEvent) => {
    if (capture?.(e.code)) return;
    const lane = laneFor(e.code, getMapping());
    if (lane !== undefined) {
      pressed.delete(e.code);
      up(lane);
    }
  };

  window.addEventListener("keydown", onDown);
  window.addEventListener("keyup", onUp);

  return {
    unbind() {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    },
    /** 重开 / 重新开始时清除遗留的按下状态 */
    reset() {
      pressed.clear();
    },
  };
}
