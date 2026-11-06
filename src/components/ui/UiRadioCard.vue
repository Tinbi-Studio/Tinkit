<script setup lang="ts">
import { computed } from 'vue'
import { Check } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface RadioCardOption {
  value: string | number
  title: string
  subtitle?: string
  description?: string
  icon?: Component
  badge?: string
  badgeVariant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info'
  tags?: string[]
  meta?: string
  recommended?: boolean
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    options: RadioCardOption[]
    name?: string
    columns?: 1 | 2 | 3 | 4
    gap?: 'sm' | 'md' | 'lg'
    layout?: 'vertical' | 'horizontal'
    disabled?: boolean
  }>(),
  {
    name: () => `radio-card-${Math.random().toString(36).substring(2, 9)}`,
    columns: 3,
    gap: 'md',
    layout: 'vertical',
    disabled: false,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}>()

const gapClass = computed(() => {
  switch (props.gap) {
    case 'sm':
      return 'gap-4'
    case 'lg':
      return 'gap-6 sm:gap-7'
    case 'md':
    default:
      return 'gap-5 sm:gap-6'
  }
})

const gridColsClass = computed(() => {
  switch (props.columns) {
    case 1:
      return 'grid-cols-1'
    case 2:
      return 'grid-cols-1 sm:grid-cols-2'
    case 4:
      return 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4'
    case 3:
    default:
      return 'grid-cols-1 sm:grid-cols-3'
  }
})

function select(option: RadioCardOption) {
  if (props.disabled || option.disabled) return
  emit('update:modelValue', option.value)
  emit('change', option.value)
}
</script>

<template>
  <div class="grid" :class="[gridColsClass, gapClass]" role="radiogroup">
    <div
      v-for="opt in options"
      :key="opt.value"
      role="radio"
      :aria-checked="modelValue === opt.value"
      :aria-disabled="disabled || opt.disabled"
      tabindex="0"
      class="group relative flex flex-col justify-between rounded-box border p-5 sm:p-5.5 transition-all duration-200 cursor-pointer select-none"
      :class="[
        modelValue === opt.value
          ? 'border-[rgb(var(--p))] bg-[var(--surface-raised)] shadow-none'
          : 'border-[var(--border)] bg-[var(--surface-input)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]',
        (disabled || opt.disabled) && 'opacity-50 cursor-not-allowed pointer-events-none'
      ]"
      @click="select(opt)"
      @keydown.space.prevent="select(opt)"
      @keydown.enter.prevent="select(opt)"
    >
      <!-- Top Recommended or Custom Badge ribbon if exists -->
      <div v-if="opt.recommended" class="absolute -top-3 right-4">
        <span class="inline-flex items-center gap-1 rounded-badge bg-[var(--accent)] px-3 py-0.5 text-[10px] font-semibold tracking-wide text-primary-content shadow-sm">
          Recommended
        </span>
      </div>

      <!-- Header: Icon/Avatar + Radio Button / Check + Title & Badge -->
      <div>
        <div class="flex items-start justify-between gap-3">
          <component
            v-if="opt.icon"
            :is="opt.icon"
            class="h-5 w-5 shrink-0 stroke-[1.8] text-[var(--text-muted)]"
          />

          <!-- Custom Radio Indicator (Pill or Ring Check) -->
          <div class="ms-auto flex items-center pt-0.5">
            <div
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200"
              :class="
                modelValue === opt.value
                  ? 'border-primary bg-primary text-primary-content shadow-none'
                  : 'border-[var(--border)] bg-[var(--surface-input)] group-hover:border-[var(--border-strong)]'
              "
            >
              <Check v-if="modelValue === opt.value" class="h-3 w-3 stroke-[2.5]" />
            </div>
          </div>
        </div>

        <!-- Title, Subtitle, and Badge -->
        <div class="mt-4 space-y-1.5">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="text-sm sm:text-[15px] font-bold tracking-tight text-[var(--text)] transition-colors"
              :class="modelValue === opt.value && 'text-[var(--accent)]'"
            >
              {{ opt.title }}
            </span>
            <span
              v-if="opt.badge"
              class="badge badge-xs font-semibold px-2 py-1"
              :class="[
                opt.badgeVariant ? `badge-${opt.badgeVariant}` : 'badge-soft badge-primary'
              ]"
            >
              {{ opt.badge }}
            </span>
          </div>

          <p v-if="opt.subtitle" class="text-xs font-medium text-[var(--text-muted)] leading-normal">
            {{ opt.subtitle }}
          </p>

          <p v-if="opt.description" class="pt-1 text-xs text-[var(--text-muted)] leading-relaxed">
            {{ opt.description }}
          </p>
        </div>
      </div>

      <!-- Footer: Tags or Meta Specifications (e.g. latency, throughput, cost) -->
      <div
        v-if="(opt.tags && opt.tags.length > 0) || opt.meta"
        class="mt-5 flex items-center justify-between gap-2 border-t border-[var(--border)] pt-3.5 text-[11px]"
      >
        <div v-if="opt.tags && opt.tags.length > 0" class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in opt.tags"
            :key="tag"
            class="rounded-md bg-[var(--surface-raised)] px-2 py-0.5 font-medium text-[var(--text-muted)] text-[10.5px] border border-[var(--border)]"
          >
            {{ tag }}
          </span>
        </div>
        <div v-if="opt.meta" class="font-mono text-xs font-medium text-[var(--text-muted)] ms-auto shrink-0">
          {{ opt.meta }}
        </div>
      </div>
    </div>
  </div>
</template>
