<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useToast } from '@/stores/toast'
import {
  Settings,
  Save,
  Building2,
  CreditCard,
  Bell,
  ShieldCheck,
  KeyRound,
  Plus,
  Download,
  Trash2,
  MoreHorizontal,
  Smartphone,
  Laptop,
  Globe,
  Clock,
  Zap,
  Mail,
  CalendarDays,
  MessageSquare,
  ReceiptText,
  Lock,
  Webhook,
  ScrollText,
  Rocket,
  TrendingUp,
} from 'lucide-vue-next'
import { formatIDR } from '@/data/products'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiInputCurrency from '@/components/ui/UiInputCurrency.vue'
import UiInputPercent from '@/components/ui/UiInputPercent.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiRadioCard, { type RadioCardOption } from '@/components/ui/UiRadioCard.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiTable from '@/components/ui/UiTable.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiList, { type ListItem } from '@/components/ui/UiList.vue'
import UiTimeline, { type TimelineItem } from '@/components/ui/UiTimeline.vue'
import UiCodeBlock from '@/components/ui/UiCodeBlock.vue'
import UiAccordion from '@/components/ui/UiAccordion.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiDropdown, { type DropdownItem } from '@/components/ui/UiDropdown.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import type { TableColumn } from '@/types/table'

interface Invoice {
  id: string
  period: string
  amount: number
  status: 'Paid' | 'Pending' | 'Overdue'
  issued: string
}

interface SessionRow {
  id: string
  device: string
  browser: string
  location: string
  lastActive: string
  icon: 'laptop' | 'phone'
  current: boolean
}

interface ApiKey {
  id: string
  label: string
  prefix: string
  scope: string
  created: string
  lastUsed: string
}

interface WebhookRow {
  id: number
  url: string
  events: string[]
  active: boolean
}

const toast = useToast()

const activeTab = ref<'general' | 'billing' | 'notifications' | 'security' | 'api'>('general')
const saving = ref(false)
const timer = ref<number | null>(null)

const tabs = [
  { id: 'general', label: 'Umum', icon: Settings },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'notifications', label: 'Notifikasi', icon: Bell },
  { id: 'security', label: 'Keamanan', icon: ShieldCheck },
  { id: 'api', label: 'API & Webhook', icon: KeyRound },
]

// ---------- General ----------
const workspace = ref({
  name: 'Tinkit Studio',
  slug: 'tinkit-studio',
  email: 'halo@tinkit.example',
  timezone: 'Asia/Jakarta',
  language: 'id',
  companySize: '51-200',
  tags: ['SaaS', 'E-commerce', 'Indonesia'],
  description:
    '<p>Tinkit Studio membangun platform commerce dan tooling internal untuk brand premium di Asia Tenggara.</p>',
  logo: [] as UploadedFileItem[],
})

const preferences = ref({
  density: 'comfortable' as string | number,
  defaultPageSize: '25',
  reduceMotion: false,
  sidebarLabels: true,
  weeklyDigest: true,
})

const timezoneOptions = [
  { label: 'Waktu Indonesia Barat (GMT+7)', value: 'Asia/Jakarta' },
  { label: 'Waktu Indonesia Tengah (GMT+8)', value: 'Asia/Makassar' },
  { label: 'Waktu Indonesia Timur (GMT+9)', value: 'Asia/Jayapura' },
  { label: 'Singapore (GMT+8)', value: 'Asia/Singapore' },
]

const languageOptions = [
  { label: 'Bahasa Indonesia', value: 'id' },
  { label: 'English', value: 'en' },
]

const companySizeOptions = [
  { label: '1-10 karyawan', value: '1-10' },
  { label: '11-50 karyawan', value: '11-50' },
  { label: '51-200 karyawan', value: '51-200' },
  { label: '201-1000 karyawan', value: '201-1000' },
]

const pageSizeOptions = [
  { label: '10 baris', value: '10' },
  { label: '25 baris', value: '25' },
  { label: '50 baris', value: '50' },
]

const densityOptions: RadioCardOption[] = [
  {
    value: 'comfortable',
    title: 'Comfortable',
    subtitle: 'Ruang lega untuk tim',
    description: 'Padding besar, tinggi baris lebih longgar, cocok untuk penggunaan intensif.',
    icon: Settings,
    badge: 'Default',
    badgeVariant: 'primary',
    recommended: true,
  },
  {
    value: 'compact',
    title: 'Compact',
    subtitle: 'Informasi padat',
    description: 'Menampilkan lebih banyak data pada satu layar, ideal untuk dashboard ops.',
    icon: ScrollText,
    badge: 'Power user',
    badgeVariant: 'info',
  },
]

const workspaceTagOptions = ['SaaS', 'E-commerce', 'Agency', 'Fintech', 'Indonesia', 'Enterprise']

// ---------- Billing ----------
const billing = ref({
  threshold: 2500000 as number | null,
  warnPercent: 80 as number | null,
  renewalDate: '2026-12-01',
  autoRenew: true,
  invoiceCopy: true,
  poNumber: 'PO-TNK-2026-118',
})

const plans: RadioCardOption[] = [
  {
    value: 'starter',
    title: 'Starter',
    subtitle: 'Untuk tim kecil',
    description: '5 seat, 1 workspace, dukungan email pada jam kerja.',
    icon: Rocket,
    badge: 'Rp 499rb/bln',
    badgeVariant: 'info',
    meta: '5 seat',
  },
  {
    value: 'growth',
    title: 'Growth',
    subtitle: 'Skala operasional',
    description: '15 seat, analitik lanjutan, otomasi alur kerja, dan SLA 8 jam.',
    icon: TrendingUp,
    badge: 'Rp 1,9jt/bln',
    badgeVariant: 'primary',
    meta: '15 seat',
  },
  {
    value: 'enterprise',
    title: 'Enterprise',
    subtitle: 'Kebutuhan korporat',
    description: 'Seat tak terbatas, SSO, audit log, dedicated success manager.',
    icon: Building2,
    badge: 'Aktif',
    badgeVariant: 'success',
    meta: 'Unlimited',
    recommended: true,
  },
]

