<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import {
  CheckCircle2,
  Clock,
  Kanban,
  Plus,
  RotateCcw,
  Search,
  Sparkles,
  Trash2,
  X,
} from 'lucide-vue-next'
import type {
  KanbanPriority,
  KanbanStatus,
  KanbanSubtask,
  KanbanTask,
} from '@/types/kanban'
import type { ColorVariant } from '@/types/theme'
import {
  INITIAL_KANBAN_TASKS,
  KANBAN_COLUMNS,
  KANBAN_MEMBERS,
} from '@/data/kanbanTasks'
import { useToast } from '@/stores/toast'
import KanbanColumn from '@/components/kanban/KanbanColumn.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'

const toast = useToast()

function cloneInitialTasks(): KanbanTask[] {
  return INITIAL_KANBAN_TASKS.map((t) => ({
    ...t,
    assignees: [...t.assignees],
    subtasks: t.subtasks.map((s) => ({ ...s })),
  }))
}

const tasks = ref<KanbanTask[]>(cloneInitialTasks())
const searchQuery = ref('')
const activePriority = ref<'all' | KanbanPriority>('all')
const activeMemberId = ref<string | null>(null)
const draggingTask = ref<KanbanTask | null>(null)

const priorityFilterOptions: { label: string; value: 'all' | KanbanPriority }[] = [
  { label: 'Semua', value: 'all' },
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const statusSelectOptions: { label: string; value: KanbanStatus }[] = [
  { label: 'Backlog', value: 'backlog' },
  { label: 'To Do', value: 'todo' },
  { label: 'In Progress', value: 'in-progress' },
  { label: 'In Review', value: 'review' },
  { label: 'Done', value: 'done' },
]

const prioritySelectOptions: { label: string; value: KanbanPriority }[] = [
  { label: 'Urgent', value: 'urgent' },
  { label: 'High', value: 'high' },
  { label: 'Medium', value: 'medium' },
  { label: 'Low', value: 'low' },
]

const categoryPresetOptions: { label: string; value: string; variant: ColorVariant }[] = [
  { label: 'Design System', value: 'Design System', variant: 'primary' },
  { label: 'Backend API', value: 'Backend API', variant: 'info' },
  { label: 'UI/UX', value: 'UI/UX', variant: 'secondary' },
  { label: 'Database', value: 'Database', variant: 'warning' },
  { label: 'QA & Testing', value: 'QA & Testing', variant: 'accent' },
  { label: 'Security', value: 'Security', variant: 'error' },
  { label: 'Workspace', value: 'Workspace', variant: 'success' },
]

const filteredTasks = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return tasks.value.filter((task) => {
    if (activePriority.value !== 'all' && task.priority !== activePriority.value) {
      return false
    }
    if (
      activeMemberId.value &&
      !task.assignees.some((a) => a.id === activeMemberId.value)
    ) {
      return false
    }
    if (q) {
      const hay = `${task.code} ${task.title} ${task.description} ${task.category}`.toLowerCase()
      return hay.includes(q)
    }
    return true
  })
})

function tasksByColumn(status: KanbanStatus): KanbanTask[] {
  return filteredTasks.value.filter((t) => t.status === status)
}

const boardMetrics = computed(() => {
  const total = tasks.value.length
  const inProgress = tasks.value.filter((t) => t.status === 'in-progress').length
  const inReview = tasks.value.filter((t) => t.status === 'review').length
  const done = tasks.value.filter((t) => t.status === 'done').length
  const completionPct = total > 0 ? Math.round((done / total) * 100) : 0

  return { total, inProgress, inReview, done, completionPct }
})

function handleDropTask(taskId: string, targetStatus: KanbanStatus) {
  const found = tasks.value.find((t) => t.id === taskId)
  if (!found || found.status === targetStatus) {
    draggingTask.value = null
    return
  }

  const targetCol = KANBAN_COLUMNS.find((c) => c.id === targetStatus)
  found.status = targetStatus
  draggingTask.value = null

  toast.primary(
    'Status Tugas Diperbarui',
    `${found.code} dipindahkan ke kolom "${targetCol?.title ?? targetStatus}".`,
  )
}

