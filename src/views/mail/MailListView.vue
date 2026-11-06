<script setup lang="ts">
import { Mail } from 'lucide-vue-next'
import MailListPane from '@/components/mail/MailListPane.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
</script>

<template>
  <div class="flex min-w-0 flex-1">
    <MailListPane />
    <div class="hidden flex-1 items-center justify-center p-8 md:flex">
      <UiEmptyState
        title="Pilih email untuk dibaca"
        description="Klik salah satu email di daftar kiri untuk melihat isi, lampiran, dan membalas pesan."
        :icon="Mail"
        variant="primary"
        compact
      />
    </div>
  </div>
</template>
