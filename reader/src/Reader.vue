<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, nextTick } from 'vue'
import { Converter } from 'opencc-js'
import type { Section } from './jingang'

const props = defineProps<{
  sutra: { id: string; title: string; preface?: string; sections: Section[] }
}>()

const SIZES = ['s', 'm', 'l', 'xl', 'xxl'] as const
type Size = (typeof SIZES)[number]
const SIZE_LABEL: Record<Size, string> = { s: '小', m: '中', l: '大', xl: '特大', xxl: '超大' }
const SIZE_PX: Record<Size, number> = { s: 17, m: 19, l: 22, xl: 26, xxl: 30 }

type Script = 't' | 's'
const SCRIPT_LABEL: Record<Script, string> = { t: '繁', s: '簡' }

const THEMES = ['day', 'night'] as const
type Theme = (typeof THEMES)[number]
const THEME_LABEL: Record<Theme, string> = { day: '日間', night: '夜間' }

const STORAGE_KEY = `reader.state.${props.sutra.id}`
interface Saved { size: Size; anchor?: string; script?: Script; theme?: Theme }

function loadSaved(): Saved {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { size: 'm' }
}

const saved = loadSaved()
const size = ref<Size>(saved.size)
const script = ref<Script>(saved.script ?? 't')
const theme = ref<Theme>(saved.theme ?? 'day')
const pendingAnchor = ref<string | undefined>(saved.anchor)

const toSimplified = Converter({ from: 'tw', to: 'cn' })
const conv = (text: string) => (script.value === 's' ? toSimplified(text) : text)
const cTitle = computed(() => conv(props.sutra.title))
const cPreface = computed(() => props.sutra.preface ? conv(props.sutra.preface) : '')
const cSections = computed(() => props.sutra.sections.map((s) => ({
  id: s.id,
  title: conv(s.title),
  lines: s.body.split('\n').map(conv),
})))

const viewer = ref<HTMLElement | null>(null)
const track = ref<HTMLElement | null>(null)
const totalPages = ref(1)
const currentPage = ref(0)
const pageWidth = ref(0)
const showChrome = ref(true)
const showToc = ref(false)
const showSettings = ref(false)
const animating = ref(true)

const fontPx = computed(() => SIZE_PX[size.value])
const trackTransform = computed(() => `translateX(${-currentPage.value * pageWidth.value}px)`)

function persist() {
  const sectionId = currentSectionId()
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      size: size.value,
      anchor: sectionId,
      script: script.value,
      theme: theme.value,
    }))
  } catch {}
}

function setScript(s: Script) {
  const anchor = currentSectionId()
  script.value = s
  nextTick(() => {
    measure()
    if (anchor) jumpToAnchor(anchor)
    persist()
  })
}

function setTheme(t: Theme) {
  theme.value = t
  persist()
}

function currentSectionId(): string | undefined {
  const t = track.value
  if (!t || !pageWidth.value) return undefined
  const pageStart = currentPage.value * pageWidth.value
  const pageEnd = pageStart + pageWidth.value
  const sectionEls = t.querySelectorAll<HTMLElement>('[data-section]')
  let lastBefore: string | undefined
  for (const el of Array.from(sectionEls)) {
    const left = el.offsetLeft
    if (left >= pageStart && left < pageEnd) return el.dataset.section
    if (left < pageStart) lastBefore = el.dataset.section
  }
  return lastBefore
}

function measure() {
  const v = viewer.value
  const t = track.value
  if (!v || !t) return
  pageWidth.value = v.clientWidth
  totalPages.value = Math.max(1, Math.round(t.scrollWidth / v.clientWidth))
  currentPage.value = Math.min(currentPage.value, totalPages.value - 1)
}

function goToPage(n: number) {
  const clamped = Math.max(0, Math.min(totalPages.value - 1, n))
  if (clamped === currentPage.value) return
  animating.value = true
  currentPage.value = clamped
  persist()
}

function nextPage() { goToPage(currentPage.value + 1) }
function prevPage() { goToPage(currentPage.value - 1) }

function jumpToAnchor(id: string) {
  const t = track.value
  if (!t || !pageWidth.value) return
  const el = t.querySelector<HTMLElement>(`[data-section="${id}"]`)
  if (!el) return
  const page = Math.floor(el.offsetLeft / pageWidth.value)
  animating.value = false
  currentPage.value = Math.max(0, Math.min(totalPages.value - 1, page))
  requestAnimationFrame(() => { animating.value = true })
}

function onResize() {
  const anchor = currentSectionId()
  nextTick(() => {
    measure()
    if (anchor) jumpToAnchor(anchor)
  })
}

