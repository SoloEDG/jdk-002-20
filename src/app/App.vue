<script setup lang="ts">
import { useWorkspace } from "./useWorkspace";
import { LibraryPanel } from "../features/library";
import { StageView, TransportBar } from "../features/performance";
import { JudgmentPanel } from "../features/judgment";
import { PracticePanel } from "../features/practice";
import { RecordsPanel } from "../features/records";
import { secondsAt } from "../shared/chart";
const w = useWorkspace();
const { library: l, practice: p, judgment: j, records: r, performance: s } = w;
</script>
<template>
  <div class="workspace">
    <header>
      <a class="brand" href="./"
        ><span class="brand-icon">Ⅲ</span>PULSE<span class="brand-slash">/</span
        ><small>节奏边界</small></a
      >
      <nav><span class="nav-active">演出空间</span><span>练习与探索</span></nav>
      <div class="header-status">
        <span class="live-dot"></span> AUDIO ENGINE READY
        <span class="avatar">P</span>
      </div>
    </header>
    <div class="page-heading">
      <div>
        <div class="eyebrow">FIND YOUR RHYTHM. FEEL THE PULSE.</div>
        <h1>让节奏，接管此刻<span class="green">↗</span></h1>
      </div>
      <span class="session-badge">SESSION 002 <i></i> 自由演出</span>
    </div>
    <main>
      <div class="left-column">
        <LibraryPanel
          :tracks="l.tracks.value"
          :selected-id="l.selectedId.value"
          :search="l.search.value"
          :locked="w.locked.value"
          @select="w.select"
          @search="l.search.value = $event"
        /><PracticePanel
          :track="l.selected.value"
          :config="p.config.value"
          :locked="w.locked.value"
          @update="w.updatePractice"
        />
      </div>
      <section class="performance panel">
        <div class="section-label">
          02 / ON STAGE
          <span>{{ p.config.value.enabled ? "PRACTICE" : "STANDARD" }}</span>
        </div>
        <div class="now-playing">
          <div>
            <h2>{{ l.selected.value.title }}</h2>
            <p>{{ l.selected.value.artist }}</p>
          </div>
          <span class="bpm"
            ><b>{{ l.selected.value.bpm }}</b> BPM</span
          >
        </div>
        <StageView
          :track="l.selected.value"
          :run="s.run.value"
          :time="s.time.value"
          :phase="s.phase.value"
          :done="j.done.value"
          :held="j.held.value"
          :feedback="j.feedback.value"
          :combo="j.stats.value.combo"
          @down="w.down"
          @up="w.up"
        /><TransportBar
          :phase="s.phase.value"
          :time="s.time.value"
          :duration="secondsAt(l.selected.value.beats, l.selected.value.bpm)"
          :volume="s.volume.value"
          @start="w.start"
          @restart="w.start"
          @pause="w.pause"
          @resume="s.resume"
          @volume="s.setVolume"
        />
        <p v-if="w.error.value" role="alert">{{ w.error.value }}</p>
        <div class="stage-help">
          <span><b>点击</b> 对准判定线</span><span><b>长按</b> 保持至尾端</span
          ><span><b>组合</b> 同时按下</span>
        </div>
      </section>
      <aside>
        <JudgmentPanel
          v-bind="j.stats.value"
          :hits="j.hits.value"
        /><RecordsPanel
          :records="r.records.value"
          :latest="r.latest.value"
          :track-id="l.selectedId.value"
          :warning="r.warning.value"
        />
        <div class="key-guide">
          <span>PLAY GUIDE</span>
          <p>方向键或 D F J K 进行演奏<br />空格暂停 · 切出窗口自动暂停</p>
          <div><kbd>D</kbd><kbd>F</kbd><kbd>J</kbd><kbd>K</kbd></div>
          <small>建议佩戴耳机，享受完整声场</small>
        </div>
      </aside>
    </main>
    <footer>
      <span>PULSE / BUILT FOR THE MOMENT</span
      ><span>纯粹的节拍，专注的你。 <i>●</i> 全部音频本地生成</span
      ><span>VOL. 002 — 2026</span>
    </footer>
  </div>
</template>
