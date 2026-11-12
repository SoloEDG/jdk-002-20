import type { Lane, Note, Track } from "../../../shared/chart";
function chart(id: string, density: number): Note[] {
  const notes: Note[] = [];
  for (let beat = 4; beat < 60; beat += density) {
    const i = notes.length;
    const lane = ((i * 3 + Math.floor(beat / 8)) % 4) as Lane;
    notes.push({
      id: `${id}-${i}`,
      beat,
      lanes: i % 9 === 8 ? [lane, ((lane + 2) % 4) as Lane] : [lane],
      duration: i % 7 === 5 ? Math.min(density * 0.75, 1.5) : 0,
    });
  }
  return notes;
}
export const catalog: Track[] = [
  {
    id: "neon",
    title: "Neon Reverie",
    artist: "PULSE SOUND LAB",
    bpm: 112,
    level: 3,
    color: "#bcf366",
    mood: "夜色漫游 / SYNTH POP",
    beats: 64,
    melody: [220, 261.63, 329.63, 392, 440, 392, 329.63, 261.63],
    notes: chart("neon", 2),
  },
  {
    id: "tide",
    title: "Electric Tide",
    artist: "MIRA / ORIGINAL MIX",
    bpm: 128,
    level: 5,
    color: "#a999ff",
    mood: "电流浪潮 / FUTURE BASS",
    beats: 64,
    melody: [164.81, 246.94, 329.63, 369.99, 493.88, 369.99, 329.63, 246.94],
    notes: chart("tide", 1),
  },
  {
    id: "orbit",
    title: "Orbital Rush",
    artist: "KAI / NIGHT SESSION",
    bpm: 150,
    level: 8,
    color: "#ff9776",
    mood: "轨道加速 / DRUM & BASS",
    beats: 64,
    melody: [196, 293.66, 349.23, 440, 523.25, 440, 349.23, 293.66],
    notes: chart("orbit", 0.5),
  },
];
