import type { Lane } from "../../../shared/chart";

/** 按轨道 0..3 顺序保存的 KeyboardEvent.code 数组（仅字母键） */
export type KeyMapping = [string, string, string, string];

export const DEFAULT_KEY_MAPPING: KeyMapping = [
  "KeyD",
  "KeyF",
  "KeyJ",
  "KeyK",
];

const STORAGE_KEY = "pulse-keymap-v1";
const LETTER_CODE = /^Key[A-Z]$/;

export function isLetterCode(code: string): boolean {
  return LETTER_CODE.test(code);
}

/** KeyboardEvent.code 转展示字符，KeyA -> A */
export function keyLabel(code: string): string {
  return isLetterCode(code) ? code.slice(3) : code;
}

/** 整套校验：必须恰好四个互不相同的字母键 */
export function isValidMapping(codes: unknown): codes is KeyMapping {
  if (!Array.isArray(codes) || codes.length !== 4) return false;
  const seen = new Set<string>();
  for (const code of codes) {
    if (
      typeof code !== "string" ||
      !isLetterCode(code) ||
      seen.has(code)
    )
      return false;
    seen.add(code);
  }
  return true;
}

export function loadKeymap(): KeyMapping {
  const fallback = (): KeyMapping => [...DEFAULT_KEY_MAPPING];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) return fallback();
    const parsed: unknown = JSON.parse(raw);
    return isValidMapping(parsed) ? parsed : fallback();
  } catch {
    return fallback();
  }
}

/** 保存前再次整包校验，失败时调用方保留旧配置 */
export function saveKeymap(mapping: KeyMapping): boolean {
  if (!isValidMapping(mapping)) return false;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mapping));
    return true;
  } catch {
    return false;
  }
}

export function laneName(lane: Lane): string {
  return `第 ${lane + 1} 轨`;
}
