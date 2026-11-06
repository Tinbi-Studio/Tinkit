<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'
import {
  ArrowLeft,
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Info,
  Sparkles,
  Download,
  FileText,
  Package,
  CheckCircle2,
  MessageSquare,
  History,
  Pencil,
  Link2,
  Copy,
  ThumbsUp,
  Headphones,
  Cable,
  BatteryCharging,
  Box,
  Palette,
  Clock,
  User,
  MapPin,
} from 'lucide-vue-next'
import { formatIDR } from '@/data/products'
import { useProductStore } from '@/stores/products'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiCarousel from '@/components/ui/UiCarousel.vue'
import UiTabs, { type TabItem } from '@/components/ui/UiTabs.vue'
import UiAccordion, { type AccordionItem } from '@/components/ui/UiAccordion.vue'
import UiTimeline, { type TimelineItem } from '@/components/ui/UiTimeline.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiTable from '@/components/ui/UiTable.vue'
import UiCodeBlock from '@/components/ui/UiCodeBlock.vue'
import UiVideoPlayer from '@/components/ui/UiVideoPlayer.vue'
import UiChatMessage, { type MessageAuthor } from '@/components/ui/UiChatMessage.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiInputCurrency from '@/components/ui/UiInputCurrency.vue'
import UiInputPercent from '@/components/ui/UiInputPercent.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'
import UiPopover from '@/components/ui/UiPopover.vue'
import type { TableColumn } from '@/types/table'

const route = useRoute()
const toast = useToast()
const productStore = useProductStore()

const product = computed(
  () => productStore.findProduct(Number(route.params.id)) ?? productStore.products[0],
)

const activeSlide = ref(0)
const activeTab = ref<string | number>('overview')
const quantity = ref(1)
const selectedColor = ref('midnight')
const wishlisted = ref(false)

const discountedPrice = computed(() =>
  Math.round(product.value.price * (1 - product.value.discount / 100)),
)
const savings = computed(() => product.value.price - discountedPrice.value)

const tabs: TabItem[] = [
  { id: 'overview', label: 'Overview', icon: Info },
  { id: 'reviews', label: 'Reviews', icon: Star, badge: product.value.reviews, badgeVariant: 'warning' },
  { id: 'qa', label: 'Tanya Jawab', icon: MessageSquare, badge: 6, badgeVariant: 'info' },
  { id: 'files', label: 'Dokumen', icon: FileText },
  { id: 'activity', label: 'Aktivitas', icon: History },
]

const slides = computed(() =>
  product.value.gallery.map((image, index) => ({
    id: index,
    image,
    title: index === 0 ? product.value.name : `Tampilan ${index + 1}`,
    alt: `${product.value.name} ${index + 1}`,
  })),
)

const colorOptions = [
  { value: 'midnight', label: 'Midnight Black', color: '#181a20', delta: 0 },
  { value: 'ivory', label: 'Ivory Sand', color: '#e8e2d6', delta: 150000 },
  { value: 'sage', label: 'Sage Green', color: '#8fbf6a', delta: 200000 },
]
const activeColor = computed(
  () => colorOptions.find((option) => option.value === selectedColor.value) ?? colorOptions[0],
)
const colorPrice = computed(() => discountedPrice.value + activeColor.value.delta)

const specItems: AccordionItem[] = [
  {
    id: 'audio',
    title: 'Driver & Kualitas Audio',
    icon: Headphones,
    badge: 'Hi-Res',
    content:
      'Driver dinamis 40mm dengan diafragma bio-cellulose, rentang frekuensi 5Hz - 40kHz, dan sertifikasi Hi-Res Audio Wireless.',
  },
  {
    id: 'connectivity',
    title: 'Konektivitas',
    icon: Cable,
    content:
      'Bluetooth 5.3 multipoint (2 perangkat), codec LDAC/AAC/SBC, serta koneksi USB-C audio dan jack 3.5mm.',
  },
  {
    id: 'battery',
    title: 'Baterai & Charging',
    icon: BatteryCharging,
    badge: '40 jam',
    content:
      'Hingga 40 jam pemakaian (ANC off) atau 28 jam (ANC on). Fast charge 10 menit memberi tambahan 5 jam pemakaian.',
  },
  {
    id: 'box',
    title: 'Isi Kotak',
    icon: Box,
    content:
      'Headphone, hard case, kabel USB-C, kabel audio 3.5mm, adaptor pesawat, dan kartu garansi resmi 24 bulan.',
  },
]

