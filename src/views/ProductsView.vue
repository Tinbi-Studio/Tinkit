<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useProductStore } from '@/stores/products'
import {
  Star,
  Boxes,
  Wallet,
  TriangleAlert,
  PackageCheck,
  Plus,
  Pencil,
  Copy,
  Archive,
  Trash2,
  RefreshCw,
  Info,
  ArrowUpRight,
} from 'lucide-vue-next'
import UiStatCard from '@/components/ui/UiStatCard.vue'
import UiCard from '@/components/ui/UiCard.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiDropdown, { type DropdownItem } from '@/components/ui/UiDropdown.vue'
import UiDataTable from '@/components/ui/UiDataTable.vue'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  formatIDR,
  type Product,
  type ProductStatus,
} from '@/data/products'
import type { TableColumn } from '@/types/table'

const toast = useToast()
const router = useRouter()
const store = useProductStore()
const products = computed(() => store.products)

const categoryFilter = ref('ALL')
const statusFilter = ref('ALL')
const stockFilter = ref('ALL')
const tagFilter = ref<string[]>([])

const categoryOptions = [
  { label: 'Semua Kategori', value: 'ALL' },
  ...PRODUCT_CATEGORIES.map((category) => ({ label: category, value: category })),
]

const statusOptions = [
  { label: 'Semua Status', value: 'ALL' },
  ...PRODUCT_STATUSES.map((status) => ({ label: status, value: status })),
]

const stockOptions = [
  { label: 'Semua Stok', value: 'ALL' },
  { label: 'Stok Menipis (< 20)', value: 'LOW', description: 'Perlu restock segera' },
  { label: 'Stok Habis', value: 'OUT', description: 'Tidak dapat dijual' },
  { label: 'Stok Aman', value: 'SAFE', description: 'Di atas ambang minimum' },
]

const availableTags = computed(() => {
  const tags = new Set<string>()
  products.value.forEach((product) => product.tags.forEach((tag) => tags.add(tag)))
  return Array.from(tags).slice(0, 10)
})

const filteredProducts = computed(() => {
  return products.value.filter((product) => {
    const matchCategory = categoryFilter.value === 'ALL' || product.category === categoryFilter.value
    const matchStatus = statusFilter.value === 'ALL' || product.status === statusFilter.value
    const matchStock =
      stockFilter.value === 'ALL' ||
      (stockFilter.value === 'LOW' && product.stock > 0 && product.stock < 20) ||
      (stockFilter.value === 'OUT' && product.stock === 0) ||
      (stockFilter.value === 'SAFE' && product.stock >= 20)
    const matchTags =
      tagFilter.value.length === 0 ||
      tagFilter.value.every((tag) => product.tags.includes(tag))
    return matchCategory && matchStatus && matchStock && matchTags
  })
})

const totalInventoryValue = computed(() =>
  products.value.reduce((total, product) => total + product.price * product.stock, 0),
)
const lowStockCount = computed(
  () => products.value.filter((product) => product.stock > 0 && product.stock < 20).length,
)
const outOfStockCount = computed(() => products.value.filter((product) => product.stock === 0).length)
const activeCount = computed(() => products.value.filter((product) => product.status === 'Active').length)

function resetFilters() {
  categoryFilter.value = 'ALL'
  statusFilter.value = 'ALL'
  stockFilter.value = 'ALL'
  tagFilter.value = []
}

const columns: TableColumn<Product>[] = [
  { key: 'product', label: 'Produk', sortable: false, width: '300px' },
  { key: 'category', label: 'Kategori', sortable: true },
  { key: 'price', label: 'Harga', sortable: true, align: 'right' },
  { key: 'stock', label: 'Stok', sortable: true, width: '170px' },
  { key: 'rating', label: 'Rating', sortable: true, align: 'center' },
  { key: 'status', label: 'Status', align: 'center' },
  { key: 'actions', label: 'Aksi', align: 'right', width: '80px' },
]

const statusVariant: Record<ProductStatus, 'success' | 'warning' | 'neutral'> = {
  Active: 'success',
  Draft: 'warning',
  Archived: 'neutral',
}

function statusBadge(status: string): 'success' | 'warning' | 'neutral' {
  return statusVariant[status as ProductStatus] ?? 'neutral'
}

function handleBulkDelete(rows: Product[]) {
  store.removeProducts(rows.map((row) => row.id))
  toast.error('Produk Dihapus', `${rows.length} produk dihapus dari katalog.`)
}

function stockVariant(product: Product): 'success' | 'warning' | 'error' {
  if (product.stock === 0) return 'error'
  if (product.stock < 20) return 'warning'
  return 'success'
}

