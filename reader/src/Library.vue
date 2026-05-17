<script setup lang="ts">
import { sutras, LANG_LABEL } from './sutras'

function open(id: string) {
  const url = new URL(window.location.href)
  url.searchParams.set('sutra', id)
  window.location.href = url.toString()
}
</script>

<template>
  <div class="library">
    <div class="library__inner">
      <h1 class="library__title">經典選讀</h1>
      <p class="library__subtitle">請選擇要閱讀的經典</p>
      <ul class="library__list">
        <li v-for="s in sutras" :key="s.id">
          <button class="library__item" @click="open(s.id)">
            <span class="library__item-title">{{ s.title }}</span>
            <span class="library__item-badges">
              <span class="library__item-lang">{{ LANG_LABEL[s.lang] }}</span>
              <span class="library__item-meta">{{ s.sections.length }} 段</span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.library {
  position: fixed;
  inset: 0;
  background: #f4ecd8;
  color: #2d2a26;
  overflow-y: auto;
  font-family: "Noto Serif TC", "PingFang TC", "Songti TC", serif;
}
.library__inner {
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 24px 64px;
}
.library__title {
  text-align: center;
  font-size: 28px;
  letter-spacing: 0.1em;
  margin: 0 0 8px;
  color: #5a3a1a;
}
.library__subtitle {
  text-align: center;
  color: #6b5b3a;
  margin: 0 0 32px;
  font-size: 14px;
}
.library__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.library__item {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 20px;
  background: #faf3e0;
  border: 1px solid #c9b58c;
  border-radius: 10px;
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.1s ease;
}
.library__item:hover { background: #f5ead0; }
.library__item:active { transform: scale(0.99); }
.library__item-title { font-size: 18px; letter-spacing: 0.05em; }
.library__item-badges { display: flex; align-items: center; gap: 10px; }
.library__item-lang {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #ebd9b6;
  color: #5a3a1a;
  letter-spacing: 0.05em;
}
.library__item-meta { font-size: 12px; color: #8a6d3b; }
</style>
