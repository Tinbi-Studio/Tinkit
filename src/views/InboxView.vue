<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import { useToast } from '@/stores/toast'
import {
  Mail,
  Phone,
  MapPin,
  CalendarClock,
  Search,
  Plus,
  Send,
  Paperclip,
  MoreHorizontal,
  Star,
  Trash2,
  Flag,
  Inbox,
  CircleUser,
  StickyNote,
  ShoppingBag,
  MessagesSquare,
  Filter,
} from 'lucide-vue-next'
import { formatIDR } from '@/data/products'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiAvatar, { type AvatarStatus } from '@/components/ui/UiAvatar.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'
import UiDropdown, { type DropdownItem } from '@/components/ui/UiDropdown.vue'
import UiPopover from '@/components/ui/UiPopover.vue'
import UiMessageScroll from '@/components/ui/UiMessageScroll.vue'
import UiChatMessage, { type MessageAuthor } from '@/components/ui/UiChatMessage.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiList, { type ListItem } from '@/components/ui/UiList.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiAccordion from '@/components/ui/UiAccordion.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiRadioCard, { type RadioCardOption } from '@/components/ui/UiRadioCard.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'

type ConversationChannel = 'Website' | 'Marketplace' | 'Email'
type ConversationPriority = 'High' | 'Normal' | 'Low'
type ConversationFilter = 'all' | 'unread' | 'flagged'

interface InboxMessage {
  id: number
  role: 'user' | 'assistant' | 'system'
  content: string
  time: string
  status?: 'sending' | 'sent' | 'delivered' | 'read'
}

interface ConversationOrder {
  id: string
  date: string
  total: number
  status: 'Completed' | 'Shipped' | 'Processing'
}

interface Conversation {
  id: number
  name: string
  email: string
  phone: string
  city: string
  joined: string
  channel: ConversationChannel
  status: AvatarStatus
  unread: number
  flagged: boolean
  priority: ConversationPriority
  tags: string[]
  lifetimeValue: number
  loyalty: number
  lastActive: string
  messages: InboxMessage[]
  orders: ConversationOrder[]
}

const toast = useToast()

let messageId = 100
function nextMessageId(): number {
  messageId += 1
  return messageId
}

