<script setup lang="ts">
import { computed } from "vue";
import type { Result } from "../../../shared/session";
import { bestFor, rank } from "../lib/summary";
const props = defineProps<{
  records: Result[];
  latest: Result | null;
  trackId: string;
  warning: string;
}>();
const best = computed(() => bestFor(props.records, props.trackId));
</script>
<template>
  <section class="records panel">
    <div class="section-label">05 / PERSONAL BEST <span>LOCAL</span></div>
    <div v-if="latest && latest.trackId === trackId" class="result-mini">
      <b>{{ rank(latest.accuracy) }}</b>
      <div>
        <strong>{{ latest.practice ? "练习已完成" : "演出已完成" }}</strong
        ><small
          >{{ latest.title }} · {{ latest.score.toLocaleString() }} 分</small
        >
      </div>
    </div>
    <div v-else-if="best" class="result-mini">
      <b>{{ rank(best.accuracy) }}</b>
      <div>
        <strong>{{ best.score.toLocaleString() }}</strong
        ><small
          >{{ best.accuracy.toFixed(2) }}% / {{ best.maxCombo }} 连击</small
        >
      </div>
    </div>
    <div v-else class="empty-record">
      <span>↗</span>
      <p>你的新纪录，从这里开始<small>完成整首演出后自动保存</small></p>
    </div>
    <details v-if="records.length">
      <summary>最近演出 · {{ records.length }}</summary>
      <div v-for="r in records.slice(0, 5)" :key="r.id" class="history-row">
        <span
          >{{ r.title
          }}<small>{{
            r.practice ? "练习 " + r.speed + "×" : "正式演出"
          }}</small></span
        ><b>{{ r.score.toLocaleString() }}</b>
      </div>
    </details>
    <p v-if="warning" class="warning">{{ warning }}</p>
  </section>
</template>
