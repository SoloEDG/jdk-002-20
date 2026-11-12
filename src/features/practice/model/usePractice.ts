import { ref } from "vue";
import type { PracticeConfig } from "../../../shared/session";
import { normalize } from "../lib/range";
export function usePractice() {
  const config = ref<PracticeConfig>({
    enabled: false,
    speed: 0.75,
    start: 0,
    end: 64,
  });
  function update(patch: Partial<PracticeConfig>, beats: number) {
    config.value = normalize({ ...config.value, ...patch }, beats);
  }
  function reset(beats: number) {
    config.value = { ...config.value, start: 0, end: beats };
  }
  return { config, update, reset };
}
