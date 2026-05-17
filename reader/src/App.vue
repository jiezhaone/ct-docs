<script setup lang="ts">
import { computed } from 'vue'
import Reader from './Reader.vue'
import Library from './Library.vue'
import { findSutra } from './sutras'

const params = new URLSearchParams(window.location.search)
const sutra = computed(() => findSutra(params.get('sutra')))
</script>

<template>
  <Reader v-if="sutra" :sutra="sutra" />
  <Library v-else />
</template>
