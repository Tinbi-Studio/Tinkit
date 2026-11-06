<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ColorVariant } from '@/types/theme'

export type AvatarShape = 'circle' | 'square' | 'rounded'
export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away'

export interface UiAvatarProps {
  src?: string
  alt?: string
  name?: string
  size?: AvatarSize
  shape?: AvatarShape
  status?: AvatarStatus
  variant?: ColorVariant
  bordered?: boolean
}

const props = withDefaults(defineProps<UiAvatarProps>(), {
  src: undefined,
  alt: undefined,
  name: undefined,
  size: 'md',
  shape: 'circle',
  status: undefined,
  variant: 'primary',
  bordered: false,
})

const imageError = ref(false)

const initials = computed(() => {
  if (props.name) {
    const parts = props.name.trim().split(/\s+/)
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    return parts[0].slice(0, 2).toUpperCase()
  }
  if (props.alt) {
    return props.alt.slice(0, 2).toUpperCase()
  }
  return '?'
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'xs':
      return {
        container: 'h-6 w-6 text-[10px]',
        statusDot: 'h-1.5 w-1.5 border-[1.5px]',
      }
    case 'sm':
      return {
        container: 'h-8 w-8 text-xs',
        statusDot: 'h-2 w-2 border-[1.5px]',
      }
    case 'lg':
      return {
        container: 'h-12 w-12 text-base font-semibold',
        statusDot: 'h-3 w-3 border-2',
      }
    case 'xl':
      return {
        container: 'h-16 w-16 text-lg font-bold',
        statusDot: 'h-3.5 w-3.5 border-2',
      }
    case '2xl':
      return {
        container: 'h-20 w-20 text-2xl font-bold',
        statusDot: 'h-4 w-4 border-2',
      }
    case 'md':
    default:
      return {
        container: 'h-10 w-10 text-sm font-medium',
        statusDot: 'h-2.5 w-2.5 border-2',
      }
  }
})

const shapeClasses = computed(() => {
  switch (props.shape) {
    case 'square':
      return 'rounded-none'
    case 'rounded':
      return 'rounded-box'
    case 'circle':
    default:
      return 'rounded-full'
  }
})

const variantFallbackClasses = computed(() => {
  const map: Record<ColorVariant, string> = {
    primary: 'bg-primary/20 text-primary-ink border border-primary/30',
    secondary: 'bg-secondary/20 text-secondary-ink border border-secondary/30',
    accent: 'bg-accent/20 text-accent-ink border border-accent/30',
    neutral: 'bg-[var(--surface-raised)] text-[var(--text)] border border-[var(--border)]',
    info: 'bg-info/20 text-info border border-info/30',
    success: 'bg-success/20 text-success border border-success/30',
    warning: 'bg-warning/20 text-warning border border-warning/30',
    error: 'bg-error/20 text-error border border-error/30',
  }
  return map[props.variant]
})

const statusDotClasses = computed(() => {
  if (!props.status) return ''
  const statusColor: Record<AvatarStatus, string> = {
    online: 'bg-success',
    offline: 'bg-base-content/40',
    busy: 'bg-error',
    away: 'bg-warning',
  }
  return [
    'absolute bottom-0 right-0 rounded-full border-base-100 shadow-xs ring-1 ring-black/5',
    sizeClasses.value.statusDot,
    statusColor[props.status],
  ]
})
</script>

<template>
  <div class="relative inline-flex shrink-0 select-none">
    <!-- Avatar Main Container -->
    <div
      class="relative flex items-center justify-center overflow-hidden transition-all duration-150"
      :class="[
        sizeClasses.container,
        shapeClasses,
        bordered ? 'ring-2 ring-primary/40 ring-offset-2 ring-offset-base-100' : '',
        src && !imageError ? 'bg-base-300' : variantFallbackClasses,
      ]"
    >
      <!-- Image when available and loaded -->
      <img
        v-if="src && !imageError"
        :src="src"
        :alt="alt ?? name ?? 'Avatar'"
        class="h-full w-full object-cover"
        @error="imageError = true"
      />

      <!-- Fallback text / slot when no image or load error -->
      <slot v-else>
        <span class="tracking-wider uppercase select-none font-semibold">
          {{ initials }}
        </span>
      </slot>
    </div>

    <!-- Status indicator badge dot -->
    <span
      v-if="status"
      :class="statusDotClasses"
      :title="`Status: ${status}`"
    />
  </div>
</template>
