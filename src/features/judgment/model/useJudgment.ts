import { computed, ref } from "vue";
import type { Lane, Note } from "../../../shared/chart";
import { secondsAt } from "../../../shared/chart";
import type { Hit, Run } from "../../../shared/session";
import { grade, statistics, WINDOWS } from "../lib/rules";
export function useJudgment() {
  const hits = ref<Hit[]>([]),
    held = ref(new Set<Lane>()),
    feedback = ref(""),
    total = ref(0);
  let run: Run | null = null;
  const holding = new Map<string, { note: Note; delta: number }>();
  const pending = new Map<string, { at: number; lanes: Set<Lane> }>();
  const done = computed(() => new Set(hits.value.map((h) => h.noteId)));
  const stats = computed(() => statistics(hits.value, total.value));
  function finish(n: Note, delta: number, miss = false) {
    if (done.value.has(n.id)) return;
    const g = miss ? "MISS" : grade(delta);
    hits.value.push({ noteId: n.id, grade: g, delta, beat: n.beat });
    feedback.value = g;
    holding.delete(n.id);
    pending.delete(n.id);
  }
  function reset(next: Run) {
    run = next;
    hits.value = [];
    held.value = new Set();
    holding.clear();
    pending.clear();
    feedback.value = "";
    total.value = next.notes.length;
  }
  function down(lane: Lane, time: number) {
    if (!run || held.value.has(lane)) return;
    held.value.add(lane);
    const n = run.notes.find(
      (n) =>
        n.lanes.includes(lane) &&
        !done.value.has(n.id) &&
        !holding.has(n.id) &&
        Math.abs(secondsAt(n.beat, run!.track.bpm) - time) <= WINDOWS.good,
    );
    if (!n) return;
    const delta = time - secondsAt(n.beat, run.track.bpm);
    if (n.lanes.length > 1) {
      const group = pending.get(n.id) ?? { at: time, lanes: new Set<Lane>() };
      group.lanes.add(lane);
      pending.set(n.id, group);
      if (group.lanes.size < n.lanes.length) return;
    }
    if (n.duration > 0) holding.set(n.id, { note: n, delta });
    else finish(n, delta);
  }
  function up(lane: Lane, time: number) {
    held.value.delete(lane);
    if (!run) return;
    for (const h of holding.values()) {
      if (h.note.lanes.includes(lane)) {
        const end = secondsAt(h.note.beat + h.note.duration, run.track.bpm);
        finish(h.note, h.delta, time < end - 0.12);
      }
    }
  }
  function tick(time: number) {
    if (!run) return;
    for (const n of run.notes) {
      if (done.value.has(n.id)) continue;
      const h = holding.get(n.id);
      if (h) {
        if (time >= secondsAt(n.beat + n.duration, run.track.bpm))
          finish(n, h.delta);
      } else if (time > secondsAt(n.beat, run.track.bpm) + WINDOWS.good)
        finish(n, time - secondsAt(n.beat, run.track.bpm), true);
    }
  }
  function clearHeld() {
    held.value.clear();
  }
  return {
    hits,
    held,
    feedback,
    done,
    stats,
    reset,
    down,
    up,
    tick,
    clearHeld,
  };
}
