<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  Archive,
  ArrowLeft,
  CornerUpLeft,
  FileText,
  Image as ImageIcon,
  Mail as MailIcon,
  Paperclip,
  Send,
  Star,
  Trash2,
} from 'lucide-vue-next'
import { useMailStore } from '@/stores/mail'
import { useToast } from '@/stores/toast'
import { formatFullDate } from '@/utils/date'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'

const props = defineProps<{ messageId: string }>()

const store = useMailStore()
const toast = useToast()
const router = useRouter()

const message = computed(
  () => store.messages.find((item) => item.id === props.messageId) ?? null,
)
const replyBody = ref('')
const showReply = ref(false)

const attachmentIcon = (type: string) => {
  if (type === 'image') return ImageIcon
  return FileText
}

function reply() {
  showReply.value = true
}

function sendReply() {
  if (!message.value) return
  if (!replyBody.value.replace(/<[^>]*>/g, '').trim()) {
    toast.warning('Balasan kosong', 'Tulis isi balasan terlebih dahulu.')
    return
  }
  store.sendMail({
    to: [message.value.from.email],
    cc: [],
    subject: `Re: ${message.value.subject}`,
    body: replyBody.value,
  })
  replyBody.value = ''
  showReply.value = false
  toast.success('Balasan terkirim', `Balasan dikirim ke ${message.value.from.name}.`)
}

function moveCurrent(target: 'archive' | 'trash') {
  if (!message.value) return
  store.selectedIds = [message.value.id]
  store.moveSelected(target)
  toast.success(
    'Email dipindahkan',
    target === 'archive' ? 'Email diarsipkan.' : 'Email dipindahkan ke Sampah.',
  )
  router.push('/mail')
}
</script>

<template>
  <div v-if="message" class="flex min-w-0 flex-1 flex-col">
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-2.5">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-primary md:hidden"
        @click="router.push('/mail')"
      >
        <ArrowLeft class="h-4 w-4" /> Kembali
      </button>

      <div class="flex items-center gap-1">
        <UiButton
          variant="ghost"
          size="xs"
          :icon="Star"
          title="Bintang"
          @click="store.toggleStar(message.id)"
        />
        <UiButton
          variant="ghost"
          size="xs"
          :icon="Archive"
          title="Arsipkan"
          @click="moveCurrent('archive')"
        />
        <UiButton
          variant="ghost"
          size="xs"
          :icon="Trash2"
          title="Hapus"
          @click="moveCurrent('trash')"
        />
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
      <div class="mb-4 flex flex-wrap items-center gap-2">
        <h2 class="text-lg font-bold leading-snug text-base-content">{{ message.subject }}</h2>
        <UiBadge v-for="label in message.labels" :key="label" variant="primary" size="sm" soft>
          {{ label }}
        </UiBadge>
      </div>

      <div class="mb-5 flex items-start gap-3">
        <UiAvatar :name="message.from.name" size="md" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold text-base-content">
            {{ message.from.name }}
            <span class="ml-1 text-xs font-normal text-[var(--text-muted)]">
              &lt;{{ message.from.email }}&gt;
            </span>
          </p>
          <p class="text-[11px] text-[var(--text-faint)]">{{ formatFullDate(message.date) }}</p>
        </div>
      </div>

      <div
        class="mail-body text-sm leading-relaxed text-[var(--text)] [&>p]:mb-3 [&>ul]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5"
        v-html="message.body"
      />

      <div v-if="message.attachments.length" class="mt-6 border-t border-[var(--border)] pt-4">
        <p class="mb-2 flex items-center gap-1.5 text-xs font-bold text-[var(--text-muted)]">
          <Paperclip class="h-3.5 w-3.5" /> {{ message.attachments.length }} lampiran
        </p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="attachment in message.attachments"
            :key="attachment.id"
            type="button"
            class="flex items-center gap-2 rounded-btn border border-[var(--border)] px-3 py-2 text-left transition-colors hover:bg-[var(--surface-raised)]"
            @click="toast.info('Lampiran', `${attachment.name} (${attachment.size})`)"
          >
            <component :is="attachmentIcon(attachment.type)" class="h-4 w-4 text-primary" />
            <span class="text-xs font-semibold text-base-content">{{ attachment.name }}</span>
            <span class="text-[10px] text-[var(--text-faint)]">{{ attachment.size }}</span>
          </button>
        </div>
      </div>

      <div class="mt-6 border-t border-[var(--border)] pt-4">
        <UiButton
          v-if="!showReply"
          variant="primary"
          soft
          size="sm"
          :icon="CornerUpLeft"
          @click="reply"
        >
          Balas Email
        </UiButton>

        <div v-else class="space-y-3">
          <UiRichEditor v-model="replyBody" placeholder="Tulis balasan..." min-height="120px" />
          <div class="flex justify-end gap-2">
            <UiButton variant="ghost" size="sm" @click="showReply = false">Batal</UiButton>
            <UiButton variant="primary" size="sm" :icon="Send" @click="sendReply">Kirim Balasan</UiButton>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-1 items-center justify-center p-8">
    <UiEmptyState
      title="Email tidak ditemukan"
      description="Email ini mungkin sudah dipindahkan atau dihapus."
      :icon="MailIcon"
      compact
    />
  </div>
</template>