const currentPlan = ref<string | number>('enterprise')
const showPlanModal = ref(false)
const pendingPlan = ref<string | number>('enterprise')

const invoices = ref<Invoice[]>([
  { id: 'INV-2026-10', period: 'Oktober 2026', amount: 4250000, status: 'Pending', issued: '2026-10-01' },
  { id: 'INV-2026-09', period: 'September 2026', amount: 4250000, status: 'Paid', issued: '2026-09-01' },
  { id: 'INV-2026-08', period: 'Agustus 2026', amount: 3900000, status: 'Paid', issued: '2026-08-01' },
  { id: 'INV-2026-07', period: 'Juli 2026', amount: 3900000, status: 'Overdue', issued: '2026-07-01' },
])

const invoiceColumns: TableColumn<Invoice>[] = [
  { key: 'id', label: 'Invoice', sortable: true },
  { key: 'period', label: 'Periode' },
  { key: 'issued', label: 'Terbit', sortable: true },
  { key: 'amount', label: 'Nominal', align: 'right', sortable: true },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions', label: '', align: 'right', width: '60px' },
]

const showCardModal = ref(false)
const cardForm = ref({
  holder: 'Tinkit Studio',
  number: '4111 1111 1111 1111',
  brand: 'visa',
  expiry: '2028-04-30',
  cvc: '',
})

const brandOptions = [
  { label: 'Visa', value: 'visa' },
  { label: 'Mastercard', value: 'mastercard' },
  { label: 'JCB', value: 'jcb' },
]

const seatUsage = 18
const seatLimit = 25

const selectedPlanTitle = computed(
  () => plans.find((option) => option.value === currentPlan.value)?.title ?? 'Enterprise',
)

function invoiceBadge(status: string): 'success' | 'warning' | 'error' {
  if (status === 'Paid') return 'success'
  if (status === 'Pending') return 'warning'
  return 'error'
}

function invoiceActions(): DropdownItem[] {
  return [
    { label: 'Unduh PDF', value: 'pdf', icon: Download },
    { label: 'Kirim ulang email', value: 'email', icon: Mail },
  ]
}

function handleInvoiceAction(action: DropdownItem, invoice: Invoice) {
  if (action.value === 'pdf') {
    toast.success('Invoice Diunduh', `${invoice.id} tersimpan sebagai PDF.`)
  } else {
    toast.info('Invoice Dikirim Ulang', `${invoice.id} dikirim ke finance@tinkit.example.`)
  }
}

function openPlanModal() {
  pendingPlan.value = currentPlan.value
  showPlanModal.value = true
}

function confirmPlan() {
  currentPlan.value = pendingPlan.value
  showPlanModal.value = false
  toast.success('Paket Diperbarui', `Workspace kini menggunakan paket ${selectedPlanTitle.value}.`)
}

function saveCard() {
  if (!cardForm.value.holder.trim() || !cardForm.value.number.trim()) {
    toast.error('Data Kartu Tidak Lengkap', 'Nama pemegang kartu dan nomor kartu wajib diisi.')
    return
  }
  showCardModal.value = false
  toast.success('Metode Pembayaran Disimpan', 'Kartu berhasil diperbarui untuk penagihan otomatis.')
}

// ---------- Notifications ----------
const digest = ref<string | number>('daily')
const notifyChannels = ref({
  email: true,
  push: true,
  slack: false,
  whatsapp: false,
})
const notifyTopics = ref(['Order updates', 'Security alerts'])
const quietHours = ref({
  start: '21:00',
  end: '07:00',
  enabled: true,
})

const digestOptions: RadioCardOption[] = [
  {
    value: 'realtime',
    title: 'Real-time',
    subtitle: 'Notifikasi seketika',
    description: 'Setiap event penting dikirim langsung ke kanal terpilih.',
    icon: Zap,
    badge: 'Instant',
    badgeVariant: 'warning',
  },
  {
    value: 'daily',
    title: 'Ringkasan Harian',
    subtitle: 'Sekali sehari pukul 08:00',
    description: 'Kompilasi pesanan, pembayaran, dan isu operasional dalam satu email.',
    icon: Mail,
    badge: 'Populer',
    badgeVariant: 'primary',
    recommended: true,
  },
  {
    value: 'weekly',
    title: 'Ringkasan Mingguan',
    subtitle: 'Setiap Senin pagi',
    description: 'Laporan performa mingguan untuk stakeholder dan manajemen.',
    icon: CalendarDays,
    badge: 'Executive',
    badgeVariant: 'info',
  },
]

const topicOptions = [
  'Order updates',
  'Security alerts',
  'Inventory alerts',
  'Billing',
  'Product reviews',
  'Team mentions',
]

const timeOptions = [
  { label: '18:00 WIB', value: '18:00' },
  { label: '21:00 WIB', value: '21:00' },
  { label: '22:00 WIB', value: '22:00' },
  { label: '23:00 WIB', value: '23:00' },
  { label: '07:00 WIB', value: '07:00' },
]

// ---------- Security ----------
const security = ref({
  twoFactor: true,
  requireApproval: true,
  sessionTimeout: '30',
  ipAllowlist: '',
  ssoEnabled: false,
})

const sessionTimeoutOptions = [
  { label: '15 menit', value: '15' },
  { label: '30 menit', value: '30' },
  { label: '1 jam', value: '60' },
  { label: '8 jam', value: '480' },
]

