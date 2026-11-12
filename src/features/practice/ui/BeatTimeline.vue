<script setup lang="ts">
import type { Track } from "../../../shared/chart";
defineProps<{ track: Track; start: number; end: number }>();
</script>
<template>
  <div class="beat-timeline" aria-label="谱面密度预览">
    <span
      v-for="bar in 16"
      :key="bar"
      :class="{ outside: (bar - 1) * 4 < start || (bar - 1) * 4 >= end }"
      :style="{
        height:
          12 +
          track.notes.filter((n) => n.beat >= (bar - 1) * 4 && n.beat < bar * 4)
            .length *
            4 +
          'px',
      }"
    ></span>
  </div>
</template>
