<script setup lang="ts">
import type { Hit } from "../../../shared/session";
defineProps<{
  score: number;
  accuracy: number;
  combo: number;
  maxCombo: number;
  hits: Hit[];
}>();
</script>
<template>
  <section class="score-panel panel">
    <div class="section-label">
      03 / LIVE SCORE <span class="green">● LIVE</span>
    </div>
    <div class="big-score">{{ String(score).padStart(7, "0") }}</div>
    <div class="score-stats">
      <div>
        <small>ACCURACY</small><b>{{ accuracy.toFixed(2) }}<em>%</em></b>
      </div>
      <div>
        <small>MAX COMBO</small><b>{{ maxCombo }}<em>×</em></b>
      </div>
    </div>
    <div class="combo-current">
      <span>当前连击</span><b>{{ combo }} <small>COMBO</small></b>
    </div>
    <div class="grade-list">
      <div
        v-for="g in ['PERFECT', 'GREAT', 'GOOD', 'MISS']"
        :key="g"
        :class="g.toLowerCase()"
      >
        <i></i><span>{{ g }}</span
        ><b>{{ hits.filter((h) => h.grade === g).length }}</b>
      </div>
    </div>
  </section>
</template>