const sessions = ref<SessionRow[]>([
  {
    id: 's1',
    device: 'MacBook Pro 14"',
    browser: 'Chrome 130 · macOS',
    location: 'Jakarta, ID',
    lastActive: 'Aktif sekarang',
    icon: 'laptop',
    current: true,
  },
  {
    id: 's2',
    device: 'iPhone 15 Pro',
    browser: 'Safari · iOS 18',
    location: 'Bandung, ID',
    lastActive: '2 jam lalu',
    icon: 'phone',
    current: false,
  },
  {
    id: 's3',
    device: 'Dell XPS 15',
    browser: 'Edge 129 · Windows 11',
    location: 'Surabaya, ID',
    lastActive: 'Kemarin, 21:40',
    icon: 'laptop',
    current: false,
  },
])

const sessionColumns: TableColumn<SessionRow>[] = [
  { key: 'device', label: 'Perangkat' },
  { key: 'location', label: 'Lokasi' },
  { key: 'lastActive', label: 'Aktivitas Terakhir' },
  { key: 'current', label: 'Status', align: 'center' },
  { key: 'actions', label: '', align: 'right', width: '100px' },
]

const showRevokeModal = ref(false)
const revokeTarget = ref<SessionRow | null>(null)

const securityTimeline: TimelineItem[] = [
  {
    id: 'sec-1',
    title: 'Login berhasil dari perangkat baru',
    description: 'iPhone 15 Pro · Jakarta, ID · metode 2FA authenticator.',
    time: 'Hari ini, 08:12',
    variant: 'success',
    icon: ShieldCheck,
    badge: 'Login',
  },
  {
    id: 'sec-2',
    title: 'API key production dirotasi',
    description: 'Dilakukan oleh arif.budiman@tinkit.example.',
    time: 'Kemarin, 16:34',
    variant: 'info',
    icon: KeyRound,
    badge: 'API',
  },
  {
    id: 'sec-3',
    title: 'Percobaan login gagal 3x',
    description: 'Alamat IP 103.28.14.9 diblokir sementara selama 30 menit.',
    time: '24 Okt 2026, 03:08',
    variant: 'warning',
    icon: Lock,
    badge: 'Blocked',
  },
  {
    id: 'sec-4',
    title: 'Kebijakan sesi diperbarui',
    description: 'Batas idle time diubah dari 60 menit menjadi 30 menit.',
    time: '21 Okt 2026, 11:02',
    variant: 'neutral',
    icon: Globe,
    badge: 'Policy',
  },
]

function openRevoke(session: SessionRow) {
  revokeTarget.value = session
  showRevokeModal.value = true
}

function confirmRevoke() {
  const session = revokeTarget.value
  if (!session) return
  sessions.value = sessions.value.filter((item) => item.id !== session.id)
  showRevokeModal.value = false
  revokeTarget.value = null
  toast.warning('Sesi Dicabut', `${session.device} telah dikeluarkan dari workspace.`)
}

// ---------- API ----------
const apiKeys = ref<ApiKey[]>([
  {
    id: 'key-prod',
    label: 'Production Server',
    prefix: 'tnk_live_9f2c',
    scope: 'Full access',
    created: '2026-02-11',
    lastUsed: '2 jam lalu',
  },
  {
    id: 'key-ci',
    label: 'CI/CD Pipeline',
    prefix: 'tnk_live_41ad',
    scope: 'Read + deploy',
    created: '2026-05-30',
    lastUsed: '12 jam lalu',
  },
  {
    id: 'key-analytics',
    label: 'Analytics Worker',
    prefix: 'tnk_read_77bd',
    scope: 'Read only',
    created: '2026-08-04',
    lastUsed: '3 hari lalu',
  },
])

const apiKeyColumns: TableColumn<ApiKey>[] = [
  { key: 'label', label: 'Label' },
  { key: 'prefix', label: 'Key', width: '200px' },
  { key: 'scope', label: 'Scope', align: 'center' },
  { key: 'lastUsed', label: 'Terakhir Dipakai', align: 'right' },
  { key: 'actions', label: '', align: 'right', width: '60px' },
]

function apiKeyActions(): DropdownItem[] {
  return [
    { label: 'Rotasi key', value: 'rotate' },
    { divider: true },
    { label: 'Cabut akses', value: 'revoke', danger: true },
  ]
}

function handleApiKeyAction(action: DropdownItem, key: ApiKey) {
  if (action.value === 'rotate') {
    toast.success('Key Dirotasi', `${key.label} memiliki kredensial baru. Perbarui server Anda.`)
    return
  }
  apiKeys.value = apiKeys.value.filter((item) => item.id !== key.id)
  toast.error('Key Dicabut', `${key.label} tidak dapat digunakan lagi.`)
}

const webhooks = ref<WebhookRow[]>([
  {
    id: 1,
    url: 'https://hooks.tinkit.example/orders',
    events: ['order.created', 'order.paid'],
    active: true,
  },
])

const showWebhookModal = ref(false)
const webhookForm = ref({
  url: '',
  events: [] as string[],
  secret: true,
  active: true,
})

const webhookEvents = [
  'order.created',
  'order.paid',
  'order.shipped',
  'refund.processed',
  'product.updated',
  'customer.created',
]

function openWebhookModal() {
  webhookForm.value = { url: '', events: [], secret: true, active: true }
  showWebhookModal.value = true
}

