<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { Github, Star } from 'lucide-vue-next'
import { GITHUB_REPOSITORY_API_URL, GITHUB_REPOSITORY_URL } from '@/config/github'

const CACHE_KEY = 'tinkit:github-stars'
const CACHE_TTL = 10 * 60 * 1000

const stars = ref<number | null>(null)
const loading = ref(true)
const error = ref(false)
let controller: AbortController | null = null

const formattedStars = computed(() => {
  if (stars.value === null) return null
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(stars.value)
})

const label = computed(() => {
  if (formattedStars.value) return `Star Tinkit on GitHub. ${formattedStars.value} stars`
  if (error.value) return 'Open Tinkit on GitHub'
  return 'Loading GitHub stars'
})

function readCache(): number | null {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null')
    if (typeof cached?.count === 'number' && Date.now() - cached.fetchedAt < CACHE_TTL) {
      return cached.count
    }
  } catch {
    return null
  }
  return null
}

function writeCache(count: number) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ count, fetchedAt: Date.now() }))
  } catch {
    return
  }
}

async function fetchStars() {
  const cached = readCache()
  if (cached !== null) {
    stars.value = cached
    loading.value = false
    return
  }

  controller = new AbortController()
  try {
    const response = await fetch(GITHUB_REPOSITORY_API_URL, {
      headers: { Accept: 'application/vnd.github+json' },
      signal: controller.signal,
    })
    if (!response.ok) throw new Error('GitHub request failed')

    const data = await response.json()
    if (typeof data?.stargazers_count === 'number') {
      stars.value = data.stargazers_count
      writeCache(data.stargazers_count)
    } else {
      error.value = true
    }
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

onMounted(fetchStars)

onBeforeUnmount(() => controller?.abort())
</script>

<template>
  <a
    :href="GITHUB_REPOSITORY_URL"
    class="btn btn-ghost btn-sm gap-1.5"
    target="_blank"
    rel="noopener noreferrer"
    :aria-label="label"
    title="Open Tinkit on GitHub"
  >
    <Github class="h-4 w-4" />
    <span class="inline-flex items-center gap-1">
      <Star class="h-3.5 w-3.5 fill-current text-warning" aria-hidden="true" />
      <span v-if="loading" class="h-3 w-7 animate-pulse rounded-full bg-[var(--surface-raised)]" aria-hidden="true" />
      <span v-else-if="formattedStars" class="tabular-nums">{{ formattedStars }}</span>
      <span v-else>—</span>
    </span>
  </a>
</template>
