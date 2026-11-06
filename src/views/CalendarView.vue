<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Plus,
  Trash2,
  Users,
} from 'lucide-vue-next'
import type { CalendarCategory, CalendarEvent } from '@/types/calendar'
import { CALENDAR_EVENTS } from '@/data/calendarEvents'
import { useToast } from '@/stores/toast'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import CalendarMonthGrid from '@/components/calendar/CalendarMonthGrid.vue'

const toast = useToast()

const monthNames = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

function toIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

const today = new Date()
const cursor = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const selectedDate = ref(toIso(today))
const events = ref<CalendarEvent[]>(CALENDAR_EVENTS.map((event) => ({ ...event })))

const monthLabel = computed(() => `${monthNames[cursor.value.getMonth()]} ${cursor.value.getFullYear()}`)

const monthEvents = computed(() =>
  events.value.filter((event) => {
    const date = new Date(`${event.date}T00:00:00`)
    return date.getMonth() === cursor.value.getMonth() && date.getFullYear() === cursor.value.getFullYear()
  }),
)

const selectedDayEvents = computed(() =>
  events.value
    .filter((event) => event.date === selectedDate.value)
    .sort((a, b) => a.startTime.localeCompare(b.startTime)),
)

const selectedDayLabel = computed(() => {
  const date = new Date(`${selectedDate.value}T00:00:00`)
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
})

const summary = computed<{ label: string; value: number; color: 'primary' | 'error' | 'accent' }[]>(() => [
  { label: 'Meeting', value: monthEvents.value.filter((e) => e.category === 'meeting').length, color: 'primary' },
  { label: 'Deadline', value: monthEvents.value.filter((e) => e.category === 'deadline').length, color: 'error' },
  { label: 'Pengingat', value: monthEvents.value.filter((e) => e.category === 'reminder').length, color: 'accent' },
])

const categoryOptions: { label: string; value: CalendarCategory }[] = [
  { label: 'Meeting', value: 'meeting' },
  { label: 'Deadline', value: 'deadline' },
  { label: 'Pengingat', value: 'reminder' },
  { label: 'Libur', value: 'holiday' },
]

const createOpen = ref(false)
const form = reactive({
  title: '',
  date: toIso(today),
  startTime: '09:00',
  endTime: '10:00',
  category: 'meeting' as CalendarCategory,
  location: '',
  notes: '',
})

const detailOpen = ref(false)
const detailEvent = ref<CalendarEvent | null>(null)

function shiftMonth(delta: number) {
  cursor.value = new Date(cursor.value.getFullYear(), cursor.value.getMonth() + delta, 1)
}

function goToday() {
  const now = new Date()
  cursor.value = new Date(now.getFullYear(), now.getMonth(), 1)
  selectedDate.value = toIso(now)
}

function openCreate(iso?: string) {
  form.title = ''
  form.date = iso ?? selectedDate.value
  form.startTime = '09:00'
  form.endTime = '10:00'
  form.category = 'meeting'
  form.location = ''
  form.notes = ''
  createOpen.value = true
}

function submitCreate() {
  if (!form.title.trim()) {
    toast.warning('Judul wajib diisi', 'Beri nama acara sebelum menyimpan.')
    return
  }

  const colorByCategory: Record<CalendarCategory, CalendarEvent['color']> = {
    meeting: 'primary',
    deadline: 'error',
    reminder: 'accent',
    holiday: 'neutral',
  }

  events.value.push({
    id: `evt-${Date.now()}`,
    title: form.title.trim(),
    date: form.date,
    startTime: form.startTime,
    endTime: form.endTime,
    category: form.category,
    color: colorByCategory[form.category],
    location: form.location.trim() || undefined,
    notes: form.notes.trim() || undefined,
  })

  selectedDate.value = form.date
  cursor.value = new Date(`${form.date}T00:00:00`)
  createOpen.value = false
  toast.success('Acara ditambahkan', `${form.title} tersimpan di kalender.`)
}

function openDetail(event: CalendarEvent) {
  detailEvent.value = event
  detailOpen.value = true
}

