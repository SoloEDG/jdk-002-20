export type Lane = 0 | 1 | 2 | 3;
export type Note = {
  id: string;
  beat: number;
  lanes: Lane[];
  duration: number;
};
export type Track = {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  level: number;
  color: string;
  mood: string;
  notes: Note[];
  beats: number;
  melody: number[];
};
export const secondsAt = (beat: number, bpm: number) => (beat * 60) / bpm;
export const laneLabels = ["←", "↓", "↑", "→"];
export const laneKeys = ["ArrowLeft", "ArrowDown", "ArrowUp", "ArrowRight"];
