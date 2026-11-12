<script setup lang="ts">
import type { Track } from "../../../shared/chart";
import type { PracticeConfig } from "../../../shared/session";
import { rangeLabel } from "../lib/range";
import BeatTimeline from "./BeatTimeline.vue";
defineProps<{ track: Track; config: PracticeConfig; locked: boolean }>();
defineEmits<{ update: [patch: Partial<PracticeConfig>] }>();
</script>
<template>
  <section class="practice panel">
    <div class="section-label">
      04 / PRACTICE LAB
      <label class="toggle"
        ><input
          aria-label="练习模式"
          type="checkbox"
          :disabled="locked"
          :checked="config.enabled"
          @change="
            $emit('update', {
              enabled: ($event.target as HTMLInputElement).checked,
            })
          " /><span></span
      ></label>
    </div>
    <div class="practice-heading">
      <h3>把难点，变成肌肉记忆</h3>
      <p class="muted">独立练习成绩不计入最佳纪录</p>
    </div>
    <div class="speed-row">
      <span>播放速度</span><b>{{ config.speed.toFixed(2) }}×</b>
    </div>
    <div class="speed-buttons">
      <button
        v-for="v in [0.5, 0.75, 1, 1.25]"
        :key="v"
        :disabled="locked || !config.enabled"
        :class="{ active: config.speed === v }"
        @click="$emit('update', { speed: v })"
      >
        {{ v }}×
      </button>
    </div>
    <BeatTimeline :track="track" :start="config.start" :end="config.end" />
    <div class="range-heading">
      <span>练习片段</span><b>{{ rangeLabel(config.start, config.end) }}</b>
    </div>
    <div class="range-inputs">
      <label
        >起始拍<input
          aria-label="起始拍"
          type="number"
          min="0"
          :max="track.beats - 4"
          step="4"
          :disabled="locked || !config.enabled"
          :value="config.start"
          @change="
            $emit('update', {
              start: Number(($event.target as HTMLInputElement).value),
            })
          " /></label
      ><span>→</span
      ><label
        >结束拍<input
          aria-label="结束拍"
          type="number"
          min="4"
          :max="track.beats"
          step="4"
          :disabled="locked || !config.enabled"
          :value="config.end"
          @change="
            $emit('update', {
              end: Number(($event.target as HTMLInputElement).value),
            })
          "
      /></label>
    </div>
  </section>
</template>
