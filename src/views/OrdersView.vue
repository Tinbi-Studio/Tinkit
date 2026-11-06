<script setup lang="ts">
import { computed, ref } from 'vue'
import { useToast } from '@/stores/toast'
import {
  Wallet,
  Truck,
  Undo2,
  Eye,
  Send,
  XCircle,
  RefreshCw,
  Printer,
  Info,
  ReceiptText,
  PackageCheck,
  MapPin,
  CreditCard,
  Boxes,
  CircleDollarSign,
  Building2,
} from 'lucide-vue-next'
import { PRODUCTS, formatIDR } from '@/data/products'
import UiStatCard from '@/components/ui/UiStatCard.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiTimeline, { type TimelineItem } from '@/components/ui/UiTimeline.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiTable from '@/components/ui/UiTable.vue'
import UiDropdown, { type DropdownItem } from '@/components/ui/UiDropdown.vue'
import UiDataTable from '@/components/ui/UiDataTable.vue'
import UiInputCurrency from '@/components/ui/UiInputCurrency.vue'
import UiRadioCard, { type RadioCardOption } from '@/components/ui/UiRadioCard.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import type { TableColumn } from '@/types/table'

type OrderStatus = 'Processing' | 'Shipped' | 'Completed' | 'Refunded' | 'Cancelled'
type PaymentStatus = 'Paid' | 'Pending' | 'Refunded'
type Channel = 'Website' | 'Marketplace' | 'Retail'

interface OrderLine {
  id: number
  name: string
  qty: number
  price: number
}

interface Order {
  id: string
  customer: string
  email: string
  city: string
  address: string
  channel: Channel
  items: number
  lines: OrderLine[]
  total: number
  payment: PaymentStatus
  status: OrderStatus
  date: string
  fulfillment: number
  tracking: string
}

const toast = useToast()

