<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import type { ColorVariant } from '@/types/theme'

export interface AccordionItem {
  id: string | number
  title: string
  content?: string
  icon?: unknown
  disabled?: boolean
  badge?: string
  badgeVariant?: ColorVariant
}

export interface UiAccordionProps {
  items: AccordionItem[]
  modelValue?: (string | number)[] | string | number | null
  multiple?: boolean
  variant?: 'default' | 'bordered' | 'separated' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<UiAccordionProps>(), {
  modelValue: () => [],
  multiple: false,
  variant: 'default',
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: (string | number)[] | string | number | null]
  change: [id: string | number, isOpen: boolean]
}>()

function normalizeIds(value: UiAccordionProps['modelValue']): (string | number)[] {
  if (value === null || value === undefined) return []
  return Array.isArray(value) ? [...value] : [value]
}

// Internal active IDs state so the accordion works with or without v-model.
const internalIds = ref<(string | number)[]>(normalizeIds(props.modelValue))

watch(
  () => props.modelValue,
  (value) => {
    internalIds.value = normalizeIds(value)
  },
  { deep: true },
)

function isOpen(id: string | number): boolean {
  return internalIds.value.includes(id)
}

function toggle(item: AccordionItem) {
  if (item.disabled) return

  const currentlyOpen = isOpen(item.id)
  let next: (string | number)[] = []

  if (props.multiple) {
    if (currentlyOpen) {
      next = internalIds.value.filter((i) => i !== item.id)
    } else {
      next = [...internalIds.value, item.id]
    }
  } else {
    next = currentlyOpen ? [] : [item.id]
  }

  internalIds.value = next
  emit('update:modelValue', props.multiple ? next : (next[0] ?? null))
  emit('change', item.id, !currentlyOpen)
}

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return {
        header: 'px-3 py-2 text-xs',
        body: 'px-3 pb-3 pt-1 text-xs',
        icon: 'h-3.5 w-3.5',
      }
    case 'lg':
      return {
        header: 'px-5 py-4 text-base',
        body: 'px-5 pb-5 pt-1 text-sm',
        icon: 'h-5 w-5',
      }
    case 'md':
    default:
      return {
        header: 'px-4 py-3 text-sm',
        body: 'px-4 pb-4 pt-1 text-sm',
        icon: 'h-4 w-4',
      }
  }
})

const variantContainerClasses = computed(() => {
  switch (props.variant) {
    case 'separated':
      return 'space-y-2'
    case 'bordered':
      return 'rounded-box border border-base-300 divide-y divide-base-300 bg-base-100 overflow-hidden shadow-sm'
    case 'ghost':
      return 'divide-y divide-base-200'
    case 'default':
    default:
      return 'rounded-box border border-[var(--border)] divide-y divide-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm'
  }
})

const itemClasses = (item: AccordionItem) => {
  if (props.variant === 'separated') {
    return [
      'rounded-box border transition-colors duration-150',
      isOpen(item.id)
        ? 'border-primary/40 bg-[var(--surface-raised)] shadow-sm'
        : 'border-[var(--border)] bg-[var(--surface)] hover:border-base-content/20',
      item.disabled ? 'opacity-50 pointer-events-none' : '',
    ]
  }
  return [
    'transition-colors duration-150',
    item.disabled ? 'opacity-50 pointer-events-none' : '',
  ]
}
</script>

<template>
  <div class="w-full" :class="variantContainerClasses">
    <div
      v-for="item in items"
      :key="item.id"
      :class="itemClasses(item)"
    >
      <!-- Accordion Header Button -->
      <button
        type="button"
        class="w-full flex items-center justify-between gap-3 text-left font-medium transition-colors cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
        :class="[
          sizeClasses.header,
          isOpen(item.id) ? 'text-primary font-semibold' : 'text-base-content hover:text-primary',
        ]"
        :aria-expanded="isOpen(item.id)"
        :disabled="item.disabled"
        @click="toggle(item)"
      >
        <div class="flex items-center gap-2.5 min-w-0">
          <component
            :is="item.icon"
            v-if="item.icon"
            class="shrink-0 text-base-content/70"
            :class="sizeClasses.icon"
          />
          <slot :name="`title-${item.id}`" :item="item" :is-open="isOpen(item.id)">
            <span class="truncate">{{ item.title }}</span>
          </slot>
          <span
            v-if="item.badge"
            class="badge badge-sm font-semibold shrink-0"
            :class="item.badgeVariant ? `badge-${item.badgeVariant}` : 'badge-ghost'"
          >
            {{ item.badge }}
          </span>
        </div>

        <ChevronDown
          class="shrink-0 text-base-content/50 transition-transform duration-200"
          :class="[
            sizeClasses.icon,
            isOpen(item.id) ? 'rotate-180 text-primary' : '',
          ]"
        />
      </button>

      <!-- Accordion Content Collapse with Grid Transition -->
      <div
        class="grid transition-[grid-template-rows] duration-200 ease-out"
        :class="isOpen(item.id) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
      >
        <div class="overflow-hidden">
          <div :class="sizeClasses.body" class="text-base-content/80 leading-relaxed">
            <slot :name="`content-${item.id}`" :item="item">
              <slot :item="item">
                {{ item.content }}
              </slot>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
