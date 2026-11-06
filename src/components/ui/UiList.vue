<script setup lang="ts">
import type { ColorVariant } from '@/types/theme'

export interface ListItem {
  id: string | number
  title: string
  subtitle?: string
  meta?: string
  avatar?: string
  icon?: any
  variant?: ColorVariant
  badge?: string
  badgeVariant?: ColorVariant
  disabled?: boolean
}

export interface UiListProps {
  items?: ListItem[]
  hoverable?: boolean
  bordered?: boolean
  compact?: boolean
}

withDefaults(defineProps<UiListProps>(), {
  items: () => [],
  hoverable: true,
  bordered: true,
  compact: false,
})

const emit = defineEmits<{
  itemClick: [item: ListItem]
}>()

function getIconClasses(variant: ColorVariant = 'primary') {
  const map: Record<ColorVariant, string> = {
    primary: 'bg-primary/12 text-primary',
    secondary: 'bg-secondary/12 text-secondary',
    accent: 'bg-accent/12 text-accent',
    neutral: 'bg-neutral/12 text-neutral',
    info: 'bg-info/12 text-info',
    success: 'bg-success/12 text-success',
    warning: 'bg-warning/15 text-warning',
    error: 'bg-error/12 text-error',
  }
  return map[variant]
}
</script>

<template>
  <div
    class="flex flex-col divide-y divide-base-300/70 bg-base-100 rounded-box overflow-hidden"
    :class="bordered ? 'border border-base-300' : ''"
  >
    <slot>
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-center justify-between gap-3.5 transition-colors"
        :class="[
          compact ? 'px-3.5 py-2.5' : 'px-4 py-3.5',
          hoverable && !item.disabled ? 'hover:bg-base-200/60 cursor-pointer' : '',
          item.disabled ? 'opacity-50 cursor-not-allowed' : '',
        ]"
        @click="!item.disabled && emit('itemClick', item)"
      >
        <!-- Left: Avatar / Icon + Text -->
        <div class="flex items-center gap-3.5 min-w-0">
          <!-- Avatar Text/Initials or Icon -->
          <component
            v-if="item.icon"
            :is="item.icon"
            class="h-5 w-5 shrink-0 text-[var(--text-muted)]"
          />
          <div
            v-else-if="item.avatar"
            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-extrabold text-xs uppercase shadow-xs"
            :class="getIconClasses(item.variant)"
          >
            {{ item.avatar }}
          </div>

          <div class="min-w-0 flex-1">
            <p class="text-sm font-bold text-base-content truncate">
              {{ item.title }}
            </p>
            <p v-if="item.subtitle" class="text-xs text-base-content/60 truncate mt-0.5">
              {{ item.subtitle }}
            </p>
          </div>
        </div>

        <!-- Right: Meta / Badge / Custom Slot -->
        <div class="flex items-center gap-2.5 shrink-0">
          <slot name="item-action" :item="item">
            <span
              v-if="item.badge"
              class="badge badge-sm font-semibold"
              :class="`badge-soft badge-${item.badgeVariant || item.variant || 'primary'}`"
            >
              {{ item.badge }}
            </span>
            <span v-if="item.meta" class="text-xs font-mono text-base-content/50">
              {{ item.meta }}
            </span>
          </slot>
        </div>
      </div>
    </slot>
  </div>
</template>
