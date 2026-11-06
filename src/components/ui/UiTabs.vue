<script setup lang="ts">
import { computed } from 'vue'
import type { ColorVariant } from '@/types/theme'

export interface TabItem {
  id: string | number
  label: string
  icon?: unknown
  badge?: string | number
  badgeVariant?: ColorVariant
  disabled?: boolean
}

export interface UiTabsProps {
  items: TabItem[]
  modelValue?: string | number
  variant?: 'attached' | 'pills' | 'underline' | 'boxed'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
}

const props = withDefaults(defineProps<UiTabsProps>(), {
  modelValue: undefined,
  variant: 'attached',
  size: 'md',
  fullWidth: false,
})

const emit = defineEmits<{
  'update:modelValue': [id: string | number]
  change: [id: string | number]
}>()

const activeTabId = computed({
  get() {
    if (props.modelValue !== undefined) return props.modelValue
    return props.items[0]?.id
  },
  set(val: string | number) {
    emit('update:modelValue', val)
    emit('change', val)
  },
})

function selectTab(item: TabItem) {
  if (item.disabled) return
  activeTabId.value = item.id
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        tab: 'h-9 text-xs gap-1.5',
        icon: 'h-3.5 w-3.5',
        content: 'p-3 text-xs',
      }
    case 'lg':
      return {
        tab: 'h-[3.25rem] text-base gap-2.5',
        icon: 'h-5 w-5',
        content: 'p-6 text-sm',
      }
    case 'md':
    default:
      return {
        tab: 'h-11 text-sm gap-2',
        icon: 'h-4 w-4',
        content: 'p-5 text-sm',
      }
  }
})

// Boxed and underline tabs use tighter horizontal padding/gaps so the strip
// does not spread labels far apart.
const tabPadding = computed(() => {
  const compact = props.variant === 'boxed' || props.variant === 'underline'
  if (props.size === 'sm') return compact ? 'px-2.5' : 'px-3'
  if (props.size === 'lg') return compact ? 'px-3.5' : 'px-6'
  return compact ? 'px-3' : 'px-4'
})

// Header & Tab styling per variant
const headerContainerClasses = computed(() => {
  switch (props.variant) {
    case 'attached':
      return 'flex items-stretch -mb-px rounded-t-box border-b border-[var(--border)] overflow-x-auto scrollbar-none'
    case 'underline':
      return 'flex items-stretch gap-0 border-b border-[var(--border)] overflow-x-auto scrollbar-none'
    case 'boxed':
      return 'inline-flex items-stretch gap-0.5 p-1 rounded-btn bg-base-300/60 border border-[var(--border)] overflow-x-auto max-w-full'
    case 'pills':
    default:
      return 'flex items-center gap-2 overflow-x-auto scrollbar-none'
  }
})

function getTabButtonClasses(item: TabItem) {
  const isActive = activeTabId.value === item.id

  if (props.variant === 'attached') {
    return [
      'relative font-medium transition-all select-none border-t border-r first:border-l border-[var(--border)] -mr-px cursor-pointer',
      sizeClasses.value.tab,
      tabPadding.value,
      props.fullWidth ? 'flex-1 justify-center' : '',
      isActive
        ? 'bg-[var(--surface-card)] text-[var(--accent)] font-bold shadow-[inset_0_2px_0_var(--accent)] !border-b-transparent z-10'
        : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]',
      item.disabled ? 'opacity-40 pointer-events-none' : '',
    ]
  }

  if (props.variant === 'underline') {
    return [
      'relative font-medium border-b-2 -mb-px transition-colors select-none cursor-pointer',
      sizeClasses.value.tab,
      tabPadding.value,
      props.fullWidth ? 'flex-1 justify-center' : '',
      isActive
        ? 'border-primary text-primary font-bold'
        : 'border-transparent text-base-content/70 hover:text-base-content hover:border-base-300',
      item.disabled ? 'opacity-40 pointer-events-none' : '',
    ]
  }

  if (props.variant === 'boxed') {
    return [
      'rounded-btn font-medium transition-all select-none cursor-pointer',
      sizeClasses.value.tab,
      tabPadding.value,
      props.fullWidth ? 'flex-1 justify-center' : '',
      isActive
        ? 'bg-primary text-primary-content font-semibold shadow-none'
        : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-hover)]',
      item.disabled ? 'opacity-40 pointer-events-none' : '',
    ]
  }

  // pills (default)
  return [
    'rounded-btn font-medium transition-all select-none cursor-pointer',
    sizeClasses.value.tab,
    tabPadding.value,
    props.fullWidth ? 'flex-1 justify-center' : '',
    isActive
      ? 'bg-primary text-primary-content font-semibold shadow-none'
      : 'bg-transparent text-[var(--text-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--text)]',
    item.disabled ? 'opacity-40 pointer-events-none' : '',
  ]
}

const contentContainerClasses = computed(() => {
  if (props.variant === 'attached') {
    return 'rounded-b-box border-x border-b border-[var(--border)] bg-[var(--surface-card)] shadow-none'
  }
  return 'mt-3'
})
</script>

<template>
  <div class="w-full">
    <!-- Tab Navigation Bar -->
    <div :class="headerContainerClasses" role="tablist">
      <button
        v-for="item in items"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="activeTabId === item.id"
        :aria-disabled="item.disabled"
        :disabled="item.disabled"
        class="inline-flex items-center"
        :class="getTabButtonClasses(item)"
        @click="selectTab(item)"
      >
        <component
          :is="item.icon"
          v-if="item.icon"
          class="shrink-0"
          :class="sizeClasses.icon"
        />

        <slot :name="`tab-${item.id}`" :item="item" :is-active="activeTabId === item.id">
          <span>{{ item.label }}</span>
        </slot>

        <span
          v-if="item.badge !== undefined"
          class="badge badge-xs font-semibold shrink-0"
          :class="item.badgeVariant ? `badge-${item.badgeVariant}` : 'badge-ghost'"
        >
          {{ item.badge }}
        </span>
      </button>
    </div>

    <!-- Tab Panels Container (Directly attached when variant='attached') -->
    <div :class="contentContainerClasses">
      <div
        v-for="item in items"
        v-show="activeTabId === item.id"
        :key="item.id"
        role="tabpanel"
        :class="sizeClasses.content"
      >
        <slot :name="item.id" :item="item">
          <slot :item="item" />
        </slot>
      </div>
    </div>
  </div>
</template>
