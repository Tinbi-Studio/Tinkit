<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import { useToast } from '@/stores/toast'
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Target,
  Download,
  CalendarDays,
  Info,
  Database,
  Sparkles,
  FileText,
  Plus,
  MoreHorizontal,
  Mail,
  Users,
  MousePointerClick,
} from 'lucide-vue-next'
import { PRODUCTS, formatIDR } from '@/data/products'
import UiStatCard from '@/components/ui/UiStatCard.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiTabs from '@/components/ui/UiTabs.vue'
import UiCarousel from '@/components/ui/UiCarousel.vue'
import UiTable from '@/components/ui/UiTable.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiList, { type ListItem } from '@/components/ui/UiList.vue'
import UiTimeline, { type TimelineItem } from '@/components/ui/UiTimeline.vue'
import UiCodeBlock from '@/components/ui/UiCodeBlock.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'
import UiPopover from '@/components/ui/UiPopover.vue'
import UiAccordion from '@/components/ui/UiAccordion.vue'
import UiDropdown, { type DropdownItem } from '@/components/ui/UiDropdown.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiRadioCard, { type RadioCardOption } from '@/components/ui/UiRadioCard.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiInputPercent from '@/components/ui/UiInputPercent.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import type { TableColumn } from '@/types/table'

interface RevenuePoint {
  id: string
  label: string
  value: number
  target: number
}

interface ChannelRow {
  id: string
  name: string
  users: number
  conversion: number
  bounce: number
  trend: string
}

interface TopProduct {
  id: number
  name: string
  category: string
  units: number
  revenue: number
}

interface ScheduledReport {
  id: number
  name: string
  frequency: string
  nextRun: string
  format: 'PDF' | 'XLSX' | 'CSV'
  recipients: number
  active: boolean
}

const toast = useToast()

const period = ref('30d')
const dateFrom = ref('2026-09-29')
const dateTo = ref('2026-10-29')
const activeTab = ref<'summary' | 'channels' | 'funnel' | 'reports'>('summary')
const exporting = ref(false)
const timer = ref<number | null>(null)

const periodOptions = [
  { label: '7 hari terakhir', value: '7d' },
  { label: '30 hari terakhir', value: '30d' },
  { label: '90 hari terakhir', value: '90d' },
  { label: 'Kuartal berjalan', value: 'qtd' },
  { label: 'Tahun berjalan', value: 'ytd' },
]

const periodLabel = computed(
  () => periodOptions.find((option) => option.value === period.value)?.label ?? 'Custom',
)

const revenueSeries = ref<RevenuePoint[]>([
  { id: 'nov', label: 'Nov', value: 412000000, target: 380000000 },
  { id: 'des', label: 'Des', value: 468000000, target: 420000000 },
  { id: 'jan', label: 'Jan', value: 389000000, target: 400000000 },
  { id: 'feb', label: 'Feb', value: 431000000, target: 410000000 },
  { id: 'mar', label: 'Mar', value: 512000000, target: 450000000 },
  { id: 'apr', label: 'Apr', value: 486000000, target: 460000000 },
  { id: 'mei', label: 'Mei', value: 534000000, target: 480000000 },
  { id: 'jun', label: 'Jun', value: 601000000, target: 520000000 },
  { id: 'jul', label: 'Jul', value: 578000000, target: 540000000 },
  { id: 'agu', label: 'Agu', value: 642000000, target: 560000000 },
  { id: 'sep', label: 'Sep', value: 688000000, target: 600000000 },
  { id: 'okt', label: 'Okt', value: 731000000, target: 640000000 },
])

const maxRevenue = computed(() => Math.max(...revenueSeries.value.map((point) => Math.max(point.value, point.target))))

function barHeight(value: number): string {
  const ratio = maxRevenue.value === 0 ? 0 : value / maxRevenue.value
  return `${Math.max(6, Math.round(ratio * 100))}%`
}