function saveWebhook() {
  if (!webhookForm.value.url.startsWith('https://')) {
    toast.error('URL Tidak Valid', 'Endpoint webhook wajib menggunakan HTTPS.')
    return
  }
  if (webhookForm.value.events.length === 0) {
    toast.error('Event Kosong', 'Pilih minimal satu event yang ingin dikirim.')
    return
  }
  webhooks.value.push({
    id: Date.now(),
    url: webhookForm.value.url.trim(),
    events: [...webhookForm.value.events],
    active: webhookForm.value.active,
  })
  showWebhookModal.value = false
  toast.success('Webhook Ditambahkan', 'Endpoint baru akan menerima event terpilih.')
}

function removeWebhook(id: number) {
  webhooks.value = webhooks.value.filter((item) => item.id !== id)
  toast.info('Webhook Dihapus', 'Endpoint tidak lagi menerima event.')
}

const integrations: ListItem[] = [
  {
    id: 'slack',
    title: 'Slack',
    subtitle: 'Kirim notifikasi pesanan ke kanal tim',
    icon: MessageSquare,
    variant: 'primary',
    badge: 'Terhubung',
    badgeVariant: 'success',
  },
  {
    id: 'github',
    title: 'GitHub',
    subtitle: 'Sinkronisasi issue dan deployment',
    icon: Webhook,
    variant: 'neutral',
    badge: 'Terhubung',
    badgeVariant: 'success',
  },
  {
    id: 'xero',
    title: 'Xero',
    subtitle: 'Rekonsiliasi invoice dan pembayaran',
    icon: ReceiptText,
    variant: 'info',
    badge: 'Belum',
    badgeVariant: 'warning',
  },
]

const apiFaq = [
  {
    id: 'auth',
    title: 'Bagaimana cara autentikasi request API?',
    content:
      'Sertakan header Authorization: Bearer <API_KEY> pada setiap request. Key production diawali tnk_live_, sedangkan key read-only diawali tnk_read_.',
    badge: 'Auth',
    badgeVariant: 'primary' as const,
  },
  {
    id: 'limit',
    title: 'Apa batas rate limit yang berlaku?',
    content:
      'Default 600 request per menit per key. Respons akan menyertakan header X-RateLimit-Remaining. Hubungi success manager untuk peningkatan kuota.',
    badge: 'Rate limit',
    badgeVariant: 'warning' as const,
  },
  {
    id: 'retry',
    title: 'Bagaimana penanganan retry webhook?',
    content:
      'Kami mengirim ulang hingga 5 kali dengan exponential backoff ketika endpoint merespons non-2xx. Gunakan signature HMAC pada header X-Tinkit-Signature untuk verifikasi.',
    badge: 'Webhook',
    badgeVariant: 'info' as const,
  },
]

const curlSample = `curl https://api.tinkit.example/v1/orders \\
  -H "Authorization: Bearer $TINKIT_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "customer_id": "cus_8f21",
    "channel": "website",
    "items": [
      { "sku": "TNK-KEY-001", "qty": 2 }
    ]
  }'`

// ---------- Shared ----------
function saveAll() {
  if (saving.value) return
  saving.value = true
  timer.value = window.setTimeout(() => {
    saving.value = false
    toast.success('Pengaturan Disimpan', 'Perubahan workspace diterapkan ke seluruh tim.')
  }, 1100)
}

function resetChanges() {
  toast.info('Perubahan Direset', 'Form dikembalikan ke konfigurasi terakhir yang tersimpan.')
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value),
  )
}

