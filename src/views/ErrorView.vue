<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Home,
  ArrowLeft,
  ShieldAlert,
  FileQuestion,
  ServerCrash,
  RefreshCw,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

type ErrorCode = '404' | '403' | '500'

const activeCode = ref<ErrorCode>(
  (['404', '403', '500'].includes(String(route.params.code))
    ? String(route.params.code)
    : '404') as ErrorCode,
)

watch(
  () => route.params.code,
  (val) => {
    if (val && ['404', '403', '500'].includes(String(val))) {
      activeCode.value = String(val) as ErrorCode
    }
  },
)

const errorConfigs = {
  '404': {
    code: '404',
    title: 'Page Not Found',
    subtitle: "We couldn't find the page you are looking for",
    badge: 'HTTP 404 Not Found',
    avatarClass: 'avatar-soft-primary',
    icon: FileQuestion,
  },
  '403': {
    code: '403',
    title: 'You are not authorized',
    subtitle: "You don't have permission to access this page. Go Home!",
    badge: 'HTTP 403 Forbidden',
    avatarClass: 'avatar-soft-warning',
    icon: ShieldAlert,
  },
  '500': {
    code: '500',
    title: 'Internal server error',
    subtitle: 'Oops, something went wrong on our server. Please try again later.',
    badge: 'HTTP 500 Server Error',
    avatarClass: 'avatar-soft-error',
    icon: ServerCrash,
  },
}

const currentError = computed(() => errorConfigs[activeCode.value])
</script>

<template>
  <div class="relative min-h-screen flex flex-col items-center justify-center bg-base-200 p-6 text-center overflow-hidden">
    <!-- Subtle Bottom Decorative Wave Mask (Tinkit misc-bg) -->
    <svg
      class="pointer-events-none absolute bottom-0 left-0 right-0 w-full h-44 text-base-300/60"
      viewBox="0 0 1440 200"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 130 C 360 40, 720 180, 1080 95 C 1260 55, 1380 110, 1440 85 L 1440 200 L 0 200 Z"
        fill="currentColor"
      />
    </svg>

    <div class="relative z-10 w-full max-w-lg space-y-6">
      <!-- Switcher Pills for Previewing 404 / 403 / 500 -->
      <div class="inline-flex items-center gap-1.5 rounded-btn bg-base-100 p-1.5 shadow-sm border border-base-300/80">
        <button
          v-for="code in (['404', '403', '500'] as ErrorCode[])"
          :key="code"
          type="button"
          class="rounded-btn px-4 py-1 text-xs font-semibold transition-all"
          :class="
            activeCode === code
              ? 'bg-primary text-primary-content shadow-[0_2px_6px_0_rgb(var(--p)/0.45)]'
              : 'text-base-content/65 hover:text-base-content'
          "
          @click="activeCode = code"
        >
          Error {{ code }}
        </button>
      </div>

      <!-- Large Tinkit Error Code + Title + Subtitle -->
      <div>
        <h1 class="text-7xl sm:text-8xl font-extrabold tracking-tight text-base-content leading-none">
          {{ currentError.code }}
        </h1>
        <h4 class="mt-4 text-xl sm:text-2xl font-semibold text-base-content">
          {{ currentError.title }}
        </h4>
        <p class="mt-2 text-sm text-base-content/60">
          {{ currentError.subtitle }}
        </p>
      </div>

      <!-- Clean Illustration Card -->
      <div class="card mx-auto max-w-sm p-6 flex flex-col items-center">
        <div
          class="flex h-20 w-20 items-center justify-center rounded-box mb-4"
          :class="currentError.avatarClass"
        >
          <component :is="currentError.icon" class="h-10 w-10" />
        </div>
        <span class="badge badge-soft badge-primary px-3 py-1 text-xs font-mono">
          {{ currentError.badge }}
        </span>
        <p class="mt-2 text-xs text-base-content/50">
          Request ID: <code class="font-mono">TNK-{{ activeCode }}-9821X</code>
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button class="btn btn-outline bg-base-100 gap-2" @click="router.back()">
          <ArrowLeft class="h-4 w-4" />
          Go Back
        </button>
        <button
          v-if="activeCode === '500'"
          class="btn btn-soft btn-warning gap-2"
          @click="router.go(0)"
        >
          <RefreshCw class="h-4 w-4" />
          Retry
        </button>
        <RouterLink to="/" class="btn btn-primary gap-2">
          <Home class="h-4 w-4" />
          Back to home
        </RouterLink>
      </div>
    </div>
  </div>
</template>
