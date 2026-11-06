<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Archive, Inbox, RefreshCw, Search, Trash2, XCircle } from 'lucide-vue-next'
import { useMailStore } from '@/stores/mail'
import { useToast } from '@/stores/toast'
import MailListItem from './MailListItem.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'

const store = useMailStore()
const toast = useToast()
const router = useRouter()

function openMessage(id: string) {
  store.openMessage(id)
  router.push(`/mail/${id}`)
}

const allSelected = computed(
  () =>
    store.filteredMessages.length > 0 &&
    store.selectedIds.length === store.filteredMessages.length,
)

const folderLabel = computed(() => {
  const labels: Record<string, string> = {
    inbox: 'Kotak Masuk',
    starred: 'Berbintang',
    sent: 'Terkirim',
    drafts: 'Draf',
    archive: 'Arsip',
    trash: 'Sampah',
  }
  return labels[store.folder] ?? 'Mail'
})

function toggleSelectAll() {
  if (allSelected.value) {
    store.clearSelection()
    return
  }
  store.selectedIds = store.filteredMessages.map((message) => message.id)
}

function archiveSelected() {
  if (!store.selectedIds.length) return
  store.moveSelected('archive')
  toast.success('Email diarsipkan', 'Email terpilih dipindahkan ke Arsip.')
}

function trashSelected() {
  if (!store.selectedIds.length) return
  store.moveSelected('trash')
  toast.success('Email dipindahkan', 'Email terpilih dipindahkan ke Sampah.')
}

function refresh() {
  toast.info('Kotak masuk disegarkan', 'Tidak ada email baru untuk saat ini.')
}
</script>

<template>
  <div class="flex w-full shrink-0 flex-col border-r border-[var(--border)] md:w-80 lg:w-96">
    <div class="border-b border-[var(--border)] p-3">
      <div class="mb-2 flex items-center justify-between">
        <h2 class="flex items-center gap-2 text-sm font-bold text-base-content">
          <Inbox class="h-4 w-4 text-primary" />
          {{ folderLabel }}
          <span class="text-xs font-medium text-[var(--text-faint)]">({{ store.filteredMessages.length }})</span>
        </h2>
        <button
          type="button"
          class="rounded-full p-1.5 text-[var(--text-faint)] hover:bg-[var(--surface-raised)] hover:text-primary"
          title="Muat ulang"
          @click="refresh"
        >
          <RefreshCw class="h-3.5 w-3.5" />
        </button>
      </div>

      <UiInput v-model="store.query" placeholder="Cari email, pengirim, subjek...">
        <template #icon-left>
          <Search class="h-4 w-4" />
        </template>
      </UiInput>
    </div>

    <div class="flex items-center justify-between gap-2 border-b border-[var(--border)] px-3 py-2">
      <label class="flex items-center gap-2">
        <UiCheckbox :model-value="allSelected" size="sm" @update:model-value="toggleSelectAll" />
        <span class="text-[11px] font-medium text-[var(--text-muted)]">
          {{ store.selectedIds.length ? `${store.selectedIds.length} dipilih` : 'Pilih semua' }}
        </span>
      </label>

      <div class="flex items-center gap-1">
        <UiButton
          variant="ghost"
          size="xs"
          :icon="Archive"
          title="Arsipkan"
          :disabled="!store.selectedIds.length"
          @click="archiveSelected"
        />
        <UiButton
          variant="ghost"
          size="xs"
          :icon="Trash2"
          title="Hapus"
          :disabled="!store.selectedIds.length"
          @click="trashSelected"
        />
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto">
      <MailListItem
        v-for="message in store.filteredMessages"
        :key="message.id"
        :message="message"
        :active="store.activeId === message.id"
        :selected="store.selectedIds.includes(message.id)"
        @open="openMessage"
        @select="(id) => store.toggleSelected(id)"
        @star="(id) => store.toggleStar(id)"
      />

      <div v-if="!store.filteredMessages.length" class="p-4">
        <UiEmptyState
          compact
          :title="store.query ? 'Email tidak ditemukan' : 'Folder masih kosong'"
          :description="
            store.query
              ? 'Coba kata kunci lain atau hapus filter pencarian.'
              : 'Belum ada email di folder ini.'
          "
          :icon="store.query ? XCircle : Inbox"
          variant="secondary"
        />
      </div>
    </div>
  </div>
</template>