const insightSlides = [
  {
    id: 'insight-1',
    title: 'Pertumbuhan pendapatan +21,8% dibanding bulan lalu',
    description:
      'Kenaikan didorong kategori Audio dan Peripherals. Konversi dari kanal marketplace naik 3,4 poin setelah optimasi halaman produk.',
    image:
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80',
    alt: 'Dashboard analitik penjualan',
  },
  {
    id: 'insight-2',
    title: 'Keranjang terabaikan turun ke 11,2%',
    description:
      'Kampanye pengingat keranjang otomatis menyumbang Rp 84 juta pendapatan tambahan pada periode ini.',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1600&q=80',
    alt: 'Laporan performa pemasaran',
  },
  {
    id: 'insight-3',
    title: 'Pelanggan berulang menyumbang 46% omzet',
    description:
      'Program loyalitas Gold meningkatkan frekuensi pembelian 1,8x. Segmen ini menjadi prioritas retensi kuartal depan.',
    image:
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80',
    alt: 'Analisis pelanggan loyal',
  },
]

const acquisitionItems: ListItem[] = [
  { id: 'organic', title: 'Organic Search', subtitle: '124.820 sesi', icon: TrendingUp, variant: 'primary', meta: '38%' },
  { id: 'direct', title: 'Direct', subtitle: '86.410 sesi', icon: MousePointerClick, variant: 'info', meta: '26%' },
  { id: 'social', title: 'Social Media', subtitle: '58.230 sesi', icon: Users, variant: 'secondary', meta: '18%' },
  { id: 'email', title: 'Email Campaign', subtitle: '39.740 sesi', icon: Mail, variant: 'success', meta: '12%' },
  { id: 'referral', title: 'Referral', subtitle: '19.360 sesi', icon: Sparkles, variant: 'warning', meta: '6%' },
]

const channelRows: ChannelRow[] = [
  { id: 'website', name: 'Website', users: 128420, conversion: 4.8, bounce: 32, trend: '+8.2%' },
  { id: 'marketplace', name: 'Marketplace', users: 96410, conversion: 6.1, bounce: 27, trend: '+12.4%' },
  { id: 'retail', name: 'Retail', users: 41230, conversion: 9.4, bounce: 18, trend: '+3.1%' },
  { id: 'email', name: 'Email Campaign', users: 39740, conversion: 5.2, bounce: 24, trend: '+15.7%' },
  { id: 'social', name: 'Social Media', users: 58230, conversion: 2.9, bounce: 41, trend: '-1.8%' },
]

const channelColumns: TableColumn<ChannelRow>[] = [
  { key: 'name', label: 'Kanal', sortable: true },
  { key: 'users', label: 'Pengguna', sortable: true, align: 'right' },
  { key: 'conversion', label: 'Konversi', sortable: true, width: '200px' },
  { key: 'bounce', label: 'Bounce Rate', align: 'right' },
  { key: 'trend', label: 'Tren', align: 'right' },
]