const conversations = ref<Conversation[]>([
  {
    id: 1,
    name: 'Rina Kartika',
    email: 'rina.kartika@studio.io',
    phone: '+62 812-2334-9081',
    city: 'Bandung',
    joined: '2025-03-14',
    channel: 'Marketplace',
    status: 'online',
    unread: 1,
    flagged: false,
    priority: 'High',
    tags: ['Nimbus Keyboard', 'Repeat Buyer'],
    lifetimeValue: 18750000,
    loyalty: 68,
    lastActive: '2 menit lalu',
    messages: [
      { id: 1, role: 'system', content: 'Senin, 26 Oktober 2026', time: '' },
      {
        id: 2,
        role: 'assistant',
        content: 'Halo kak, saya mau tanya apakah Nimbus Keyboard masih ready stock?',
        time: '09:12',
      },
      {
        id: 3,
        role: 'user',
        content: 'Halo Rina! Nimbus Keyboard ready stock 48 unit. Mau saya bantu buat pesanan?',
        time: '09:14',
        status: 'read',
      },
      {
        id: 4,
        role: 'assistant',
        content:
          'Sudah saya order kemarin lewat marketplace, nomor TNK-10481. Kira-kira kapan dikirim ya?',
        time: '09:18',
      },
      {
        id: 5,
        role: 'user',
        content:
          'Pesanan TNK-10481 sudah kami serahkan ke JNE REG hari ini. Resi: JKT-BDG-8821. Estimasi 1-2 hari kerja ke Bandung.',
        time: '09:21',
        status: 'delivered',
      },
      {
        id: 6,
        role: 'assistant',
        content: 'Siap, ditunggu ya kak. Terima kasih!',
        time: '09:24',
      },
    ],
    orders: [
      { id: 'TNK-10481', date: '2026-10-26', total: 1450000, status: 'Shipped' },
      { id: 'TNK-10392', date: '2026-09-11', total: 8250000, status: 'Completed' },
    ],
  },
  {
    id: 2,
    name: 'Dimas Pratama',
    email: 'dimas.pratama@nusantara.co',
    phone: '+62 811-9087-2233',
    city: 'Surabaya',
    joined: '2024-11-02',
    channel: 'Website',
    status: 'busy',
    unread: 1,
    flagged: true,
    priority: 'High',
    tags: ['Studio Display', 'Refund'],
    lifetimeValue: 42350000,
    loyalty: 84,
    lastActive: '12 menit lalu',
    messages: [
      { id: 10, role: 'system', content: 'Senin, 26 Oktober 2026', time: '' },
      {
        id: 11,
        role: 'assistant',
        content:
          'Selamat siang, Studio Display yang saya terima ada dead pixel di sudut kiri bawah. Saya ingin ajukan refund.',
        time: '11:02',
      },
      {
        id: 12,
        role: 'user',
        content:
          'Mohon maaf atas ketidaknyamanan ini. Boleh kirimkan foto kondisi panel dan nomor invoice-nya?',
        time: '11:05',
        status: 'read',
      },
      {
        id: 13,
        role: 'assistant',
        content: 'Invoice TNK-10480. Foto sudah saya kirim lewat email ya kak.',
        time: '11:08',
      },
    ],
    orders: [
      { id: 'TNK-10480', date: '2026-10-24', total: 17549000, status: 'Completed' },
      { id: 'TNK-10375', date: '2026-08-19', total: 24800000, status: 'Completed' },
    ],
  },
  {
    id: 3,
    name: 'Nadia Putri',
    email: 'nadia.putri@product.id',
    phone: '+62 856-4412-7889',
    city: 'Yogyakarta',
    joined: '2026-01-21',
    channel: 'Email',
    status: 'away',
    unread: 2,
    flagged: false,
    priority: 'Normal',
    tags: ['Billing', 'Invoice'],
    lifetimeValue: 6300000,
    loyalty: 35,
    lastActive: '1 jam lalu',
    messages: [
      { id: 20, role: 'system', content: 'Minggu, 25 Oktober 2026', time: '' },
      {
        id: 21,
        role: 'assistant',
        content:
          'Saya butuh invoice resmi untuk pembelian Pulse Watch. Apakah bisa dikirim ke email perusahaan saya?',
        time: '14:40',
      },
      {
        id: 22,
        role: 'user',
        content: 'Tentu, kami kirimkan invoice PDF ke nadia.putri@product.id dalam 10 menit.',
        time: '14:44',
        status: 'delivered',
      },
      {
        id: 23,
        role: 'assistant',
        content: 'Sudah diterima, tapi NPWP perusahaan belum tercantum. Bisa diperbaiki?',
        time: '15:12',
      },
      {
        id: 24,
        role: 'assistant',
        content: 'Kalau bisa sekalian kirim faktur pajak ya kak.',
        time: '15:13',
      },
    ],
    orders: [{ id: 'TNK-10479', date: '2026-10-23', total: 3799000, status: 'Processing' }],
  },
  {
    id: 4,
    name: 'Fajar Nugroho',
    email: 'fajar.nugroho@marketing.id',
    phone: '+62 813-2277-5510',
    city: 'Semarang',
    joined: '2026-06-30',
    channel: 'Marketplace',
    status: 'online',
    unread: 0,
    flagged: false,
    priority: 'Low',
    tags: ['Pre-sales', 'Ergo Cloud Chair'],
    lifetimeValue: 1510000,
    loyalty: 18,
    lastActive: '3 jam lalu',
    messages: [
      { id: 30, role: 'system', content: 'Sabtu, 24 Oktober 2026', time: '' },
      {
        id: 31,
        role: 'assistant',
        content:
          'Halo, Ergo Cloud Chair ada varian warna selain graphite? Dan apakah bisa kirim ke Semarang minggu ini?',
        time: '10:15',
      },
      {
        id: 32,
        role: 'user',
        content:
          'Tersedia varian mist gray dan sand. Pengiriman ke Semarang estimasi 2 hari setelah pembayaran.',
        time: '10:19',
        status: 'read',
      },
      {
        id: 33,
        role: 'assistant',
        content: 'Oke, saya diskusi dulu dengan tim kantor. Nanti saya kabari lagi.',
        time: '10:26',
      },
    ],
    orders: [],
  },
  {
    id: 5,
    name: 'Siti Aminah',
    email: 'siti.aminah@finance.id',
    phone: '+62 878-1122-4455',
    city: 'Jakarta Pusat',
    joined: '2025-09-08',
    channel: 'Website',
    status: 'offline',
    unread: 0,
    flagged: false,
    priority: 'Normal',
    tags: ['Slate Desk', 'Refund'],
    lifetimeValue: 24800000,
    loyalty: 56,
    lastActive: 'Kemarin',
    messages: [
      { id: 40, role: 'system', content: 'Jumat, 23 Oktober 2026', time: '' },
      {
        id: 41,
        role: 'assistant',
        content: 'Refund untuk pesanan TNK-10477 sudah saya terima. Terima kasih responnya cepat.',
        time: '16:02',
      },
      {
        id: 42,
        role: 'user',
        content: 'Senang bisa membantu, Bu Siti. Kami tunggu pesanan berikutnya.',
        time: '16:05',
        status: 'read',
      },
    ],
    orders: [{ id: 'TNK-10477', date: '2026-10-21', total: 5890000, status: 'Completed' }],
  },
])

const activeId = ref<number | null>(conversations.value[0]?.id ?? null)
const searchQuery = ref('')
const conversationFilter = ref<ConversationFilter>('all')
const draft = ref('')
const internalMode = ref(false)
const pendingAttachments = ref<UploadedFileItem[]>([])
const typing = ref(false)
const detailTab = ref<'info' | 'notes' | 'orders'>('info')
const internalNote = ref(
  '<p>Pelanggan prioritas tinggi. Riwayat pembelian konsisten dan selalu memberi ulasan positif.</p>',
)
const messageScrollRef = ref<InstanceType<typeof UiMessageScroll> | null>(null)
const timers: number[] = []

const activeConversation = computed(
  () => conversations.value.find((item) => item.id === activeId.value) ?? null,
)

const filterLabel = computed(() => {
  switch (conversationFilter.value) {
    case 'unread':
      return 'Belum dibaca'
    case 'flagged':
      return 'Ditandai'
    case 'all':
    default:
      return 'Semua'
  }
})

