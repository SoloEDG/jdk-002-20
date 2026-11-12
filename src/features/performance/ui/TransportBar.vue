<script setup lang="ts">
import type { Phase } from "../../../shared/session";
defineProps<{ phase: Phase; time: number; duration: number; volume: number }>();
defineEmits<{
  start: [];
  pause: [];
  resume: [];
  restart: [];
  volume: [v: number];
}>();
const fmt = (n: number) =>
  `${Math.floor(n / 60)}:${String(Math.floor(n % 60)).padStart(2, "0")}`;
</script>
<template>
  <div class="transport">
    <div class="progress">
      <i :style="{ width: Math.min(100, (time / duration) * 100) + '%' }"></i>
    </div>
    <div class="transport-row">
      <span class="timecode"
        >{{ fmt(time) }} <em>/ {{ fmt(duration) }}</em></span
      ><button
        v-if="phase === 'playing'"
        class="primary"
        @click="$emit('pause')"
      >
        Ⅱ 暂停演出</button
      ><button
        v-else-if="phase === 'paused'"
        class="primary"
        @click="$emit('resume')"
      >
        ▶ 继续演出</button
      ><button v-else class="primary" @click="$emit('start')">
        ▶ {{ phase === "finished" ? "再次演出" : "开始演出" }}</button
      ><button
        class="icon-button"
        aria-label="重新开始"
        @click="$emit('restart')"
      >
        ↻</button
      ><label class="volume"
        >音量
        <input
          aria-label="音量"
          type="range"
          min="0"
          max="1"
          step=".05"
          :value="volume"
          @input="
            $emit('volume', Number(($event.target as HTMLInputElement).value))
          "
      /></label>
    </div>
  </div>
</template>
