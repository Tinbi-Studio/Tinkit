<script setup lang="ts">
import { computed } from 'vue'
import { Archive, FileText, HardDrive, Inbox, Plus, Send, Star, Trash2 } from 'lucide-vue-next'
import { useMailStore } from '@/stores/mail'
import type { MailFolder } from '@/types/mail'
import UiProgress from '@/components/ui/UiProgress.vue'

const store = useMailStore()

const folders: { key: MailFolder; label: string; icon: unknown }[] = [
  { key: 'inbox', label: 'Kotak Masuk', icon: Inbox },
  { key: 'starred', label: 'Berbintang', icon: Star },
  { key: 'sent', label: 'Terkirim', icon: Send },
  { key: 'drafts', label: 'Draf', icon: FileText },
  { key: 'archive', label: 'Arsip', icon: Archive },
  { key: 'trash', label: 'Sampah', icon: Trash2 },
]

const counts = computed(() => store.unreadCounts)
</script>

<template>
  <aside
    class="flex w-full shrink-0 flex-row items-center gap-2 overflow-x-auto border-b border-[var(--border)] p-2 lg:w-52 lg:flex-col lg:items-stretch lg:gap-4 lg:overflow-visible lg:border-b-0 lg:border-r lg:p-3"
  >
    <RouterLink to="/mail/compose" class="btn btn-primary shrink-0 justify-center gap-2 lg:w-full">
      <Plus class="h-4 w-4" />
      <span class="lg:hidden">Tulis</span>
      <span class="hidden lg:inline">Tulis Email</span>
    </RouterLink>

    <nav class="flex flex-row gap-0.5 lg:flex-col">
      <button
        v-for="item in folders"
        :key="item.key"
        type="button"
        class="flex shrink-0 items-center justify-between gap-2 rounded-btn px-3 py-2 text-left text-xs font-semibold transition-colors"
        :class="
          store.folder === item.key
            ? 'bg-[var(--accent-soft)] text-[var(--accent)]'
            : 'text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-base-content'
        "
        @click="store.setFolder(item.key)"
      >
        <span class="flex items-center gap-2.5">
          <component :is="item.icon" class="h-4 w-4" />
          {{ item.label }}
        </span>
        <span
          v-if="counts[item.key] > 0"
          class="badge badge-xs font-bold"
          :class="store.folder === item.key ? 'bg-[var(--accent)] text-white' : 'badge-soft badge-primary'"
        >
          {{ counts[item.key] }}
        </span>
      </button>
    </nav>

    <div class="mt-auto hidden rounded-btn border border-[var(--border)] p-3 lg:block">
      <div class="mb-2 flex items-center gap-2 text-[11px] font-bold text-[var(--text-muted)]">
        <HardDrive class="h-3.5 w-3.5" />
        Penyimpanan
      </div>
      <UiProgress :value="18" variant="primary" size="xs" />
      <p class="mt-1.5 text-[10px] text-[var(--text-faint)]">2,7 GB dari 15 GB</p>
    </div>
  </aside>
</template>
