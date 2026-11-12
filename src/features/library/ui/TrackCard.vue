<script setup lang="ts">
import type { Track } from "../../../shared/chart";
defineProps<{ track: Track; selected: boolean; index: number }>();
defineEmits<{ select: [id: string] }>();
</script>
<template>
  <button
    class="track-card"
    :class="{ selected }"
    :style="{ '--track': track.color }"
    @click="$emit('select', track.id)"
  >
    <span class="cover"
      ><span class="orbit"></span
      ><b>{{ String(index + 1).padStart(2, "0") }}</b></span
    ><span class="track-name"
      ><strong>{{ track.title }}</strong
      ><small>{{ track.artist }}</small
      ><span class="track-tags"
        >{{ track.bpm }} BPM <i>•</i> {{ track.mood.split("/")[1] }}</span
      ></span
    ><span class="level"
      ><small>LEVEL</small
      ><b>{{ String(track.level).padStart(2, "0") }}</b></span
    ><span class="chosen">{{ selected ? "●" : "○" }}</span>
  </button>
</template>