const orders = ref<Order[]>([
  {
    id: 'TNK-10482',
    customer: 'Arif Budiman',
    email: 'arif.budiman@acme.id',
    city: 'Jakarta Selatan',
    address: 'Jl. Senopati No. 24, Kebayoran Baru',
    channel: 'Website',
    items: 2,
    lines: [
      { id: 1, name: PRODUCTS[0].name, qty: 1, price: PRODUCTS[0].price },
      { id: 2, name: PRODUCTS[7].name, qty: 1, price: PRODUCTS[7].price },
    ],
    total: 3519000,
    payment: 'Paid',
    status: 'Processing',
    date: '2026-10-27',
    fulfillment: 35,
    tracking: 'Menunggu pickup kurir',
  },
  {
    id: 'TNK-10481',
    customer: 'Rina Kartika',
    email: 'rina.kartika@studio.io',
    city: 'Bandung',
    address: 'Jl. Braga No. 88, Sumur Bandung',
    channel: 'Marketplace',
    items: 1,
    lines: [{ id: 2, name: PRODUCTS[1].name, qty: 1, price: PRODUCTS[1].price }],
    total: 1450000,
    payment: 'Paid',
    status: 'Shipped',
    date: '2026-10-26',
    fulfillment: 70,
    tracking: 'JNE REG · JKT-BDG-8821',
  },
  {
    id: 'TNK-10480',
    customer: 'Dimas Pratama',
    email: 'dimas.pratama@nusantara.co',
    city: 'Surabaya',
    address: 'Jl. Darmo No. 12, Wonokromo',
    channel: 'Website',
    items: 3,
    lines: [
      { id: 3, name: PRODUCTS[2].name, qty: 1, price: PRODUCTS[2].price },
      { id: 4, name: PRODUCTS[3].name, qty: 1, price: PRODUCTS[3].price },
      { id: 5, name: PRODUCTS[6].name, qty: 1, price: PRODUCTS[6].price },
    ],
    total: 17549000,
    payment: 'Paid',
    status: 'Completed',
    date: '2026-10-24',
    fulfillment: 100,
    tracking: 'Diterima penerima',
  },
  {
    id: 'TNK-10479',
    customer: 'Nadia Putri',
    email: 'nadia.putri@product.id',
    city: 'Yogyakarta',
    address: 'Jl. Kaliurang KM 5, Sleman',
    channel: 'Retail',
    items: 1,
    lines: [{ id: 6, name: PRODUCTS[5].name, qty: 1, price: PRODUCTS[5].price }],
    total: 3799000,
    payment: 'Pending',
    status: 'Processing',
    date: '2026-10-23',
    fulfillment: 10,
    tracking: 'Menunggu konfirmasi pembayaran',
  },
  {
    id: 'TNK-10478',
    customer: 'Fajar Nugroho',
    email: 'fajar.nugroho@marketing.id',
    city: 'Semarang',
    address: 'Jl. Pandanaran No. 5, Semarang Tengah',
    channel: 'Marketplace',
    items: 2,
    lines: [
      { id: 7, name: PRODUCTS[4].name, qty: 1, price: PRODUCTS[4].price },
      { id: 8, name: PRODUCTS[7].name, qty: 1, price: PRODUCTS[7].price },
    ],
    total: 1510000,
    payment: 'Paid',
    status: 'Shipped',
    date: '2026-10-22',
    fulfillment: 65,
    tracking: 'SiCepat · SMG-7729',
  },
  {
    id: 'TNK-10477',
    customer: 'Siti Aminah',
    email: 'siti.aminah@finance.id',
    city: 'Jakarta Pusat',
    address: 'Jl. Thamrin No. 10, Menteng',
    channel: 'Website',
    items: 1,
    lines: [{ id: 9, name: PRODUCTS[10].name, qty: 1, price: PRODUCTS[10].price }],
    total: 5890000,
    payment: 'Refunded',
    status: 'Refunded',
    date: '2026-10-21',
    fulfillment: 100,
    tracking: 'Refund selesai 24 Okt 2026',
  },
  {
    id: 'TNK-10476',
    customer: 'Hendra Wijaya',
    email: 'hendra.wijaya@eng.id',
    city: 'Bekasi',
    address: 'Jl. Ahmad Yani No. 7, Bekasi Selatan',
    channel: 'Website',
    items: 4,
    lines: [
      { id: 10, name: PRODUCTS[1].name, qty: 2, price: PRODUCTS[1].price },
      { id: 11, name: PRODUCTS[7].name, qty: 2, price: PRODUCTS[7].price },
    ],
    total: 4140000,
    payment: 'Paid',
    status: 'Completed',
    date: '2026-10-19',
    fulfillment: 100,
    tracking: 'Diterima penerima',
  },
  {
    id: 'TNK-10475',
    customer: 'Maya Sari',
    email: 'maya.sari@cs.id',
    city: 'Denpasar',
    address: 'Jl. Sunset Road No. 21, Kuta',
    channel: 'Marketplace',
    items: 2,
    lines: [
      { id: 12, name: PRODUCTS[7].name, qty: 1, price: PRODUCTS[7].price },
      { id: 13, name: PRODUCTS[9].name, qty: 1, price: PRODUCTS[9].price },
    ],
    total: 2770000,
    payment: 'Paid',
    status: 'Shipped',
    date: '2026-10-18',
    fulfillment: 80,
    tracking: 'Anteraja · DPS-4102',
  },
  {
    id: 'TNK-10474',
    customer: 'Reza Rahadian',
    email: 'reza.rahadian@design.io',
    city: 'Malang',
    address: 'Jl. Ijen No. 33, Klojen',
    channel: 'Retail',
    items: 1,
    lines: [{ id: 14, name: PRODUCTS[8].name, qty: 1, price: PRODUCTS[8].price }],
    total: 18999000,
    payment: 'Pending',
    status: 'Processing',
    date: '2026-10-17',
    fulfillment: 15,
    tracking: 'Menunggu verifikasi transfer',
  },
  {
    id: 'TNK-10473',
    customer: 'Larasati Dewi',
    email: 'larasati.dewi@product.id',
    city: 'Makassar',
    address: 'Jl. Penghibur No. 9, Ujung Pandang',
    channel: 'Website',
    items: 2,
    lines: [
      { id: 15, name: PRODUCTS[0].name, qty: 1, price: PRODUCTS[0].price },
      { id: 16, name: PRODUCTS[4].name, qty: 1, price: PRODUCTS[4].price },
    ],
    total: 3789000,
    payment: 'Paid',
    status: 'Cancelled',
    date: '2026-10-16',
    fulfillment: 0,
    tracking: 'Dibatalkan oleh pelanggan',
  },
  {
    id: 'TNK-10472',
    customer: 'Bima Sakti',
    email: 'bima.sakti@cloud.id',
    city: 'Tangerang',
    address: 'Jl. BSD Boulevard No. 2, Serpong',
    channel: 'Website',
    items: 3,
    lines: [
      { id: 17, name: PRODUCTS[2].name, qty: 1, price: PRODUCTS[2].price },
      { id: 18, name: PRODUCTS[5].name, qty: 1, price: PRODUCTS[5].price },
      { id: 19, name: PRODUCTS[7].name, qty: 1, price: PRODUCTS[7].price },
    ],
    total: 16969000,
    payment: 'Paid',
    status: 'Completed',
    date: '2026-10-14',
    fulfillment: 100,
    tracking: 'Diterima penerima',
  },
  {
    id: 'TNK-10471',
    customer: 'Putri Ayu',
    email: 'putri.ayu@marketing.id',
    city: 'Medan',
    address: 'Jl. Gatot Subroto No. 44, Medan Petisah',
    channel: 'Marketplace',
    items: 1,
    lines: [{ id: 20, name: PRODUCTS[6].name, qty: 1, price: PRODUCTS[6].price }],
    total: 750000,
    payment: 'Paid',
    status: 'Completed',
    date: '2026-10-12',
    fulfillment: 100,
    tracking: 'Diterima penerima',
  },
])