const topProducts = computed<TopProduct[]>(() =>
  PRODUCTS.map((product) => ({
    id: product.id,
    name: product.name,
    category: product.category,
    units: product.sold,
    revenue: product.price * product.sold,
  }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5),
)

const topColumns: TableColumn<TopProduct>[] = [
  { key: 'name', label: 'Produk' },
  { key: 'units', label: 'Terjual', align: 'right', sortable: true },
  { key: 'revenue', label: 'Pendapatan', align: 'right', sortable: true },
]

const funnelSteps = [
  { id: 'visit', label: 'Kunjungan Sesi', value: 324700, variant: 'primary' as const },
  { id: 'product', label: 'Lihat Produk', value: 186240, variant: 'info' as const },
  { id: 'cart', label: 'Tambah ke Keranjang', value: 68410, variant: 'secondary' as const },
  { id: 'checkout', label: 'Mulai Checkout', value: 34210, variant: 'warning' as const },
  { id: 'paid', label: 'Pembayaran Sukses', value: 21874, variant: 'success' as const },
]

function funnelPercent(value: number): number {
  return Math.round((value / funnelSteps[0].value) * 100)
}

const analystTimeline: TimelineItem[] = [
  {
    id: 't1',
    title: 'Kampanye retargeting Q4 diluncurkan',
    description: 'Segmentasi pelanggan berulang dengan penawaran bundling audio.',
    time: '25 Okt 2026, 10:00',
    variant: 'primary',
    icon: Sparkles,
    badge: 'Campaign',
  },
  {
    id: 't2',
    title: 'Optimasi halaman produk Audio',
    description: 'Peningkatan CTR 14% setelah pembaruan galeri dan ulasan.',
    time: '22 Okt 2026, 16:20',
    variant: 'info',
    icon: MousePointerClick,
    badge: 'CRO',
  },
  {
    id: 't3',
    title: 'Peringatan stok menipis',
    description: 'Halo Lamp dan Orbit Speaker perlu restock sebelum kampanye berikutnya.',
    time: '20 Okt 2026, 08:45',
    variant: 'warning',
    icon: TrendingUp,
    badge: 'Inventory',
  },
  {
    id: 't4',
    title: 'Sinkronisasi data gudang selesai',
    description: 'Katalog dan harga tersinkron penuh dengan sistem ERP.',
    time: '18 Okt 2026, 02:10',
    variant: 'success',
    icon: Database,
    badge: 'System',
  },
]

const glossary = [
  {
    id: 'cvr',
    title: 'Bagaimana Conversion Rate dihitung?',
    content:
      'Conversion rate = jumlah transaksi sukses dibagi jumlah sesi unik pada periode terpilih. Sesi yang berasal dari bot dan internal QA dikeluarkan dari perhitungan.',
    badge: 'CVR',
    badgeVariant: 'primary' as const,
  },
  {
    id: 'aov',
    title: 'Mengapa AOV berbeda dengan laporan keuangan?',
    content:
      'AOV pada dashboard menggunakan nilai pesanan sebelum refund dan tanpa biaya pengiriman, sehingga dapat berbeda dengan laporan pendapatan bersih pada modul keuangan.',
    badge: 'AOV',
    badgeVariant: 'info' as const,
  },
  {
    id: 'attribution',
    title: 'Model atribusi apa yang dipakai?',
    content:
      'Metrik kanal menggunakan model last non-direct click dengan jendela atribusi 30 hari. Perubahan model diterapkan serentak ke seluruh laporan tersimpan.',
    badge: 'Attribution',
    badgeVariant: 'warning' as const,
  },
  {
    id: 'freshness',
    title: 'Seberapa sering data disegarkan?',
    content:
      'Data transaksi disinkronkan setiap 5 menit. Metrik perilaku dari warehouse diperbarui setiap jam dan dapat mengalami keterlambatan hingga 60 menit.',
    badge: 'Pipeline',
    badgeVariant: 'success' as const,
  },
]

const sqlSample = `select
  date_trunc('day', created_at) as day,
  channel,
  count(distinct session_id) as sessions,
  count(distinct order_id) filter (where status = 'paid') as orders,
  round(
    count(distinct order_id) filter (where status = 'paid')::numeric
    / nullif(count(distinct session_id), 0) * 100, 2
  ) as conversion_rate
from analytics.funnel_events
where created_at >= current_date - interval '30 days'
group by 1, 2
order by 1 desc;`

const tabs = [
  { id: 'summary', label: 'Ringkasan', icon: BarChart3 },
  { id: 'channels', label: 'Kanal & Traffic', icon: Users },
  { id: 'funnel', label: 'Funnel Konversi', icon: Target },
  { id: 'reports', label: 'Laporan Terjadwal', icon: FileText },
]

const reports = ref<ScheduledReport[]>([
  { id: 1, name: 'Executive Revenue Digest', frequency: 'Mingguan', nextRun: '2026-11-02', format: 'PDF', recipients: 6, active: true },
  { id: 2, name: 'Inventory & Stock Alert', frequency: 'Harian', nextRun: '2026-10-30', format: 'XLSX', recipients: 4, active: true },
  { id: 3, name: 'Channel Performance Monthly', frequency: 'Bulanan', nextRun: '2026-11-01', format: 'CSV', recipients: 9, active: false },
])

const reportColumns: TableColumn<ScheduledReport>[] = [
  { key: 'name', label: 'Laporan', sortable: true },
  { key: 'frequency', label: 'Frekuensi', align: 'center' },
  { key: 'nextRun', label: 'Jadwal Berikutnya', sortable: true },
  { key: 'format', label: 'Format', align: 'center' },
  { key: 'recipients', label: 'Penerima', align: 'center' },
  { key: 'actions', label: '', align: 'right', width: '70px' },
]

function reportActions(report: ScheduledReport): DropdownItem[] {
  return [
    { label: 'Jalankan sekarang', value: 'run' },
    { label: report.active ? 'Nonaktifkan jadwal' : 'Aktifkan jadwal', value: 'toggle' },
    { divider: true },
    { label: 'Hapus jadwal', value: 'delete', danger: true },
  ]
}

function handleReportAction(action: DropdownItem, report: ScheduledReport) {
  if (action.value === 'run') {
    toast.success('Laporan Dijalankan', `${report.name} sedang dibuat dan akan dikirim ke ${report.recipients} penerima.`)
  }
  if (action.value === 'toggle') {
    report.active = !report.active
    toast.info(report.active ? 'Jadwal Diaktifkan' : 'Jadwal Dinonaktifkan', report.name)
  }
  if (action.value === 'delete') {
    reports.value = reports.value.filter((item) => item.id !== report.id)
    toast.error('Jadwal Dihapus', `${report.name} tidak akan dikirim lagi.`)
  }
}

const showSchedule = ref(false)
const scheduleForm = ref({
  name: '',
  frequency: 'weekly' as string | number,
  nextRun: '2026-11-02',
  time: '08:00',
  formats: ['pdf'] as string[],
  threshold: 10 as number | null,
  recipients: ['analytics@tinkit.example'] as string[],
})

const frequencyOptions: RadioCardOption[] = [
  {
    value: 'daily',
    title: 'Harian',
    subtitle: 'Setiap pukul 08:00',
    icon: CalendarDays,
    badge: 'Realtime',
    badgeVariant: 'info',
  },
  {
    value: 'weekly',
    title: 'Mingguan',
    subtitle: 'Setiap Senin pagi',
    icon: BarChart3,
    badge: 'Populer',
    badgeVariant: 'primary',
    recommended: true,
  },
  {
    value: 'monthly',
    title: 'Bulanan',
    subtitle: 'Tanggal 1 setiap bulan',
    icon: FileText,
    badge: 'Executive',
    badgeVariant: 'secondary',
  },
]

const timeOptions = [
  { label: '06:00 WIB', value: '06:00' },
  { label: '08:00 WIB', value: '08:00' },
  { label: '12:00 WIB', value: '12:00' },
  { label: '17:00 WIB', value: '17:00' },
]

const recipientOptions = [
  'analytics@tinkit.example',
  'finance@tinkit.example',
  'ops@tinkit.example',
  'growth@tinkit.example',
  'ceo@tinkit.example',
]

const distributionOptions = ref({ rawCsv: true, slack: false })

function exportReport() {
  if (exporting.value) return
  exporting.value = true
  timer.value = window.setTimeout(() => {
    exporting.value = false
    toast.success('Laporan Diekspor', `Ringkasan ${periodLabel.value.toLowerCase()} siap diunduh.`)
  }, 1200)
}

function openSchedule() {
  scheduleForm.value = {
    name: '',
    frequency: 'weekly',
    nextRun: '2026-11-02',
    time: '08:00',
    formats: ['pdf'],
    threshold: 10,
    recipients: ['analytics@tinkit.example'],
  }
  showSchedule.value = true
}

function saveSchedule() {
  const form = scheduleForm.value
  if (!form.name.trim()) {
    toast.error('Nama Laporan Wajib Diisi', 'Beri nama agar mudah dikenali tim.')
    return
  }
  if (form.recipients.length === 0) {
    toast.error('Penerima Kosong', 'Tambahkan minimal satu alamat email penerima.')
    return
  }
  const frequencyMap: Record<string, string> = {
    daily: 'Harian',
    weekly: 'Mingguan',
    monthly: 'Bulanan',
  }
  reports.value.unshift({
    id: Date.now(),
    name: form.name.trim(),
    frequency: frequencyMap[String(form.frequency)] ?? 'Mingguan',
    nextRun: form.nextRun,
    format: form.formats.includes('xlsx') ? 'XLSX' : form.formats.includes('csv') ? 'CSV' : 'PDF',
    recipients: form.recipients.length,
    active: true,
  })
  showSchedule.value = false
  toast.success('Jadwal Laporan Dibuat', `${form.name} akan dikirim otomatis sesuai jadwal.`)
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
        <h4 class="text-xl font-bold text-[var(--text)]">Analytics &amp; Insights</h4>
        <p class="mt-0.5 text-sm text-[var(--text-muted)]">
          Pantau performa pendapatan, kanal akuisisi, dan funnel konversi toko secara menyeluruh.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <UiButton variant="ghost" size="sm" class="border border-base-300" @click="openSchedule">
          <FileText class="h-4 w-4" />
          Jadwalkan Laporan
        </UiButton>
        <UiButton variant="primary" size="sm" :disabled="exporting" @click="exportReport">
          <UiSpinner v-if="exporting" size="xs" />
          <Download v-else class="h-4 w-4" />
          <span>{{ exporting ? 'Menyiapkan...' : 'Ekspor Ringkasan' }}</span>
        </UiButton>
      </div>
    </div>

    <!-- Period Filter -->
    <div class="card p-4">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
        <UiSelect v-model="period" :options="periodOptions" label="Periode Analitik" />
        <UiDatePicker v-model="dateFrom" label="Dari Tanggal" />
        <UiDatePicker v-model="dateTo" label="Sampai Tanggal" />
        <div class="flex items-end">
          <UiButton variant="primary" soft size="sm" block :icon="CalendarDays" @click="toast.info('Filter Diterapkan', `Menampilkan data ${periodLabel.toLowerCase()}.`)">
            Terapkan Filter
          </UiButton>
        </div>
      </div>
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <UiStatCard
        layout="vertical"
        title="Pendapatan Bersih"
        :value="formatIDR(731000000)"
        change="+21.8%"
        trend="up"
        description="Dibanding periode sebelumnya"
        variant="primary"
        :icon="TrendingUp"
      />
      <UiStatCard
        layout="vertical"
        title="Total Pesanan"
        value="21.874"
        change="+12.4%"
        trend="up"
        description="Semua kanal penjualan"
        variant="info"
        :icon="ShoppingCart"
      />
      <UiStatCard
        layout="vertical"
        title="Conversion Rate"
        value="4.8%"
        change="+0.6 pt"
        trend="up"
        description="Sesi unik menjadi transaksi"
        variant="success"
        :icon="Target"
      />
      <UiStatCard
        layout="vertical"
        title="Average Order Value"
        :value="formatIDR(4450000)"
        change="-2.1%"
        trend="down"
        description="Nilai transaksi rata-rata"
        variant="warning"
        :icon="BarChart3"
      />
    </div>

    <UiAlert variant="info" title="Anomali traffic terdeteksi" dismissible>
      <p>
        Lonjakan kunjungan 42% dari kanal Social Media terdeteksi pukul 09:00 WIB. Conversion rate
        kanal tersebut turun ke 2.9%, kemungkinan berasal dari kampanye berbayar dengan intent rendah.
      </p>
      <template #actions>
        <button class="btn btn-info btn-sm" @click="activeTab = 'channels'">Lihat Kanal</button>
      </template>
    </UiAlert>

    <!-- Main Tabs -->
    <UiTabs v-model="activeTab" :items="tabs" variant="attached">
      <!-- SUMMARY -->
      <template #summary>
        <div class="space-y-5">
          <UiCarousel :slides="insightSlides" aspect-ratio="wide" autoplay :interval="6000" show-thumbnails />

          <div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <UiCard
              title="Pendapatan vs Target"
              subtitle="12 bulan terakhir · dalam Rupiah"
              class="xl:col-span-2"
            >
              <template #actions>
                <UiTooltip text="Target ditetapkan oleh tim finance setiap awal bulan">
                  <Info class="h-4 w-4 text-[var(--text-faint)]" />
                </UiTooltip>
                <UiBadge variant="success" soft size="sm">+14.2% vs target</UiBadge>
              </template>

              <div class="mt-2 flex items-end gap-1.5 sm:gap-2.5">
                <div
                  v-for="point in revenueSeries"
                  :key="point.id"
                  class="flex flex-1 flex-col items-center gap-1.5"
                >
                  <div class="flex h-44 w-full items-end justify-center gap-0.5">
                    <div
                      class="w-1/2 rounded-t-sm bg-primary/30 transition-all duration-300 hover:bg-primary/50"
                      :style="{ height: barHeight(point.target) }"
                      :title="`Target ${point.label}: ${formatIDR(point.target)}`"
                    />
                    <div
                      class="w-1/2 rounded-t-sm bg-primary transition-all duration-300"
                      :style="{ height: barHeight(point.value) }"
                      :title="`Aktual ${point.label}: ${formatIDR(point.value)}`"
                    />
                  </div>
                  <span class="text-[10px] font-medium text-base-content/45">{{ point.label }}</span>
                </div>
              </div>

              <div class="mt-4 flex flex-wrap items-center gap-4 border-t border-base-300/70 pt-3 text-[11px] text-base-content/60">
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-sm bg-primary" /> Aktual
                </span>
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2.5 w-2.5 rounded-sm bg-primary/30" /> Target
                </span>
                <span class="ml-auto">Puncak: Oktober {{ formatIDR(731000000) }}</span>
              </div>
            </UiCard>

            <UiCard title="Sumber Akuisisi" subtitle="Kontribusi sesi 30 hari terakhir">
              <template #actions>
                <UiPopover title="Detail Sumber" subtitle="Definisi metrik" width-class="w-72">
                  <template #trigger>
                    <button type="button" class="btn btn-ghost btn-xs btn-circle">
                      <Info class="h-3.5 w-3.5" />
                    </button>
                  </template>
                  <p>
                    Sesi dihitung unik per pengunjung dalam 30 menit. Traffic internal dan bot
                    dikeluarkan dari total.
                  </p>
                </UiPopover>
              </template>
              <UiList :items="acquisitionItems" compact />
            </UiCard>
          </div>

          <div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
            <UiCard
              title="Produk Berperforma Terbaik"
              subtitle="Berdasarkan pendapatan periode ini"
              class="xl:col-span-2"
            >
              <UiTable :columns="topColumns" :items="topProducts" hoverable compact>
                <template #cell-name="{ item }">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-base-content">{{ item.name }}</p>
                    <p class="text-[11px] text-base-content/50">{{ item.category }}</p>
                  </div>
                </template>
                <template #cell-units="{ value }">
                  <span class="font-mono text-xs">{{ Number(value).toLocaleString('id-ID') }}</span>
                </template>
                <template #cell-revenue="{ value }">
                  <span class="font-mono text-xs font-bold text-primary">{{ formatIDR(Number(value)) }}</span>
                </template>
              </UiTable>
            </UiCard>

            <UiCard title="Catatan Analis" subtitle="Perubahan terbaru pada data">
              <UiTimeline :items="analystTimeline" />
            </UiCard>
          </div>
        </div>
      </template>

      <!-- CHANNELS -->
      <template #channels>
        <div class="space-y-5">
          <UiCard title="Performa Kanal" subtitle="Perbandingan pengguna, konversi, dan bounce rate">
            <UiTable :columns="channelColumns" :items="channelRows" hoverable zebra>
              <template #cell-name="{ item }">
                <span class="text-sm font-semibold text-base-content">{{ item.name }}</span>
              </template>
              <template #cell-users="{ value }">
                <span class="font-mono text-xs">{{ Number(value).toLocaleString('id-ID') }}</span>
              </template>
              <template #cell-conversion="{ value }">
                <div class="space-y-1">
                  <UiProgress
                    :value="Number(value)"
                    :max="12"
                    :variant="Number(value) >= 6 ? 'success' : Number(value) >= 4 ? 'info' : 'warning'"
                    size="xs"
                  />
                  <span class="text-[10px] font-semibold text-base-content/60">{{ value }}%</span>
                </div>
              </template>
              <template #cell-bounce="{ value }">
                <UiBadge :variant="Number(value) > 35 ? 'warning' : 'success'" soft size="sm">
                  {{ value }}%
                </UiBadge>
              </template>
              <template #cell-trend="{ value }">
                <span
                  class="text-xs font-semibold"
                  :class="String(value).startsWith('-') ? 'text-error' : 'text-success'"
                >
                  {{ value }}
                </span>
              </template>
            </UiTable>
          </UiCard>

          <div class="grid grid-cols-1 gap-5 xl:grid-cols-2">
            <UiCard title="Query Warehouse" subtitle="Sumber utama metrik funnel konversi">
              <UiCodeBlock
                :code="sqlSample"
                language="sql"
                filename="funnel_conversion.sql"
                show-line-numbers
                copyable
                max-height="320px"
              />
            </UiCard>

            <UiCard title="Glosarium Metrik" subtitle="Definisi yang dipakai pada dashboard">
              <UiAccordion :items="glossary" variant="separated" />
            </UiCard>
          </div>
        </div>
      </template>

      <!-- FUNNEL -->
      <template #funnel>
        <div class="space-y-5">
          <UiCard title="Funnel Konversi" subtitle="Dari kunjungan hingga pembayaran sukses">
            <template #actions>
              <UiBadge variant="primary" soft size="sm">Overall CVR 4.8%</UiBadge>
            </template>
            <div class="space-y-4">
              <div
                v-for="step in funnelSteps"
                :key="step.id"
                class="space-y-1.5"
              >
                <div class="flex items-center justify-between text-xs">
                  <span class="font-semibold text-base-content">{{ step.label }}</span>
                  <span class="font-mono text-base-content/60">
                    {{ step.value.toLocaleString('id-ID') }} · {{ funnelPercent(step.value) }}%
                  </span>
                </div>
                <UiProgress :value="funnelPercent(step.value)" :variant="step.variant" size="md" />
              </div>
            </div>
          </UiCard>

          <div class="grid grid-cols-1 gap-5 md:grid-cols-3">
            <div class="card p-5">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold text-base-content/45">
                  Drop-off Terbesar
                </p>
                <UiBadge variant="error" soft size="sm">Kritis</UiBadge>
              </div>
              <p class="mt-2 text-2xl font-extrabold text-base-content">63.3%</p>
              <p class="mt-1 text-xs text-base-content/55">
                Pengunjung yang melihat produk tetapi tidak menambahkan ke keranjang.
              </p>
            </div>
            <div class="card p-5">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold text-base-content/45">
                  Keranjang Terabaikan
                </p>
                <UiBadge variant="warning" soft size="sm">-2.4 pt</UiBadge>
              </div>
              <p class="mt-2 text-2xl font-extrabold text-base-content">11.2%</p>
              <p class="mt-1 text-xs text-base-content/55">
                Turun setelah kampanye pengingat keranjang otomatis diaktifkan.
              </p>
            </div>
            <div class="card p-5">
              <div class="flex items-center justify-between">
                <p class="text-xs font-semibold text-base-content/45">
                  Pembayaran Sukses
                </p>
                <UiBadge variant="success" soft size="sm">+3.1%</UiBadge>
              </div>
              <p class="mt-2 text-2xl font-extrabold text-base-content">21.874</p>
              <p class="mt-1 text-xs text-base-content/55">
                Transaksi berhasil dibandingkan 21.198 pada periode sebelumnya.
              </p>
            </div>
          </div>
        </div>
      </template>

      <!-- REPORTS -->
      <template #reports>
        <div class="space-y-5">
          <UiCard title="Laporan Terjadwal" subtitle="Pengiriman otomatis ke penerima terdaftar">
            <template #actions>
              <UiButton variant="primary" size="xs" :icon="Plus" @click="openSchedule">
                Jadwal Baru
              </UiButton>
            </template>

            <UiTable v-if="reports.length > 0" :columns="reportColumns" :items="reports" hoverable>
              <template #cell-name="{ item }">
                <div class="flex items-center gap-2.5">
                  <span class="flex h-8 w-8 items-center justify-center rounded-btn bg-primary/12 text-primary">
                    <FileText class="h-4 w-4" />
                  </span>
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-base-content">{{ item.name }}</p>
                    <p class="text-[11px] text-base-content/50">
                      {{ item.active ? 'Aktif' : 'Dijeda' }} · {{ item.recipients }} penerima
                    </p>
                  </div>
                </div>
              </template>
              <template #cell-nextRun="{ value }">
                <span class="text-xs">{{ formatDate(String(value)) }}</span>
              </template>
              <template #cell-format="{ value }">
                <UiBadge variant="secondary" soft size="sm">{{ value }}</UiBadge>
              </template>
              <template #cell-actions="{ item }">
                <UiDropdown
                  align="right"
                  variant="ghost"
                  size="xs"
                  :items="reportActions(item)"
                  @select="(action) => handleReportAction(action, item)"
                >
                  <template #trigger>
                    <button type="button" class="btn btn-ghost btn-xs btn-circle" aria-label="Aksi laporan">
                      <MoreHorizontal class="h-4 w-4" />
                    </button>
                  </template>
                </UiDropdown>
              </template>
            </UiTable>

            <UiEmptyState
              v-else
              title="Belum Ada Laporan Terjadwal"
              description="Buat jadwal laporan pertama agar tim menerima ringkasan otomatis setiap periode."
              :icon="FileText"
              compact
            >
              <UiButton variant="primary" size="sm" :icon="Plus" @click="openSchedule">
                Jadwalkan Laporan
              </UiButton>
            </UiEmptyState>
          </UiCard>

          <UiCard title="Preferensi Distribusi" subtitle="Pengaturan umum untuk seluruh laporan terjadwal">
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <UiSelect
                v-model="scheduleForm.time"
                :options="timeOptions"
                label="Jam Pengiriman Default"
              />
              <UiInput
                :model-value="'analytics@tinkit.example'"
                label="Email Pengirim"
                hint="Alamat ini digunakan sebagai pengirim laporan otomatis."
                disabled
              />
            </div>
            <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <UiCheckbox
                v-model="distributionOptions.rawCsv"
                label="Sertakan lampiran CSV mentah"
                description="Memudahkan tim data melakukan validasi ulang."
                variant="primary"
              />
              <UiCheckbox
                v-model="distributionOptions.slack"
                label="Kirim juga ke Slack #analytics"
                description="Ringkasan singkat dikirim ke kanal internal."
                variant="info"
              />
            </div>
          </UiCard>
        </div>
      </template>
    </UiTabs>

    <!-- Schedule Modal -->
    <UiModal
      v-model="showSchedule"
      title="Jadwalkan Laporan"
      subtitle="Atur laporan otomatis untuk tim dan stakeholder."
      max-width="xl"
    >
      <div class="space-y-5">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiInput v-model="scheduleForm.name" label="Nama Laporan" placeholder="Contoh: Weekly Growth Digest" />
          <UiDatePicker v-model="scheduleForm.nextRun" label="Pengiriman Pertama" />
        </div>

        <div>
          <p class="label-text mb-2">Frekuensi Pengiriman</p>
          <UiRadioCard v-model="scheduleForm.frequency" :options="frequencyOptions" :columns="3" gap="sm" />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiSelect v-model="scheduleForm.time" :options="timeOptions" label="Jam Kirim" />
          <UiInputPercent
            v-model="scheduleForm.threshold"
            label="Ambang Peringatan Pertumbuhan"
            hint="Laporan ditandai merah jika pertumbuhan di bawah nilai ini."
            :min="0"
            :max="100"
            show-slider
          />
        </div>

        <div>
          <p class="label-text mb-2">Format Lampiran</p>
          <div class="flex flex-wrap gap-4">
            <UiCheckbox v-model="scheduleForm.formats" value="pdf" label="PDF" variant="error" />
            <UiCheckbox v-model="scheduleForm.formats" value="xlsx" label="Excel" variant="success" />
            <UiCheckbox v-model="scheduleForm.formats" value="csv" label="CSV" variant="primary" />
          </div>
        </div>

        <UiSelectTag
          v-model="scheduleForm.recipients"
          :options="recipientOptions"
          label="Penerima Laporan"
          placeholder="Tambah email penerima..."
          :max-tags="8"
          allow-create
        />

        <UiAlert variant="info" style-type="soft" title="Perkiraan pengiriman">
          <p>
            Laporan pertama akan dikirim pada {{ formatDate(scheduleForm.nextRun) }} pukul
            {{ scheduleForm.time }} WIB ke {{ scheduleForm.recipients.length }} penerima.
          </p>
        </UiAlert>
      </div>

      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batalkan</UiButton>
        <UiButton variant="primary" size="sm" :icon="Mail" @click="saveSchedule">
          Simpan Jadwal
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