function removeDetailEvent() {
  if (!detailEvent.value) return
  events.value = events.value.filter((event) => event.id !== detailEvent.value?.id)
  detailOpen.value = false
  detailEvent.value = null
  toast.success('Acara dihapus', 'Acara telah dihapus dari kalender.')
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-bold text-[var(--text)]">Kalender</h1>
        <p class="mt-1 text-sm text-[var(--text-muted)]">
          Jadwal rapat, deadline, dan pengingat tim dalam satu tampilan bulanan.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UiButton variant="ghost" size="sm" :icon="ChevronLeft" title="Bulan sebelumnya" @click="shiftMonth(-1)" />
        <UiButton variant="ghost" size="sm" title="Hari ini" @click="goToday">Hari Ini</UiButton>
        <UiButton variant="ghost" size="sm" :icon="ChevronRight" title="Bulan berikutnya" @click="shiftMonth(1)" />
        <UiButton variant="primary" size="sm" :icon="Plus" @click="openCreate()">Tambah Acara</UiButton>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div v-for="item in summary" :key="item.label" class="card p-4">
        <p class="text-xs font-medium text-[var(--text-muted)]">{{ item.label }}</p>
        <p class="mt-1 text-2xl font-bold text-base-content">{{ item.value }}</p>
        <UiBadge :variant="item.color" size="sm" soft class="mt-2">Bulan ini</UiBadge>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <div class="card overflow-hidden">
        <div class="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
          <h2 class="flex items-center gap-2 text-base font-bold text-base-content">
            <CalendarDays class="h-4 w-4 text-primary" />
            {{ monthLabel }}
          </h2>
          <span class="text-xs text-[var(--text-muted)]">{{ monthEvents.length }} acara</span>
        </div>

        <CalendarMonthGrid
          :year="cursor.getFullYear()"
          :month="cursor.getMonth()"
          :events="events"
          :selected-date="selectedDate"
          @select-date="selectedDate = $event"
          @select-event="openDetail"
          @create-event="openCreate"
        />
      </div>

      <UiCard :title="selectedDayLabel" subtitle="Agenda hari terpilih" accent-top="primary">
        <template #actions>
          <UiButton variant="primary" soft size="xs" :icon="Plus" @click="openCreate(selectedDate)">
            Acara
          </UiButton>
        </template>

        <div v-if="selectedDayEvents.length" class="space-y-3">
          <button
            v-for="event in selectedDayEvents"
            :key="event.id"
            type="button"
            class="w-full rounded-btn border border-[var(--border)] p-3 text-left transition-colors hover:bg-[var(--surface-raised)]"
            @click="openDetail(event)"
          >
            <div class="flex items-start justify-between gap-2">
              <p class="text-sm font-bold text-base-content">{{ event.title }}</p>
              <UiBadge :variant="event.color" size="sm" soft>{{ event.category }}</UiBadge>
            </div>
            <div class="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-[var(--text-muted)]">
              <span class="inline-flex items-center gap-1">
                <Clock class="h-3 w-3" /> {{ event.startTime }}–{{ event.endTime }}
              </span>
              <span v-if="event.location" class="inline-flex items-center gap-1">
                <MapPin class="h-3 w-3" /> {{ event.location }}
              </span>
              <span v-if="event.attendees?.length" class="inline-flex items-center gap-1">
                <Users class="h-3 w-3" /> {{ event.attendees.length }} peserta
              </span>
            </div>
          </button>
        </div>

        <UiEmptyState
          v-else
          compact
          title="Tidak ada acara"
          description="Hari ini masih kosong. Tambahkan acara baru untuk mulai mengisi agenda."
          :icon="CalendarDays"
          variant="secondary"
        >
          <template #actions>
            <UiButton variant="primary" size="sm" :icon="Plus" @click="openCreate(selectedDate)">
              Tambah Acara
            </UiButton>
          </template>
        </UiEmptyState>
      </UiCard>
    </div>

    <UiModal v-model="createOpen" title="Tambah Acara" subtitle="Simpan jadwal baru ke kalender tim" max-width="md">
      <div class="space-y-4">
        <UiInput v-model="form.title" label="Judul acara" placeholder="Contoh: Review sprint 14" />
        <UiDatePicker v-model="form.date" label="Tanggal" />
        <div class="grid grid-cols-2 gap-4">
          <label class="flex flex-col gap-1.5">
            <span class="label-text">Mulai</span>
            <input v-model="form.startTime" type="time" class="input input-bordered" />
          </label>
          <label class="flex flex-col gap-1.5">
            <span class="label-text">Selesai</span>
            <input v-model="form.endTime" type="time" class="input input-bordered" />
          </label>
        </div>
        <UiSelect
          v-model="form.category"
          :options="categoryOptions"
          label="Kategori"
          :searchable="false"
          :clearable="false"
        />
        <UiInput v-model="form.location" label="Lokasi (opsional)" placeholder="Google Meet / Kantor" />
        <UiTextarea v-model="form.notes" label="Catatan (opsional)" :rows="3" />

        <div class="flex justify-end gap-2 pt-2">
          <UiButton variant="ghost" @click="createOpen = false">Batal</UiButton>
          <UiButton variant="primary" :icon="Plus" @click="submitCreate">Simpan Acara</UiButton>
        </div>
      </div>
    </UiModal>

    <UiModal v-model="detailOpen" :title="detailEvent?.title" subtitle="Detail acara" max-width="sm">
      <div v-if="detailEvent" class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <UiBadge :variant="detailEvent.color" size="sm" soft>{{ detailEvent.category }}</UiBadge>
          <UiBadge variant="neutral" size="sm" outline>{{ detailEvent.date }}</UiBadge>
        </div>

        <p class="flex items-center gap-2 text-sm text-[var(--text)]">
          <Clock class="h-4 w-4 text-primary" />
          {{ detailEvent.startTime }} – {{ detailEvent.endTime }}
        </p>
        <p v-if="detailEvent.location" class="flex items-center gap-2 text-sm text-[var(--text)]">
          <MapPin class="h-4 w-4 text-primary" /> {{ detailEvent.location }}
        </p>

        <div v-if="detailEvent.attendees?.length" class="space-y-2">
          <p class="text-xs font-bold text-[var(--text-muted)]">Peserta</p>
          <div v-for="attendee in detailEvent.attendees" :key="attendee.email" class="flex items-center gap-2">
            <UiAvatar :name="attendee.name" size="xs" />
            <div class="min-w-0">
              <p class="truncate text-xs font-semibold text-base-content">{{ attendee.name }}</p>
              <p class="truncate text-[11px] text-[var(--text-muted)]">{{ attendee.email }}</p>
            </div>
          </div>
        </div>

        <p
          v-if="detailEvent.notes"
          class="rounded-btn bg-[var(--surface-raised)] p-3 text-xs leading-relaxed text-[var(--text)]"
        >
          {{ detailEvent.notes }}
        </p>

        <div class="flex justify-between gap-2 pt-2">
          <UiButton variant="error" soft size="sm" :icon="Trash2" @click="removeDetailEvent">Hapus</UiButton>
          <UiButton variant="primary" size="sm" @click="detailOpen = false">Tutup</UiButton>
        </div>
      </div>
    </UiModal>
  </div>
</template>