function resetBoard() {
  tasks.value = cloneInitialTasks()
  searchQuery.value = ''
  activePriority.value = 'all'
  activeMemberId.value = null
  toast.info('Board Direset', 'Data tugas sprint dikembalikan ke kondisi awal.')
}

// Create Task Modal State
const createOpen = ref(false)
const createForm = reactive({
  title: '',
  description: '',
  status: 'todo' as KanbanStatus,
  priority: 'medium' as KanbanPriority,
  category: 'Design System',
  dueDate: '2026-11-20',
  assigneeIds: ['mem-1'] as string[],
  firstSubtask: '',
})

function openCreateModal(defaultStatus: KanbanStatus = 'todo') {
  createForm.title = ''
  createForm.description = ''
  createForm.status = defaultStatus
  createForm.priority = 'medium'
  createForm.category = 'Design System'
  createForm.dueDate = '2026-11-20'
  createForm.assigneeIds = ['mem-1']
  createForm.firstSubtask = ''
  createOpen.value = true
}

function toggleCreateAssignee(memberId: string) {
  const idx = createForm.assigneeIds.indexOf(memberId)
  if (idx >= 0) {
    if (createForm.assigneeIds.length > 1) {
      createForm.assigneeIds.splice(idx, 1)
    }
  } else {
    createForm.assigneeIds.push(memberId)
  }
}

function submitCreateTask() {
  if (!createForm.title.trim()) {
    toast.warning('Judul wajib diisi', 'Masukkan judul tugas sebelum menyimpan.')
    return
  }

  const nextNumber = 110 + tasks.value.length
  const catObj = categoryPresetOptions.find((c) => c.value === createForm.category)
  const assignees = KANBAN_MEMBERS.filter((m) => createForm.assigneeIds.includes(m.id))
  const subtasks: KanbanSubtask[] = createForm.firstSubtask.trim()
    ? [{ id: `st-${Date.now()}`, title: createForm.firstSubtask.trim(), done: false }]
    : []

  const newTask: KanbanTask = {
    id: `task-${Date.now()}`,
    code: `TKT-${nextNumber}`,
    title: createForm.title.trim(),
    description: createForm.description.trim(),
    status: createForm.status,
    priority: createForm.priority,
    category: createForm.category,
    categoryVariant: catObj?.variant || 'primary',
    dueDate: createForm.dueDate,
    assignees: assignees.length > 0 ? assignees : [KANBAN_MEMBERS[0]!],
    subtasks,
    commentsCount: 0,
    attachmentsCount: 0,
  }

  tasks.value.unshift(newTask)
  createOpen.value = false
  toast.success('Tugas Ditambahkan', `${newTask.code} — ${newTask.title} berhasil dibuat.`)
}

// Task Detail & Edit Modal State
const detailOpen = ref(false)
const activeTask = ref<KanbanTask | null>(null)
const newSubtaskText = ref('')

function openTaskDetail(task: KanbanTask) {
  activeTask.value = task
  newSubtaskText.value = ''
  detailOpen.value = true
}

function addSubtaskToActive() {
  if (!activeTask.value || !newSubtaskText.value.trim()) return
  activeTask.value.subtasks.push({
    id: `st-${Date.now()}`,
    title: newSubtaskText.value.trim(),
    done: false,
  })
  newSubtaskText.value = ''
}

function removeSubtaskFromActive(subtaskId: string) {
  if (!activeTask.value) return
  activeTask.value.subtasks = activeTask.value.subtasks.filter((s) => s.id !== subtaskId)
}

function toggleActiveTaskAssignee(memberId: string) {
  if (!activeTask.value) return
  const exists = activeTask.value.assignees.some((a) => a.id === memberId)
  if (exists) {
    if (activeTask.value.assignees.length > 1) {
      activeTask.value.assignees = activeTask.value.assignees.filter((a) => a.id !== memberId)
    }
  } else {
    const member = KANBAN_MEMBERS.find((m) => m.id === memberId)
    if (member) {
      activeTask.value.assignees.push(member)
    }
  }
}