const variantColumns: TableColumn[] = [
  { key: 'color', label: 'Warna' },
  { key: 'sku', label: 'SKU' },
  { key: 'stock', label: 'Stok', align: 'right' },
  { key: 'price', label: 'Harga', align: 'right' },
  { key: 'status', label: 'Status', align: 'center' },
]

const variants = [
  { color: 'Midnight Black', sku: 'AUD-AUR-001-MB', stock: 84, price: 2899000, status: 'Tersedia' },
  { color: 'Ivory Sand', sku: 'AUD-AUR-001-IV', stock: 41, price: 3049000, status: 'Tersedia' },
  { color: 'Sage Green', sku: 'AUD-AUR-001-SG', stock: 12, price: 3099000, status: 'Stok Menipis' },
  { color: 'Coral Edition', sku: 'AUD-AUR-001-CR', stock: 0, price: 3199000, status: 'Habis' },
]

const ratingBreakdown = [
  { stars: 5, count: 241, percent: 77, variant: 'success' as const },
  { stars: 4, count: 48, percent: 15, variant: 'primary' as const },
  { stars: 3, count: 15, percent: 5, variant: 'info' as const },
  { stars: 2, count: 5, percent: 2, variant: 'warning' as const },
  { stars: 1, count: 3, percent: 1, variant: 'error' as const },
]

const reviews = [
  {
    id: 1,
    name: 'Rina Kartika',
    role: 'Verified Buyer',
    initials: 'RK',
    rating: 5,
    date: '18 Apr 2026',
    title: 'ANC-nya luar biasa untuk kerja di coworking space',
    body: 'Bass tetap punchy walau ANC aktif. Build quality terasa premium dan earcup sangat nyaman dipakai 8 jam lebih.',
    helpful: 34,
    photos: true,
  },
  {
    id: 2,
    name: 'Dimas Pratama',
    role: 'Verified Buyer',
    initials: 'DP',
    rating: 4,
    date: '11 Apr 2026',
    title: 'Baterai awet, aplikasi companion bisa lebih baik',
    body: 'Klaim 40 jam terbukti di pemakaian saya. Hanya saja EQ di aplikasi masih terbatas presetnya.',
    helpful: 18,
    photos: false,
  },
  {
    id: 3,
    name: 'Siti Aminah',
    role: 'Top Reviewer',
    initials: 'SA',
    rating: 5,
    date: '02 Apr 2026',
    title: 'Upgrade besar dari generasi sebelumnya',
    body: 'Multipoint beneran berfungsi mulus antara laptop dan ponsel. Mic juga jernih untuk meeting online.',
    helpful: 27,
    photos: true,
  },
]

const reviewFilter = ref('ALL')
const reviewFilterOptions = [
  { label: 'Semua Ulasan', value: 'ALL' },
  { label: 'Bintang 5', value: '5' },
  { label: 'Dengan Foto', value: 'PHOTO' },
]
const filteredReviews = computed(() => {
  if (reviewFilter.value === '5') return reviews.filter((review) => review.rating === 5)
  if (reviewFilter.value === 'PHOTO') return reviews.filter((review) => review.photos)
  return reviews
})

const seller: MessageAuthor = { name: 'Tinkit Official Store', status: 'online' }
const buyer: MessageAuthor = { name: 'Fajar Nugroho', status: 'away' }

const qaMessages = [
  {
    id: 1,
    role: 'user' as const,
    author: buyer,
    content: 'Apakah headphone ini mendukung multipoint untuk dua laptop sekaligus?',
    timestamp: '10:24',
    status: 'read' as const,
  },
  {
    id: 2,
    role: 'assistant' as const,
    author: seller,
    content: 'Halo Fajar! Betul, Aurora Pro mendukung multipoint hingga 2 perangkat aktif bersamaan dengan Bluetooth 5.3.',
    timestamp: '10:31',
    status: 'read' as const,
  },
  {
    id: 3,
    role: 'user' as const,
    author: buyer,
    content: 'Kalau garansinya bagaimana?',
    timestamp: '10:33',
    status: 'read' as const,
  },
  {
    id: 4,
    role: 'assistant' as const,
    author: seller,
    content: 'Garansi resmi distributor 24 bulan untuk kerusakan pabrikan, termasuk unit replacement jika tidak bisa diperbaiki.',
    timestamp: '10:35',
    status: 'delivered' as const,
  },
]

