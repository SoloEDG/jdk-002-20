<script setup lang="ts">
import type { Track } from "../../../shared/chart";
import TrackCard from "./TrackCard.vue";
defineProps<{
  tracks: Track[];
  selectedId: string;
  search: string;
  locked: boolean;
}>();
defineEmits<{ select: [id: string]; search: [value: string] }>();
</script>
<template>
  <section class="library panel">
    <div class="section-label">01 / MUSIC LIBRARY <span>03 TRACKS</span></div>
    <h2>寻找你的频率<span class="green">.</span></h2>
    <p class="muted">每一个节拍，都是新的起点。</p>
    <input
      aria-label="搜索曲目"
      class="search"
      placeholder="⌕  搜索曲目或艺术家"
      :value="search"
      @input="$emit('search', ($event.target as HTMLInputElement).value)"
    />
    <div class="track-list" :class="{ locked }">
      <TrackCard
        v-for="(t, i) in tracks"
        :key="t.id"
        :track="t"
        :index="i"
        :selected="t.id === selectedId"
        @select="!locked && $emit('select', $event)"
      />
      <p v-if="!tracks.length" class="muted">没有匹配曲目</p>
    </div>
    <div class="library-foot">
      <span class="live-dot"></span> ORIGINAL AUDIO / 本地合成原声
    </div>
  </section>
</template>
