import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { MailDraft, MailFolder, MailMessage } from '@/types/mail'
import { MAIL_SEED } from '@/data/mail'

const CURRENT_USER = { name: 'Arif Nugraha', email: 'arif@tinkit.io' }

function toRecipients(emails: string[]): MailMessage['to'] {
  return emails.map((email) => ({
    name: email.split('@')[0],
    email,
  }))
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export const useMailStore = defineStore('mail', () => {
  const messages = ref<MailMessage[]>(MAIL_SEED.map((message) => ({ ...message })))
  const folder = ref<MailFolder>('inbox')
  const query = ref('')
  const selectedIds = ref<string[]>([])
  const activeId = ref<string | null>(null)

  const folderMessages = computed(() => {
    if (folder.value === 'starred') {
      return messages.value.filter((message) => message.starred)
    }
    return messages.value.filter((message) => message.folder === folder.value)
  })

  const filteredMessages = computed(() => {
    const keyword = query.value.trim().toLowerCase()
    if (!keyword) return folderMessages.value

    return folderMessages.value.filter((message) =>
      `${message.subject} ${message.preview} ${message.from.name}`.toLowerCase().includes(keyword),
    )
  })

  const unreadCounts = computed<Record<MailFolder, number>>(() => ({
    inbox: messages.value.filter((message) => message.folder === 'inbox' && !message.read).length,
    starred: messages.value.filter((message) => message.starred && !message.read).length,
    sent: 0,
    drafts: messages.value.filter((message) => message.folder === 'drafts').length,
    archive: 0,
    trash: 0,
  }))

  const activeMessage = computed(
    () => messages.value.find((message) => message.id === activeId.value) ?? null,
  )

  function setFolder(next: MailFolder) {
    folder.value = next
    query.value = ''
    selectedIds.value = []
    activeId.value = null
  }

  function openMessage(id: string) {
    activeId.value = id
    const message = messages.value.find((item) => item.id === id)
    if (message) message.read = true
  }

  function toggleStar(id: string) {
    const message = messages.value.find((item) => item.id === id)
    if (message) message.starred = !message.starred
  }

  function toggleSelected(id: string) {
    const index = selectedIds.value.indexOf(id)
    if (index === -1) selectedIds.value.push(id)
    else selectedIds.value.splice(index, 1)
  }

  function clearSelection() {
    selectedIds.value = []
  }

  function moveSelected(target: MailFolder) {
    const ids = new Set(selectedIds.value)
    for (const message of messages.value) {
      if (ids.has(message.id)) message.folder = target
    }
    selectedIds.value = []
    activeId.value = null
  }

  function sendMail(draft: MailDraft): string {
    const id = `mail-${Date.now()}`
    const body = draft.body.trim() || '<p></p>'
    messages.value.unshift({
      id,
      folder: 'sent',
      from: { ...CURRENT_USER },
      to: toRecipients(draft.to),
      subject: draft.subject.trim() || '(Tanpa subjek)',
      preview: stripHtml(body).slice(0, 120),
      body,
      date: new Date().toISOString(),
      read: true,
      starred: false,
      labels: [],
      attachments: [],
    })
    return id
  }

  function saveDraft(draft: MailDraft): string {
    const id = `draft-${Date.now()}`
    const body = draft.body.trim() || '<p></p>'
    messages.value.unshift({
      id,
      folder: 'drafts',
      from: { ...CURRENT_USER },
      to: toRecipients(draft.to),
      subject: draft.subject.trim() || '(Tanpa subjek)',
      preview: stripHtml(body).slice(0, 120),
      body,
      date: new Date().toISOString(),
      read: true,
      starred: false,
      labels: [],
      attachments: [],
    })
    return id
  }

  return {
    messages,
    folder,
    query,
    selectedIds,
    activeId,
    folderMessages,
    filteredMessages,
    unreadCounts,
    activeMessage,
    setFolder,
    openMessage,
    toggleStar,
    toggleSelected,
    clearSelection,
    moveSelected,
    sendMail,
    saveDraft,
  }
})