const filteredConversations = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  return conversations.value.filter((conversation) => {
    const matchesFilter =
      conversationFilter.value === 'all' ||
      (conversationFilter.value === 'unread' && conversation.unread > 0) ||
      (conversationFilter.value === 'flagged' && conversation.flagged)
    if (!matchesFilter) return false
    if (!query) return true
    return (
      conversation.name.toLowerCase().includes(query) ||
      conversation.email.toLowerCase().includes(query) ||
      conversation.messages.some((message) => message.content.toLowerCase().includes(query))
    )
  })
})

const unreadTotal = computed(() =>
  conversations.value.reduce((total, conversation) => total + conversation.unread, 0),
)
const flaggedTotal = computed(() => conversations.value.filter((item) => item.flagged).length)

const customerTags = computed<string[]>({
  get: () => activeConversation.value?.tags ?? [],
  set: (value) => {
    if (activeConversation.value) activeConversation.value.tags = value
  },
})

const priorityFlag = computed<boolean>({
  get: () => activeConversation.value?.flagged ?? false,
  set: (value) => {
    if (activeConversation.value) activeConversation.value.flagged = value
  },
})

const customerMetaItems = computed<ListItem[]>(() => {
  const conversation = activeConversation.value
  if (!conversation) return []
  return [
    { id: 'email', title: conversation.email, subtitle: 'Email', icon: Mail, variant: 'primary' },
    { id: 'phone', title: conversation.phone, subtitle: 'Telepon', icon: Phone, variant: 'info' },
    { id: 'city', title: conversation.city, subtitle: 'Kota', icon: MapPin, variant: 'success' },
    {
      id: 'joined',
      title: formatDate(conversation.joined),
      subtitle: 'Pelanggan sejak',
      icon: CalendarClock,
      variant: 'warning',
    },
  ]
})

const orderHistoryItems = computed<ListItem[]>(() =>
  (activeConversation.value?.orders ?? []).map((order) => ({
    id: order.id,
    title: order.id,
    subtitle: `${formatDate(order.date)} · ${formatIDR(order.total)}`,
    icon: ShoppingBag,
    variant: 'secondary',
    badge: order.status,
    badgeVariant:
      order.status === 'Completed' ? 'success' : order.status === 'Shipped' ? 'info' : 'warning',
  })),
)

const detailTabs = [
  { id: 'info', label: 'Profil', icon: CircleUser },
  { id: 'notes', label: 'Catatan', icon: StickyNote },
  { id: 'orders', label: 'Pesanan', icon: ShoppingBag },
]

const channelOptions = [
  { label: 'Website', value: 'Website' },
  { label: 'Marketplace', value: 'Marketplace' },
  { label: 'Email', value: 'Email' },
]

const tagOptions = [
  'Pre-sales',
  'Billing',
  'Invoice',
  'Refund',
  'Repeat Buyer',
  'Nimbus Keyboard',
  'Studio Display',
  'Ergo Cloud Chair',
]

const quickReplyItems: DropdownItem[] = [
  { label: 'Sapaan pembuka', value: 'greeting' },
  { label: 'Konfirmasi stok', value: 'stock' },
  { label: 'Info pengiriman', value: 'shipping' },
  { label: 'Penutup & terima kasih', value: 'closing' },
]

const conversationActions: DropdownItem[] = [
  { label: 'Tandai belum dibaca', value: 'unread' },
  { label: 'Tandai / lepas prioritas', value: 'flag' },
  { divider: true },
  { label: 'Arsipkan percakapan', value: 'archive' },
  { label: 'Hapus percakapan', value: 'delete', danger: true },
]

const handlingGuide = [
  {
    id: 'sla',
    title: 'Target respons pertama',
    content:
      'Balas pesan baru maksimal 5 menit pada jam kerja. Jika di luar jam kerja, gunakan balasan cepat dan tandai percakapan untuk ditindaklanjuti besok.',
    badge: 'SLA',
    badgeVariant: 'warning' as const,
  },
  {
    id: 'refund',
    title: 'Eskalasi refund > Rp 10 juta',
    content:
      'Refund di atas Rp 10 juta wajib melalui persetujuan supervisor dan menyertakan bukti QC. Gunakan tab Pesanan untuk memverifikasi nilai transaksi asli.',
    badge: 'Policy',
    badgeVariant: 'error' as const,
  },
  {
    id: 'handover',
    title: 'Serah terima shift',
    content:
      'Tulis ringkasan pada tab Catatan Internal sebelum mengakhiri shift. Sertakan nomor invoice, status refund, dan janji tindak lanjut ke pelanggan.',
    badge: 'Internal',
    badgeVariant: 'info' as const,
  },
]

const showCompose = ref(false)
const showDeleteConfirm = ref(false)
const pendingDelete = ref<Conversation | null>(null)
const newConversation = ref({
  name: '',
  email: '',
  channel: 'Website',
  priority: 'normal' as string | number,
  tags: [] as string[],
  message: '<p>Halo, terima kasih telah menghubungi Tinkit Support.</p>',
  greeting: true,
  files: [] as UploadedFileItem[],
})

const priorityOptions: RadioCardOption[] = [
  {
    value: 'high',
    title: 'Prioritas Tinggi',
    subtitle: 'Respon < 5 menit',
    icon: Flag,
    badge: 'P1',
    badgeVariant: 'error',
  },
  {
    value: 'normal',
    title: 'Prioritas Normal',
    subtitle: 'Respon < 1 jam',
    icon: MessagesSquare,
    badge: 'P2',
    badgeVariant: 'info',
    recommended: true,
  },
  {
    value: 'low',
    title: 'Prioritas Rendah',
    subtitle: 'Respon < 24 jam',
    icon: Inbox,
    badge: 'P3',
    badgeVariant: 'secondary',
  },
]

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value),
  )
}

