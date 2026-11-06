<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref, watch, type CSSProperties } from 'vue'
import { animateDropdownIn, animateDropdownOut } from '@/utils/gsap'
import {
  computeFloatingPosition,
  type FloatingAlign,
  type FloatingPlacement,
  type FloatingSide,
} from '@/utils/floating'

export interface UiFloatingPanelProps {
  open: boolean
  anchor: HTMLElement | null
  align?: FloatingAlign
  side?: FloatingSide
  offset?: number
  matchWidth?: boolean
  panelClass?: string
  panelRole?: string
  ariaLabel?: string
}

const props = withDefaults(defineProps<UiFloatingPanelProps>(), {
  align: 'start',
  side: 'auto',
  offset: 6,
  matchWidth: false,
  panelClass: '',
  panelRole: 'listbox',
  ariaLabel: undefined,
})

const emit = defineEmits<{ close: [] }>()

const panelRef = ref<HTMLElement | null>(null)
const placement = ref<FloatingPlacement>('bottom')
const style = ref<CSSProperties>({
  position: 'fixed',
  top: '0px',
  left: '0px',
  zIndex: 'var(--z-floating, 1000)',
})

let resizeObserver: ResizeObserver | null = null

function updatePosition() {
  const panel = panelRef.value
  const anchor = props.anchor
  if (!panel || !anchor) return

  const anchorRect = anchor.getBoundingClientRect()
  const panelRect = panel.getBoundingClientRect()
  const result = computeFloatingPosition(
    {
      top: anchorRect.top,
      left: anchorRect.left,
      width: anchorRect.width,
      height: anchorRect.height,
    },
    // scrollHeight = natural content height. Using offsetHeight would oscillate
    // because applying maxHeight changes the measured height on the next frame.
    { width: panelRect.width, height: panel.scrollHeight },
    { width: window.innerWidth, height: window.innerHeight },
    {
      align: props.align,
      side: props.side,
      offset: props.offset,
      matchWidth: props.matchWidth,
      padding: 8,
    },
  )

  placement.value = result.placement
  style.value = {
    position: 'fixed',
    top: `${result.top}px`,
    left: `${result.left}px`,
    zIndex: 'var(--z-floating, 1000)',
    transformOrigin: result.placement === 'bottom' ? 'top center' : 'bottom center',
    ...(result.width !== null ? { width: `${result.width}px` } : {}),
    ...(result.maxHeight !== null ? { maxHeight: `${result.maxHeight}px` } : {}),
  }
}

function onPointerDown(event: PointerEvent) {
  const target = event.target as Node | null
  if (!target) return
  if (panelRef.value?.contains(target) || props.anchor?.contains(target)) return
  emit('close')
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key !== 'Escape') return
  emit('close')
  props.anchor?.focus()
}

function addListeners() {
  window.addEventListener('scroll', updatePosition, true)
  window.addEventListener('resize', updatePosition)
  document.addEventListener('pointerdown', onPointerDown, true)
  document.addEventListener('keydown', onKeyDown, true)

  if (typeof ResizeObserver !== 'undefined' && panelRef.value) {
    resizeObserver = new ResizeObserver(updatePosition)
    resizeObserver.observe(panelRef.value)
    if (props.anchor) resizeObserver.observe(props.anchor)
  }
}

function removeListeners() {
  window.removeEventListener('scroll', updatePosition, true)
  window.removeEventListener('resize', updatePosition)
  document.removeEventListener('pointerdown', onPointerDown, true)
  document.removeEventListener('keydown', onKeyDown, true)
  resizeObserver?.disconnect()
  resizeObserver = null
}

watch(
  () => props.open,
  async (open) => {
    removeListeners()
    if (!open) return
    await nextTick()
    updatePosition()
    addListeners()
  },
  { flush: 'post' },
)

onBeforeUnmount(removeListeners)
</script>

<template>
  <Teleport to="body">
    <Transition
      :css="false"
      @enter="(el, done) => animateDropdownIn(el, done)"
      @leave="(el, done) => animateDropdownOut(el, done)"
    >
      <div
        v-if="open"
        ref="panelRef"
        :role="panelRole"
        :aria-label="ariaLabel"
        :data-floating-panel="panelRole"
        :data-placement="placement"
        class="fixed"
        :class="panelClass"
        :style="style"
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>
