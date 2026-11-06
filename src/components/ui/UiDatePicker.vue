<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  ChevronDown,
} from 'lucide-vue-next'
import UiFloatingPanel from '@/components/ui/UiFloatingPanel.vue'

export interface UiDatePickerProps {
  modelValue?: string
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  clearable?: boolean
  disabled?: boolean
  enableTime?: boolean
  minYear?: number
  maxYear?: number
}

const props = withDefaults(defineProps<UiDatePickerProps>(), {
  modelValue: '',
  label: undefined,
  placeholder: 'Pilih tanggal...',
  hint: undefined,
  error: undefined,
  clearable: true,
  disabled: false,
  enableTime: false,
  minYear: 1970,
  maxYear: 2040,
})

const emit = defineEmits<{
  'update:modelValue': [val: string]
  change: [val: string]
}>()

const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const viewMode = ref<'calendar' | 'month' | 'year'>('calendar')

const monthNames = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
]
const monthShortNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
]
const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

const today = new Date()
const viewYear = ref(today.getFullYear())
const viewMonth = ref(today.getMonth())

// Time state
const selectedHour = ref('12')
const selectedMinute = ref('00')

const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutesList = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'))

// Parse YYYY-MM-DD or YYYY-MM-DD HH:mm
function parseValue(val?: string) {
  if (!val) return null
  const [datePart, timePart] = val.split(' ')
  if (!datePart) return null
  const [y, m, d] = datePart.split('-').map(Number)
  if (isNaN(y) || isNaN(m) || isNaN(d)) return null

  let hr = '12'
  let mn = '00'
  if (timePart) {
    const [h, min] = timePart.split(':')
    if (h) hr = h.padStart(2, '0')
    if (min) mn = min.padStart(2, '0')
  }

  return { year: y, month: m - 1, day: d, hour: hr, minute: mn, datePart }
}

function syncFromModel() {
  const parsed = parseValue(props.modelValue)
  if (parsed) {
    viewYear.value = parsed.year
    viewMonth.value = parsed.month
    selectedHour.value = parsed.hour
    selectedMinute.value = parsed.minute
  } else {
    viewYear.value = today.getFullYear()
    viewMonth.value = today.getMonth()
  }
}

watch(() => props.modelValue, syncFromModel, { immediate: true })

function toIsoDate(y: number, m: number, d: number): string {
  const mm = String(m + 1).padStart(2, '0')
  const dd = String(d).padStart(2, '0')
  return `${y}-${mm}-${dd}`
}

function buildValueString(dateStr: string): string {
  if (!props.enableTime) return dateStr
  return `${dateStr} ${selectedHour.value}:${selectedMinute.value}`
}

const formattedDisplay = computed(() => {
  const parsed = parseValue(props.modelValue)
  if (!parsed) return ''
  const d = parsed.day
  const m = monthNames[parsed.month]
  const y = parsed.year
  if (props.enableTime) {
    return `${d} ${m} ${y}, ${parsed.hour}:${parsed.minute}`
  }
  return `${d} ${m} ${y}`
})

interface CalendarCell {
  day: number
  month: number
  year: number
  iso: string
  isCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
}

const calendarCells = computed<CalendarCell[]>(() => {
  const y = viewYear.value
  const m = viewMonth.value

  const firstDayOfMonth = new Date(y, m, 1).getDay()
  const daysInCurrentMonth = new Date(y, m + 1, 0).getDate()
  const daysInPrevMonth = new Date(y, m, 0).getDate()

  const todayIso = toIsoDate(today.getFullYear(), today.getMonth(), today.getDate())
  const selectedDatePart = parseValue(props.modelValue)?.datePart

  const cells: CalendarCell[] = []

  // Leading days from previous month
  const prevMonth = m === 0 ? 11 : m - 1
  const prevYear = m === 0 ? y - 1 : y
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i
    const iso = toIsoDate(prevYear, prevMonth, day)
    cells.push({
      day,
      month: prevMonth,
      year: prevYear,
      iso,
      isCurrentMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === selectedDatePart,
    })
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const iso = toIsoDate(y, m, day)
    cells.push({
      day,
      month: m,
      year: y,
      iso,
      isCurrentMonth: true,
      isToday: iso === todayIso,
      isSelected: iso === selectedDatePart,
    })
  }

  // Trailing days (6 weeks = 42 cells)
  const nextMonth = m === 11 ? 0 : m + 1
  const nextYear = m === 11 ? y + 1 : y
  const remaining = 42 - cells.length
  for (let day = 1; day <= remaining; day++) {
    const iso = toIsoDate(nextYear, nextMonth, day)
    cells.push({
      day,
      month: nextMonth,
      year: nextYear,
      iso,
      isCurrentMonth: false,
      isToday: iso === todayIso,
      isSelected: iso === selectedDatePart,
    })
  }

  return cells
})

// Year options for jump selector
const availableYears = computed(() => {
  const years: number[] = []
  for (let yr = props.minYear; yr <= props.maxYear; yr++) {
    years.push(yr)
  }
  return years
})