const productFiles = ref<UploadedFileItem[]>([
  {
    id: 'doc-1',
    name: 'datasheet-aurora-pro.pdf',
    size: 1843200,
    type: 'application/pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    progress: 100,
    status: 'done',
  },
  {
    id: 'doc-2',
    name: 'product-gallery-01.jpg',
    size: 524288,
    type: 'image/jpeg',
    url: product.value.gallery[0],
    progress: 100,
    status: 'done',
  },
  {
    id: 'doc-3',
    name: 'panduan-migrasi-firmware.txt',
    size: 8192,
    type: 'text/plain',
    url: 'data:text/plain;charset=utf-8,Langkah%20update%20firmware%20Aurora%20Pro%3A%201.%20Buka%20aplikasi%20Tinkit%20Audio.%202.%20Hubungkan%20headphone.%203.%20Pilih%20Firmware%20Update.',
    progress: 100,
    status: 'done',
  },
])

const activityItems: TimelineItem[] = [
  {
    id: 1,
    title: 'Harga katalog diperbarui',
    description: 'Diskon 17% diaktifkan untuk kampanye Mid-Season Sale.',
    time: 'Hari ini, 09:12',
    variant: 'primary',
    badge: 'Pricing',
    author: 'Arif Budiman',
    icon: Pencil,
  },
  {
    id: 2,
    title: 'Restock gudang Jakarta',
    description: '148 unit masuk ke bin A-12 dan siap dikirim.',
    time: 'Kemarin, 16:40',
    variant: 'success',
    badge: 'Inventory',
    author: 'Siti Aminah',
    icon: Package,
  },
  {
    id: 3,
    title: 'Konten deskripsi diperbarui',
    description: 'Menambahkan spesifikasi codec LDAC dan multipoint.',
    time: '26 Apr 2026',
    variant: 'info',
    badge: 'Content',
    author: 'Rina Kartika',
    icon: FileText,
  },
  {
    id: 4,
    title: 'Produk dibuat',
    description: 'SKU AUD-AUR-001 pertama kali dipublikasikan.',
    time: '12 Jan 2026',
    variant: 'neutral',
    badge: 'Created',
    author: 'Sistem',
    icon: CheckCircle2,
  },
]

const skuPayload = computed(() =>
  JSON.stringify(
    {
      sku: product.value.sku,
      name: product.value.name,
      price: product.value.price,
      currency: 'IDR',
      stock: product.value.stock,
      tags: product.value.tags,
      status: product.value.status,
      updatedAt: new Date().toISOString(),
    },
    null,
    2,
  ),
)

const documentColumns: TableColumn[] = [
  { key: 'name', label: 'Nama Berkas' },
  { key: 'type', label: 'Tipe' },
  { key: 'size', label: 'Ukuran', align: 'right' },
]

const documentRows = [
  { id: 1, name: 'datasheet-aurora-pro.pdf', type: 'PDF', size: '1.8 MB' },
  { id: 2, name: 'product-gallery-01.jpg', type: 'JPEG', size: '512 KB' },
  { id: 3, name: 'panduan-migrasi-firmware.txt', type: 'TXT', size: '8 KB' },
]

function addToCart() {
  toast.success(
    'Ditambahkan ke Keranjang',
    `${quantity.value}x ${product.value.name} (${activeColor.value.label}) — ${formatIDR(colorPrice.value * quantity.value)}`,
  )
}

function toggleWishlist() {
  wishlisted.value = !wishlisted.value
  if (wishlisted.value) {
    toast.primary('Ditambahkan ke Wishlist', `${product.value.name} disimpan untuk nanti.`)
  } else {
    toast.info('Dihapus dari Wishlist', `${product.value.name} dihapus dari daftar simpanan.`)
  }
}

function copyShareLink() {
  const link = `${window.location.origin}/products/${product.value.id}`
  if (navigator.clipboard) {
    navigator.clipboard.writeText(link).catch(() => undefined)
  }
  toast.info('Tautan Disalin', link)
}

