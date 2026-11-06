<script setup lang="ts">
import MailFolderRail from '@/components/mail/MailFolderRail.vue'
</script>

<template>
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-[var(--text)]">Mail Workspace</h1>
      <p class="mt-1 text-sm text-[var(--text-muted)]">
        Kelola kotak masuk, balas email, dan susun pesan baru dalam satu ruang kerja.
      </p>
    </div>

    <div class="overflow-hidden rounded-box border border-[var(--border)] bg-base-100">
      <div class="flex h-[calc(100dvh-13rem)] min-h-[34rem] max-h-[52rem] flex-col lg:flex-row">
        <MailFolderRail />
        <RouterView />
      </div>
    </div>
  </div>
</template>
