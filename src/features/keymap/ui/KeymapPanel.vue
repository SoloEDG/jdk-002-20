<script setup lang="ts">
import { computed } from "vue";
import { laneLabels } from "../../../shared/chart";
import type { Lane } from "../../../shared/chart";
import type { KeyMapping } from "../lib/keymap";

const props = defineProps<{
  mapping: KeyMapping;
  draft: KeyMapping | null;
  capturingLane: Lane | null;
  labels: string[];
  displayLabels: string[];
  error: string;
  notice: string;
  locked: boolean;
}>();

defineEmits<{
  begin: [];
  cancel: [];
  save: [];
}>();

const isCapturing = computed(() => props.capturingLane !== null);
const draftComplete = computed(
  () => props.capturingLane === null && props.draft !== null,
);
const rowLabels = computed(() =>
  Array.from({ length: 4 }, (_, i) =>
    isCapturing.value || props.draft
      ? props.displayLabels[i]
      : props.labels[i],
  ),
);
</script>

<template>
  <section class="keymap panel">
    <div class="section-label">
      05 / KEY BINDINGS
      <span v-if="isCapturing">CAPTURING</span>
    </div>
    <div class="keymap-heading">
      <h3>自定义字母键位</h3>
      <p class="muted">方向键固定备用 · 空格保留暂停 · 仅接受四个不同字母键</p>
    </div>

    <div class="keymap-lanes" :class="{ capturing: isCapturing }">
      <div
        v-for="i in 4"
        :key="i"
        class="keymap-row"
        :class="{
          active: capturingLane === (i - 1),
          done: isCapturing && (capturingLane as number) > i - 1,
        }"
      >
        <span class="keymap-arrow">{{ laneLabels[i - 1] }}</span>
        <kbd>{{ rowLabels[i - 1] }}</kbd>
        <small v-if="capturingLane === (i - 1)" class="keymap-prompt"
          >请按下字母键…</small
        >
        <small v-else-if="isCapturing && (capturingLane as number) > i - 1"
          >已采集</small
        >
      </div>
    </div>

    <p v-if="error" class="keymap-error" role="alert">{{ error }}</p>
    <p v-else-if="notice" class="keymap-notice" role="status">{{ notice }}</p>
    <p v-else-if="locked" class="keymap-locked">
      演出或暂停中无法修改键位，结束后再试
    </p>

    <div class="keymap-actions">
      <button
        v-if="!isCapturing && !draft"
        class="keymap-button"
        :disabled="locked"
        @click="$emit('begin')"
      >
        开始采集
      </button>
      <template v-else>
        <button
          class="keymap-button"
          :disabled="locked || !draftComplete"
          @click="$emit('save')"
        >
          确认并保存
        </button>
        <button
          class="keymap-button ghost"
          :disabled="locked"
          @click="$emit('cancel')"
        >
          放弃
        </button>
      </template>
    </div>
  </section>
</template>