const activeStatus = ref<'ALL' | OrderStatus>('ALL')
const channelFilter = ref('ALL')
const dateFrom = ref('2026-10-01')
const dateTo = ref('2026-10-31')

const statusTabs: Array<{ id: 'ALL' | OrderStatus; label: string }> = [
  { id: 'ALL', label: 'Semua' },
  { id: 'Processing', label: 'Diproses' },
  { id: 'Shipped', label: 'Dikirim' },
  { id: 'Completed', label: 'Selesai' },
  { id: 'Refunded', label: 'Refund' },
  { id: 'Cancelled', label: 'Dibatalkan' },
]

function statusCount(status: 'ALL' | OrderStatus): number {
  return status === 'ALL'
    ? orders.value.length
    : orders.value.filter((order) => order.status === status).length
}

const channelOptions = [
  { label: 'Semua Kanal', value: 'ALL' },
  { label: 'Website', value: 'Website' },
  { label: 'Marketplace', value: 'Marketplace' },
  { label: 'Retail', value: 'Retail' },
]

const dateError = computed(() => Boolean(dateFrom.value && dateTo.value && dateFrom.value > dateTo.value))

const filteredOrders = computed(() => {
  if (dateError.value) return []
  return orders.value.filter((order) => {
    const matchStatus = activeStatus.value === 'ALL' || order.status === activeStatus.value
    const matchChannel = channelFilter.value === 'ALL' || order.channel === channelFilter.value
    const matchFrom = !dateFrom.value || order.date >= dateFrom.value
    const matchTo = !dateTo.value || order.date <= dateTo.value
    return matchStatus && matchChannel && matchFrom && matchTo
  })
})

const paidRevenue = computed(() =>
  orders.value
    .filter((order) => order.payment === 'Paid')
    .reduce((total, order) => total + order.total, 0),
)
const processingCount = computed(() => orders.value.filter((order) => order.status === 'Processing').length)
const shippedCount = computed(() => orders.value.filter((order) => order.status === 'Shipped').length)
const refundedTotal = computed(() =>
  orders.value
    .filter((order) => order.status === 'Refunded')
    .reduce((total, order) => total + order.total, 0),
)

function resetDateRange() {
  dateFrom.value = '2026-10-01'
  dateTo.value = '2026-10-31'
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(
    new Date(value),
  )
}

type BadgeVariant = 'primary' | 'secondary' | 'accent' | 'neutral' | 'info' | 'success' | 'warning' | 'error'

const statusVariant: Record<OrderStatus, BadgeVariant> = {
  Processing: 'warning',
  Shipped: 'info',
  Completed: 'success',
  Refunded: 'error',
  Cancelled: 'neutral',
}
const paymentVariant: Record<PaymentStatus, BadgeVariant> = {
  Paid: 'success',
  Pending: 'warning',
  Refunded: 'error',
}

function statusBadge(status: string): BadgeVariant {
  return statusVariant[status as OrderStatus] ?? 'neutral'
}

function paymentBadge(payment: string): BadgeVariant {
  return paymentVariant[payment as PaymentStatus] ?? 'neutral'
}

