import { computed, ref } from "vue";
import type { Lane } from "../../../shared/chart";
import {
  DEFAULT_KEY_MAPPING,
  type KeyMapping,
  isLetterCode,
  isValidMapping,
  keyLabel,
  laneName,
  loadKeymap,
  saveKeymap,
} from "../lib/keymap";

/**
 * 可保存的四轨字母键映射。
 * 采集期间只改草稿，提交时整包校验通过才整体替换，
 * 避免设置到一半出现两个轨道抢同一按键。
 */
export function useKeymap() {
  // 已确认、正式演出与练习共用的唯一映射
  const mapping = ref<KeyMapping>(loadKeymap());
  // 正在逐轨采集的轨道；为 null 表示未在采集
  const capturingLane = ref<Lane | null>(null);
  // 尚未提交的草稿，采集期间不影响生效中的 mapping
  const draft = ref<KeyMapping | null>(null);
  const error = ref("");
  const notice = ref("");

  const labels = computed(() => mapping.value.map(keyLabel));
  const displayLabels = computed(() =>
    (draft.value ?? mapping.value).map(keyLabel),
  );

  function beginCapture() {
    // 以当前已确认映射为草稿起点
    draft.value = [...mapping.value];
    capturingLane.value = 0;
    error.value = "";
    notice.value = "";
  }

  function cancelCapture() {
    capturingLane.value = null;
    draft.value = null;
    error.value = "";
  }

  /** 由全局按键监听转发：仅在采集态消费按键 */
  function captureKey(code: string): boolean {
    const lane = capturingLane.value;
    if (lane === null || !draft.value) return false;

    if (!isLetterCode(code)) {
      error.value = "只接受字母键，方向键固定保留，请改按字母键";
      return true;
    }
    // 同键占用其他轨道：记录冲突，但不替换任何已生效配置
    const takenBy = draft.value.findIndex((c, i) => c === code && i !== lane);
    if (takenBy !== -1) {
      error.value = `${keyLabel(code)} 已分配给${laneName(
        takenBy as Lane,
      )}，请换一个不同的字母键`;
      return true;
    }

    draft.value[lane] = code;
    error.value = "";
    const next = (lane + 1) as Lane;
    if (next <= 3) {
      capturingLane.value = next;
    } else {
      capturingLane.value = null;
    }
    return true;
  }

  /** 提交：整包校验通过才替换并持久化，冲突时保留旧配置 */
  function commit(): boolean {
    if (!draft.value) return false;
    const candidate = [...draft.value] as KeyMapping;
    if (!isValidMapping(candidate)) {
      error.value = "四个轨道必须是互不相同的字母键，已保留原键位";
      return false;
    }
    if (!saveKeymap(candidate)) {
      error.value = "键位无法保存到本地，已保留原键位";
      return false;
    }
    mapping.value = candidate;
    draft.value = null;
    capturingLane.value = null;
    error.value = "";
    notice.value = "新键位已保存，演出与练习同时生效";
    return true;
  }

  /** 重开 / 重新开始时调用，清掉未完成的采集与提示 */
  function reset() {
    capturingLane.value = null;
    draft.value = null;
    error.value = "";
  }

  return {
    mapping,
    draft,
    capturingLane,
    error,
    notice,
    labels,
    displayLabels,
    defaultLabels: DEFAULT_KEY_MAPPING.map(keyLabel),
    beginCapture,
    cancelCapture,
    captureKey,
    commit,
    reset,
  };
}
