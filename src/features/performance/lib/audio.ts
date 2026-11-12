import type { Run } from "../../../shared/session";
import { secondsAt } from "../../../shared/chart";
export class AudioTransport {
  private epoch = 0;
  private context: AudioContext | null = null;
  private sources: AudioScheduledSourceNode[] = [];
  private anchor = 0;
  private offset = 0;
  private speed = 1;
  private active = false;
  private gain: GainNode | null = null;
  volume = 0.45;
  get time() {
    return (
      this.offset +
      (this.active && this.context
        ? (this.context.currentTime - this.anchor) * this.speed
        : 0)
    );
  }
  async play(run: Run, at: number) {
    this.stop();
    const token = this.epoch;
    this.context ??= new AudioContext();
    await this.context.resume();
    if (token !== this.epoch) return;
    const ctx = this.context;
    this.offset = at;
    this.speed = run.speed;
    this.anchor = ctx.currentTime + 0.04;
    this.active = true;
    this.gain = ctx.createGain();
    this.gain.gain.value = this.volume;
    this.gain.connect(ctx.destination);
    const end = secondsAt(run.end, run.track.bpm);
    for (let beat = 0; beat < run.end; beat += 0.5) {
      const time = secondsAt(beat, run.track.bpm);
      if (time < at || time >= end) continue;
      const when = this.anchor + (time - at) / this.speed;
      const strong = beat % 1 === 0;
      const osc = ctx.createOscillator(),
        env = ctx.createGain();
      osc.type = strong ? "triangle" : "sine";
      const freq = strong ? run.track.melody[Math.floor(beat) % 8]! : 70;
      osc.frequency.setValueAtTime(freq, when);
      if (!strong)
        osc.frequency.exponentialRampToValueAtTime(35, when + 0.12 / run.speed);
      env.gain.setValueAtTime(0.0001, when);
      env.gain.exponentialRampToValueAtTime(strong ? 0.22 : 0.5, when + 0.008);
      env.gain.exponentialRampToValueAtTime(
        0.0001,
        when + (strong ? 0.25 : 0.12) / run.speed,
      );
      osc.connect(env);
      env.connect(this.gain);
      osc.start(when);
      osc.stop(when + 0.35 / run.speed);
      this.sources.push(osc);
    }
  }
  pause() {
    const at = this.time;
    this.stop();
    this.offset = at;
    return at;
  }
  stop() {
    this.epoch++;
    this.active = false;
    for (const s of this.sources) {
      try {
        s.stop();
      } catch {}
      s.disconnect();
    }
    this.sources = [];
    this.gain?.disconnect();
    this.gain = null;
  }
  setVolume(value: number) {
    this.volume = value;
    if (this.gain)
      this.gain.gain.setTargetAtTime(value, this.context!.currentTime, 0.03);
  }
}
