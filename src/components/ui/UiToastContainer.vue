<script setup lang="ts">
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  Sparkles,
  X,
} from 'lucide-vue-next'
import { useToastStore } from '@/stores/toast'
import type { ToastVariant } from '@/types/toast'
import gsap from 'gsap'

const toastStore = useToastStore()

function onToastEnter(el: Element, done: () => void) {
  gsap.fromTo(
    el,
    {
      opacity: 0,
      y: 36,
      scale: 0.95,
    },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.45,
      ease: 'power3.out',
      clearProps: 'transform,opacity',
      onComplete: done,
    },
  )
}

function onToastLeave(el: Element, done: () => void) {
  gsap.to(el, {
    opacity: 0,
    y: 20,
    scale: 0.95,
    duration: 0.28,
    ease: 'power2.in',
    onComplete: done,
  })
}

function getIcon(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return CheckCircle2
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    case 'primary':
      return Sparkles
    case 'info':
    default:
      return Info
  }
}

function getCardClasses(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'border-success/35 bg-base-100 shadow-success/15'
    case 'error':
      return 'border-error/35 bg-base-100 shadow-error/15'
    case 'warning':
      return 'border-warning/35 bg-base-100 shadow-warning/15'
    case 'primary':
      return 'border-primary/35 bg-base-100 shadow-primary/15'
    case 'info':
    default:
      return 'border-info/35 bg-base-100 shadow-info/15'
  }
}

function getIconContainerClasses(variant: ToastVariant) {
  switch (variant) {
    case 'success':
      return 'bg-success/15 text-success'
    case 'error':
      return 'bg-error/15 text-error'
    case 'warning':
      return 'bg-warning/15 text-warning'
    case 'primary':
      return 'bg-primary/15 text-primary'
    case 'info':
    default:
      return 'bg-info/15 text-info'
  }
}
</script>

<template>
  <div
    class="fixed bottom-5 right-5 z-[var(--z-toast)] flex flex-col-reverse gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    role="region"
    aria-label="Notifikasi Toast"
  >
    <TransitionGroup
      :css="false"
      @enter="onToastEnter"
      @leave="onToastLeave"
    >
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-start gap-3 rounded-box border p-3.5 shadow-xl backdrop-blur-md transition-colors"
        :class="getCardClasses(toast.variant)"
      >
        <div
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn mt-0.5"
          :class="getIconContainerClasses(toast.variant)"
        >
          <component :is="getIcon(toast.variant)" class="h-4 w-4" />
        </div>

        <div class="flex-1 min-w-0 pr-1">
          <h5 class="text-xs font-bold text-base-content leading-snug">
            {{ toast.title }}
          </h5>
          <p
            v-if="toast.message"
            class="text-xs text-base-content/70 mt-0.5 leading-relaxed break-words"
          >
            {{ toast.message }}
          </p>
        </div>

        <button
          type="button"
          class="btn btn-ghost btn-xs btn-circle text-base-content/50 hover:text-base-content shrink-0"
          aria-label="Tutup notifikasi"
          @click="toastStore.remove(toast.id)"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>
