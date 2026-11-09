<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  Calendar,
  CheckSquare,
  GripVertical,
  MessageSquare,
  Paperclip,
} from 'lucide-vue-next'
import type { KanbanPriority, KanbanTask } from '@/types/kanban'
import type { ColorVariant } from '@/types/theme'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiProgress from '@/components/ui/UiProgress.vue'

const props = defineProps<{
  task: KanbanTask
}>()

const emit = defineEmits<{
  select: [task: KanbanTask]
  dragStart: [task: KanbanTask]
  dragEnd: []
}>()

const isDragging = ref(false)

const priorityConfig = computed<{ label: string; variant: ColorVariant }>(() => {
  const map: Record<KanbanPriority, { label: string; variant: ColorVariant }> = {
    urgent: { label: 'Urgent', variant: 'error' },
    high: { label: 'High', variant: 'warning' },
    medium: { label: 'Medium', variant: 'info' },
    low: { label: 'Low', variant: 'neutral' },
  }
  return map[props.task.priority]
})

const subtaskStats = computed(() => {
  const total = props.task.subtasks.length
  const completed = props.task.subtasks.filter((s) => s.done).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  return { total, completed, percent }
})

const formattedDueDate = computed(() => {
  if (!props.task.dueDate) return ''
  try {
    return new Date(`${props.task.dueDate}T00:00:00`).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
    })
  } catch {
    return props.task.dueDate
  }
})

function onDragStart(event: DragEvent) {
  isDragging.value = true
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', props.task.id)
  }
  emit('dragStart', props.task)
}

function onDragEnd() {
  isDragging.value = false
  emit('dragEnd')
}
</script>

<template>
  <article
    draggable="true"
    role="button"
    tabindex="0"
    class="group relative flex flex-col gap-3 rounded-box border border-[var(--border)] bg-base-100 p-3.5 text-left transition-all duration-150 hover:border-primary/45 hover:bg-[var(--surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35 cursor-grab active:cursor-grabbing"
    :class="isDragging ? 'opacity-45 scale-[0.98] ring-2 ring-primary/40' : ''"
    @click="emit('select', task)"
    @keydown.enter.prevent="emit('select', task)"
    @keydown.space.prevent="emit('select', task)"
    @dragstart="onDragStart"
    @dragend="onDragEnd"
  >
    <!-- Top Row: Code + Category & Priority Badges -->
    <div class="flex items-center justify-between gap-2">
      <div class="flex items-center gap-1.5 min-w-0">
        <GripVertical class="h-3.5 w-3.5 shrink-0 text-[var(--text-faint)] opacity-60 group-hover:opacity-100 transition-opacity" />
        <span class="font-mono text-[11px] font-bold text-[var(--text-muted)]">
          {{ task.code }}
        </span>
        <UiBadge :variant="task.categoryVariant" size="sm" soft>
          {{ task.category }}
        </UiBadge>
      </div>

      <UiBadge :variant="priorityConfig.variant" size="sm" soft>
        {{ priorityConfig.label }}
      </UiBadge>
    </div>

    <!-- Title & Short Description -->
    <div class="space-y-1">
      <h3 class="text-sm font-bold leading-snug text-base-content group-hover:text-primary transition-colors">
        {{ task.title }}
      </h3>
      <p
        v-if="task.description"
        class="line-clamp-2 text-xs leading-relaxed text-[var(--text-muted)]"
      >
        {{ task.description }}
      </p>
    </div>

    <!-- Subtasks Progress Bar (if task has subtasks) -->
    <div v-if="subtaskStats.total > 0" class="space-y-1.5 pt-0.5">
      <div class="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
        <span class="inline-flex items-center gap-1 font-medium">
          <CheckSquare class="h-3.5 w-3.5 text-primary" />
          Checklist
        </span>
        <span class="font-mono font-semibold">
          {{ subtaskStats.completed }}/{{ subtaskStats.total }}
        </span>
      </div>
      <UiProgress
        :value="subtaskStats.percent"
        :variant="subtaskStats.percent === 100 ? 'success' : 'primary'"
        size="xs"
      />
    </div>

    <!-- Footer: Assignees + Metadata (Due Date, Comments, Attachments) -->
    <div class="flex items-center justify-between gap-2 border-t border-[var(--border)] pt-2.5 mt-0.5">
      <!-- Stacked Assignee Avatars -->
      <div class="flex items-center -space-x-1.5">
        <UiAvatar
          v-for="member in task.assignees"
          :key="member.id"
          :src="member.avatar"
          :name="member.name"
          :variant="member.variant || 'primary'"
          size="xs"
          bordered
          :title="`${member.name} (${member.role})`"
        />
      </div>

      <!-- Right Meta Indicators -->
      <div class="flex items-center gap-2.5 text-[11px] text-[var(--text-muted)]">
        <span
          v-if="formattedDueDate"
          class="inline-flex items-center gap-1 font-medium"
          title="Tenggat waktu"
        >
          <Calendar class="h-3 w-3 text-[var(--text-faint)]" />
          {{ formattedDueDate }}
        </span>

        <span
          v-if="task.commentsCount > 0"
          class="inline-flex items-center gap-1 font-mono"
          title="Komentar"
        >
          <MessageSquare class="h-3 w-3 text-[var(--text-faint)]" />
          {{ task.commentsCount }}
        </span>

        <span
          v-if="task.attachmentsCount > 0"
          class="inline-flex items-center gap-1 font-mono"
          title="Lampiran"
        >
          <Paperclip class="h-3 w-3 text-[var(--text-faint)]" />
          {{ task.attachmentsCount }}
        </span>
      </div>
    </div>
  </article>
</template>