function deleteActiveTask() {
  if (!activeTask.value) return
  const code = activeTask.value.code
  tasks.value = tasks.value.filter((t) => t.id !== activeTask.value?.id)
  detailOpen.value = false
  activeTask.value = null
  toast.success('Tugas Dihapus', `Kartu ${code} telah dihapus dari Kanban board.`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Page Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div class="flex items-center gap-2">
          <h1 class="text-2xl font-bold text-[var(--text)]">Kanban Board</h1>
          <UiBadge variant="primary" size="sm" soft>Sprint 15</UiBadge>
        </div>
        <p class="mt-1 text-sm text-[var(--text-muted)]">
          Kelola alur pengerjaan fitur, pantau batas WIP per kolom, dan kolaborasi lintas tim secara visual.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UiButton
          variant="ghost"
          size="sm"
          :icon="RotateCcw"
          @click="resetBoard"
        >
          Reset Board
        </UiButton>
        <UiButton
          variant="primary"
          size="sm"
          :icon="Plus"
          @click="openCreateModal('todo')"
        >
          Tugas Baru
        </UiButton>
      </div>
    </div>

    <!-- Sprint Summary KPI Cards -->
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div class="card p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-[var(--text-muted)]">Total Tugas Sprint</span>
          <span class="flex h-8 w-8 items-center justify-center rounded-btn bg-primary/12 text-primary">
            <Kanban class="h-4 w-4" />
          </span>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-bold text-base-content">{{ boardMetrics.total }}</span>
          <UiBadge variant="primary" size="sm" soft>5 Kolom Aktif</UiBadge>
        </div>
      </div>

      <div class="card p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-[var(--text-muted)]">Sedang Dikerjakan</span>
          <span class="flex h-8 w-8 items-center justify-center rounded-btn bg-info/12 text-info">
            <Clock class="h-4 w-4" />
          </span>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-bold text-base-content">{{ boardMetrics.inProgress }}</span>
          <UiBadge variant="info" size="sm" soft>In Progress</UiBadge>
        </div>
      </div>

      <div class="card p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-[var(--text-muted)]">Menunggu Review QA</span>
          <span class="flex h-8 w-8 items-center justify-center rounded-btn bg-warning/15 text-warning">
            <Sparkles class="h-4 w-4" />
          </span>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-bold text-base-content">{{ boardMetrics.inReview }}</span>
          <UiBadge variant="warning" size="sm" soft>In Review</UiBadge>
        </div>
      </div>

      <div class="card p-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <span class="text-xs font-medium text-[var(--text-muted)]">Tingkat Penyelesaian</span>
          <span class="flex h-8 w-8 items-center justify-center rounded-btn bg-success/12 text-success">
            <CheckCircle2 class="h-4 w-4" />
          </span>
        </div>
        <div class="mt-2 flex items-baseline justify-between">
          <span class="text-2xl font-bold text-base-content">{{ boardMetrics.completionPct }}%</span>
          <UiBadge variant="success" size="sm" soft>{{ boardMetrics.done }} Selesai</UiBadge>
        </div>
      </div>
    </div>

    <!-- Filter & Search Toolbar -->
    <div class="card p-3.5 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      <!-- Left: Search + Priority Filter Pills -->
      <div class="flex flex-wrap items-center gap-2.5">
        <div class="relative flex items-center w-full sm:w-64">
          <Search class="pointer-events-none absolute left-3 h-4 w-4 text-[var(--text-faint)]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari kode, judul, atau tag..."
            class="input input-sm w-full pl-9 pr-7 bg-base-100 border-[var(--border)] text-xs focus:border-primary"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-2 text-[var(--text-muted)] hover:text-base-content cursor-pointer"
            aria-label="Hapus pencarian"
            @click="searchQuery = ''"
          >
            <X class="h-3.5 w-3.5" />
          </button>
        </div>

        <div class="flex flex-wrap items-center gap-1">
          <button
            v-for="opt in priorityFilterOptions"
            :key="opt.value"
            type="button"
            class="btn btn-xs h-7 px-2.5 rounded-btn"
            :class="activePriority === opt.value ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
            @click="activePriority = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <!-- Right: Assignee Quick Filter Avatars -->
      <div class="flex items-center gap-2">
        <span class="text-xs font-medium text-[var(--text-muted)]">Filter Tim:</span>
        <div class="flex items-center gap-1.5">
          <button
            v-for="member in KANBAN_MEMBERS"
            :key="member.id"
            type="button"
            class="rounded-full transition-transform cursor-pointer"
            :class="
              activeMemberId === member.id
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 scale-105'
                : 'opacity-75 hover:opacity-100'
            "
            :title="`Filter: ${member.name}`"
            @click="activeMemberId = activeMemberId === member.id ? null : member.id"
          >
            <UiAvatar
              :src="member.avatar"
              :name="member.name"
              :variant="member.variant || 'primary'"
              size="xs"
            />
          </button>
          <button
            v-if="activeMemberId"
            type="button"
            class="btn btn-ghost btn-xs h-6 px-2 text-[11px]"
            @click="activeMemberId = null"
          >
            Semua Tim
          </button>
        </div>
      </div>
    </div>

    <!-- Horizontal Scrollable Kanban Columns -->
    <div class="overflow-x-auto pb-3">
      <div class="flex items-start gap-4 min-w-max">
        <KanbanColumn
          v-for="col in KANBAN_COLUMNS"
          :key="col.id"
          :column="col"
          :tasks="tasksByColumn(col.id)"
          @select-task="openTaskDetail"
          @create-task="openCreateModal"
          @drop-task="handleDropTask"
          @drag-start="draggingTask = $event"
          @drag-end="draggingTask = null"
        />
      </div>
    </div>

    <!-- Modal: Create New Task -->
    <UiModal
      v-model="createOpen"
      title="Tambah Tugas Kanban Baru"
      subtitle="Buat kartu tugas baru dan tetapkan ke anggota tim sprint"
    >
      <form class="space-y-4" @submit.prevent="submitCreateTask">
        <UiInput
          v-model="createForm.title"
          label="Judul Tugas"
          placeholder="Contoh: Integrasi OAuth2 Google & GitHub"
          required
        />

        <UiTextarea
          v-model="createForm.description"
          label="Deskripsi Singkat"
          placeholder="Jelaskan spesifikasi atau kriteria selesai..."
          :rows="3"
        />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiSelect
            v-model="createForm.status"
            label="Kolom Status"
            :options="statusSelectOptions"
          />
          <UiSelect
            v-model="createForm.priority"
            label="Prioritas"
            :options="prioritySelectOptions"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiSelect
            v-model="createForm.category"
            label="Kategori / Modul"
            :options="categoryPresetOptions"
          />
          <UiDatePicker
            v-model="createForm.dueDate"
            label="Tenggat Waktu"
          />
        </div>

        <UiInput
          v-model="createForm.firstSubtask"
          label="Checklist Subtask Awal (Opsional)"
          placeholder="Contoh: Buat skema validasi token"
        />

        <div class="space-y-1.5">
          <label class="label-text text-xs font-semibold text-base-content/85">
            Penanggung Jawab (Assignees)
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="member in KANBAN_MEMBERS"
              :key="member.id"
              type="button"
              class="inline-flex items-center gap-2 rounded-btn border px-2.5 py-1.5 text-xs transition-colors cursor-pointer"
              :class="
                createForm.assigneeIds.includes(member.id)
                  ? 'border-primary bg-primary/12 text-primary font-semibold'
                  : 'border-[var(--border)] bg-base-100 text-[var(--text-muted)] hover:bg-[var(--surface-raised)]'
              "
              @click="toggleCreateAssignee(member.id)"
            >
              <UiAvatar
                :src="member.avatar"
                :name="member.name"
                :variant="member.variant || 'primary'"
                size="xs"
              />
              <span>{{ member.name }}</span>
            </button>
          </div>
        </div>
      </form>

      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batal</UiButton>
        <UiButton variant="primary" size="sm" :icon="Plus" @click="submitCreateTask">
          Simpan Tugas
        </UiButton>
      </template>
    </UiModal>

    <!-- Modal: Task Detail & Checklist Management -->
    <UiModal
      v-model="detailOpen"
      :title="activeTask ? `${activeTask.code} — Detail Tugas` : 'Detail Tugas'"
      subtitle="Perbarui kolom status, prioritas, tenggat, atau centang daftar subtask"
    >
      <div v-if="activeTask" class="space-y-4">
        <UiInput
          v-model="activeTask.title"
          label="Judul Tugas"
        />

        <UiTextarea
          v-model="activeTask.description"
          label="Deskripsi"
          :rows="3"
        />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UiSelect
            v-model="activeTask.status"
            label="Kolom Status"
            :options="statusSelectOptions"
          />
          <UiSelect
            v-model="activeTask.priority"
            label="Prioritas"
            :options="prioritySelectOptions"
          />
          <UiDatePicker
            v-model="activeTask.dueDate"
            label="Tenggat Waktu"
          />
        </div>

        <!-- Subtasks Checklist Section -->
        <div class="rounded-box border border-[var(--border)] bg-[var(--surface-raised)] p-3.5 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-base-content">
              Checklist Subtask ({{ activeTask.subtasks.filter((s) => s.done).length }}/{{ activeTask.subtasks.length }})
            </span>
          </div>

          <div v-if="activeTask.subtasks.length > 0" class="space-y-2">
            <div
              v-for="sub in activeTask.subtasks"
              :key="sub.id"
              class="flex items-center justify-between gap-2 rounded-btn bg-base-100 px-3 py-2 border border-[var(--border)]"
            >
              <UiCheckbox
                v-model="sub.done"
                :label="sub.title"
                size="sm"
                variant="primary"
              />
              <button
                type="button"
                class="text-[var(--text-faint)] hover:text-error transition-colors cursor-pointer"
                title="Hapus subtask"
                @click="removeSubtaskFromActive(sub.id)"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <p v-else class="text-xs text-[var(--text-muted)]">
            Belum ada item checklist pada tugas ini.
          </p>

          <!-- Add Subtask Inline Form -->
          <form class="flex items-center gap-2 pt-1" @submit.prevent="addSubtaskToActive">
            <input
              v-model="newSubtaskText"
              type="text"
              placeholder="Tambah item checklist baru..."
              class="input input-sm flex-1 bg-base-100 border-[var(--border)] text-xs focus:border-primary"
            />
            <UiButton type="submit" variant="primary" soft size="xs" :icon="Plus">
              Tambah
            </UiButton>
          </form>
        </div>

        <!-- Assignees Selector -->
        <div class="space-y-1.5">
          <label class="label-text text-xs font-semibold text-base-content/85">
            Anggota Tim Bertugas
          </label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="member in KANBAN_MEMBERS"
              :key="member.id"
              type="button"
              class="inline-flex items-center gap-2 rounded-btn border px-2.5 py-1.5 text-xs transition-colors cursor-pointer"
              :class="
                activeTask.assignees.some((a) => a.id === member.id)
                  ? 'border-primary bg-primary/12 text-primary font-semibold'
                  : 'border-[var(--border)] bg-base-100 text-[var(--text-muted)] hover:bg-[var(--surface-raised)]'
              "
              @click="toggleActiveTaskAssignee(member.id)"
            >
              <UiAvatar
                :src="member.avatar"
                :name="member.name"
                :variant="member.variant || 'primary'"
                size="xs"
              />
              <span>{{ member.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <template #footer="{ close }">
        <UiButton variant="error" soft size="sm" :icon="Trash2" @click="deleteActiveTask">
          Hapus Tugas
        </UiButton>
        <UiButton
          variant="primary"
          size="sm"
          @click="
            close();
            toast.success('Perubahan Disimpan', 'Detail tugas telah diperbarui.')
          "
        >
          Selesai
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
