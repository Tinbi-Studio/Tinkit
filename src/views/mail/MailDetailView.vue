<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import MailListPane from '@/components/mail/MailListPane.vue'
import MailDetailPane from '@/components/mail/MailDetailPane.vue'
import { useMailStore } from '@/stores/mail'

const route = useRoute()
const store = useMailStore()

watch(
  () => route.params.id,
  (id) => {
    if (typeof id === 'string') store.openMessage(id)
  },
  { immediate: true },
)
</script>

<template>
  <div class="flex min-w-0 flex-1">
    <MailListPane />
    <MailDetailPane :message-id="String(route.params.id)" />
  </div>
</template>
