import { computed, onMounted, onUnmounted, ref } from "vue";
import { useLibrary } from "../features/library";
import { usePerformance } from "../features/performance";
import { useJudgment, bindInput } from "../features/judgment";
import { usePractice } from "../features/practice";
import { useRecords, makeResult } from "../features/records";
import { useKeymap } from "../features/keymap";
import { makeRun } from "../shared/session";
import type { PracticeConfig } from "../shared/session";
import type { Lane } from "../shared/chart";

export function useWorkspace() {
  const library = useLibrary(),
    practice = usePractice(),
    judgment = useJudgment(),
    records = useRecords(),
    keymap = useKeymap(),
    error = ref("");
  const performance = usePerformance(
    (t) => judgment.tick(t),
    () => {
      if (performance.run.value)
        records.commit(
          makeResult(
            performance.run.value,
            judgment.hits.value,
            judgment.stats.value,
          ),
        );
    },
  );
  const locked = computed(
    () =>
      performance.phase.value === "playing" ||
      performance.phase.value === "paused",
  );

  // 暂停 / 演出中禁止开始采集与提交，保证映射只能在非锁定状态变更
  function beginCapture() {
    if (locked.value) return;
    keymap.beginCapture();
  }
  function commitKeymap() {
    if (locked.value) return;
    keymap.commit();
  }
  function cancelCapture() {
    keymap.cancelCapture();
  }

  const input = bindInput({
    getMapping: () => keymap.mapping.value,
    capture: (code) =>
      keymap.capturingLane.value !== null && keymap.captureKey(code),
    down,
    up,
    pause: toggle,
  });

  async function start() {
    // 重开 / 重新开始：清除遗留按下状态与未完成的采集
    input.reset();
    keymap.reset();
    const run = makeRun(library.selected.value, practice.config.value);
    judgment.reset(run);
    error.value = "";
    try {
      await performance.start(run);
    } catch {
      error.value = "音频未能启动，请再次点击开始";
      performance.reset();
    }
  }
  function select(id: string) {
    if (locked.value) return;
    library.select(id);
    practice.reset(library.selected.value.beats);
    performance.reset();
    judgment.reset(makeRun(library.selected.value, practice.config.value));
  }
  function down(lane: Lane) {
    if (performance.phase.value === "playing")
      judgment.down(lane, performance.time.value);
  }
  function up(lane: Lane) {
    if (performance.phase.value === "playing")
      judgment.up(lane, performance.time.value);
  }
  function pause() {
    performance.pause();
    judgment.clearHeld();
  }
  function toggle() {
    if (performance.phase.value === "playing") pause();
    else if (performance.phase.value === "paused") void performance.resume();
  }
  function updatePractice(patch: Partial<PracticeConfig>) {
    if (!locked.value) practice.update(patch, library.selected.value.beats);
  }

  const blur = () => {
    if (performance.phase.value === "playing") pause();
  };
  onMounted(() => {
    window.addEventListener("blur", blur);
  });
  onUnmounted(() => {
    input.unbind();
    window.removeEventListener("blur", blur);
    performance.reset();
  });
  return {
    library,
    practice,
    judgment,
    records,
    performance,
    keymap,
    locked,
    error,
    start,
    select,
    down,
    up,
    pause,
    updatePractice,
    beginCapture,
    commitKeymap,
    cancelCapture,
  };
}