function openPicker() {
  if (props.disabled) return
  if (isOpen.value) {
    closePicker()
    return
  }
  isOpen.value = true
  viewMode.value = 'calendar'
  syncFromModel()
}

function closePicker() {
  isOpen.value = false
}

function prevMonth(event?: Event) {
  event?.stopPropagation()
  if (viewMonth.value === 0) {
    viewMonth.value = 11
    viewYear.value--
  } else {
    viewMonth.value--
  }
}

function nextMonth(event?: Event) {
  event?.stopPropagation()
  if (viewMonth.value === 11) {
    viewMonth.value = 0
    viewYear.value++
  } else {
    viewMonth.value++
  }
}

function selectCell(cell: CalendarCell) {
  viewYear.value = cell.year
  viewMonth.value = cell.month
  const val = buildValueString(cell.iso)
  emit('update:modelValue', val)
  emit('change', val)
  if (!props.enableTime) {
    isOpen.value = false
  }
}

function selectMonth(mIdx: number) {
  viewMonth.value = mIdx
  viewMode.value = 'calendar'
}

function selectYear(yr: number) {
  viewYear.value = yr
  viewMode.value = 'calendar'
}

function onTimeChange() {
  const parsed = parseValue(props.modelValue)
  const dateStr = parsed ? parsed.datePart : toIsoDate(viewYear.value, viewMonth.value, today.getDate())
  const val = buildValueString(dateStr)
  emit('update:modelValue', val)
  emit('change', val)
}

function selectToday() {
  const iso = toIsoDate(today.getFullYear(), today.getMonth(), today.getDate())
  viewYear.value = today.getFullYear()
  viewMonth.value = today.getMonth()
  const val = buildValueString(iso)
  emit('update:modelValue', val)
  emit('change', val)
  if (!props.enableTime) {
    isOpen.value = false
  }
}

function clearDate(event?: Event) {
  event?.stopPropagation()
  emit('update:modelValue', '')
  emit('change', '')
}
</script>