onUnmounted(() => {
  if (timer.value !== null) window.clearTimeout(timer.value)
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-xl font-bold text-[var(--text)]">Workspace Settings</h1>
        <p class="mt-0.5 text-sm text-[var(--text-muted)]">
          Kelola identitas workspace, penagihan, notifikasi, keamanan, dan integrasi API.
        </p>
      </div>
      <div class="flex items-center gap-2.5">
        <UiBadge variant="warning" soft dot>Draft tersimpan lokal</UiBadge>
        <UiButton variant="ghost" size="sm" class="border border-base-300" @click="resetChanges">
          Reset
        </UiButton>
        <UiButton variant="primary" size="sm" :disabled="saving" @click="saveAll">
          <UiSpinner v-if="saving" size="xs" />
          <Save v-else class="h-4 w-4" />
          <span>{{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}</span>
        </UiButton>
      </div>
    </div>

    <UiTabs v-model="activeTab" :items="tabs" variant="pills" full-width>
      <!-- GENERAL -->
      <template #general>
        <div class="space-y-5">
          <UiCard title="Identitas Workspace" subtitle="Informasi dasar yang tampil pada seluruh dokumen dan email.">
            <div class="grid grid-cols-1 gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div class="space-y-3">
                <UiAvatar :name="workspace.name" size="2xl" variant="primary" />
                <UiFileUpload
                  v-model="workspace.logo"
                  mode="file"
                  label="Logo Workspace"
                  accept="image/png,image/jpeg,image/svg+xml"
                  :max-size-mb="2"
                  hint="PNG atau SVG, maksimal 2 MB"
                />
              </div>

              <div class="space-y-4">
                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <UiInput v-model="workspace.name" label="Nama Workspace" placeholder="Tinkit Studio" />
                  <UiInput v-model="workspace.slug" label="Slug URL" hint="tinkit.example/{slug}" />
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <UiInput v-model="workspace.email" type="email" label="Email Kontak" />
                  <UiSelect v-model="workspace.companySize" :options="companySizeOptions" label="Ukuran Perusahaan" />
                </div>

                <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <UiSelect v-model="workspace.timezone" :options="timezoneOptions" label="Zona Waktu" />
                  <UiSelect v-model="workspace.language" :options="languageOptions" label="Bahasa Utama" />
                </div>

                <UiSelectTag
                  v-model="workspace.tags"
                  :options="workspaceTagOptions"
                  label="Kategori Workspace"
                  placeholder="Tambah kategori..."
                  :max-tags="6"
                  allow-create
                />

                <UiRichEditor
                  v-model="workspace.description"
                  label="Deskripsi Workspace"
                  hint="Tampil pada halaman publik dan invoice."
                  min-height="120px"
                />
              </div>
            </div>
          </UiCard>

          <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <UiCard title="Preferensi Tampilan" subtitle="Densitas antarmuka dan perilaku tabel default.">
              <div class="space-y-4">
                <div>
                  <p class="label-text mb-2">Densitas Antarmuka</p>
                  <UiRadioCard v-model="preferences.density" :options="densityOptions" :columns="2" gap="sm" />
                </div>

                <UiSelect v-model="preferences.defaultPageSize" :options="pageSizeOptions" label="Baris per Halaman Default" />

                <div class="space-y-3 rounded-box border border-base-300 p-4">
                  <UiCheckbox
                    v-model="preferences.reduceMotion"
                    label="Kurangi animasi antarmuka"
                    description="Mematikan transisi dekoratif untuk aksesibilitas."
                    variant="info"
                  />
                  <UiCheckbox
                    v-model="preferences.sidebarLabels"
                    label="Tampilkan label pada sidebar"
                    description="Jika dimatikan, sidebar hanya menampilkan ikon."
                    variant="primary"
                  />
                  <UiCheckbox
                    v-model="preferences.weeklyDigest"
                    label="Kirim ringkasan mingguan ke admin"
                    variant="success"
                  />
                </div>
              </div>
            </UiCard>

            <UiCard title="Zona Berbahaya" subtitle="Tindakan permanen yang memengaruhi seluruh workspace." accent-top="error">
              <UiAlert variant="error" style-type="soft" title="Hapus workspace permanen">
                <p>
                  Seluruh data pesanan, produk, dan anggota tim akan dihapus dalam 30 hari. Tindakan
                  ini tidak dapat dibatalkan.
                </p>
                <template #actions>
                  <button
                    class="btn btn-error btn-sm"
                    @click="toast.error('Perlu Konfirmasi', 'Hubungi owner workspace untuk menghapus workspace.')"
                  >
                    Hapus Workspace
                  </button>
                </template>
              </UiAlert>

              <div class="mt-4 space-y-2 rounded-box border border-base-300 p-4">
                <p class="text-xs font-semibold text-base-content">Ekspor seluruh data</p>
                <p class="text-[11px] text-base-content/55">
                  Unduh arsip JSON berisi produk, pesanan, dan pelanggan sebelum melakukan perubahan besar.
                </p>
                <UiButton variant="ghost" size="sm" class="border border-base-300" :icon="Download" @click="toast.info('Ekspor Dimulai', 'Arsip data akan dikirim ke email owner.')">
                  Unduh Arsip
                </UiButton>
              </div>
            </UiCard>
          </div>
        </div>
      </template>

      <!-- BILLING -->
      <template #billing>
        <div class="space-y-5">
          <div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <UiCard title="Paket Aktif" subtitle="Langganan workspace saat ini" class="xl:col-span-2">
              <template #actions>
                <UiButton variant="primary" size="xs" @click="openPlanModal">Ubah Paket</UiButton>
              </template>

              <div class="flex flex-wrap items-center gap-3 rounded-box border border-primary/20 bg-primary/8 p-4">
                <span class="flex h-11 w-11 items-center justify-center rounded-btn bg-primary/15 text-primary">
                  <Building2 class="h-5 w-5" />
                </span>
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-2">
                    <p class="text-sm font-bold text-base-content">{{ selectedPlanTitle }}</p>
                    <UiBadge variant="success" soft size="sm">Aktif</UiBadge>
                  </div>
                  <p class="text-[11px] text-base-content/55">
                    Perpanjangan otomatis {{ formatDate(billing.renewalDate) }} · PO {{ billing.poNumber }}
                  </p>
                </div>
                <div class="text-right">
                  <p class="font-mono text-sm font-extrabold text-base-content">{{ formatIDR(4250000) }}</p>
                  <p class="text-[10px] text-base-content/45">per bulan</p>
                </div>
              </div>

              <div class="mt-4 space-y-2">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-base-content/60">Pemakaian seat</span>
                  <span class="font-semibold text-base-content">{{ seatUsage }} / {{ seatLimit }} seat</span>
                </div>
                <UiProgress :value="seatUsage" :max="seatLimit" variant="warning" show-value />
                <p class="text-[11px] text-base-content/50">
                  Tersisa {{ seatLimit - seatUsage }} seat. Maksimal dapat ditingkatkan ke 50 seat pada paket Enterprise.
                </p>
              </div>
            </UiCard>

            <UiCard title="Metode Pembayaran" subtitle="Kartu kredit penagihan otomatis">
              <div class="rounded-box border border-base-300 bg-base-200/40 p-4">
                <div class="flex items-center justify-between">
                  <UiBadge variant="secondary" soft size="sm">Visa</UiBadge>
                  <CreditCard class="h-5 w-5 text-base-content/40" />
                </div>
                <p class="mt-3 font-mono text-sm tracking-widest text-base-content">•••• •••• •••• 4242</p>
                <p class="mt-1 text-[11px] text-base-content/50">Tinkit Studio · Exp 04/2028</p>
              </div>
              <UiButton variant="ghost" size="sm" class="mt-3 border border-base-300" block @click="showCardModal = true">
                Ganti Kartu
              </UiButton>
            </UiCard>
          </div>

          <UiAlert variant="warning" title="Invoice Oktober menunggu pembayaran">
            <p>
              Invoice INV-2026-10 sebesar {{ formatIDR(4250000) }} jatuh tempo 31 Oktober 2026.
              Pembayaran otomatis akan dicoba ulang pada 30 Oktober.
            </p>
            <template #actions>
              <button class="btn btn-warning btn-sm" @click="toast.primary('Pembayaran Diproses', 'Kartu utama akan ditagih dalam beberapa detik.')">
                Bayar Sekarang
              </button>
            </template>
          </UiAlert>

          <UiCard title="Riwayat Invoice" subtitle="Unduh bukti tagihan dan faktur pajak.">
            <UiTable :columns="invoiceColumns" :items="invoices" hoverable zebra>
              <template #cell-id="{ value }">
                <span class="font-mono text-xs font-bold text-primary">{{ value }}</span>
              </template>
              <template #cell-issued="{ value }">
                <span class="text-xs">{{ formatDate(String(value)) }}</span>
              </template>
              <template #cell-amount="{ value }">
                <span class="font-mono text-xs font-semibold">{{ formatIDR(Number(value)) }}</span>
              </template>
              <template #cell-status="{ value }">
                <UiBadge :variant="invoiceBadge(String(value))" soft size="sm">{{ value }}</UiBadge>
              </template>
              <template #cell-actions="{ item }">
                <UiDropdown
                  align="right"
                  variant="ghost"
                  size="xs"
                  :items="invoiceActions()"
                  @select="(action) => handleInvoiceAction(action, item)"
                >
                  <template #trigger>
                    <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Aksi invoice">
                      <MoreHorizontal class="h-4 w-4" />
                    </button>
                  </template>
                </UiDropdown>
              </template>
            </UiTable>
          </UiCard>

          <UiCard title="Preferensi Penagihan" subtitle="Batas pengeluaran dan pengingat biaya.">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
              <UiInputCurrency v-model="billing.threshold" label="Batas Notifikasi Tagihan" currency="IDR" />
              <UiInputPercent v-model="billing.warnPercent" label="Peringatan Pemakaian (%)" :min="0" :max="100" show-slider />
              <UiDatePicker v-model="billing.renewalDate" label="Tanggal Perpanjangan" />
            </div>
            <div class="mt-4 flex flex-col gap-3 rounded-box border border-base-300 p-4">
              <UiCheckbox
                v-model="billing.autoRenew"
                label="Perpanjang langganan otomatis"
                description="Tagihan dibuat 7 hari sebelum masa aktif berakhir."
                variant="success"
              />
              <UiCheckbox
                v-model="billing.invoiceCopy"
                label="Kirim invoice ke finance@tinkit.example"
                description="Salinan PDF dikirim setiap awal bulan."
                variant="info"
              />
            </div>
          </UiCard>
        </div>
      </template>

      <!-- NOTIFICATIONS -->
      <template #notifications>
        <div class="space-y-5">
          <UiCard title="Frekuensi Ringkasan" subtitle="Seberapa sering Anda menerima rangkuman aktivitas.">
            <UiRadioCard v-model="digest" :options="digestOptions" :columns="3" />
          </UiCard>

          <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <UiCard title="Kanal Notifikasi" subtitle="Aktifkan kanal yang ingin digunakan.">
              <div class="space-y-3 rounded-box border border-base-300 p-4">
                <UiCheckbox
                  v-model="notifyChannels.email"
                  label="Email"
                  description="Dikirim ke arif.budiman@tinkit.example"
                  variant="primary"
                />
                <UiCheckbox
                  v-model="notifyChannels.push"
                  label="Push notification"
                  description="Browser dan aplikasi mobile"
                  variant="info"
                />
                <UiCheckbox
                  v-model="notifyChannels.slack"
                  label="Slack"
                  description="Kanal #ops-alerts"
                  variant="secondary"
                />
                <UiCheckbox
                  v-model="notifyChannels.whatsapp"
                  label="WhatsApp Business"
                  description="Hanya untuk peringatan kritis"
                  variant="success"
                />
              </div>
            </UiCard>

            <UiCard title="Topik yang Diikuti" subtitle="Pilih event yang memicu notifikasi.">
              <UiSelectTag
                v-model="notifyTopics"
                :options="topicOptions"
                label="Topik Notifikasi"
                placeholder="Tambah topik..."
                :max-tags="8"
              />
              <div class="mt-4 space-y-3 rounded-box border border-base-300 p-4">
                <UiCheckbox
                  v-model="quietHours.enabled"
                  label="Aktifkan jam tenang"
                  description="Notifikasi non-kritis ditahan pada rentang ini."
                  variant="warning"
                />
                <div class="grid grid-cols-2 gap-3">
                  <UiSelect v-model="quietHours.start" :options="timeOptions" label="Mulai" :disabled="!quietHours.enabled" />
                  <UiSelect v-model="quietHours.end" :options="timeOptions" label="Selesai" :disabled="!quietHours.enabled" />
                </div>
              </div>
            </UiCard>
          </div>

          <UiAlert variant="info" title="Tips mengurangi kebisingan">
            <p>
              Nonaktifkan topik yang tidak Anda tangani langsung. Sebagian besar tim ops hanya
              mengikuti <strong>Order updates</strong>, <strong>Inventory alerts</strong>, dan
              <strong>Security alerts</strong>.
            </p>
          </UiAlert>
        </div>
      </template>

      <!-- SECURITY -->
      <template #security>
        <div class="space-y-5">
          <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <UiCard title="Kebijakan Autentikasi" subtitle="Perlindungan akses ke workspace.">
              <div class="space-y-4">
                <UiCheckbox
                  v-model="security.twoFactor"
                  label="Wajibkan 2FA untuk seluruh anggota"
                  description="Menggunakan authenticator app atau security key."
                  variant="success"
                />
                <UiCheckbox
                  v-model="security.requireApproval"
                  label="Persetujuan owner untuk undangan baru"
                  description="Setiap anggota baru harus disetujui manual."
                  variant="primary"
                />
                <UiCheckbox
                  v-model="security.ssoEnabled"
                  label="Aktifkan SSO SAML"
                  description="Tersedia pada paket Enterprise dengan IdP tersertifikasi."
                  variant="info"
                />
                <UiSelect v-model="security.sessionTimeout" :options="sessionTimeoutOptions" label="Batas Idle Sesi" />
                <UiInput
                  v-model="security.ipAllowlist"
                  label="IP Allowlist (opsional)"
                  placeholder="103.28.14.0/24, 202.10.1.5"
                  hint="Pisahkan beberapa alamat dengan koma."
                />
              </div>
            </UiCard>

            <UiCard title="Riwayat Keamanan" subtitle="Aktivitas akses terbaru pada workspace.">
              <UiTimeline :items="securityTimeline" />
            </UiCard>
          </div>

          <UiAlert v-if="sessions.length > 2" variant="warning" title="Beberapa perangkat aktif">
            <p>
              Terdapat {{ sessions.length }} sesi aktif. Cabut sesi yang tidak dikenal untuk menjaga
              keamanan akun tim.
            </p>
          </UiAlert>

          <UiCard title="Sesi Aktif" subtitle="Perangkat yang saat ini memiliki akses ke workspace.">
            <UiTable :columns="sessionColumns" :items="sessions" hoverable>
              <template #cell-device="{ item }">
                <div class="flex items-center gap-2.5">
                  <span class="flex h-8 w-8 items-center justify-center rounded-btn bg-base-200 text-base-content/60">
                    <Smartphone v-if="item.icon === 'phone'" class="h-4 w-4" />
                    <Laptop v-else class="h-4 w-4" />
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-base-content">{{ item.device }}</p>
                    <p class="text-[11px] text-base-content/50">{{ item.browser }}</p>
                  </div>
                </div>
              </template>
              <template #cell-location="{ value }">
                <span class="inline-flex items-center gap-1.5 text-xs text-base-content/70">
                  <Globe class="h-3.5 w-3.5 text-base-content/40" />
                  {{ value }}
                </span>
              </template>
              <template #cell-lastActive="{ value }">
                <span class="inline-flex items-center gap-1.5 text-xs text-base-content/60">
                  <Clock class="h-3.5 w-3.5" />
                  {{ value }}
                </span>
              </template>
              <template #cell-current="{ item }">
                <UiBadge :variant="item.current ? 'success' : 'neutral'" soft dot size="sm">
                  {{ item.current ? 'Perangkat ini' : 'Aktif' }}
                </UiBadge>
              </template>
              <template #cell-actions="{ item }">
                <UiButton
                  v-if="!item.current"
                  variant="error"
                  soft
                  size="xs"
                  @click="openRevoke(item)"
                >
                  Cabut
                </UiButton>
                <span v-else class="text-[10px] text-base-content/40">—</span>
              </template>
            </UiTable>
          </UiCard>
        </div>
      </template>

      <!-- API -->
      <template #api>
        <div class="space-y-5">
          <UiCard title="API Keys" subtitle="Gunakan key terpisah untuk setiap environment.">
            <template #actions>
              <UiButton variant="primary" size="xs" :icon="Plus" @click="toast.success('API Key Dibuat', 'Key baru ditampilkan sekali. Simpan dengan aman.')">
                Buat API Key
              </UiButton>
            </template>

            <UiTable :columns="apiKeyColumns" :items="apiKeys" hoverable>
              <template #cell-label="{ value }">
                <span class="text-sm font-semibold text-base-content">{{ value }}</span>
              </template>
              <template #cell-prefix="{ value }">
                <code class="rounded bg-base-200 px-2 py-0.5 font-mono text-[11px] text-base-content/75">
                  {{ value }}••••••••
                </code>
              </template>
              <template #cell-scope="{ value }">
                <UiBadge variant="info" soft size="sm">{{ value }}</UiBadge>
              </template>
              <template #cell-actions="{ item }">
                <UiDropdown
                  align="right"
                  variant="ghost"
                  size="xs"
                  :items="apiKeyActions()"
                  @select="(action) => handleApiKeyAction(action, item)"
                >
                  <template #trigger>
                    <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Aksi API key">
                      <MoreHorizontal class="h-4 w-4" />
                    </button>
                  </template>
                </UiDropdown>
              </template>
            </UiTable>

            <UiAlert variant="warning" style-type="soft" title="Simpan key di secret manager" class="mt-4">
              <p>
                Jangan menyimpan API key di repositori atau frontend. Gunakan environment variable
                pada server dan rotasi key setiap 90 hari.
              </p>
            </UiAlert>
          </UiCard>

          <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <UiCard title="Contoh Request" subtitle="Membuat pesanan melalui REST API">
              <UiCodeBlock
                :code="curlSample"
                language="bash"
                filename="create-order.sh"
                show-line-numbers
                copyable
                max-height="300px"
              />
            </UiCard>

            <UiCard title="Integrasi Terhubung" subtitle="Aplikasi pihak ketiga pada workspace.">
              <UiList :items="integrations" @item-click="(item) => toast.info('Integrasi', `${item.title} dibuka.`)">
                <template #item-action="{ item }">
                  <UiBadge
                    :variant="item.badge === 'Terhubung' ? 'success' : 'warning'"
                    soft
                    size="sm"
                  >
                    {{ item.badge }}
                  </UiBadge>
                </template>
              </UiList>
            </UiCard>
          </div>

          <UiCard title="Webhook Endpoints" subtitle="Kirim event real-time ke sistem Anda.">
            <template #actions>
              <UiButton variant="primary" size="xs" :icon="Plus" @click="openWebhookModal">
                Tambah Webhook
              </UiButton>
            </template>

            <div v-if="webhooks.length > 0" class="space-y-3">
              <div
                v-for="hook in webhooks"
                :key="hook.id"
                class="rounded-box border border-base-300 p-4"
              >
                <div class="flex flex-wrap items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate font-mono text-xs font-semibold text-base-content">{{ hook.url }}</p>
                    <div class="mt-2 flex flex-wrap gap-1.5">
                      <UiBadge
                        v-for="event in hook.events"
                        :key="event"
                        variant="secondary"
                        soft
                        size="sm"
                      >
                        {{ event }}
                      </UiBadge>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <UiBadge :variant="hook.active ? 'success' : 'neutral'" soft dot size="sm">
                      {{ hook.active ? 'Aktif' : 'Dijeda' }}
                    </UiBadge>
                    <UiButton variant="ghost" size="xs" class="border border-base-300" @click="toast.info('Test Webhook', 'Event uji dikirim ke endpoint.')">
                      Test
                    </UiButton>
                    <UiButton variant="error" soft size="xs" :icon="Trash2" icon-only title="Hapus webhook" @click="removeWebhook(hook.id)" />
                  </div>
                </div>
              </div>
            </div>

            <UiEmptyState
              v-else
              title="Belum Ada Webhook"
              description="Tambahkan endpoint HTTPS untuk menerima event pesanan dan refund secara real-time."
              :icon="Webhook"
              compact
            >
              <UiButton variant="primary" size="sm" :icon="Plus" @click="openWebhookModal">
                Tambah Webhook
              </UiButton>
            </UiEmptyState>
          </UiCard>

          <UiCard title="Panduan API" subtitle="Pertanyaan umum seputar integrasi.">
            <UiAccordion :items="apiFaq" variant="separated" />
          </UiCard>
        </div>
      </template>
    </UiTabs>

    <!-- Plan Modal -->
    <UiModal v-model="showPlanModal" title="Ubah Paket Langganan" subtitle="Pilih paket yang sesuai skala operasional tim." max-width="xl">
      <div class="space-y-5">
        <UiRadioCard v-model="pendingPlan" :options="plans" :columns="3" />
        <UiAlert variant="info" style-type="soft" title="Perubahan paket prorata">
          <p>
            Selisih biaya dihitung prorata pada invoice berikutnya. Downgrade berlaku pada akhir
            periode penagihan berjalan.
          </p>
        </UiAlert>
      </div>
      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batalkan</UiButton>
        <UiButton variant="primary" size="sm" @click="confirmPlan">Konfirmasi Paket</UiButton>
      </template>
    </UiModal>

    <!-- Card Modal -->
    <UiModal v-model="showCardModal" title="Ganti Kartu Pembayaran" subtitle="Kartu digunakan untuk penagihan otomatis bulanan." max-width="lg">
      <div class="space-y-4">
        <UiInput v-model="cardForm.holder" label="Nama Pemegang Kartu" placeholder="Nama sesuai kartu" />
        <UiInput v-model="cardForm.number" label="Nomor Kartu" placeholder="4111 1111 1111 1111" />
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <UiSelect v-model="cardForm.brand" :options="brandOptions" label="Jaringan" />
          <UiDatePicker v-model="cardForm.expiry" label="Masa Berlaku" />
          <UiInput v-model="cardForm.cvc" label="CVC" placeholder="•••" />
        </div>
        <UiAlert variant="warning" style-type="soft" title="Verifikasi 3D Secure">
          <p>Bank Anda mungkin meminta verifikasi tambahan setelah kartu disimpan.</p>
        </UiAlert>
      </div>
      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batalkan</UiButton>
        <UiButton variant="primary" size="sm" :icon="CreditCard" @click="saveCard">Simpan Kartu</UiButton>
      </template>
    </UiModal>

    <!-- Revoke Session Modal -->
    <UiModal v-model="showRevokeModal" title="Cabut Sesi Perangkat" subtitle="Perangkat harus login ulang untuk mengakses workspace." max-width="md">
      <UiAlert variant="error" title="Konfirmasi Pencabutan Sesi">
        <p>
          Sesi pada <strong>{{ revokeTarget?.device }}</strong> ({{ revokeTarget?.location }}) akan
          diakhiri segera. Pekerjaan yang belum tersimpan dapat hilang.
        </p>
      </UiAlert>
      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batal</UiButton>
        <UiButton variant="error" size="sm" @click="confirmRevoke">Cabut Sesi</UiButton>
      </template>
    </UiModal>

    <!-- Webhook Modal -->
    <UiModal v-model="showWebhookModal" title="Tambah Webhook" subtitle="Endpoint akan menerima POST bertanda tangan HMAC." max-width="lg">
      <div class="space-y-4">
        <UiInput v-model="webhookForm.url" label="Endpoint URL" placeholder="https://api.perusahaan.id/tinkit/webhook" hint="Wajib HTTPS dan merespons 2xx dalam 5 detik." />
        <UiSelectTag
          v-model="webhookForm.events"
          :options="webhookEvents"
          label="Event yang Dikirim"
          placeholder="Pilih event..."
          :max-tags="6"
        />
        <div class="space-y-3 rounded-box border border-base-300 p-4">
          <UiCheckbox
            v-model="webhookForm.secret"
            label="Sertakan signature HMAC"
            description="Header X-Tinkit-Signature untuk verifikasi payload."
            variant="success"
          />
          <UiCheckbox
            v-model="webhookForm.active"
            label="Aktifkan endpoint segera"
            variant="primary"
          />
        </div>
      </div>
      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batalkan</UiButton>
        <UiButton variant="primary" size="sm" :icon="Webhook" @click="saveWebhook">Simpan Endpoint</UiButton>
      </template>
    </UiModal>
  </div>
</template>
