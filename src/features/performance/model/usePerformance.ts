import { ref, shallowRef } from "vue";
import type { Phase, Run } from "../../../shared/session";
import { secondsAt } from "../../../shared/chart";
import { AudioTransport } from "../lib/audio";
export function usePerformance(
  onTick: (time: number) => void,
  onEnd: () => void,
) {
  const phase = ref<Phase>("ready"),
    time = ref(0),
    run = shallowRef<Run | null>(null),
    volume = ref(0.45);
  const audio = new AudioTransport();
  let frame = 0;
  let generation = 0;
  function tick() {
    if (phase.value !== "playing" || !run.value) return;
    time.value = Math.max(
      secondsAt(run.value.start, run.value.track.bpm),
      audio.time,
    );
    onTick(time.value);
    if (time.value >= secondsAt(run.value.end, run.value.track.bpm) + 0.2) {
      audio.pause();
      phase.value = "finished";
      onEnd();
      return;
    }
    frame = requestAnimationFrame(tick);
  }
  async function start(next: Run) {
    const token = ++generation;
    cancelAnimationFrame(frame);
    audio.stop();
    run.value = next;
    time.value = secondsAt(next.start, next.track.bpm);
    phase.value = "ready";
    await audio.play(next, time.value);
    if (token !== generation) return;
    phase.value = "playing";
    tick();
  }
  function pause() {
    if (phase.value !== "playing") return;
    time.value = audio.pause();
    phase.value = "paused";
    cancelAnimationFrame(frame);
  }
  async function resume() {
    if (phase.value !== "paused" || !run.value) return;
    const token = ++generation;
    await audio.play(run.value, time.value);
    if (token !== generation) return;
    phase.value = "playing";
    tick();
  }
  function reset() {
    generation++;
    audio.stop();
    cancelAnimationFrame(frame);
    phase.value = "ready";
    time.value = 0;
    run.value = null;
  }
  function setVolume(v: number) {
    volume.value = v;
    audio.setVolume(v);
  }
  return { phase, time, run, volume, start, pause, resume, reset, setVolume };
}
