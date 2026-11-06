<script setup lang="ts">
import type { ColorVariant } from '@/types/theme'

export interface TimelineItem {
  id: string | number
  title: string
  description?: string
  time: string
  variant?: ColorVariant
  icon?: any
  badge?: string
  author?: string
}

export interface UiTimelineProps {
  items: TimelineItem[]
}

defineProps<UiTimelineProps>()

function getDotClasses(variant: ColorVariant = 'primary') {
  const map: Record<ColorVariant, string> = {
    primary: 'bg-primary ring-primary/20',
    secondary: 'bg-secondary ring-secondary/20',
    accent: 'bg-accent ring-accent/20',
    neutral: 'bg-neutral ring-neutral/20',
    info: 'bg-info ring-info/20',
    success: 'bg-success ring-success/20',
    warning: 'bg-warning ring-warning/20',
    error: 'bg-error ring-error/20',
  }
  return map[variant]
}
</script>

<template>
  <ul class="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-[1.5px] before:bg-base-300">
    <li
      v-for="item in items"
      :key="item.id"
      class="relative pl-7"
    >
      <!-- Tinkit Timeline Point -->
      <span
        class="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full ring-4"
        :class="getDotClasses(item.variant)"
      />

      <!-- Timeline Content -->
      <div>
        <div class="flex flex-wrap items-center justify-between gap-2 mb-1">
          <h6 class="text-sm font-semibold text-base-content">
            {{ item.title }}
          </h6>
          <small class="text-xs text-base-content/50">
            {{ item.time }}
          </small>
        </div>

        <p v-if="item.description" class="text-xs text-base-content/65 leading-relaxed mb-2">
          {{ item.description }}
        </p>

        <div v-if="item.badge || item.author" class="flex flex-wrap items-center gap-2">
          <span
            v-if="item.badge"
            class="badge badge-xs font-medium"
            :class="`badge-soft badge-${item.variant || 'primary'}`"
          >
            {{ item.badge }}
          </span>
          <span v-if="item.author" class="text-xs text-base-content/55">
            by <strong class="font-medium text-base-content">{{ item.author }}</strong>
          </span>
        </div>
      </div>
    </li>
  </ul>
</template>
