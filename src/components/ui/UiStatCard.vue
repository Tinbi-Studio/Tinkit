<script setup lang="ts">
import { type Component } from 'vue'
import { ChevronUp, ChevronDown } from 'lucide-vue-next'
import type { ColorVariant } from '@/types/theme'

export interface UiStatCardProps {
  title: string
  value: string
  change?: string
  trend?: 'up' | 'down' | 'neutral'
  description?: string
  badgeText?: string
  variant?: ColorVariant
  icon?: Component
  layout?: 'vertical' | 'horizontal'
}

withDefaults(defineProps<UiStatCardProps>(), {
  change: undefined,
  trend: 'up',
  description: undefined,
  badgeText: undefined,
  variant: 'primary',
  icon: undefined,
  layout: 'horizontal',
})
</script>

<template>
  <!-- Layout 1: CRM Vertical Card (Icon top-left, Trend top-right, Value + Label + Pill below) -->
  <div v-if="layout === 'vertical'" class="card h-full">
    <div class="card-body p-5 flex flex-col justify-between gap-4">
      <div class="flex items-start justify-between gap-2">
        <component
          v-if="icon"
          :is="icon"
          class="h-5 w-5 shrink-0 text-[var(--text-muted)]"
        />

        <div
          v-if="change"
          class="inline-flex items-center text-xs font-medium"
          :class="
            trend === 'up'
              ? 'text-success'
              : trend === 'down'
                ? 'text-error'
                : 'text-info'
          "
        >
          <span>{{ change }}</span>
          <ChevronUp v-if="trend === 'up'" class="h-4 w-4" />
          <ChevronDown v-else-if="trend === 'down'" class="h-4 w-4" />
        </div>
      </div>

      <div>
        <h4 class="text-xl font-semibold text-base-content mb-0.5">
          {{ value }}
        </h4>
        <p class="text-xs text-base-content/60 mb-2.5">
          {{ title }}
        </p>
        <span
          v-if="badgeText || description"
          class="badge badge-xs bg-base-200 text-base-content/65 font-medium"
        >
          {{ badgeText || description }}
        </span>
      </div>
    </div>
  </div>

  <!-- Layout 2: Tinkit Horizontal Stat Card (Left: Title, Value + Change, Description | Right: Soft Square Avatar Icon) -->
  <div v-else class="card h-full">
    <div class="card-body p-5 flex flex-row items-start justify-between gap-3">
      <div class="space-y-1">
        <span class="text-sm font-normal text-base-content/80 block">
          {{ title }}
        </span>
        <div class="flex items-baseline gap-2 flex-wrap">
          <h4 class="text-2xl font-semibold text-base-content tracking-tight">
            {{ value }}
          </h4>
          <span
            v-if="change"
            class="text-xs font-medium"
            :class="
              trend === 'up'
                ? 'text-success'
                : trend === 'down'
                  ? 'text-error'
                  : 'text-info'
            "
          >
            ({{ change }})
          </span>
        </div>
        <p v-if="description" class="text-xs text-base-content/55">
          {{ description }}
        </p>
      </div>

      <component
        v-if="icon"
        :is="icon"
        class="h-5 w-5 shrink-0 text-[var(--text-muted)]"
      />
    </div>
  </div>
</template>
