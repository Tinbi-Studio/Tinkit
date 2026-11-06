<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ColorVariant } from '@/types/theme'

export interface UiTooltipProps {
  text: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  variant?: ColorVariant
  teleport?: boolean
}

const props = withDefaults(defineProps<UiTooltipProps>(), {
  position: 'top',
  variant: 'neutral',
  teleport: false,
})

const isVisible = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const coords = ref({ top: 0, left: 0 })

function updateCoords() {
  if (!triggerRef.value) return
  const rect = triggerRef.value.getBoundingClientRect()
  
  if (props.position === 'right') {
    coords.value = {
      top: rect.top + rect.height / 2,
      left: rect.right + 8,
    }
  } else if (props.position === 'left') {
    coords.value = {
      top: rect.top + rect.height / 2,
      left: rect.left - 8,
    }
  } else if (props.position === 'bottom') {
    coords.value = {
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    }
  } else {
    // top
    coords.value = {
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    }
  }
}

function show() {
  if (props.teleport) {
    updateCoords()
  }
  isVisible.value = true
}

function hide() {
  isVisible.value = false
}

const positionClasses = computed(() => {
  if (props.teleport) {
    switch (props.position) {
      case 'bottom':
        return '-translate-x-1/2'
      case 'left':
        return '-translate-y-1/2 -translate-x-full'
      case 'right':
        return '-translate-y-1/2'
      case 'top':
      default:
        return '-translate-x-1/2 -translate-y-full'
    }
  }
  switch (props.position) {
    case 'bottom':
      return 'top-full left-1/2 -translate-x-1/2 mt-2'
    case 'left':
      return 'right-full top-1/2 -translate-y-1/2 mr-2'
    case 'right':
      return 'left-full top-1/2 -translate-y-1/2 ml-2'
    case 'top':
    default:
      return 'bottom-full left-1/2 -translate-x-1/2 mb-2'
  }
})

const variantClasses = computed(() => {
  const map: Record<ColorVariant, string> = {
    neutral: 'bg-[var(--surface-overlay)] text-base-content border border-[var(--border)] shadow-xl',
    primary: 'bg-primary text-primary-content shadow-lg',
    secondary: 'bg-secondary text-secondary-content shadow-lg',
    accent: 'bg-accent text-accent-content shadow-lg',
    info: 'bg-info text-info-content shadow-lg',
    success: 'bg-success text-success-content shadow-lg',
    warning: 'bg-warning text-warning-content shadow-lg',
    error: 'bg-error text-error-content shadow-lg',
  }
  return map[props.variant]
})
</script>

<template>
  <div
    ref="triggerRef"
    class="relative inline-flex"
    @mouseenter="show"
    @mouseleave="hide"
    @focusin="show"
    @focusout="hide"
  >
    <slot />

    <!-- Teleported version to body if requested (immune to overflow:hidden / scroll containers) -->
    <Teleport v-if="teleport" to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isVisible && text"
          role="tooltip"
          class="pointer-events-none fixed z-[var(--z-tooltip)] whitespace-nowrap rounded-btn px-2.5 py-1.5 text-[11px] font-semibold"
          :class="[positionClasses, variantClasses]"
          :style="{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
          }"
        >
          {{ text }}
        </div>
      </Transition>
    </Teleport>

    <!-- Inline relative version -->
    <Transition
      v-else
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isVisible && text"
        role="tooltip"
        class="pointer-events-none absolute z-50 whitespace-nowrap rounded-btn px-2.5 py-1.5 text-[11px] font-semibold shadow-lg"
        :class="[positionClasses, variantClasses]"
      >
        {{ text }}
      </div>
    </Transition>
  </div>
</template>