function rowActions(product: Product): DropdownItem[] {
  return [
    { label: 'Edit produk', value: 'edit', icon: Pencil },
    { label: 'Duplikat', value: 'duplicate', icon: Copy },
    { divider: true },
    {
      label: product.status === 'Archived' ? 'Aktifkan kembali' : 'Arsipkan',
      value: 'archive',
      icon: Archive,
      disabled: product.status === 'Archived',
    },
    { label: 'Hapus', value: 'delete', icon: Trash2, danger: true },
  ]
}

function handleRowAction(value: string | number | undefined, product: Product) {
  if (value === 'edit') {
    router.push({ name: 'product-edit', params: { id: product.id } })
    return
  }
  if (value === 'duplicate') {
    const clone = store.duplicateProduct(product.id)
    if (clone) {
      toast.success('Produk Diduplikasi', `${product.name} disalin sebagai draft baru.`)
    }
    return
  }
  if (value === 'archive') {
    store.archiveProduct(product.id)
    toast.warning('Produk Diarsipkan', `${product.name} tidak lagi tampil di katalog publik.`)
    return
  }
  if (value === 'delete') {
    store.removeProducts([product.id])
    toast.error('Produk Dihapus', `${product.name} telah dihapus dari katalog.`)
  }
}

const syncing = ref(false)
function syncCatalog() {
  if (syncing.value) return
  syncing.value = true
  window.setTimeout(() => {
    syncing.value = false
    toast.success('Sinkronisasi Selesai', `${filteredProducts.value.length} produk tersinkron dengan gudang pusat.`)
  }, 1200)
}

