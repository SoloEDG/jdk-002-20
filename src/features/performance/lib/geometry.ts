import type { Note } from "../../../shared/chart";
import { secondsAt } from "../../../shared/chart";
export function noteY(note: Note, time: number, bpm: number) {
  return 390 - (secondsAt(note.beat, bpm) - time) * 190;
}
export function tailHeight(note: Note, bpm: number) {
  return secondsAt(note.duration, bpm) * 190;
}
export function visibleNotes(
  notes: Note[],
  time: number,
  bpm: number,
  done: Set<string>,
) {
  return notes.filter(
    (n) =>
      !done.has(n.id) &&
      noteY(n, time, bpm) > -180 &&
      noteY(n, time, bpm) < 460,
  );
}
