<script setup lang="ts">
import { computed } from 'vue'
import type { ColorVariant } from '@/types/theme'

export interface UiCardProps {
  title?: string
  subtitle?: string
  bordered?: boolean
  compact?: boolean
  hoverable?: boolean
  accentTop?: ColorVariant
  overflowVisible?: boolean
}

const props = withDefaults(defineProps<UiCardProps>(), {
  title: undefined,
  subtitle: undefined,
  bordered: false,
  compact: false,
  hoverable: false,
  accentTop: undefined,
  overflowVisible: true,
})

const accentBorderClass = computed(() => {
  if (!props.accentTop) return ''
  const map: Record<ColorVariant, string> = {
    primary: 'border-t-3 border-t-primary',
    secondary: 'border-t-3 border-t-secondary',
    accent: 'border-t-3 border-t-accent',
    neutral: 'border-t-3 border-t-neutral',
    info: 'border-t-3 border-t-info',
    success: 'border-t-3 border-t-success',
    warning: 'border-t-3 border-t-warning',
    error: 'border-t-3 border-t-error',
  }
  return map[props.accentTop]
})
</script>

<template>
  <div
    class="card"
    :class="[
      overflowVisible ? 'overflow-visible' : 'overflow-hidden',
      bordered ? 'card-bordered' : '',
      compact ? 'card-compact' : '',
      hoverable ? 'card-hover' : '',
      accentBorderClass,
    ]"
  >
    <div class="card-body">
      <div
        v-if="title || subtitle || $slots.header || $slots.actions"
        class="flex flex-wrap items-start justify-between gap-3 pb-1"
      >
        <div>
          <slot name="header">
            <h5 v-if="title" class="card-title">{{ title }}</h5>
            <p v-if="subtitle" class="card-subtitle mt-0.5">
              {{ subtitle }}
            </p>
          </slot>
        </div>
        <div v-if="$slots.actions" class="flex items-center gap-2">
          <slot name="actions" />
        </div>
      </div>

      <div class="flex-1">
        <slot />
      </div>

      <div
        v-if="$slots.footer"
        class="card-actions border-t border-base-300/70 pt-3.5 mt-1"
      >
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
