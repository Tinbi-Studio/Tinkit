<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { X } from 'lucide-vue-next'
import UiFloatingPanel from '@/components/ui/UiFloatingPanel.vue'

export interface UiPopoverProps {
  title?: string
  subtitle?: string
  position?: 'top' | 'bottom' | 'left' | 'right'
  widthClass?: string
  triggerMode?: 'click' | 'hover'
}

const props = withDefaults(defineProps<UiPopoverProps>(), {
  title: undefined,
  subtitle: undefined,
  position: 'bottom',
  widthClass: 'w-72',
  triggerMode: 'click',
})

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
let hoverTimer: ReturnType<typeof setTimeout> | null = null

function toggle() {
  if (props.triggerMode === 'click') {
    isOpen.value = !isOpen.value
  }
}

function close() {
  isOpen.value = false
}

function handleMouseEnter() {
  if (props.triggerMode !== 'hover') return
  if (hoverTimer) {
    clearTimeout(hoverTimer)
    hoverTimer = null
  }
  isOpen.value = true
}

function handleMouseLeave() {
  if (props.triggerMode !== 'hover') return
  hoverTimer = setTimeout(() => {
    isOpen.value = false
  }, 120)
}

onBeforeUnmount(() => {
  if (hoverTimer) clearTimeout(hoverTimer)
})
</script>

<template>
  <div
    class="relative inline-flex"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <div ref="triggerRef" class="inline-flex cursor-pointer" @click="toggle">
      <slot name="trigger" :is-open="isOpen" :toggle="toggle" />
    </div>

    <UiFloatingPanel
      :open="isOpen"
      :anchor="triggerRef"
      :side="position"
      :offset="10"
      panel-role="dialog"
      aria-label="Panel informasi"
      :panel-class="`${widthClass} overflow-y-auto rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] p-4 shadow-xl text-left`"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
      @close="close"
    >
        <div
          v-if="title || subtitle || triggerMode === 'click'"
          class="flex items-start justify-between gap-2 mb-2.5 pb-2 border-b border-[var(--border)]"
        >
          <div>
            <h5 v-if="title" class="text-xs font-extrabold text-base-content">
              {{ title }}
            </h5>
            <p v-if="subtitle" class="text-[11px] text-base-content/55 mt-0.5">
              {{ subtitle }}
            </p>
          </div>
          <button
            v-if="triggerMode === 'click'"
            type="button"
            class="btn btn-ghost btn-xs btn-circle h-5 w-5 text-base-content/50 hover:text-base-content"
            @click="close"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>

        <div class="text-xs text-base-content/80 leading-relaxed">
          <slot :close="close" />
        </div>
    </UiFloatingPanel>
  </div>
</template>