function currentTime(): string {
  return new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' }).format(new Date())
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function channelBadge(channel: string): 'primary' | 'secondary' | 'info' {
  if (channel === 'Marketplace') return 'secondary'
  if (channel === 'Email') return 'info'
  return 'primary'
}

function priorityBadge(priority: string): 'error' | 'info' | 'neutral' {
  if (priority === 'High') return 'error'
  if (priority === 'Normal') return 'info'
  return 'neutral'
}

function authorFor(message: InboxMessage): MessageAuthor | undefined {
  const conversation = activeConversation.value
  if (message.role === 'system' || !conversation) return undefined
  if (message.role === 'assistant') {
    return { name: conversation.name, status: conversation.status }
  }
  return { name: 'Anda · Tinkit Support', status: 'online' }
}

function scrollToLatest() {
  nextTick(() => messageScrollRef.value?.scrollToBottom())
}

function selectConversation(conversation: Conversation) {
  activeId.value = conversation.id
  conversation.unread = 0
  typing.value = false
  detailTab.value = 'info'
  scrollToLatest()
}

function setFilter(filter: ConversationFilter) {
  conversationFilter.value = filter
}

function handleFilterSelect(item: DropdownItem) {
  if (item.value === 'all' || item.value === 'unread' || item.value === 'flagged') {
    setFilter(item.value)
  }
}

function handleConversationAction(action: DropdownItem) {
  const conversation = activeConversation.value
  if (!conversation) return
  if (action.value === 'unread') {
    conversation.unread += 1
    toast.info('Ditandai Belum Dibaca', `${conversation.name} kembali ke antrean belum dibaca.`)
  }
  if (action.value === 'flag') {
    conversation.flagged = !conversation.flagged
    toast.primary(
      conversation.flagged ? 'Percakapan Ditandai' : 'Tanda Dilepas',
      conversation.name,
    )
  }
  if (action.value === 'archive') {
    archiveConversation(conversation)
  }
  if (action.value === 'delete') {
    pendingDelete.value = conversation
    showDeleteConfirm.value = true
  }
}

function applyQuickReply(value: string | number | undefined) {
  const templates: Record<string, string> = {
    greeting: 'Halo! Terima kasih telah menghubungi Tinkit Support. Ada yang bisa kami bantu?',
    stock: 'Stok saat ini tersedia dan siap dikirim dalam 1x24 jam setelah pembayaran.',
    shipping: 'Paket akan diserahkan ke kurir hari ini. Nomor resi dikirim otomatis via email.',
    closing: 'Terima kasih atas kepercayaan Anda. Semoga harinya menyenangkan!',
  }
  if (typeof value === 'string' && templates[value]) {
    draft.value = templates[value]
  }
}

function sendMessage() {
  const conversation = activeConversation.value
  if (!conversation) return
  const text = draft.value.trim()
  const attachments = pendingAttachments.value
  if (!text && attachments.length === 0) return

  if (internalMode.value) {
    conversation.messages.push({
      id: nextMessageId(),
      role: 'system',
      content: `Catatan internal: ${text || 'Lampiran ditambahkan ke percakapan'}`,
      time: currentTime(),
    })
    draft.value = ''
    internalMode.value = false
    pendingAttachments.value = []
    scrollToLatest()
    return
  }

  const attachmentNote =
    attachments.length > 0
      ? `\n\nLampiran:\n${attachments.map((file) => `- ${file.name}`).join('\n')}`
      : ''

  const message: InboxMessage = {
    id: nextMessageId(),
    role: 'user',
    content: `${text || 'Mengirim lampiran'}${attachmentNote}`,
    time: currentTime(),
    status: 'sending',
  }
  conversation.messages.push(message)
  conversation.lastActive = 'Baru saja'
  draft.value = ''
  pendingAttachments.value = []
  scrollToLatest()

  timers.push(
    window.setTimeout(() => {
      message.status = 'sent'
    }, 450),
  )
  timers.push(
    window.setTimeout(() => {
      message.status = 'delivered'
    }, 900),
  )
  timers.push(
    window.setTimeout(() => {
      typing.value = true
      scrollToLatest()
    }, 1200),
  )
  timers.push(
    window.setTimeout(() => {
      typing.value = false
      const reply =
        'Terima kasih atas informasinya! Saya cek dulu ke tim gudang, estimasi 5 menit ya kak.'
      conversation.messages.push({
        id: nextMessageId(),
        role: 'assistant',
        content: reply,
        time: currentTime(),
      })
      if (activeId.value !== conversation.id) conversation.unread += 1
      scrollToLatest()
    }, 2800),
  )
}

function archiveConversation(conversation: Conversation) {
  conversations.value = conversations.value.filter((item) => item.id !== conversation.id)
  if (activeId.value === conversation.id) {
    activeId.value = conversations.value[0]?.id ?? null
  }
  toast.info('Percakapan Diarsipkan', `${conversation.name} dipindahkan ke arsip.`)
}

function confirmDelete() {
  const conversation = pendingDelete.value
  if (!conversation) return
  conversations.value = conversations.value.filter((item) => item.id !== conversation.id)
  if (activeId.value === conversation.id) {
    activeId.value = conversations.value[0]?.id ?? null
  }
  showDeleteConfirm.value = false
  pendingDelete.value = null
  toast.error('Percakapan Dihapus', `${conversation.name} dihapus dari inbox.`)
}

function openCompose() {
  newConversation.value = {
    name: '',
    email: '',
    channel: 'Website',
    priority: 'normal',
    tags: [],
    message: '<p>Halo, terima kasih telah menghubungi Tinkit Support.</p>',
    greeting: true,
    files: [],
  }
  showCompose.value = true
}

function createConversation() {
  const form = newConversation.value
  if (!form.name.trim() || !form.email.trim()) {
    toast.error('Data Belum Lengkap', 'Nama dan email pelanggan wajib diisi.')
    return
  }

  const priorityMap: Record<string, ConversationPriority> = {
    high: 'High',
    normal: 'Normal',
    low: 'Low',
  }
  const messages: InboxMessage[] = [
    {
      id: nextMessageId(),
      role: 'system',
      content: `Percakapan baru dari kanal ${form.channel}`,
      time: '',
    },
  ]
  if (form.greeting) {
    messages.push({
      id: nextMessageId(),
      role: 'user',
      content: `Halo ${form.name.split(' ')[0]}, terima kasih telah menghubungi Tinkit Support. Ada yang bisa kami bantu?`,
      time: currentTime(),
      status: 'delivered',
    })
  }
  const body = stripHtml(form.message)
  if (body) {
    messages.push({
      id: nextMessageId(),
      role: 'user',
      content: body,
      time: currentTime(),
      status: 'sent',
    })
  }

  const conversation: Conversation = {
    id: Date.now(),
    name: form.name.trim(),
    email: form.email.trim(),
    phone: '-',
    city: '-',
    joined: new Date().toISOString().slice(0, 10),
    channel: form.channel as ConversationChannel,
    status: 'online',
    unread: 0,
    flagged: priorityMap[String(form.priority)] === 'High',
    priority: priorityMap[String(form.priority)] ?? 'Normal',
    tags: [...form.tags],
    lifetimeValue: 0,
    loyalty: 5,
    lastActive: 'Baru saja',
    messages,
    orders: [],
  }

  conversations.value.unshift(conversation)
  showCompose.value = false
  activeId.value = conversation.id
  scrollToLatest()
  toast.success('Percakapan Dibuat', `${conversation.name} siap ditangani tim support.`)
}

function saveNote() {
  toast.success('Catatan Disimpan', 'Catatan internal tersinkron ke seluruh tim support.')
}

watch(activeId, () => {
  scrollToLatest()
})

watch(
  () => activeConversation.value?.messages.length,
  () => scrollToLatest(),
)

onUnmounted(() => {
  timers.forEach((timer) => window.clearTimeout(timer))
})
</script>

<template>
  <div class="space-y-5">
    <!-- Page Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 class="text-xl font-bold text-[var(--text)]">Support Inbox</h4>
        <p class="mt-0.5 text-sm text-[var(--text-muted)]">
          Kelola percakapan pelanggan, balasan cepat, dan riwayat pesanan dalam satu ruang kerja.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <UiBadge variant="primary" soft class="gap-1.5">
          {{ conversations.length }} percakapan
        </UiBadge>
        <UiBadge variant="warning" soft dot>{{ unreadTotal }} belum dibaca</UiBadge>
        <UiButton variant="primary" size="sm" :icon="Plus" @click="openCompose">
          Percakapan Baru
        </UiButton>
      </div>
    </div>

    <UiAlert v-if="flaggedTotal > 0" variant="warning" title="Percakapan prioritas menunggu tindak lanjut">
      <p>
        {{ flaggedTotal }} percakapan ditandai prioritas tinggi, termasuk kasus refund yang perlu
        eskalasi supervisor sebelum akhir shift.
      </p>
      <template #actions>
        <button class="btn btn-warning btn-sm" @click="setFilter('flagged')">
          Lihat Percakapan
        </button>
      </template>
    </UiAlert>

    <div
      class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,300px)_minmax(0,1fr)_minmax(0,320px)]"
    >
      <!-- Conversation List -->
      <section class="card flex h-[22rem] flex-col overflow-hidden xl:h-[calc(100vh-14rem)] xl:min-h-[620px]">
        <div class="flex items-center justify-between gap-2 border-b border-base-300/80 px-4 py-3">
          <div class="min-w-0">
            <h5 class="truncate text-sm font-bold text-base-content">Percakapan</h5>
            <p class="text-[11px] text-base-content/50">{{ filterLabel }} · {{ filteredConversations.length }} hasil</p>
          </div>
          <UiDropdown
            label="Filter"
            variant="ghost"
            size="xs"
            align="right"
            :items="[
              { label: 'Semua percakapan', value: 'all' },
              { label: 'Belum dibaca', value: 'unread' },
              { label: 'Ditandai prioritas', value: 'flagged' },
            ]"
            @select="handleFilterSelect"
          >
            <template #trigger>
              <button
                type="button"
                class="btn btn-ghost btn-xs gap-1.5 border border-base-300"
                :title="`Filter: ${filterLabel}`"
              >
                <Filter class="h-3.5 w-3.5" />
                {{ filterLabel }}
              </button>
            </template>
          </UiDropdown>
        </div>

        <div class="border-b border-base-300/80 p-3">
          <UiInput v-model="searchQuery" placeholder="Cari nama, email, atau pesan..." size="sm">
            <template #icon-left>
              <Search class="h-4 w-4" />
            </template>
          </UiInput>
        </div>

        <div class="flex-1 overflow-y-auto p-2 scrollbar-thin">
          <div
            v-for="conversation in filteredConversations"
            :key="conversation.id"
            class="mb-1 cursor-pointer rounded-btn border p-3 transition-all"
            :class="
              conversation.id === activeId
                ? 'border-primary/30 bg-primary/10'
                : 'border-transparent hover:border-base-300 hover:bg-base-200/50'
            "
            @click="selectConversation(conversation)"
          >
            <div class="flex items-start gap-3">
              <UiAvatar
                :name="conversation.name"
                :status="conversation.status"
                :size="'sm'"
                :variant="conversation.priority === 'High' ? 'error' : 'primary'"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-xs font-bold text-base-content">{{ conversation.name }}</p>
                  <span class="shrink-0 text-[10px] text-base-content/45">{{ conversation.lastActive }}</span>
                </div>
                <p class="mt-0.5 line-clamp-1 text-[11px] text-base-content/55">
                  {{ conversation.messages[conversation.messages.length - 1]?.content }}
                </p>
                <div class="mt-1.5 flex items-center gap-1.5">
                  <Star
                    v-if="conversation.flagged"
                    class="h-3 w-3 fill-warning text-warning"
                  />
                  <UiBadge :variant="channelBadge(conversation.channel)" soft size="sm">
                    {{ conversation.channel }}
                  </UiBadge>
                  <UiBadge
                    v-if="conversation.unread > 0"
                    variant="primary"
                    size="sm"
                    class="ml-auto"
                  >
                    {{ conversation.unread }}
                  </UiBadge>
                </div>
              </div>
            </div>
          </div>

          <UiEmptyState
            v-if="filteredConversations.length === 0"
            title="Tidak Ada Percakapan"
            description="Belum ada percakapan yang cocok dengan filter atau kata kunci saat ini."
            :icon="Inbox"
            compact
            class="m-2"
          >
            <UiButton variant="primary" soft size="sm" @click="searchQuery = ''; setFilter('all')">
              Reset Filter
            </UiButton>
          </UiEmptyState>
        </div>

        <div class="border-t border-base-300/80 px-4 py-2.5 text-[10px] text-base-content/45">
          Menampilkan {{ filteredConversations.length }} dari {{ conversations.length }} percakapan aktif
        </div>
      </section>

      <!-- Chat Thread -->
      <section class="card flex h-[34rem] flex-col overflow-hidden xl:h-[calc(100vh-14rem)] xl:min-h-[620px]">
        <template v-if="activeConversation">
          <div class="flex items-center justify-between gap-3 border-b border-base-300/80 px-4 py-3">
            <div class="flex min-w-0 items-center gap-3">
              <UiAvatar
                :name="activeConversation.name"
                :status="activeConversation.status"
                size="md"
                :variant="activeConversation.priority === 'High' ? 'error' : 'primary'"
              />
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <p class="truncate text-sm font-bold text-base-content">{{ activeConversation.name }}</p>
                  <UiBadge :variant="priorityBadge(activeConversation.priority)" soft size="sm">
                    {{ activeConversation.priority }}
                  </UiBadge>
                </div>
                <p class="truncate text-[11px] text-base-content/50">
                  {{ activeConversation.email }} · {{ activeConversation.channel }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <UiTooltip :text="activeConversation.flagged ? 'Lepas tanda prioritas' : 'Tandai prioritas'">
                <button
                  type="button"
                  class="btn btn-ghost btn-xs btn-circle"
                  @click="priorityFlag = !priorityFlag"
                >
                  <Star
                    class="h-4 w-4"
                    :class="activeConversation.flagged ? 'fill-warning text-warning' : 'text-base-content/50'"
                  />
                </button>
              </UiTooltip>

              <UiPopover title="Kontak Pelanggan" subtitle="Informasi cepat" width-class="w-72">
                <template #trigger>
                  <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Info kontak">
                    <CircleUser class="h-4 w-4" />
                  </button>
                </template>
                <div class="space-y-2.5">
                  <div class="flex items-center gap-2">
                    <Mail class="h-3.5 w-3.5 text-primary" />
                    <span class="truncate">{{ activeConversation.email }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <Phone class="h-3.5 w-3.5 text-primary" />
                    <span>{{ activeConversation.phone }}</span>
                  </div>
                  <div class="flex items-center gap-2">
                    <MapPin class="h-3.5 w-3.5 text-primary" />
                    <span>{{ activeConversation.city }}</span>
                  </div>
                  <div class="flex items-center justify-between border-t border-[var(--border)] pt-2">
                    <span class="text-base-content/60">Lifetime value</span>
                    <strong class="font-mono text-base-content">{{ formatIDR(activeConversation.lifetimeValue) }}</strong>
                  </div>
                </div>
              </UiPopover>

              <UiDropdown
                align="right"
                variant="ghost"
                size="xs"
                :items="conversationActions"
                @select="handleConversationAction"
              >
                <template #trigger>
                  <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Aksi percakapan">
                    <MoreHorizontal class="h-4 w-4" />
                  </button>
                </template>
              </UiDropdown>
            </div>
          </div>

          <UiMessageScroll ref="messageScrollRef" class="flex-1">
            <UiChatMessage
              v-for="message in activeConversation.messages"
              :key="message.id"
              :role="message.role"
              :content="message.content"
              :author="authorFor(message)"
              :timestamp="message.time"
              :status="message.status"
              avatar-size="sm"
            />

            <UiChatMessage
              v-if="typing"
              role="assistant"
              :author="{ name: activeConversation.name, status: activeConversation.status }"
              avatar-size="sm"
            >
              <span class="inline-flex items-center gap-2 text-xs text-base-content/60">
                <UiSpinner size="xs" />
                {{ activeConversation.name }} sedang mengetik...
              </span>
            </UiChatMessage>
          </UiMessageScroll>

          <div class="border-t border-base-300/80 bg-base-200/25 p-3">
            <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
              <UiDropdown
                label="Balasan Cepat"
                variant="ghost"
                size="xs"
                :items="quickReplyItems"
                @select="(item) => applyQuickReply(item.value)"
              />
              <UiCheckbox v-model="internalMode" label="Catatan internal" />
            </div>

            <div class="flex items-end gap-2">
              <UiPopover
                title="Lampiran"
                subtitle="Maksimal 5 MB per berkas"
                position="top"
                width-class="w-80"
              >
                <template #trigger>
                  <button
                    type="button"
                    class="btn btn-ghost btn-sm btn-square relative border border-base-300"
                    aria-label="Lampiran"
                  >
                    <Paperclip class="h-4 w-4" />
                    <span
                      v-if="pendingAttachments.length > 0"
                      class="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-badge bg-primary px-1 text-[9px] font-bold text-primary-content"
                    >
                      {{ pendingAttachments.length }}
                    </span>
                  </button>
                </template>
                <template #default="{ close }">
                  <UiFileUpload
                    v-model="pendingAttachments"
                    mode="file"
                    :multiple="true"
                    :max-size-mb="5"
                    accept=".pdf,.png,.jpg,.jpeg,.zip"
                    hint="Lampiran dikirim bersama pesan berikutnya"
                  />
                  <UiButton variant="ghost" size="xs" class="mt-2" block @click="close()">
                    Selesai
                  </UiButton>
                </template>
              </UiPopover>

              <UiTextarea
                v-model="draft"
                class="flex-1"
                :rows="1"
                :max-rows="6"
                auto-grow
                show-count
                :maxlength="2000"
                :placeholder="
                  internalMode
                    ? 'Tulis catatan internal untuk tim...'
                    : `Balas ${activeConversation.name}...`
                "
                @keydown.enter.exact.prevent="sendMessage"
              />

              <UiButton
                variant="primary"
                size="sm"
                :icon="Send"
                icon-only
                :disabled="!draft.trim() && pendingAttachments.length === 0"
                title="Kirim pesan"
                @click="sendMessage"
              />
            </div>
            <p class="mt-1.5 flex flex-wrap items-center gap-1 text-[10px] text-base-content/40">
              <span>Tekan</span>
              <kbd class="rounded border border-base-300 bg-base-200 px-1 py-0.5 font-mono text-[9px] leading-none">Enter</kbd>
              <span>untuk mengirim,</span>
              <kbd class="rounded border border-base-300 bg-base-200 px-1 py-0.5 font-mono text-[9px] leading-none">Shift + Enter</kbd>
              <span>untuk baris baru.</span>
            </p>
          </div>
        </template>

        <UiEmptyState
          v-else
          title="Pilih Percakapan"
          description="Pilih salah satu percakapan di panel kiri atau buat percakapan baru untuk mulai membalas pelanggan."
          :icon="MessagesSquare"
          class="m-auto"
        >
          <UiButton variant="primary" size="sm" :icon="Plus" @click="openCompose">
            Percakapan Baru
          </UiButton>
        </UiEmptyState>
      </section>

      <!-- Customer Details -->
      <section class="card flex h-[30rem] flex-col overflow-hidden xl:h-[calc(100vh-14rem)] xl:min-h-[620px]">
        <template v-if="activeConversation">
          <div class="flex-1 overflow-y-auto p-4 scrollbar-thin">
            <UiTabs v-model="detailTab" :items="detailTabs" variant="pills" size="sm" full-width>
              <template #info>
                <div class="space-y-4">
              <div class="flex flex-col items-center gap-2 rounded-box border border-base-300 bg-base-200/30 p-4 text-center">
                <UiAvatar
                  :name="activeConversation.name"
                  :status="activeConversation.status"
                  size="lg"
                  :variant="activeConversation.priority === 'High' ? 'error' : 'primary'"
                />
                <div>
                  <p class="text-sm font-bold text-base-content">{{ activeConversation.name }}</p>
                  <p class="text-[11px] text-base-content/50">{{ activeConversation.email }}</p>
                </div>
                <div class="flex flex-wrap justify-center gap-1.5">
                  <UiBadge :variant="priorityBadge(activeConversation.priority)" soft dot size="sm">
                    {{ activeConversation.priority }} priority
                  </UiBadge>
                  <UiBadge :variant="channelBadge(activeConversation.channel)" soft size="sm">
                    {{ activeConversation.channel }}
                  </UiBadge>
                </div>
              </div>

              <UiList :items="customerMetaItems" compact />

              <div class="rounded-box border border-base-300 p-3.5">
                <div class="mb-1.5 flex items-center justify-between">
                  <p class="text-[11px] font-semibold text-base-content/45">
                    Loyalty Tier
                  </p>
                  <UiBadge variant="warning" soft size="sm">Gold</UiBadge>
                </div>
                <UiProgress :value="activeConversation.loyalty" variant="warning" size="sm" show-value />
                <p class="mt-2 text-[11px] text-base-content/55">
                  Total belanja {{ formatIDR(activeConversation.lifetimeValue) }} · {{ activeConversation.orders.length }} pesanan
                </p>
              </div>

              <UiSelectTag
                v-model="customerTags"
                :options="tagOptions"
                label="Tag Pelanggan"
                placeholder="Tambah tag..."
                :max-tags="6"
                allow-create
              />

              <UiCheckbox
                v-model="priorityFlag"
                label="Prioritaskan percakapan ini"
                description="Muncul di antrean atas seluruh agen support."
                variant="warning"
              />

              <UiAlert variant="info" style-type="soft" title="SLA respons 4 jam">
                <p v-if="activeConversation.channel === 'Marketplace'">
                  Kanal marketplace mewajibkan balasan pertama dalam 4 jam agar rating toko tetap aman.
                </p>
                <p v-else>
                  Target balasan pertama 4 jam pada jam kerja. Eskalasi ke supervisor bila melewati batas.
                </p>
              </UiAlert>
                </div>
              </template>

              <template #notes>
                <div class="space-y-4">
                  <UiRichEditor
                    v-model="internalNote"
                    label="Catatan Internal"
                    hint="Hanya terlihat oleh tim support, tidak dikirim ke pelanggan."
                    min-height="140px"
                  />
                  <UiButton variant="primary" size="sm" block @click="saveNote">Simpan Catatan</UiButton>

                  <UiAccordion :items="handlingGuide" variant="bordered" />
                </div>
              </template>

              <template #orders>
                <div class="space-y-4">
                  <UiList
                    v-if="orderHistoryItems.length > 0"
                    :items="orderHistoryItems"
                    @item-click="(item) => toast.info('Detail Pesanan', `Membuka invoice ${item.id}`)"
                  />

                  <UiEmptyState
                    v-else
                    title="Belum Ada Pesanan"
                    description="Pelanggan ini belum pernah menyelesaikan transaksi di Tinkit."
                    :icon="ShoppingBag"
                    compact
                  />

                  <UiButton
                    variant="primary"
                    soft
                    size="sm"
                    block
                    :icon="Plus"
                    @click="toast.primary('Pesanan Manual', 'Form pesanan manual dibuka untuk pelanggan ini.')"
                  >
                    Buat Pesanan Manual
                  </UiButton>
                </div>
              </template>
            </UiTabs>
          </div>
        </template>

        <UiEmptyState
          v-else
          title="Detail Pelanggan"
          description="Pilih percakapan untuk melihat profil, catatan internal, dan riwayat pesanan pelanggan."
          :icon="CircleUser"
          compact
          class="m-auto"
        />
      </section>
    </div>

    <!-- Compose Modal -->
    <UiModal
      v-model="showCompose"
      title="Percakapan Baru"
      subtitle="Mulai percakapan keluar dengan pelanggan atau calon pembeli."
      max-width="xl"
    >
      <div class="space-y-5">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiInput v-model="newConversation.name" label="Nama Pelanggan" placeholder="Contoh: Rina Kartika" />
          <UiInput
            v-model="newConversation.email"
            type="email"
            label="Email Pelanggan"
            placeholder="nama@perusahaan.id"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiSelect v-model="newConversation.channel" :options="channelOptions" label="Kanal Percakapan" />
          <UiSelectTag
            v-model="newConversation.tags"
            :options="tagOptions"
            label="Tag Topik"
            placeholder="Tambah tag..."
            :max-tags="4"
          />
        </div>

        <div>
          <p class="label-text mb-2">Prioritas Penanganan</p>
          <UiRadioCard v-model="newConversation.priority" :options="priorityOptions" :columns="3" gap="sm" />
        </div>

        <UiRichEditor
          v-model="newConversation.message"
          label="Pesan Pembuka"
          placeholder="Tulis pesan pertama untuk pelanggan..."
        />

        <UiFileUpload
          v-model="newConversation.files"
          mode="dropzone"
          label="Lampiran Pendukung"
          accept=".pdf,.png,.jpg,.zip"
          :max-size-mb="5"
          hint="Unggah katalog, invoice, atau dokumen pendukung lain"
        />

        <UiCheckbox
          v-model="newConversation.greeting"
          label="Sertakan sapaan otomatis"
          description="Template salam Tinkit Support ditambahkan di awal percakapan."
          variant="primary"
        />
      </div>

      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batalkan</UiButton>
        <UiButton variant="primary" size="sm" :icon="Send" @click="createConversation">
          Buat &amp; Kirim Pesan
        </UiButton>
      </template>
    </UiModal>

    <!-- Delete Confirmation Modal -->
    <UiModal
      v-model="showDeleteConfirm"
      title="Hapus Percakapan"
      subtitle="Tindakan ini tidak dapat dibatalkan."
      max-width="md"
    >
      <UiAlert variant="error" title="Konfirmasi Penghapusan">
        <p>
          Percakapan dengan <strong>{{ pendingDelete?.name }}</strong> beserta seluruh riwayat pesan
          akan dihapus permanen dari inbox.
        </p>
      </UiAlert>
      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batal</UiButton>
        <UiButton variant="error" size="sm" :icon="Trash2" @click="confirmDelete">Hapus Permanen</UiButton>
      </template>
    </UiModal>
  </div>
</template>
