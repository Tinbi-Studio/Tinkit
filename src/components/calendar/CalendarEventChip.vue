<script setup lang="ts">
import { computed } from 'vue'
import type { CalendarEvent } from '@/types/calendar'

const props = defineProps<{
  event: CalendarEvent
}>()

const emit = defineEmits<{
  select: [event: CalendarEvent]
}>()

const colorClass = computed(() => {
  const map: Record<string, string> = {
    primary: 'border-primary/25 bg-primary/12 text-primary',
    secondary: 'border-secondary/25 bg-secondary/12 text-secondary',
    accent: 'border-accent/25 bg-accent/12 text-accent',
    neutral: 'border-neutral/25 bg-neutral/12 text-neutral',
    info: 'border-info/25 bg-info/12 text-info',
    success: 'border-success/25 bg-success/12 text-success',
    warning: 'border-warning/25 bg-warning/12 text-warning',
    error: 'border-error/25 bg-error/12 text-error',
  }
  return map[props.event.color] ?? map.primary
})
</script>

<template>
  <button
    type="button"
    class="flex w-full cursor-pointer items-center gap-1.5 rounded-btn border px-1.5 py-1 text-left text-[11px] font-semibold transition-opacity hover:opacity-80"
    :class="colorClass"
    :title="`${event.startTime}–${event.endTime} · ${event.title}`"
    @click.stop="emit('select', event)"
  >
    <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
    <span class="shrink-0 font-mono text-[10px] opacity-75">{{ event.startTime }}</span>
    <span class="truncate">{{ event.title }}</span>
  </button>
</template>