let touchStartX = 0
let touchStartY = 0
let touchStartT = 0
function onTouchStart(e: TouchEvent) {
  const t = e.changedTouches[0]
  touchStartX = t.clientX; touchStartY = t.clientY; touchStartT = Date.now()
}
function onTouchEnd(e: TouchEvent) {
  const t = e.changedTouches[0]
  const dx = t.clientX - touchStartX
  const dy = t.clientY - touchStartY
  const dt = Date.now() - touchStartT
  if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) && dt < 600) {
    if (dx < 0) nextPage(); else prevPage()
    return
  }
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
    const x = t.clientX
    const w = window.innerWidth
    if (x < w / 3) prevPage()
    else if (x > (w * 2) / 3) nextPage()
    else {
      showChrome.value = !showChrome.value
      if (!showChrome.value) showSettings.value = false
    }
  }
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') { e.preventDefault(); nextPage() }
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); prevPage() }
  else if (e.key === 'Escape') showChrome.value = true
}

function setSize(s: Size) {
  const anchor = currentSectionId()
  size.value = s
  nextTick(() => {
    measure()
    if (anchor) jumpToAnchor(anchor)
    persist()
  })
}

watch(size, persist)
watch(theme, persist)

onMounted(() => {
  measure()
  if (pendingAnchor.value) jumpToAnchor(pendingAnchor.value)
  window.addEventListener('resize', onResize)
  window.addEventListener('keydown', onKey)
  setTimeout(() => { showChrome.value = false }, 1800)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <div :class="['reader', 'reader--' + theme]" :style="{ '--font-size': fontPx + 'px' }">
    <div
      ref="viewer"
      class="reader__viewer"
      @touchstart.passive="onTouchStart"
      @touchend.passive="onTouchEnd"
    >
      <div
        ref="track"
        class="reader__track"
        :class="{ 'is-animating': animating }"
        :style="{ transform: trackTransform }"
      >
        <div class="reader__content">
          <h1 class="reader__title" data-section="__title">{{ cTitle }}</h1>
          <p v-if="cPreface" class="reader__preface">{{ cPreface }}</p>
          <section v-for="s in cSections" :key="s.id" :data-section="s.id">
            <h2 class="reader__h2">{{ s.title }}</h2>
            <p v-for="(line, i) in s.lines" :key="i" class="reader__p">{{ line }}</p>
          </section>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showChrome" class="reader__topbar">
        <button class="icon-btn" @click="showToc = true" aria-label="目錄">☰</button>
        <span class="reader__topbar-title">{{ cTitle }}</span>
        <button class="icon-btn reader__aa" @click="showSettings = !showSettings" aria-label="設定">Aa</button>
      </div>
    </transition>

    <transition name="slide-up">
      <div v-if="showSettings && showChrome" class="reader__sheet">
        <div class="reader__sheet-row">
          <span class="reader__sheet-label">{{ conv('字體大小') }}</span>
          <div class="reader__group">
            <button
              v-for="s in SIZES"
              :key="s"
              :class="['size-btn', { 'is-active': size === s }]"
              @click="setSize(s)"
            >{{ conv(SIZE_LABEL[s]) }}</button>
          </div>
        </div>
        <div class="reader__sheet-row">
          <span class="reader__sheet-label">{{ conv('字體') }}</span>
          <div class="reader__group">
            <button
              v-for="s in (['t','s'] as Script[])"
              :key="s"
              :class="['size-btn', { 'is-active': script === s }]"
              @click="setScript(s)"
            >{{ SCRIPT_LABEL[s] }}</button>
          </div>
        </div>
        <div class="reader__sheet-row">
          <span class="reader__sheet-label">{{ conv('模式') }}</span>
          <div class="reader__group">
            <button
              v-for="t in THEMES"
              :key="t"
              :class="['size-btn', { 'is-active': theme === t }]"
              @click="setTheme(t)"
            >{{ conv(THEME_LABEL[t]) }}</button>
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showChrome" class="reader__bottombar">
        <button class="icon-btn" @click="prevPage" aria-label="上一頁">‹</button>
        <span class="reader__page">{{ currentPage + 1 }} / {{ totalPages }}</span>
        <button class="icon-btn" @click="nextPage" aria-label="下一頁">›</button>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="showToc" class="reader__toc" @click.self="showToc = false">
        <div class="reader__toc-panel">
          <h3>{{ conv('目錄') }}</h3>
          <ul>
            <li v-for="s in cSections" :key="s.id">
              <button @click="jumpToAnchor(s.id); showToc = false">{{ s.title }}</button>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
.reader {
  position: fixed;
  inset: 0;
  background: var(--bg);
  color: var(--text);
  transition: background 0.25s ease, color 0.25s ease;
}

.reader--day {
  --bg: #f4ecd8;
  --text: #2d2a26;
  --text-soft: #6b5b3a;
  --text-strong: #5a3a1a;
  --chrome-bg: rgba(244, 236, 216, 0.94);
  --chrome-text: #4a3a2a;
  --border: rgba(0,0,0,0.08);
  --btn-bg: #faf3e0;
  --btn-border: #c9b58c;
  --btn-active-bg: #8a6d3b;
  --btn-active-text: #fff;
  --overlay: rgba(0,0,0,0.4);
  --hover: rgba(0,0,0,0.05);
}
.reader--night {
  --bg: #1a1a1c;
  --text: #d4cfc4;
  --text-soft: #8a8479;
  --text-strong: #c9a86a;
  --chrome-bg: rgba(26, 26, 28, 0.94);
  --chrome-text: #c9c4ba;
  --border: rgba(255,255,255,0.08);
  --btn-bg: #2a2a2d;
  --btn-border: #3d3d40;
  --btn-active-bg: #8a6d3b;
  --btn-active-text: #fff;
  --overlay: rgba(0,0,0,0.6);
  --hover: rgba(255,255,255,0.06);
}

.reader__viewer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.reader__track {
  height: 100%;
  will-change: transform;
}
.reader__track.is-animating {
  transition: transform 0.32s cubic-bezier(0.4, 0, 0.2, 1);
}

.reader__content {
  height: 100%;
  padding: 56px 28px 56px;
  column-fill: auto;
  column-width: calc(100vw - 56px);
  column-gap: 56px;
  font-size: var(--font-size);
  line-height: 2;
  letter-spacing: 0.02em;
  text-align: justify;
}

.reader__title {
  font-size: calc(var(--font-size) * 1.5);
  text-align: center;
  margin: 0 0 0.5em;
  letter-spacing: 0.1em;
}
.reader__preface {
  text-align: center;
  margin: 0 0 1.4em;
  color: var(--text-soft);
}
.reader__content > section {
  break-before: column;
}
.reader__h2 {
  font-size: calc(var(--font-size) * 1.1);
  margin: 0 0 0.5em;
  letter-spacing: 0.05em;
  color: var(--text-strong);
  break-after: avoid-column;
}
.reader__p {
  margin: 0.4em 0;
}

.reader__topbar,
.reader__bottombar {
  position: fixed;
  left: 0; right: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 12px;
  padding: 10px 16px;
  background: var(--chrome-bg);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  z-index: 10;
}
.reader__topbar { top: 0; border-bottom: 1px solid var(--border); }
.reader__bottombar { bottom: 0; border-top: 1px solid var(--border); justify-content: center; }

.reader__topbar-title {
  flex: 1 1 120px;
  min-width: 0;
  font-size: calc(var(--font-size) * 0.75);
  font-weight: 600;
  color: var(--chrome-text);
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.reader__group { display: flex; gap: 4px; }
.size-btn {
  font-size: calc(var(--font-size) * 0.65);
  padding: 0.3em 0.55em;
  border: 1px solid var(--btn-border);
  background: var(--btn-bg);
  border-radius: 4px;
  cursor: pointer;
  color: var(--chrome-text);
}
.size-btn.is-active { background: var(--btn-active-bg); color: var(--btn-active-text); border-color: transparent; }

.icon-btn {
  width: calc(var(--font-size) * 1.9);
  height: calc(var(--font-size) * 1.9);
  border: none;
  background: transparent;
  font-size: calc(var(--font-size) * 1.15);
  cursor: pointer;
  color: var(--chrome-text);
  border-radius: 50%;
}
.icon-btn:hover { background: var(--hover); }

.reader__page {
  font-size: calc(var(--font-size) * 0.7);
  color: var(--chrome-text);
  min-width: calc(var(--font-size) * 4.5);
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.reader__toc {
  position: fixed;
  inset: 0;
  background: var(--overlay);
  z-index: 20;
  display: flex;
}
.reader__toc-panel {
  width: min(360px, 85vw);
  height: 100%;
  background: var(--bg);
  padding: 16px 12px;
  overflow-y: auto;
  box-shadow: 2px 0 12px rgba(0,0,0,0.2);
}
.reader__toc-panel h3 { margin: 4px 8px 12px; color: var(--chrome-text); font-size: calc(var(--font-size) * 0.95); }
.reader__toc-panel ul { list-style: none; margin: 0; padding: 0; }
.reader__toc-panel button {
  display: block;
  width: 100%;
  text-align: left;
  padding: 0.55em 0.7em;
  background: transparent;
  border: none;
  font-size: calc(var(--font-size) * 0.8);
  color: var(--text);
  cursor: pointer;
  border-radius: 6px;
}
.reader__toc-panel button:hover { background: var(--hover); }

.reader__aa {
  font-size: calc(var(--font-size) * 0.85);
  font-weight: 600;
  font-style: italic;
}

.reader__sheet {
  position: fixed;
  left: 0; right: 0;
  bottom: calc(var(--font-size) * 2.5);
  margin: 0 auto;
  max-width: 480px;
  background: var(--chrome-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.18);
  z-index: 15;
}
.reader__sheet-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.reader__sheet-label {
  flex: 0 0 auto;
  min-width: calc(var(--font-size) * 4);
  font-size: calc(var(--font-size) * 0.72);
  color: var(--text-soft);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.18s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-up-enter-active, .slide-up-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(12px); }
</style>