const columns: TableColumn<Order>[] = [
  { key: 'order', label: 'Order', sortable: true, width: '150px' },
  { key: 'customer', label: 'Pelanggan', width: '240px' },
  { key: 'channel', label: 'Kanal', align: 'center' },
  { key: 'total', label: 'Total', sortable: true, align: 'right' },
  { key: 'fulfillment', label: 'Fulfillment', width: '150px' },
  { key: 'payment', label: 'Pembayaran', align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions', label: 'Aksi', align: 'right', width: '80px' },
]

function rowActions(order: Order): DropdownItem[] {
  return [
    { label: 'Lihat invoice', value: 'view', icon: Eye },
    { label: 'Kirim pesanan', value: 'ship', icon: Send, disabled: order.status !== 'Processing' },
    { divider: true },
    { label: 'Refund pesanan', value: 'refund', icon: Undo2, disabled: order.payment !== 'Paid' },
    { label: 'Batalkan', value: 'cancel', icon: XCircle, danger: true, disabled: order.status === 'Completed' || order.status === 'Cancelled' },
  ]
}

const showDetail = ref(false)
const selectedOrder = ref<Order | null>(null)

function openDetail(order: Order) {
  selectedOrder.value = order
  showDetail.value = true
}

const detailTimeline = computed<TimelineItem[]>(() => {
  const order = selectedOrder.value
  if (!order) return []
  return [
    {
      id: 'paid',
      title: order.payment === 'Paid' ? 'Pembayaran diterima' : 'Menunggu pembayaran',
      description: `${order.payment === 'Paid' ? 'Dana masuk' : 'Instruksi pembayaran dikirim'} via ${order.channel}`,
      time: formatDate(order.date) + ', 09:12',
      variant: order.payment === 'Paid' ? 'success' : 'warning',
      badge: order.payment,
      icon: CircleDollarSign,
    },
    {
      id: 'packing',
      title: 'Pesanan diproses gudang',
      description: order.tracking,
      time: formatDate(order.date) + ', 11:40',
      variant: 'primary',
      badge: `${order.items} item`,
      icon: Boxes,
    },
    {
      id: 'shipped',
      title: order.status === 'Processing' ? 'Menunggu pickup kurir' : 'Paket dikirim',
      description: order.fulfillment > 40 ? order.tracking : 'Kurir belum ditugaskan',
      time: order.status === 'Processing' ? '—' : formatDate(order.date) + ', 15:20',
      variant: order.status === 'Processing' ? 'neutral' : 'info',
      badge: order.status === 'Processing' ? 'Pending' : 'In Transit',
      icon: Truck,
    },
    {
      id: 'done',
      title: order.status === 'Completed' ? 'Pesanan diterima' : 'Menunggu konfirmasi penerima',
      description: order.status === 'Completed' ? 'Pelanggan mengonfirmasi paket diterima dengan baik.' : 'Konfirmasi otomatis setelah 7 hari.',
      time: order.status === 'Completed' ? formatDate(order.date) + ', 18:02' : '—',
      variant: order.status === 'Completed' ? 'success' : 'neutral',
      badge: order.status === 'Completed' ? 'Completed' : 'Open',
      icon: PackageCheck,
    },
  ]
})

const lineColumns: TableColumn<OrderLine>[] = [
  { key: 'name', label: 'Produk' },
  { key: 'qty', label: 'Qty', align: 'center', width: '70px' },
  { key: 'price', label: 'Harga', align: 'right' },
  { key: 'subtotal', label: 'Subtotal', align: 'right' },
]

const lineItems = computed(() => {
  const order = selectedOrder.value
  if (!order) return []
  return order.lines.map((line) => ({
    ...line,
    subtotal: line.price * line.qty,
  }))
})

const orderSubtotal = computed(() => lineItems.value.reduce((total, line) => total + line.subtotal, 0))
const orderTax = computed(() => Math.round(orderSubtotal.value * 0.11))
const orderShipping = computed(() => (orderSubtotal.value > 500000 ? 0 : 25000))

function shipOrder(order: Order) {
  order.status = 'Shipped'
  order.fulfillment = Math.max(order.fulfillment, 80)
  order.tracking = 'Resi dibuat · menunggu pickup kurir'
  toast.success('Pesanan Dikirim', `Invoice ${order.id} telah diserahkan ke kurir.`)
}

function shipSelected() {
  if (!selectedOrder.value) return
  shipOrder(selectedOrder.value)
  showDetail.value = false
}

function cancelOrder(order: Order) {
  order.status = 'Cancelled'
  order.fulfillment = 0
  toast.warning('Pesanan Dibatalkan', `Invoice ${order.id} dibatalkan dan stok dikembalikan.`)
}

function printInvoice() {
  toast.info('Menyiapkan Invoice', 'Dokumen PDF sedang dibuat dan akan diunduh otomatis.')
}

const showRefundModal = ref(false)
const refundOrder = ref<Order | null>(null)
const refundMethod = ref<string | number>('original')
const refundForm = ref({
  amount: 0 as number | null,
  reason: 'DAMAGED',
  restock: true,
  note: '<p>Barang diterima dalam kondisi rusak. Refund penuh disetujui tim QC.</p>',
})

const reasonOptions = [
  { label: 'Barang rusak / cacat', value: 'DAMAGED', description: 'Kerusakan fisik atau malfungsi' },
  { label: 'Tidak sesuai deskripsi', value: 'MISMATCH', description: 'Produk berbeda dari katalog' },
  { label: 'Keterlambatan pengiriman', value: 'LATE', description: 'Melewati SLA pengiriman' },
  { label: 'Permintaan pelanggan', value: 'CUSTOMER', description: 'Alasan lain yang disetujui' },
]

const refundMethods: RadioCardOption[] = [
  {
    value: 'original',
    title: 'Metode Asal',
    subtitle: 'Kembali ke sumber pembayaran',
    icon: CreditCard,
    badge: 'Instan',
    badgeVariant: 'success',
    meta: '1-3 hari kerja',
  },
  {
    value: 'store-credit',
    title: 'Saldo Toko',
    subtitle: 'Kredit untuk pembelian berikutnya',
    icon: Wallet,
    badge: 'Bonus 5%',
    badgeVariant: 'primary',
    meta: 'Langsung',
    recommended: true,
  },
  {
    value: 'transfer',
    title: 'Transfer Bank',
    subtitle: 'Manual ke rekening pelanggan',
    icon: Building2,
    badge: 'Manual',
    badgeVariant: 'warning',
    meta: '2-5 hari kerja',
  },
]

function openRefund(order: Order) {
  refundOrder.value = order
  refundForm.value = {
    amount: order.total,
    reason: 'DAMAGED',
    restock: true,
    note: '<p>Barang diterima dalam kondisi rusak. Refund penuh disetujui tim QC.</p>',
  }
  refundMethod.value = 'original'
  showRefundModal.value = true
}

function submitRefund() {
  const order = refundOrder.value
  if (!order) return
  if (!refundForm.value.amount || refundForm.value.amount <= 0) {
    toast.error('Nominal Tidak Valid', 'Nominal refund harus lebih besar dari nol.')
    return
  }
  order.status = 'Refunded'
  order.payment = 'Refunded'
  order.tracking = `Refund ${formatIDR(refundForm.value.amount)} diproses`
  showRefundModal.value = false
  toast.success('Refund Diproses', `${formatIDR(refundForm.value.amount)} untuk ${order.id} sedang diproses.`)
}

function handleBulkDelete(rows: Order[]) {
  orders.value = orders.value.filter((order) => !rows.some((row) => row.id === order.id))
  toast.error('Pesanan Dihapus', `${rows.length} pesanan dihapus dari daftar.`)
}

const refreshing = ref(false)
function refreshOrders() {
  if (refreshing.value) return
  refreshing.value = true
  window.setTimeout(() => {
    refreshing.value = false
    toast.success('Data Diperbarui', `${filteredOrders.value.length} pesanan termuat dari server demo.`)
  }, 1000)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 class="text-xl font-bold text-[var(--text)]">Orders &amp; Invoices</h4>
        <p class="mt-0.5 text-sm text-[var(--text-muted)]">
          Pantau pembayaran, fulfillment, dan proses refund dari seluruh kanal penjualan.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <UiButton variant="ghost" size="sm" class="border border-base-300" @click="refreshOrders">
          <UiSpinner v-if="refreshing" size="xs" />
          <RefreshCw v-else class="h-4 w-4" />
          <span>{{ refreshing ? 'Memuat...' : 'Refresh' }}</span>
        </UiButton>
        <UiButton variant="primary" size="sm" :icon="ReceiptText" @click="openDetail(orders[0])">
          Invoice Terbaru
        </UiButton>
      </div>
    </div>

    <!-- KPI -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <UiStatCard
        layout="horizontal"
        title="Pendapatan Terbayar"
        :value="formatIDR(paidRevenue)"
        change="+12.5%"
        trend="up"
        description="Bulan berjalan"
        variant="success"
        :icon="Wallet"
      />
      <UiStatCard
        layout="horizontal"
        title="Sedang Diproses"
        :value="String(processingCount)"
        change="+2"
        trend="up"
        description="Perlu tindakan gudang"
        variant="warning"
        :icon="Boxes"
      />
      <UiStatCard
        layout="horizontal"
        title="Dalam Pengiriman"
        :value="String(shippedCount)"
        change="SLA 96%"
        trend="neutral"
        description="Kurir aktif"
        variant="info"
        :icon="Truck"
      />
      <UiStatCard
        layout="horizontal"
        title="Total Refund"
        :value="formatIDR(refundedTotal)"
        change="-4.1%"
        trend="down"
        description="Bulan berjalan"
        variant="error"
        :icon="Undo2"
      />
    </div>

    <UiAlert v-if="processingCount > 0" variant="info" title="Ada pesanan menunggu tindakan">
      <p>
        {{ processingCount }} pesanan belum diserahkan ke kurir. Pastikan stok sudah dialokasikan sebelum cutoff pukul 16:00.
      </p>
      <template #actions>
        <button class="btn btn-info btn-sm" @click="activeStatus = 'Processing'">Buka Antrean</button>
      </template>
    </UiAlert>

    <!-- Filters -->
    <UiCard title="Filter Pesanan" subtitle="Saring berdasarkan status, kanal penjualan, dan rentang tanggal." accent-top="primary">
      <template #actions>
        <UiTooltip text="Rentang tanggal memengaruhi tabel secara langsung">
          <Info class="h-4 w-4 text-[var(--text-faint)]" />
        </UiTooltip>
      </template>

      <div class="space-y-4">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="tab in statusTabs"
            :key="tab.id"
            type="button"
            class="inline-flex items-center gap-1.5 rounded-btn border px-3 py-1.5 text-xs font-semibold transition-all"
            :class="
              activeStatus === tab.id
                ? 'border-primary bg-primary text-primary-content shadow-none'
                : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
            "
            :aria-pressed="activeStatus === tab.id"
            @click="activeStatus = tab.id"
          >
            {{ tab.label }}
            <span class="rounded-badge bg-base-200 px-1.5 py-0.5 font-mono text-[10px] text-base-content/70">
              {{ statusCount(tab.id) }}
            </span>
          </button>
        </div>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UiSelect v-model="channelFilter" :options="channelOptions" label="Kanal Penjualan" />
          <UiDatePicker v-model="dateFrom" label="Dari Tanggal" />
          <UiDatePicker v-model="dateTo" label="Sampai Tanggal" />
        </div>

        <UiAlert v-if="dateError" variant="error" title="Rentang tanggal tidak valid">
          <p>Tanggal awal melewati tanggal akhir. Perbaiki rentang atau reset filter.</p>
          <template #actions>
            <button class="btn btn-error btn-sm" @click="resetDateRange">Reset Rentang</button>
          </template>
        </UiAlert>
      </div>
    </UiCard>

    <!-- Orders Table -->
    <UiDataTable
      v-if="!dateError"
      :columns="columns"
      :items="filteredOrders"
      :initial-page-size="5"
      :page-size-options="[5, 10, 25]"
      export-title="Tinkit Orders & Invoices Report"
      @bulk-delete="handleBulkDelete"
    >
      <template #cell-order="{ item }">
        <div>
          <p class="font-mono text-xs font-bold text-primary">{{ item.id }}</p>
          <p class="text-[11px] text-base-content/50">{{ formatDate(item.date) }}</p>
          <p class="text-[11px] text-base-content/40">{{ item.items }} item</p>
        </div>
      </template>

      <template #cell-customer="{ item }">
        <div class="flex items-center gap-2.5">
          <UiAvatar :name="item.customer" :variant="item.status === 'Completed' ? 'success' : 'primary'" size="sm" />
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-base-content">{{ item.customer }}</p>
            <p class="truncate text-[11px] text-base-content/50">{{ item.email }}</p>
          </div>
        </div>
      </template>

      <template #cell-channel="{ value }">
        <UiBadge variant="secondary" soft size="sm">{{ value }}</UiBadge>
      </template>

      <template #cell-total="{ value }">
        <span class="font-mono text-sm font-bold">{{ formatIDR(Number(value)) }}</span>
      </template>

      <template #cell-fulfillment="{ item }">
        <div class="space-y-1">
          <UiProgress
            :value="item.fulfillment"
            :variant="item.fulfillment >= 100 ? 'success' : item.fulfillment >= 60 ? 'info' : 'warning'"
            size="xs"
          />
          <p class="truncate text-[10px] text-base-content/50" :title="item.tracking">{{ item.tracking }}</p>
        </div>
      </template>

      <template #cell-payment="{ value }">
        <UiBadge :variant="paymentBadge(String(value))" soft size="sm">{{ value }}</UiBadge>
      </template>

      <template #cell-status="{ value }">
        <UiBadge :variant="statusBadge(String(value))" soft dot size="sm">{{ value }}</UiBadge>
      </template>

      <template #cell-actions="{ item }">
        <UiDropdown
          align="right"
          variant="ghost"
          size="xs"
          label="Aksi"
          :items="rowActions(item)"
          @select="
            (action) => {
              if (action.value === 'view') openDetail(item)
              if (action.value === 'ship') shipOrder(item)
              if (action.value === 'refund') openRefund(item)
              if (action.value === 'cancel') cancelOrder(item)
            }
          "
        />
      </template>
    </UiDataTable>

    <UiEmptyState
      v-else
      title="Rentang Tanggal Tidak Valid"
      description="Tanggal awal tidak boleh melewati tanggal akhir. Reset rentang untuk menampilkan kembali pesanan."
      :icon="ReceiptText"
      variant="error"
    >
      <UiButton variant="error" soft size="sm" @click="resetDateRange">Reset Rentang Tanggal</UiButton>
    </UiEmptyState>

    <!-- Order Detail Modal -->
    <UiModal v-model="showDetail" :title="`Invoice ${selectedOrder?.id ?? ''}`" subtitle="Rincian pesanan, pengiriman, dan status pembayaran." max-width="xl">
      <div v-if="selectedOrder" class="space-y-5">
        <UiAlert
          v-if="selectedOrder.payment === 'Pending'"
          variant="warning"
          title="Pembayaran belum terkonfirmasi"
          dismissible
        >
          <p>
            Pesanan dibuat pada {{ formatDate(selectedOrder.date) }}. Batas pembayaran 24 jam sebelum otomatis dibatalkan.
          </p>
        </UiAlert>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div class="rounded-box border border-base-300 bg-base-200/35 p-3.5">
            <p class="text-[11px] font-semibold text-base-content/45">Status</p>
            <UiBadge :variant="statusBadge(selectedOrder.status)" soft dot class="mt-1.5">{{ selectedOrder.status }}</UiBadge>
          </div>
          <div class="rounded-box border border-base-300 bg-base-200/35 p-3.5">
            <p class="text-[11px] font-semibold text-base-content/45">Pembayaran</p>
            <UiBadge :variant="paymentBadge(selectedOrder.payment)" soft class="mt-1.5">{{ selectedOrder.payment }}</UiBadge>
          </div>
          <div class="rounded-box border border-base-300 bg-base-200/35 p-3.5">
            <p class="text-[11px] font-semibold text-base-content/45">Total</p>
            <p class="mt-1 font-mono text-base font-extrabold text-base-content">{{ formatIDR(selectedOrder.total) }}</p>
          </div>
        </div>

        <UiProgress :value="selectedOrder.fulfillment" label="Progres Fulfillment" show-value :variant="selectedOrder.fulfillment >= 100 ? 'success' : 'primary'" />

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="rounded-box border border-base-300 p-4">
            <div class="mb-2 flex items-center gap-2 text-xs font-bold text-base-content/50">
              <MapPin class="h-3.5 w-3.5 text-primary" />
              Alamat Pengiriman
            </div>
            <p class="text-sm font-semibold text-base-content">{{ selectedOrder.customer }}</p>
            <p class="mt-1 text-xs leading-relaxed text-base-content/65">
              {{ selectedOrder.address }}<br />
              {{ selectedOrder.city }}, Indonesia<br />
              {{ selectedOrder.email }}
            </p>
          </div>
          <div class="rounded-box border border-base-300 p-4">
            <div class="mb-2 flex items-center gap-2 text-xs font-bold text-base-content/50">
              <Truck class="h-3.5 w-3.5 text-info" />
              Informasi Kurir
            </div>
            <p class="text-sm font-semibold text-base-content">{{ selectedOrder.tracking }}</p>
            <p class="mt-1 text-xs text-base-content/65">
              Kanal: {{ selectedOrder.channel }} · {{ selectedOrder.items }} item
            </p>
            <UiButton variant="info" soft size="xs" class="mt-2" :icon="Printer" @click="printInvoice">
              Cetak Label
            </UiButton>
          </div>
        </div>

        <div>
          <h5 class="card-title mb-2">Item Pesanan</h5>
          <UiTable :columns="lineColumns" :items="lineItems" compact>
            <template #cell-name="{ item }">
              <span class="text-sm font-medium text-base-content">{{ item.name }}</span>
            </template>
            <template #cell-price="{ value }">
              <span class="font-mono text-xs">{{ formatIDR(Number(value)) }}</span>
            </template>
            <template #cell-subtotal="{ value }">
              <span class="font-mono text-xs font-bold">{{ formatIDR(Number(value)) }}</span>
            </template>
            <template #footer>
              <div class="space-y-1 text-xs">
                <div class="flex justify-between">
                  <span class="text-base-content/60">Subtotal</span>
                  <span class="font-mono">{{ formatIDR(orderSubtotal) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/60">Pengiriman</span>
                  <span class="font-mono">{{ orderShipping === 0 ? 'Gratis' : formatIDR(orderShipping) }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-base-content/60">PPN 11%</span>
                  <span class="font-mono">{{ formatIDR(orderTax) }}</span>
                </div>
                <div class="flex justify-between border-t border-base-300 pt-1 text-sm font-bold text-base-content">
                  <span>Total Tagihan</span>
                  <span class="font-mono">{{ formatIDR(orderSubtotal + orderShipping + orderTax) }}</span>
                </div>
              </div>
            </template>
          </UiTable>
        </div>

        <div>
          <h5 class="card-title mb-3">Riwayat Status</h5>
          <UiTimeline :items="detailTimeline" />
        </div>
      </div>

      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Tutup</UiButton>
        <UiButton variant="info" soft size="sm" :icon="Printer" @click="printInvoice">Cetak Invoice</UiButton>
        <UiButton
          v-if="selectedOrder && selectedOrder.status === 'Processing'"
          variant="primary"
          size="sm"
          :icon="Send"
          @click="shipSelected"
        >
          Kirim Pesanan
        </UiButton>
      </template>
    </UiModal>

    <!-- Refund Modal -->
    <UiModal v-model="showRefundModal" title="Proses Refund" subtitle="Tinjau nominal, alasan, dan metode pengembalian dana." max-width="xl">
      <div v-if="refundOrder" class="space-y-5">
        <UiAlert variant="warning" title="Konfirmasi Sebelum Memproses">
          <p>
            Refund untuk <strong>{{ refundOrder.id }}</strong> ({{ refundOrder.customer }}) tidak dapat dibatalkan setelah diproses.
            Nilai transaksi asli {{ formatIDR(refundOrder.total) }}.
          </p>
        </UiAlert>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiInputCurrency v-model="refundForm.amount" label="Nominal Refund" currency="IDR" :max="refundOrder.total" />
          <UiSelect v-model="refundForm.reason" :options="reasonOptions" label="Alasan Refund" />
        </div>

        <div>
          <p class="label-text mb-2">Metode Pengembalian</p>
          <UiRadioCard v-model="refundMethod" :options="refundMethods" :columns="3" gap="sm" />
        </div>

        <UiCheckbox
          v-model="refundForm.restock"
          label="Kembalikan stok ke inventori"
          description="Aktifkan jika barang kembali dalam kondisi layak jual."
          variant="success"
        />

        <UiRichEditor v-model="refundForm.note" label="Catatan Internal QC" min-height="120px" />
      </div>

      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batalkan</UiButton>
        <UiButton variant="error" size="sm" :icon="Undo2" @click="submitRefund">Proses Refund</UiButton>
      </template>
    </UiModal>
  </div>
</template>
