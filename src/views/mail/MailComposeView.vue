<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Save, Send } from 'lucide-vue-next'
import { useMailStore } from '@/stores/mail'
import { useToast } from '@/stores/toast'
import UiInput from '@/components/ui/UiInput.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiButton from '@/components/ui/UiButton.vue'

const router = useRouter()
const store = useMailStore()
const toast = useToast()

const attachments = ref<UploadedFileItem[]>([])
const form = reactive({
  to: [] as string[],
  cc: [] as string[],
  subject: '',
  body: '',
})

const canSend = computed(() => form.to.length > 0 && form.subject.trim().length > 0)

function send() {
  if (!canSend.value) {
    toast.warning('Lengkapi email', 'Isi minimal satu penerima dan subjek.')
    return
  }
  store.sendMail({ ...form })
  toast.success('Email terkirim', `Pesan dikirim ke ${form.to.length} penerima.`)
  store.setFolder('sent')
  router.push('/mail')
}

function saveDraft() {
  store.saveDraft({ ...form })
  toast.info('Draf disimpan', 'Anda dapat melanjutkannya dari folder Draf.')
  store.setFolder('drafts')
  router.push('/mail')
}
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col">
    <div class="flex items-center justify-between gap-2 border-b border-[var(--border)] px-4 py-2.5">
      <button
        type="button"
        class="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)] hover:text-primary"
        @click="router.push('/mail')"
      >
        <ArrowLeft class="h-4 w-4" /> Kembali
      </button>
      <div class="flex items-center gap-2">
        <UiButton variant="ghost" size="sm" :icon="Save" @click="saveDraft">Simpan Draf</UiButton>
        <UiButton variant="primary" size="sm" :icon="Send" :disabled="!canSend" @click="send">Kirim</UiButton>
      </div>
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
      <div class="space-y-4">
        <UiSelectTag
          v-model="form.to"
          :options="[]"
          label="Kepada"
          placeholder="Ketik alamat email lalu Enter..."
          allow-create
        />
        <UiSelectTag
          v-model="form.cc"
          :options="[]"
          label="Cc (opsional)"
          placeholder="Tambah penerima cc..."
          allow-create
        />
        <UiInput v-model="form.subject" label="Subjek" placeholder="Subjek email" />
        <UiRichEditor
          v-model="form.body"
          label="Isi pesan"
          min-height="220px"
          placeholder="Tulis pesan Anda..."
        />
        <UiFileUpload
          v-model="attachments"
          mode="dropzone"
          label="Lampiran"
          hint="Maksimal 10 MB per file"
        />
      </div>
    </div>
  </div>
</template>