<template>
  <div class="relative flex flex-col gap-1.5 w-full">
    <span v-if="label" class="label-text">
      {{ label }}
    </span>

    <!-- Trigger Box with Visible Border -->
    <div
      ref="triggerRef"
      tabindex="0"
      role="button"
      aria-haspopup="dialog"
      :aria-expanded="isOpen"
      :aria-disabled="disabled"
      class="relative w-full min-h-[40px] px-3.5 py-2 form-surface flex items-center justify-between gap-2 text-sm cursor-pointer select-none"
      :class="[
        isOpen ? 'form-surface-active' : '',
        disabled ? 'opacity-50 cursor-not-allowed bg-base-200/50' : '',
        error ? 'border-error ring-1 ring-error/20' : '',
      ]"
      @click="openPicker"
    >
      <div class="flex items-center gap-2.5 truncate">
        <CalendarIcon class="h-4 w-4 shrink-0 text-primary" />
        <span v-if="formattedDisplay" class="font-medium text-base-content truncate">
          {{ formattedDisplay }}
        </span>
        <span v-else class="text-[var(--text-faint)] truncate">
          {{ placeholder }}
        </span>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <span
          v-if="enableTime && modelValue"
          class="badge badge-soft badge-primary text-[10px] px-1.5 py-0.5 font-mono"
        >
          {{ selectedHour }}:{{ selectedMinute }}
        </span>
        <button
          v-if="clearable && modelValue && !disabled"
          type="button"
          class="btn btn-ghost btn-xs btn-circle h-5 w-5 text-[var(--text-faint)] hover:text-base-content"
          title="Kosongkan tanggal"
          @click="clearDate"
        >
          <X class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>

    <!-- Calendar Popup Floating Modal (Teleported, viewport-aware) -->
    <UiFloatingPanel
      :open="isOpen && !disabled"
      :anchor="triggerRef"
      :offset="8"
      panel-role="dialog"
      aria-label="Pilih tanggal"
      panel-class="w-[19rem] sm:w-[21rem] overflow-y-auto rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] p-4 shadow-2xl select-none dark:shadow-[0_12px_36px_rgba(0,0,0,0.55)]"
      @close="closePicker"
    >
        <!-- Top Navigation Header -->
        <div class="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[var(--border)]">
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle h-7 w-7 text-[var(--text-muted)] hover:text-base-content"
            @click.stop="prevMonth"
          >
            <ChevronLeft class="h-4 w-4" />
          </button>

          <!-- Jump Pickers: Month & Year Dropdown/Toggles -->
          <div class="flex items-center gap-1.5">
            <button
              type="button"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-btn text-xs font-bold text-base-content hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06] transition-colors"
              :class="{ 'bg-[var(--accent-soft)] text-[var(--accent)]': viewMode === 'month' }"
              @click="viewMode = viewMode === 'month' ? 'calendar' : 'month'"
            >
              <span>{{ monthNames[viewMonth] }}</span>
              <ChevronDown class="h-3.5 w-3.5 opacity-60" />
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1 px-2 py-1 rounded-btn text-xs font-bold text-base-content hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06] transition-colors"
              :class="{ 'bg-[var(--accent-soft)] text-[var(--accent)]': viewMode === 'year' }"
              @click="viewMode = viewMode === 'year' ? 'calendar' : 'year'"
            >
              <span>{{ viewYear }}</span>
              <ChevronDown class="h-3.5 w-3.5 opacity-60" />
            </button>
          </div>

          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle h-7 w-7 text-[var(--text-muted)] hover:text-base-content"
            @click.stop="nextMonth"
          >
            <ChevronRight class="h-4 w-4" />
          </button>
        </div>

        <!-- MODE 1: MONTH QUICK SELECTOR GRID -->
        <div v-if="viewMode === 'month'" class="grid grid-cols-3 gap-2 py-2">
          <button
            v-for="(mName, idx) in monthShortNames"
            :key="mName"
            type="button"
            class="py-2.5 px-2 rounded-btn text-xs font-semibold transition-colors"
            :class="
              viewMonth === idx
                ? 'bg-primary text-primary-content font-bold shadow-xs'
                : 'text-base-content hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06]'
            "
            @click="selectMonth(idx)"
          >
            {{ mName }}
          </button>
        </div>

        <!-- MODE 2: YEAR QUICK SELECTOR SCROLLABLE GRID -->
        <div v-else-if="viewMode === 'year'" class="h-48 overflow-y-auto grid grid-cols-3 gap-2 p-1 pr-2">
          <button
            v-for="yr in availableYears"
            :key="yr"
            type="button"
            class="py-2 px-2 rounded-btn text-xs font-semibold transition-colors"
            :class="
              viewYear === yr
                ? 'bg-primary text-primary-content font-bold shadow-xs'
                : 'text-base-content hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06]'
            "
            @click="selectYear(yr)"
          >
            {{ yr }}
          </button>
        </div>

        <!-- MODE 3: STANDARD CALENDAR DAYS VIEW -->
        <div v-else>
          <!-- Day Names Header -->
          <div class="grid grid-cols-7 gap-1 mb-1.5 text-center">
            <span
              v-for="day in dayNames"
              :key="day"
              class="text-[10px] font-bold uppercase text-[var(--text-faint)] py-1"
            >
              {{ day }}
            </span>
          </div>

          <!-- Calendar Days Grid -->
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="cell in calendarCells"
              :key="cell.iso"
              type="button"
              class="h-8 w-full rounded-btn text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
              :class="[
                cell.isSelected
                  ? 'bg-primary text-primary-content font-bold shadow-none'
                  : cell.isToday
                    ? 'border border-[var(--border-strong)] text-[var(--text)] font-bold bg-[var(--surface-raised)]'
                    : cell.isCurrentMonth
                      ? 'text-base-content hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06]'
                      : 'text-[var(--text-faint)] opacity-60 hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.04]',
              ]"
              @click.stop="selectCell(cell)"
            >
              {{ cell.day }}
            </button>
          </div>
        </div>

        <!-- OPTIONAL: TIME SELECTOR (Hour & Minute) -->
        <div
          v-if="enableTime && viewMode === 'calendar'"
          class="mt-3.5 pt-3 border-t border-[var(--border)] flex items-center justify-between gap-3 text-xs"
        >
          <div class="flex items-center gap-1.5 text-[var(--text-muted)]">
            <Clock class="h-4 w-4 text-primary" />
            <span class="font-medium">Waktu:</span>
          </div>

          <div class="flex items-center gap-1.5">
            <!-- Hour Picker -->
            <select
              v-model="selectedHour"
              class="select select-xs w-16 text-center font-mono font-medium"
              @change="onTimeChange"
            >
              <option v-for="h in hoursList" :key="h" :value="h">{{ h }}</option>
            </select>
            <span class="font-bold text-[var(--text-faint)]">:</span>
            <!-- Minute Picker -->
            <select
              v-model="selectedMinute"
              class="select select-xs w-16 text-center font-mono font-medium"
              @change="onTimeChange"
            >
              <option v-for="m in minutesList" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
        </div>

        <!-- Calendar Footer (Today Action + Done) -->
        <div class="mt-3.5 pt-2.5 border-t border-[var(--border)] flex items-center justify-between text-xs">
          <button
            type="button"
            class="text-[var(--accent)] font-bold hover:underline cursor-pointer"
            @click.stop="selectToday"
          >
            Hari Ini
          </button>
          <button
            v-if="enableTime"
            type="button"
            class="btn btn-primary btn-xs"
            @click.stop="closePicker"
          >
            Selesai
          </button>
          <span v-else-if="modelValue" class="font-mono text-[11px] text-[var(--text-muted)]">
            {{ modelValue }}
          </span>
        </div>
    </UiFloatingPanel>

    <span v-if="error" class="text-[11px] font-medium text-error">
      {{ error }}
    </span>
    <span v-else-if="hint" class="text-[11px] text-[var(--text-muted)]">
      {{ hint }}
    </span>
  </div>
</template>
