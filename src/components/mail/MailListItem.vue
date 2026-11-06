<script setup lang="ts">
import { Star } from 'lucide-vue-next'
import type { MailMessage } from '@/types/mail'
import { formatMailDate } from '@/utils/date'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiBadge from '@/components/ui/UiBadge.vue'

defineProps<{
  message: MailMessage
  active: boolean
  selected: boolean
}>()

const emit = defineEmits<{
  open: [id: string]
  select: [id: string]
  star: [id: string]
}>()
</script>

<template>
  <div
    class="group relative flex gap-2.5 border-b border-[var(--border)] px-3 py-3 transition-colors"
    :class="[
      active ? 'bg-[var(--accent-soft)]' : 'hover:bg-[var(--surface-raised)]',
      !message.read ? 'bg-primary/[0.03]' : '',
    ]"
  >
    <div class="pt-0.5">
      <UiCheckbox
        :model-value="selected"
        size="sm"
        @update:model-value="emit('select', message.id)"
      />
    </div>

    <button type="button" class="min-w-0 flex-1 text-left" @click="emit('open', message.id)">
      <div class="flex items-center justify-between gap-2">
        <span class="flex min-w-0 items-center gap-1.5">
          <span
            v-if="!message.read"
            class="h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
            aria-label="Belum dibaca"
          />
          <span
            class="truncate text-xs"
            :class="message.read ? 'font-medium text-[var(--text-muted)]' : 'font-bold text-base-content'"
          >
            {{ message.from.name }}
          </span>
        </span>
        <span class="shrink-0 text-[10px] text-[var(--text-faint)]">{{ formatMailDate(message.date) }}</span>
      </div>

      <p
        class="mt-0.5 truncate text-xs"
        :class="message.read ? 'text-[var(--text-muted)]' : 'font-semibold text-base-content'"
      >
        {{ message.subject }}
      </p>
      <p class="mt-0.5 line-clamp-2 text-[11px] leading-snug text-[var(--text-faint)]">
        {{ message.preview }}
      </p>

      <div v-if="message.labels.length" class="mt-1.5 flex flex-wrap gap-1">
        <UiBadge v-for="label in message.labels" :key="label" variant="primary" size="sm" soft>
          {{ label }}
        </UiBadge>
      </div>
    </button>

    <button
      type="button"
      class="absolute bottom-2 right-2 rounded-full p-1 transition-opacity"
      :class="message.starred ? 'text-warning' : 'text-[var(--text-faint)] opacity-0 group-hover:opacity-100'"
      title="Tandai berbintang"
      @click.stop="emit('star', message.id)"
    >
      <Star class="h-3.5 w-3.5" :fill="message.starred ? 'currentColor' : 'none'" />
    </button>
  </div>
</template>