function goToCreate() {
  router.push({ name: 'product-new' })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 class="text-xl font-bold text-[var(--text)]">Product Catalog</h4>
        <p class="mt-0.5 text-sm text-[var(--text-muted)]">
          Kelola katalog, harga, stok, dan status publikasi seluruh SKU toko.
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2.5">
        <UiButton variant="ghost" size="sm" class="border border-base-300" @click="syncCatalog">
          <UiSpinner v-if="syncing" size="xs" />
          <RefreshCw v-else class="h-4 w-4" />
          <span>{{ syncing ? 'Menyinkronkan...' : 'Sinkron Gudang' }}</span>
        </UiButton>
        <UiButton variant="primary" size="sm" :icon="Plus" @click="goToCreate">
          Tambah Produk
        </UiButton>
      </div>
    </div>

    <!-- KPI Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <UiStatCard
        layout="vertical"
        title="Total SKU"
        :value="String(products.length)"
        change="+3"
        trend="up"
        description="Katalog aktif & draft"
        variant="primary"
        :icon="Boxes"
      />
      <UiStatCard
        layout="vertical"
        title="Nilai Inventori"
        :value="formatIDR(totalInventoryValue)"
        change="+8.4%"
        trend="up"
        description="Harga jual x stok tersedia"
        variant="success"
        :icon="Wallet"
      />
      <UiStatCard
        layout="vertical"
        title="Stok Menipis"
        :value="String(lowStockCount)"
        change="-2"
        trend="down"
        description="SKU di bawah 20 unit"
        variant="warning"
        :icon="TriangleAlert"
      />
      <UiStatCard
        layout="vertical"
        title="Produk Aktif"
        :value="String(activeCount)"
        change="+2"
        trend="up"
        description="Tampil di storefront"
        variant="info"
        :icon="PackageCheck"
      />
    </div>

    <!-- Operational Alert -->
    <UiAlert
      v-if="lowStockCount > 0 || outOfStockCount > 0"
      variant="warning"
      title="Perhatian Restock"
      dismissible
    >
      <p>
        {{ lowStockCount }} SKU berada di bawah ambang minimum dan {{ outOfStockCount }} SKU sudah habis.
        Prioritaskan restock agar tidak kehilangan penjualan.
      </p>
      <template #actions>
        <button class="btn btn-warning btn-sm" @click="stockFilter = 'LOW'">
          Lihat Stok Menipis
        </button>
      </template>
    </UiAlert>

    <!-- Filter Panel -->
    <UiCard
      title="Segmentasi Katalog"
      subtitle="Kombinasikan kategori, status publikasi, ketersediaan stok, dan tag untuk mempersempit data."
      accent-top="primary"
    >
      <template #actions>
        <UiBadge variant="primary" soft>{{ filteredProducts.length }} produk</UiBadge>
        <UiTooltip text="Filter diterapkan langsung ke tabel di bawah">
          <Info class="h-4 w-4 text-[var(--text-faint)]" />
        </UiTooltip>
      </template>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <UiSelect v-model="categoryFilter" :options="categoryOptions" label="Kategori" />
        <UiSelect v-model="statusFilter" :options="statusOptions" label="Status" />
        <UiSelect v-model="stockFilter" :options="stockOptions" label="Ketersediaan Stok" />
        <UiSelectTag
          v-model="tagFilter"
          :options="availableTags"
          label="Filter Tag"
          placeholder="Pilih tag..."
          :allow-create="false"
        />
      </div>

      <div v-if="categoryFilter !== 'ALL' || statusFilter !== 'ALL' || stockFilter !== 'ALL' || tagFilter.length" class="mt-4 flex flex-wrap items-center gap-2">
        <span class="text-xs text-[var(--text-muted)]">Filter aktif:</span>
        <UiBadge v-if="categoryFilter !== 'ALL'" variant="primary" soft size="sm">{{ categoryFilter }}</UiBadge>
        <UiBadge v-if="statusFilter !== 'ALL'" variant="secondary" soft size="sm">{{ statusFilter }}</UiBadge>
        <UiBadge v-if="stockFilter !== 'ALL'" variant="warning" soft size="sm">{{ stockFilter }}</UiBadge>
        <UiBadge v-for="tag in tagFilter" :key="tag" variant="accent" soft size="sm">{{ tag }}</UiBadge>
        <button class="text-xs font-semibold text-primary hover:underline" @click="resetFilters">
          Reset semua
        </button>
      </div>
    </UiCard>

    <!-- Data Table -->
    <UiDataTable
      :columns="columns"
      :items="filteredProducts"
      :initial-page-size="5"
      :page-size-options="[5, 10, 25]"
      export-title="Tinkit Product Catalog Report"
      @bulk-delete="handleBulkDelete"
    >
      <template #toolbar-right>
        <UiButton variant="primary" soft size="sm" :icon="Plus" @click="goToCreate">
          Produk Baru
        </UiButton>
      </template>

      <template #cell-product="{ item }">
        <div class="flex items-center gap-3">
          <div class="h-11 w-11 shrink-0 overflow-hidden rounded-btn border border-base-300 bg-base-200">
            <img :src="item.image" :alt="item.name" class="h-full w-full object-cover" loading="lazy" />
          </div>
          <div class="min-w-0">
            <RouterLink
              :to="`/products/${item.id}`"
              class="block truncate text-sm font-semibold text-base-content hover:text-primary hover:underline"
            >
              {{ item.name }}
            </RouterLink>
            <p class="font-mono text-[11px] text-base-content/50">{{ item.sku }}</p>
            <div class="mt-1 flex flex-wrap gap-1">
              <span
                v-for="tag in item.tags.slice(0, 2)"
                :key="tag"
                class="badge badge-xs border-0 bg-base-200 font-medium text-base-content/60"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <template #cell-category="{ value }">
        <span class="text-sm text-base-content/80">{{ value }}</span>
      </template>

      <template #cell-price="{ item }">
        <div class="text-right">
          <p class="font-mono text-sm font-bold text-base-content">{{ formatIDR(item.price) }}</p>
          <p v-if="item.compareAt > item.price" class="text-[11px] text-base-content/45 line-through">{{ formatIDR(item.compareAt) }}</p>
        </div>
      </template>

      <template #cell-stock="{ item }">
        <div class="space-y-1.5">
          <div class="flex items-center justify-between text-xs">
            <span class="font-mono font-semibold" :class="item.stock === 0 ? 'text-error' : 'text-base-content/75'">
              {{ item.stock }} / {{ item.stockLimit }}
            </span>
            <UiTooltip :text="item.stock === 0 ? 'Stok habis, segera restock' : `Terjual ${item.sold} unit`">
              <TriangleAlert v-if="item.stock < 20" class="h-3.5 w-3.5" :class="item.stock === 0 ? 'text-error' : 'text-warning'" />
              <ArrowUpRight v-else class="h-3.5 w-3.5 text-success" />
            </UiTooltip>
          </div>
          <UiProgress
            :value="item.stock"
            :max="item.stockLimit"
            :variant="stockVariant(item)"
            size="xs"
          />
        </div>
      </template>

      <template #cell-rating="{ item }">
        <div class="inline-flex flex-col items-center">
          <span class="inline-flex items-center gap-1 text-sm font-bold text-base-content">
            <Star class="h-3.5 w-3.5 fill-warning text-warning" />
            {{ item.rating.toFixed(1) }}
          </span>
          <span class="text-[11px] text-base-content/45">{{ item.reviews }} ulasan</span>
        </div>
      </template>

      <template #cell-status="{ value }">
        <UiBadge :variant="statusBadge(value)" soft dot size="sm">
          {{ value }}
        </UiBadge>
      </template>

      <template #cell-actions="{ item }">
        <UiDropdown
          align="right"
          variant="ghost"
          size="xs"
          label="Aksi"
          :items="rowActions(item)"
          @select="(action) => handleRowAction(action.value, item)"
        />
      </template>
    </UiDataTable>
  </div>
</template>
