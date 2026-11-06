<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme'
import symbolInk from '@/assets/brand/tinkit-symbol-ink.png'
import symbolPale from '@/assets/brand/tinkit-symbol-pale.png'

const props = withDefaults(defineProps<{
  iconOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
}>(), {
  iconOnly: false,
  size: 'md',
})

const themeStore = useThemeStore()
const symbol = computed(() => themeStore.isDark ? symbolPale : symbolInk)

const symbolClasses = computed(() => ({
  sm: 'h-6 w-10',
  md: 'h-8 w-[54px]',
  lg: 'h-10 w-[68px]',
}[props.size]))

const nameClasses = computed(() => ({
  sm: 'text-lg',
  md: 'text-[1.35rem]',
  lg: 'text-3xl',
}[props.size]))
</script>

<template>
  <span class="inline-flex items-center gap-2.5 whitespace-nowrap">
    <img
      :src="symbol"
      alt=""
      class="shrink-0 object-contain"
      :class="symbolClasses"
      width="512"
      height="300"
    />
    <span
      v-if="!iconOnly"
      class="font-extrabold leading-none tracking-[-0.035em] text-[var(--text)]"
      :class="nameClasses"
    >Tinkit</span>
  </span>
</template>
