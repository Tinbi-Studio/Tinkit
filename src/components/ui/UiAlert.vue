<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Info,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  X,
} from 'lucide-vue-next'
import type { ColorVariant } from '@/types/theme'

export type AlertStyleType = 'accent-left' | 'soft' | 'glass' | 'solid'

export interface UiAlertProps {
  variant?: ColorVariant
  styleType?: AlertStyleType
  solid?: boolean
  title?: string
  dismissible?: boolean
}

const props = withDefaults(defineProps<UiAlertProps>(), {
  variant: 'info',
  styleType: 'accent-left',
  solid: false,
  title: undefined,
  dismissible: false,
})

const emit = defineEmits<{
  dismiss: []
}>()

const visible = ref(true)

function getIcon(variant: ColorVariant) {
  switch (variant) {
    case 'success':
      return CheckCircle2
    case 'error':
      return XCircle
    case 'warning':
      return AlertTriangle
    case 'primary':
    case 'secondary':
    case 'accent':
      return Sparkles
    case 'info':
    case 'neutral':
    default:
      return Info
  }
}

const isSolid = computed(() => props.solid || props.styleType === 'solid')

const styleClasses = computed(() => {
  const v = props.variant

  if (isSolid.value) {
    const map: Record<ColorVariant, string> = {
      primary: 'bg-primary text-primary-content border-primary',
      secondary: 'bg-secondary text-secondary-content border-secondary',
      accent: 'bg-accent text-accent-content border-accent',
      neutral: 'bg-neutral text-neutral-content border-neutral',
      info: 'bg-info text-info-content border-info',
      success: 'bg-success text-success-content border-success',
      warning: 'bg-warning text-warning-content border-warning',
      error: 'bg-error text-error-content border-error',
    }
    return `${map[v]} border`
  }

  if (props.styleType === 'glass') {
    const map: Record<ColorVariant, string> = {
      primary: 'bg-primary/8 border-primary/25 text-base-content shadow-xs shadow-primary/10',
      secondary: 'bg-secondary/8 border-secondary/25 text-base-content shadow-xs shadow-secondary/10',
      accent: 'bg-accent/8 border-accent/25 text-base-content shadow-xs shadow-accent/10',
      neutral: 'bg-base-300/30 border-base-300 text-base-content',
      info: 'bg-info/8 border-info/25 text-base-content shadow-xs shadow-info/10',
      success: 'bg-success/8 border-success/25 text-base-content shadow-xs shadow-success/10',
      warning: 'bg-warning/8 border-warning/25 text-base-content shadow-xs shadow-warning/10',
      error: 'bg-error/8 border-error/25 text-base-content shadow-xs shadow-error/10',
    }
    return `${map[v]} border backdrop-blur-md`
  }

  if (props.styleType === 'soft') {
    const map: Record<ColorVariant, string> = {
      primary: 'bg-primary/12 border-primary/20 text-base-content',
      secondary: 'bg-secondary/12 border-secondary/20 text-base-content',
      accent: 'bg-accent/12 border-accent/20 text-base-content',
      neutral: 'bg-base-200 border-base-300 text-base-content',
      info: 'bg-info/12 border-info/20 text-base-content',
      success: 'bg-success/12 border-success/20 text-base-content',
      warning: 'bg-warning/15 border-warning/25 text-base-content',
      error: 'bg-error/12 border-error/20 text-base-content',
    }
    return `${map[v]} border`
  }

  // Default: 'accent-left'
  const map: Record<ColorVariant, string> = {
    primary: 'border-l-4 border-l-primary border-y border-r border-base-300/80 bg-base-100 text-base-content',
    secondary: 'border-l-4 border-l-secondary border-y border-r border-base-300/80 bg-base-100 text-base-content',
    accent: 'border-l-4 border-l-accent border-y border-r border-base-300/80 bg-base-100 text-base-content',
    neutral: 'border-l-4 border-l-neutral border-y border-r border-base-300/80 bg-base-100 text-base-content',
    info: 'border-l-4 border-l-info border-y border-r border-base-300/80 bg-base-100 text-base-content',
    success: 'border-l-4 border-l-success border-y border-r border-base-300/80 bg-base-100 text-base-content',
    warning: 'border-l-4 border-l-warning border-y border-r border-base-300/80 bg-base-100 text-base-content',
    error: 'border-l-4 border-l-error border-y border-r border-base-300/80 bg-base-100 text-base-content',
  }
  return map[v]
})

const iconBoxClasses = computed(() => {
  const v = props.variant
  if (isSolid.value) {
    const solidIconMap: Record<ColorVariant, string> = {
      primary: 'bg-primary-content text-primary font-bold',
      secondary: 'bg-secondary-content text-secondary font-bold',
      accent: 'bg-accent-content text-accent font-bold',
      neutral: 'bg-neutral-content text-neutral font-bold',
      info: 'bg-info-content text-info font-bold',
      success: 'bg-success-content text-success font-bold',
      warning: 'bg-warning-content text-warning font-bold',
      error: 'bg-error-content text-error font-bold',
    }
    return solidIconMap[v]
  }

  const map: Record<ColorVariant, string> = {
    primary: 'bg-primary/15 text-primary-ink',
    secondary: 'bg-secondary/15 text-secondary-ink',
    accent: 'bg-accent/15 text-accent-ink',
    neutral: 'bg-neutral/15 text-neutral-ink',
    info: 'bg-info/15 text-info',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/15 text-error',
  }
  return map[v]
})

function handleDismiss() {
  visible.value = false
  emit('dismiss')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-1"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="visible"
      class="flex w-full items-start gap-3.5 rounded-box p-4 text-sm transition-all shadow-none"
      :class="styleClasses"
      role="alert"
    >
      <div
        class="flex h-8 w-8 shrink-0 items-center justify-center rounded-btn"
        :class="iconBoxClasses"
      >
        <component :is="getIcon(variant)" class="h-4 w-4" />
      </div>

      <div class="flex-1 min-w-0 pt-0.5">
        <h5
          v-if="title"
          class="font-bold tracking-tight mb-1"
          :class="isSolid ? 'text-current' : 'text-base-content'"
        >
          {{ title }}
        </h5>
        <div
          class="leading-relaxed"
          :class="isSolid ? 'text-current opacity-95' : 'text-[var(--text-muted)]'"
        >
          <slot />
        </div>
        <div v-if="$slots.actions" class="mt-3 flex items-center gap-2">
          <slot name="actions" />
        </div>
      </div>

      <button
        v-if="dismissible"
        type="button"
        class="btn btn-ghost btn-xs btn-circle shrink-0"
        :class="isSolid ? 'text-current hover:bg-black/10' : 'text-[var(--text-muted)] hover:text-[var(--text)]'"
        aria-label="Tutup pesan"
        @click="handleDismiss"
      >
        <X class="h-4 w-4" />
      </button>
    </div>
  </Transition>
</template>
