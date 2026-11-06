<script setup lang="ts">
import { computed, ref } from 'vue'
import { Loader2 } from 'lucide-vue-next'
import type { ColorVariant } from '@/types/theme'
import { animateTap } from '@/utils/gsap'

export interface UiButtonProps {
  variant?: ColorVariant | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg'
  soft?: boolean
  outline?: boolean
  block?: boolean
  circle?: boolean
  square?: boolean
  iconOnly?: boolean
  icon?: any
  loading?: boolean
  disabled?: boolean
  active?: boolean
  type?: 'button' | 'submit' | 'reset'
  title?: string
}

const props = withDefaults(defineProps<UiButtonProps>(), {
  variant: undefined,
  size: 'md',
  soft: false,
  outline: false,
  block: false,
  circle: false,
  square: false,
  iconOnly: false,
  icon: undefined,
  loading: false,
  disabled: false,
  active: undefined,
  type: 'button',
  title: undefined,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const btnRef = ref<HTMLElement | null>(null)

function handleClick(event: MouseEvent) {
  animateTap(btnRef.value)
  emit('click', event)
}

const isIconButton = computed(() => props.circle || props.square || props.iconOnly)

const iconSizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'h-3.5 w-3.5'
    case 'sm':
      return 'h-4 w-4'
    case 'lg':
      return 'h-5 w-5'
    case 'md':
    default:
      return 'h-4.5 w-4.5'
  }
})

const classes = computed(() => {
  const variantMap: Record<string, string> = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    neutral: 'btn-neutral',
    info: 'btn-info',
    success: 'btn-success',
    warning: 'btn-warning',
    error: 'btn-error',
    ghost: 'btn-ghost',
  }

  const sizeMap: Record<string, string> = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  }

  return [
    'btn',
    isIconButton.value ? 'btn-icon' : '',
    props.variant ? variantMap[props.variant] : '',
    sizeMap[props.size],
    props.soft ? 'btn-soft' : '',
    props.outline ? 'btn-outline' : '',
    props.active === true ? 'btn-active' : '',
    props.block && !isIconButton.value ? 'btn-block' : '',
    props.circle ? 'btn-circle' : '',
    props.square ? 'btn-square' : '',
  ]
    .filter(Boolean)
    .join(' ')
})
</script>

<template>
  <button
    ref="btnRef"
    :type="type"
    :class="classes"
    :disabled="disabled || loading"
    :title="title"
    :aria-label="title"
    :aria-pressed="active"
    @click="handleClick"
  >
    <Loader2 v-if="loading" class="animate-spin shrink-0" :class="iconSizeClass" />
    <template v-else>
      <slot name="icon-left" />
      <component :is="icon" v-if="icon" :class="iconSizeClass" class="shrink-0" />
      <slot />
      <slot name="icon-right" />
    </template>
  </button>
</template>
