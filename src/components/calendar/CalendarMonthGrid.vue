<script setup lang="ts">
import { computed } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { CalendarEvent } from '@/types/calendar'
import CalendarEventChip from './CalendarEventChip.vue'

const props = defineProps<{
  year: number
  month: number
  events: CalendarEvent[]
  selectedDate: string
}>()

const emit = defineEmits<{
  'select-date': [iso: string]
  'select-event': [event: CalendarEvent]
  'create-event': [iso: string]
}>()

const weekDayLabels = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']

interface GridCell {
  iso: string
  day: number
  inMonth: boolean
  isToday: boolean
  isSelected: boolean
}

function toIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const todayIso = toIso(new Date())

const eventsByDate = computed<Record<string, CalendarEvent[]>>(() => {
  const map: Record<string, CalendarEvent[]> = {}
  for (const event of props.events) {
    if (!map[event.date]) map[event.date] = []
    map[event.date].push(event)
  }
  for (const list of Object.values(map)) {
    list.sort((a, b) => a.startTime.localeCompare(b.startTime))
  }
  return map
})

const weeks = computed<GridCell[][]>(() => {
  const first = new Date(props.year, props.month, 1)
  // Monday-first calendar
  const lead = (first.getDay() + 6) % 7
  const start = new Date(props.year, props.month, 1 - lead)
  const cells: GridCell[] = []

  for (let index = 0; index < 42; index += 1) {
    const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + index)
    const iso = toIso(date)
    cells.push({
      iso,
      day: date.getDate(),
      inMonth: date.getMonth() === props.month && date.getFullYear() === props.year,
      isToday: iso === todayIso,
      isSelected: iso === props.selectedDate,
    })
  }

  return Array.from({ length: 6 }, (_, week) => cells.slice(week * 7, week * 7 + 7))
})

function eventsFor(iso: string): CalendarEvent[] {
  return eventsByDate.value[iso] ?? []
}
</script>

<template>
  <div class="overflow-x-auto">
    <div class="min-w-[52rem]">
      <div class="grid grid-cols-7 border-b border-[var(--border)] pb-2">
        <span
          v-for="label in weekDayLabels"
          :key="label"
          class="px-2 text-[11px] font-bold uppercase tracking-wide text-[var(--text-faint)]"
        >
          {{ label }}
        </span>
      </div>

      <div class="grid grid-cols-7">
        <div v-for="(week, weekIndex) in weeks" :key="weekIndex" class="contents">
          <div
            v-for="cell in week"
            :key="cell.iso"
            class="group relative min-h-[7.5rem] cursor-pointer border-b border-r border-[var(--border)] p-1.5 transition-colors"
            :class="[
              cell.inMonth ? 'bg-transparent' : 'bg-base-200/40',
              cell.isSelected ? 'ring-2 ring-inset ring-primary/40 bg-primary/[0.04]' : 'hover:bg-[var(--surface-raised)]',
            ]"
            @click="emit('select-date', cell.iso)"
          >
            <div class="mb-1 flex items-center justify-between">
              <span
                class="flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold"
                :class="[
                  cell.isToday ? 'bg-primary text-primary-content' : '',
                  !cell.inMonth ? 'text-[var(--text-faint)]' : 'text-base-content',
                ]"
              >
                {{ cell.day }}
              </span>
              <button
                type="button"
                class="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                title="Tambah acara"
                @click.stop="emit('create-event', cell.iso)"
              >
                <Plus class="h-3.5 w-3.5 text-[var(--text-faint)] hover:text-primary" />
              </button>
            </div>

            <div class="space-y-1">
              <CalendarEventChip
                v-for="event in eventsFor(cell.iso).slice(0, 3)"
                :key="event.id"
                :event="event"
                @select="emit('select-event', $event)"
              />
              <span
                v-if="eventsFor(cell.iso).length > 3"
                class="block pl-1 text-[10px] font-semibold text-[var(--text-muted)]"
              >
                +{{ eventsFor(cell.iso).length - 3 }} lagi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
