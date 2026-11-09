<script setup lang="ts">
import { computed, ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import type { KanbanColumnConfig, KanbanStatus, KanbanTask } from '@/types/kanban'
import type { ColorVariant } from '@/types/theme'
import KanbanTaskCard from './KanbanTaskCard.vue'

const props = defineProps<{
  column: KanbanColumnConfig
  tasks: KanbanTask[]
}>()

const emit = defineEmits<{
  selectTask: [task: KanbanTask]
  createTask: [status: KanbanStatus]
  dropTask: [taskId: string, targetStatus: KanbanStatus]
  dragStart: [task: KanbanTask]
  dragEnd: []
}>()

const isDragOver = ref(false)

const isOverWip = computed(() =>
  Boolean(props.column.wipLimit && props.tasks.length > props.column.wipLimit),
)

const dotClass = computed(() => {
  const map: Record<ColorVariant, string> = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    neutral: 'bg-neutral',
    info: 'bg-info',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
  }
  return map[props.column.variant]
})

function onDragOver(event: DragEvent) {
  event.preventDefault()
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
  isDragOver.value = true
}

function onDragLeave(event: DragEvent) {
  const currentTarget = event.currentTarget as HTMLElement | null
  const related = event.relatedTarget as Node | null
  if (currentTarget && related && currentTarget.contains(related)) {
    return
  }
  isDragOver.value = false
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragOver.value = false
  const taskId = event.dataTransfer?.getData('text/plain')
  if (taskId) {
    emit('dropTask', taskId, props.column.id)
  }
}
</script>

<template>
  <section
    class="flex flex-col rounded-box border transition-colors duration-150 min-w-[290px] w-[310px] sm:w-[320px] shrink-0 bg-[var(--surface-1)]"
    :class="
      isDragOver
        ? 'border-primary bg-primary/[0.04] ring-2 ring-primary/20'
        : 'border-[var(--border)]'
    "
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <!-- Column Header -->
    <header class="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3.5 py-3">
      <div class="flex items-center gap-2 min-w-0">
        <span class="h-2.5 w-2.5 rounded-full shrink-0" :class="dotClass" />
        <h2 class="truncate text-sm font-bold text-base-content">
          {{ column.title }}
        </h2>
        <span
          class="badge badge-xs font-mono font-semibold"
          :class="isOverWip ? 'badge-soft badge-warning' : 'badge-soft badge-neutral'"
          :title="column.wipLimit ? `Batas WIP: ${column.wipLimit} tugas` : undefined"
        >
          {{ tasks.length }}<template v-if="column.wipLimit">/{{ column.wipLimit }}</template>
        </span>
      </div>

      <button
        type="button"
        class="btn btn-ghost btn-xs btn-square h-7 w-7 text-[var(--text-muted)] hover:text-primary"
        :title="`Tambah tugas ke ${column.title}`"
        @click="emit('createTask', column.id)"
      >
        <Plus class="h-4 w-4" />
      </button>
    </header>

    <!-- Cards List / Dropzone -->
    <div class="flex-1 space-y-3 p-3 min-h-[260px]">
      <KanbanTaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        @select="emit('selectTask', $event)"
        @drag-start="emit('dragStart', $event)"
        @drag-end="emit('dragEnd')"
      />

      <!-- Empty Column Drop Hint -->
      <div
        v-if="tasks.length === 0"
        class="flex flex-col items-center justify-center rounded-box border border-dashed border-[var(--border)] py-10 px-4 text-center"
      >
        <p class="text-xs font-medium text-[var(--text-muted)]">
          Belum ada kartu di kolom ini
        </p>
        <button
          type="button"
          class="mt-2.5 btn btn-soft btn-primary btn-xs gap-1"
          @click="emit('createTask', column.id)"
        >
          <Plus class="h-3.5 w-3.5" />
          Tambah Tugas
        </button>
      </div>
    </div>
  </section>
</template>