function markHelpful(reviewId: number) {
  const review = reviews.find((item) => item.id === reviewId)
  if (!review) return
  review.helpful += 1
  toast.success('Terima kasih!', 'Ulasan ditandai membantu.')
}

const showPricingModal = ref(false)
interface PricingForm {
  price: number | null
  discount: number | null
  saleEnd: string
  notify: boolean
  note: string
}
const pricingForm = ref<PricingForm>({
  price: product.value.price,
  discount: product.value.discount,
  saleEnd: '2026-06-30',
  notify: true,
  note: '<p>Kampanye Mid-Season Sale berakhir 30 Juni 2026.</p>',
})

function openPricingModal() {
  pricingForm.value = {
    price: product.value.price,
    discount: product.value.discount,
    saleEnd: '2026-06-30',
    notify: true,
    note: '<p>Kampanye Mid-Season Sale berakhir 30 Juni 2026.</p>',
  }
  showPricingModal.value = true
}

function savePricing() {
  const nextPrice = pricingForm.value.price
  if (!nextPrice || nextPrice <= 0) {
    toast.error('Harga Tidak Valid', 'Harga jual harus lebih besar dari nol.')
    return
  }
  productStore.updatePricing(product.value.id, nextPrice, pricingForm.value.discount ?? 0)
  showPricingModal.value = false
  toast.success('Harga Diperbarui', `Harga baru ${formatIDR(product.value.price)} diterapkan ke semua kanal.`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-start gap-3">
        <RouterLink to="/products" class="btn btn-ghost btn-sm btn-circle border border-base-300 shrink-0">
          <ArrowLeft class="h-4 w-4" />
        </RouterLink>
        <div>
          <div class="flex flex-wrap items-center gap-2 text-xs text-[var(--text-faint)]">
            <RouterLink to="/products" class="hover:text-primary">Katalog</RouterLink>
            <span>/</span>
            <span>{{ product.category }}</span>
            <span>/</span>
            <span class="font-mono">{{ product.sku }}</span>
          </div>
          <h4 class="mt-1 text-xl font-bold text-[var(--text)]">{{ product.name }}</h4>
          <p class="mt-0.5 text-sm text-[var(--text-muted)]">
            Detail produk, media, ulasan, dan riwayat perubahan katalog.
          </p>
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
        <UiBadge :variant="product.status === 'Active' ? 'success' : 'warning'" soft dot>
          {{ product.status }}
        </UiBadge>
        <UiButton variant="ghost" size="sm" class="border border-base-300" :icon="Pencil" @click="openPricingModal">
          Atur Harga
        </UiButton>
        <UiButton variant="secondary" size="sm" :icon="ShoppingCart" @click="addToCart">
          Add to Cart
        </UiButton>
      </div>
    </div>

    <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
      <!-- Gallery & Tabs -->
      <div class="space-y-6 xl:col-span-2">
        <UiCard compact accent-top="primary">
          <UiCarousel
            v-model="activeSlide"
            :slides="slides"
            :interval="7000"
            autoplay
            show-thumbnails
            aspect-ratio="wide"
          />
        </UiCard>

        <UiTabs v-model="activeTab" :items="tabs" variant="attached" size="md">
          <!-- Overview -->
          <template #overview>
            <div class="space-y-6">
              <div class="prose-tinkit text-sm leading-relaxed text-base-content/80" v-html="product.description" />

              <div class="flex flex-wrap gap-2">
                <UiBadge v-for="tag in product.tags" :key="tag" variant="primary" soft>{{ tag }}</UiBadge>
                <UiBadge variant="accent" soft>{{ product.category }}</UiBadge>
              </div>

              <div>
                <div class="mb-3 flex items-center justify-between">
                  <h5 class="card-title">Spesifikasi Teknis</h5>
                  <UiBadge variant="neutral" soft size="sm">4 kategori</UiBadge>
                </div>
                <UiAccordion :items="specItems" :model-value="['audio']" multiple variant="separated" />
              </div>

              <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <h5 class="card-title mb-3">Video Produk</h5>
                  <UiVideoPlayer
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                    :poster="product.gallery[0]"
                    title="Aurora Pro — Feature Walkthrough"
                  />
                </div>
                <div>
                  <div class="mb-3 flex items-center justify-between">
                    <h5 class="card-title">Payload Katalog (API)</h5>
                    <UiTooltip text="Payload yang dikirim ke layanan katalog">
                      <Info class="h-4 w-4 text-[var(--text-faint)]" />
                    </UiTooltip>
                  </div>
                  <UiCodeBlock
                    :code="skuPayload"
                    language="json"
                    filename="product.json"
                    :show-line-numbers="true"
                    max-height="240px"
                  />
                </div>
              </div>

              <div>
                <h5 class="card-title mb-3">Matriks Varian</h5>
                <UiTable :columns="variantColumns" :items="variants" compact>
                  <template #cell-color="{ value }">
                    <div class="flex items-center gap-2">
                      <Palette class="h-4 w-4 text-primary" />
                      <span class="font-medium">{{ value }}</span>
                    </div>
                  </template>
                  <template #cell-sku="{ value }">
                    <span class="font-mono text-xs text-base-content/70">{{ value }}</span>
                  </template>
                  <template #cell-stock="{ value }">
                    <span class="font-mono text-xs font-bold" :class="Number(value) === 0 ? 'text-error' : 'text-base-content'">
                      {{ value }} unit
                    </span>
                  </template>
                  <template #cell-price="{ value }">
                    <span class="font-mono text-xs font-semibold">{{ formatIDR(Number(value)) }}</span>
                  </template>
                  <template #cell-status="{ value }">
                    <UiBadge
                      :variant="value === 'Tersedia' ? 'success' : value === 'Stok Menipis' ? 'warning' : 'error'"
                      soft
                      size="sm"
                    >
                      {{ value }}
                    </UiBadge>
                  </template>
                </UiTable>
              </div>
            </div>
          </template>

          <!-- Reviews -->
          <template #reviews>
            <div class="space-y-6">
              <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div class="rounded-box border border-base-300 bg-base-200/40 p-4 text-center">
                  <p class="text-4xl font-extrabold text-base-content">{{ product.rating.toFixed(1) }}</p>
                  <div class="mt-1 flex items-center justify-center gap-0.5">
                    <Star v-for="index in 5" :key="index" class="h-4 w-4" :class="index <= Math.round(product.rating) ? 'fill-warning text-warning' : 'text-base-content/25'" />
                  </div>
                  <p class="mt-1 text-xs text-base-content/55">{{ product.reviews }} ulasan terverifikasi</p>
                </div>
                <div class="space-y-2 sm:col-span-2">
                  <UiProgress
                    v-for="row in ratingBreakdown"
                    :key="row.stars"
                    :value="row.percent"
                    :variant="row.variant"
                    size="sm"
                    :label="`${row.stars} bintang`"
                    show-value
                  />
                </div>
              </div>

              <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h5 class="card-title">Ulasan Pelanggan</h5>
                <div class="w-full sm:w-56">
                  <UiSelect v-model="reviewFilter" :options="reviewFilterOptions" size="sm" />
                </div>
              </div>

              <div v-if="filteredReviews.length" class="space-y-4">
                <div
                  v-for="review in filteredReviews"
                  :key="review.id"
                  class="rounded-box border border-base-300 bg-base-100 p-4"
                >
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <UiAvatar :name="review.name" :variant="review.rating === 5 ? 'success' : 'primary'" status="online" size="md" />
                      <div>
                        <p class="text-sm font-bold text-base-content">{{ review.name }}</p>
                        <div class="flex items-center gap-2 text-[11px] text-base-content/50">
                          <span>{{ review.role }}</span>
                          <span>•</span>
                          <span>{{ review.date }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-0.5">
                      <Star v-for="index in 5" :key="index" class="h-3.5 w-3.5" :class="index <= review.rating ? 'fill-warning text-warning' : 'text-base-content/20'" />
                    </div>
                  </div>
                  <h6 class="mt-3 text-sm font-semibold text-base-content">{{ review.title }}</h6>
                  <p class="mt-1 text-sm leading-relaxed text-base-content/70">{{ review.body }}</p>
                  <div class="mt-3 flex items-center justify-between">
                    <div class="flex items-center gap-2">
                      <UiBadge v-if="review.photos" variant="info" soft size="sm">Foto pembeli</UiBadge>
                      <UiBadge variant="neutral" soft size="sm">{{ review.helpful }} membantu</UiBadge>
                    </div>
                    <button class="btn btn-ghost btn-xs gap-1.5 text-base-content/60" @click="markHelpful(review.id)">
                      <ThumbsUp class="h-3.5 w-3.5" />
                      Membantu
                    </button>
                  </div>
                </div>
              </div>

              <UiEmptyState
                v-else
                compact
                title="Belum ada ulasan yang cocok"
                description="Coba pilih filter lain untuk melihat ulasan pelanggan lainnya."
                :variant="'warning'"
              >
                <UiButton variant="warning" soft size="sm" @click="reviewFilter = 'ALL'">Tampilkan Semua</UiButton>
              </UiEmptyState>
            </div>
          </template>

          <!-- Q&A -->
          <template #qa>
            <div class="space-y-5">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="card-title">Tanya Jawab Pembeli</h5>
                  <p class="card-subtitle mt-0.5">Pertanyaan publik yang dijawab oleh tim toko.</p>
                </div>
                <UiBadge variant="info" soft dot>Respon &lt; 5 menit</UiBadge>
              </div>

              <div class="space-y-4 rounded-box border border-base-300 bg-base-200/30 p-4">
                <UiChatMessage
                  v-for="message in qaMessages"
                  :key="message.id"
                  :role="message.role"
                  :author="message.author"
                  :content="message.content"
                  :timestamp="message.timestamp"
                  :status="message.status"
                  align="left"
                />
              </div>

              <div class="flex items-start gap-2.5 rounded-box border border-base-300 bg-base-100 p-3">
                <UiAvatar :name="seller.name" variant="primary" size="sm" />
                <input class="input input-sm flex-1" placeholder="Tulis pertanyaan untuk penjual..." />
                <UiButton variant="primary" size="sm">Kirim</UiButton>
              </div>
            </div>
          </template>

          <!-- Files -->
          <template #files>
            <div class="space-y-5">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h5 class="card-title">Dokumen & Media Produk</h5>
                  <p class="card-subtitle mt-0.5">Datasheet, foto resolusi tinggi, dan panduan teknis.</p>
                </div>
                <UiButton variant="primary" soft size="sm" :icon="Download" @click="toast.info('Unduh Dimulai', 'Paket media produk sedang disiapkan.')">
                  Unduh Semua
                </UiButton>
              </div>

              <UiFileUpload
                v-model="productFiles"
                mode="file"
                label="Berkas Lampiran Produk"
                accept=".pdf,image/*,text/*"
                hint="Pratinjau PDF, gambar, dan teks tersedia langsung dari daftar."
              />

              <UiTable :columns="documentColumns" :items="documentRows" compact />
            </div>
          </template>

          <!-- Activity -->
          <template #activity>
            <div class="space-y-5">
              <div class="flex items-center justify-between">
                <div>
                  <h5 class="card-title">Riwayat Perubahan</h5>
                  <p class="card-subtitle mt-0.5">Jejak audit harga, stok, konten, dan publikasi.</p>
                </div>
                <UiBadge variant="neutral" soft>{{ activityItems.length }} entri</UiBadge>
              </div>
              <UiTimeline :items="activityItems" />
            </div>
          </template>
        </UiTabs>
      </div>

      <!-- Purchase Sidebar -->
      <div class="space-y-6">
        <UiCard accent-top="secondary">
          <div class="space-y-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="badge badge-soft badge-warning gap-1 text-xs font-bold">
                    <Star class="h-3 w-3 fill-warning" />
                    {{ product.rating.toFixed(1) }}
                  </span>
                  <span class="text-xs text-base-content/50">{{ product.reviews }} ulasan · {{ product.sold }} terjual</span>
                </div>
                <div class="mt-3 flex flex-wrap items-end gap-2">
                  <p class="font-mono text-3xl font-extrabold text-base-content">{{ formatIDR(colorPrice) }}</p>
                  <p v-if="product.compareAt > product.price" class="pb-1 font-mono text-sm text-base-content/45 line-through">{{ formatIDR(product.compareAt) }}</p>
                  <UiBadge variant="error" soft size="sm">-{{ product.discount }}%</UiBadge>
                </div>
                <p class="mt-1 text-xs font-medium text-success">Hemat {{ formatIDR(savings) }} dari harga normal</p>
              </div>
              <div class="flex flex-col gap-1.5">
                <UiTooltip text="Simpan ke wishlist">
                  <button
                    class="btn btn-ghost btn-sm btn-circle border border-base-300"
                    :class="wishlisted ? 'text-error' : 'text-base-content/60'"
                    @click="toggleWishlist"
                  >
                    <Heart class="h-4 w-4" :class="wishlisted ? 'fill-error' : ''" />
                  </button>
                </UiTooltip>
                <UiPopover title="Bagikan Produk" subtitle="Salin tautan atau kirim ke kanal tim" position="left" width-class="w-64">
                  <template #trigger>
                    <button class="btn btn-ghost btn-sm btn-circle border border-base-300 text-base-content/60">
                      <Share2 class="h-4 w-4" />
                    </button>
                  </template>
                  <div class="space-y-2">
                    <button class="flex w-full items-center gap-2 rounded-btn border border-base-300 px-3 py-2 text-xs font-semibold hover:border-primary" @click="copyShareLink">
                      <Link2 class="h-4 w-4 text-primary" />
                      Salin tautan produk
                    </button>
                    <button class="flex w-full items-center gap-2 rounded-btn border border-base-300 px-3 py-2 text-xs font-semibold hover:border-primary" @click="toast.info('Bagikan ke WhatsApp', 'Membuka draf pesan WhatsApp...')">
                      <Copy class="h-4 w-4 text-success" />
                      Kirim ke WhatsApp
                    </button>
                  </div>
                </UiPopover>
              </div>
            </div>

            <div class="rounded-box border border-base-300 bg-base-200/40 p-3.5">
              <div class="mb-2 flex items-center justify-between text-xs font-semibold">
                <span class="text-base-content/70">Ketersediaan Stok</span>
                <span class="font-mono" :class="product.stock < 20 ? 'text-warning' : 'text-success'">
                  {{ product.stock }} unit
                </span>
              </div>
              <UiProgress :value="product.stock" :max="product.stockLimit" :variant="product.stock < 20 ? 'warning' : 'success'" />
              <p class="mt-2 text-[11px] text-base-content/50">
                Dikirim dari gudang Jakarta dalam 1x24 jam kerja.
              </p>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <span class="label-text">Pilih Warna</span>
                <span class="text-xs text-base-content/50">{{ activeColor.label }}</span>
              </div>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="option in colorOptions"
                  :key="option.value"
                  type="button"
                  class="flex items-center gap-2 rounded-btn border px-3 py-1.5 text-xs font-semibold transition-all"
                  :class="
                    selectedColor === option.value
                      ? 'border-primary bg-primary text-primary-content'
                      : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                  "
                  :aria-pressed="selectedColor === option.value"
                  @click="selectedColor = option.value"
                >
                  <span class="h-3.5 w-3.5 rounded-full border border-black/10" :style="{ backgroundColor: option.color }" />
                  {{ option.label }}
                </button>
              </div>
            </div>

            <div>
              <div class="mb-2 flex items-center justify-between">
                <span class="label-text">Jumlah</span>
                <span class="text-[11px] text-base-content/50">Maks. 5 unit per transaksi</span>
              </div>
              <div class="flex items-center gap-2">
                <button class="btn btn-outline btn-sm btn-square" :disabled="quantity <= 1" @click="quantity--">−</button>
                <input v-model.number="quantity" type="number" min="1" max="5" class="input input-sm w-20 text-center font-mono" />
                <button class="btn btn-outline btn-sm btn-square" :disabled="quantity >= 5" @click="quantity++">+</button>
              </div>
            </div>

            <div class="space-y-2 pt-1">
              <UiButton variant="primary" block :icon="ShoppingCart" @click="addToCart">
                Tambahkan ke Keranjang · {{ formatIDR(colorPrice * quantity) }}
              </UiButton>
              <UiButton variant="ghost" block class="border border-base-300" :icon="Pencil" @click="openPricingModal">
                Ubah Harga & Diskon
              </UiButton>
            </div>

            <div class="space-y-2.5 border-t border-base-300 pt-3 text-xs text-base-content/65">
              <div class="flex items-center gap-2">
                <Truck class="h-4 w-4 text-primary" />
                Gratis ongkir untuk pesanan di atas {{ formatIDR(500000) }}
              </div>
              <div class="flex items-center gap-2">
                <ShieldCheck class="h-4 w-4 text-success" />
                Garansi resmi 24 bulan
              </div>
              <div class="flex items-center gap-2">
                <RotateCcw class="h-4 w-4 text-info" />
                Pengembalian gratis dalam 14 hari
                <UiTooltip text="Syarat & ketentuan berlaku">
                  <Info class="h-3.5 w-3.5 text-base-content/40" />
                </UiTooltip>
              </div>
            </div>
          </div>
        </UiCard>

        <UiCard title="Info Penjual" subtitle="Toko resmi terverifikasi Tinkit" accent-top="accent">
          <div class="flex items-center gap-3">
            <div class="flex h-12 w-12 items-center justify-center rounded-box bg-primary/12 text-primary">
              <Sparkles class="h-6 w-6" />
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-base-content">Tinkit Official Store</p>
              <p class="text-xs text-base-content/55">Jakarta · Bergabung 2021</p>
            </div>
          </div>
          <div class="mt-4 grid grid-cols-3 gap-2 text-center">
            <div class="rounded-btn bg-base-200/60 p-2">
              <p class="text-sm font-extrabold text-base-content">4.9</p>
              <p class="text-[10px] text-base-content/50">Rating</p>
            </div>
            <div class="rounded-btn bg-base-200/60 p-2">
              <p class="text-sm font-extrabold text-base-content">98%</p>
              <p class="text-[10px] text-base-content/50">Chat dibalas</p>
            </div>
            <div class="rounded-btn bg-base-200/60 p-2">
              <p class="text-sm font-extrabold text-base-content">2 jam</p>
              <p class="text-[10px] text-base-content/50">Respon</p>
            </div>
          </div>
          <div class="mt-4 space-y-2 text-xs text-base-content/65">
            <div class="flex items-center gap-2">
              <MapPin class="h-3.5 w-3.5" />
              Gudang Jakarta Selatan
            </div>
            <div class="flex items-center gap-2">
              <Clock class="h-3.5 w-3.5" />
              Senin-Sabtu, 09:00-18:00
            </div>
            <div class="flex items-center gap-2">
              <User class="h-3.5 w-3.5" />
              CS: Rina Kartika
            </div>
          </div>
          <UiButton variant="secondary" soft size="sm" block class="mt-4" :icon="MessageSquare" @click="activeTab = 'qa'">
            Tanya Penjual
          </UiButton>
        </UiCard>
      </div>
    </div>

    <!-- Pricing Modal -->
    <UiModal
      v-model="showPricingModal"
      title="Atur Harga & Diskon"
      subtitle="Perubahan harga berlaku untuk semua kanal penjualan setelah disimpan."
      max-width="lg"
    >
      <form class="space-y-4" @submit.prevent="savePricing">
        <UiAlert variant="info" title="Simulasi Harga">
          <p>
            Harga setelah diskon:
            <strong>{{ formatIDR((pricingForm.price ?? 0) * (1 - (pricingForm.discount ?? 0) / 100)) }}</strong>
            — margin kotor diestimasi 32%.
          </p>
        </UiAlert>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiInputCurrency v-model="pricingForm.price" label="Harga Normal" currency="IDR" />
          <UiInputPercent v-model="pricingForm.discount" label="Diskon Kampanye" :max="70" :show-slider="true" />
        </div>

        <UiDatePicker v-model="pricingForm.saleEnd" label="Berakhir Pada" hint="Harga kembali normal otomatis setelah tanggal ini." />

        <UiCheckbox
          v-model="pricingForm.notify"
          label="Kirim notifikasi ke pelanggan wishlist"
          description="Pelanggan akan menerima email saat harga berubah."
          variant="success"
        />

        <UiRichEditor v-model="pricingForm.note" label="Catatan Internal" min-height="120px" />
      </form>

      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batalkan</UiButton>
        <UiButton variant="primary" size="sm" :icon="CheckCircle2" @click="savePricing">Simpan Harga</UiButton>
      </template>
    </UiModal>
  </div>
</template>
