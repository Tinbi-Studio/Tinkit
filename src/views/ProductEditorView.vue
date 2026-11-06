<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { useToast } from '@/stores/toast'
import { useProductStore, type ProductDraft } from '@/stores/products'
import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  formatIDR,
  type Product,
  type ProductStatus,
} from '@/data/products'
import { ArrowLeft, Save, Sparkles } from 'lucide-vue-next'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiInputCurrency from '@/components/ui/UiInputCurrency.vue'
import UiInputPercent from '@/components/ui/UiInputPercent.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'

interface ProductForm {
  name: string
  sku: string
  category: string
  status: ProductStatus
  price: number | null
  discount: number | null
  stock: number
  tags: string[]
  description: string
  publish: boolean
  files: UploadedFileItem[]
}

const route = useRoute()
const router = useRouter()
const toast = useToast()
const store = useProductStore()

const productId = computed(() =>
  route.name === 'product-edit' ? Number(route.params.id) : null,
)
const existing = computed(() =>
  productId.value === null ? undefined : store.findProduct(productId.value),
)
const isEdit = computed(() => productId.value !== null)
const isMissing = computed(() => isEdit.value && !existing.value)

function galleryToFiles(product?: Product): UploadedFileItem[] {
  if (!product) return []
  return product.gallery.map((url, index) => ({
    id: `gallery-${product.id}-${index}`,
    name: `${product.sku.toLowerCase()}-${index + 1}.jpg`,
    size: 0,
    type: 'image/jpeg',
    url,
    progress: 100,
    status: 'done',
  }))
}

function toForm(product?: Product): ProductForm {
  return {
    name: product?.name ?? '',
    sku: product?.sku ?? '',
    category: product?.category ?? 'Audio',
    status: product?.status ?? 'Draft',
    price: product?.price ?? null,
    discount: product?.discount ?? 0,
    stock: product?.stock ?? 0,
    tags: product ? [...product.tags] : [],
    description: product?.description ?? '',
    publish: product ? product.status === 'Active' : true,
    files: galleryToFiles(product),
  }
}

const form = ref<ProductForm>(toForm(existing.value))
const formError = ref('')

watch(
  () => route.fullPath,
  () => {
    formError.value = ''
    form.value = toForm(existing.value)
  },
)

const availableTags = computed(() => {
  const tags = new Set<string>()
  store.products.forEach((product) => product.tags.forEach((tag) => tags.add(tag)))
  return Array.from(tags).slice(0, 12)
})

const priceValue = computed(() => form.value.price ?? 0)
const discountValue = computed(() => form.value.discount ?? 0)
const finalPrice = computed(() =>
  Math.round(priceValue.value * (1 - discountValue.value / 100)),
)
const savings = computed(() => priceValue.value - finalPrice.value)

const statusPreview = computed<ProductStatus>(() =>
  form.value.publish ? 'Active' : form.value.status,
)
const statusVariant: Record<ProductStatus, 'success' | 'warning' | 'neutral'> = {
  Active: 'success',
  Draft: 'warning',
  Archived: 'neutral',
}

const subtitle = computed(() =>
  isEdit.value
    ? 'Perbarui atribut katalog, harga, stok, dan media produk.'
    : 'Lengkapi atribut katalog, harga, stok, dan media produk baru.',
)

function goBack() {
  if (isEdit.value && existing.value) {
    router.push({ name: 'product-detail', params: { id: existing.value.id } })
  } else {
    router.push({ name: 'products' })
  }
}

function save() {
  formError.value = ''
  if (isMissing.value) return

  const name = form.value.name.trim()
  const sku = form.value.sku.trim().toUpperCase()

  if (!name || !sku) {
    formError.value = 'Nama produk dan SKU wajib diisi sebelum menyimpan.'
    return
  }
  if (store.products.some((product) => product.sku.toUpperCase() === sku && product.id !== productId.value)) {
    formError.value = `SKU ${sku} sudah dipakai produk lain. Gunakan kode unik.`
    return
  }
  if (!form.value.price || form.value.price <= 0) {
    formError.value = 'Harga jual harus lebih besar dari nol.'
    return
  }

  const gallery = form.value.files
    .map((file) => file.url)
    .filter((url): url is string => Boolean(url))

  const draft: ProductDraft = {
    name,
    sku,
    category: form.value.category,
    status: statusPreview.value,
    price: form.value.price,
    discount: form.value.discount ?? 0,
    stock: Math.max(0, Number(form.value.stock) || 0),
    tags: form.value.tags,
    description: form.value.description || '<p>Deskripsi produk belum diisi.</p>',
    gallery,
  }

  if (isEdit.value && existing.value) {
    store.updateProduct(existing.value.id, draft)
    toast.success('Produk Diperbarui', `${name} berhasil disimpan.`)
    router.push({ name: 'product-detail', params: { id: existing.value.id } })
    return
  }

  const created = store.addProduct(draft)
  toast.success('Produk Ditambahkan', `${name} berhasil masuk katalog.`)
  router.push({ name: 'product-detail', params: { id: created.id } })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div class="flex items-start gap-3">
        <RouterLink
          :to="isEdit && existing ? `/products/${existing.id}` : '/products'"
          class="btn btn-ghost btn-sm btn-circle shrink-0 border border-base-300"
        >
          <ArrowLeft class="h-4 w-4" />
        </RouterLink>
        <div>
          <div class="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <RouterLink to="/products" class="hover:text-primary">Katalog</RouterLink>
            <span>/</span>
            <span>{{ isEdit ? 'Edit Produk' : 'Produk Baru' }}</span>
          </div>
          <h4 class="mt-1 text-xl font-bold text-[var(--text)]">
            {{ isEdit ? 'Edit Produk' : 'Tambah Produk Baru' }}
          </h4>
          <p class="mt-0.5 text-sm text-[var(--text-muted)]">{{ subtitle }}</p>
        </div>
      </div>
      <div v-if="!isMissing" class="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
        <UiButton variant="ghost" size="sm" class="border border-base-300" @click="goBack">
          Batalkan
        </UiButton>
        <UiButton variant="primary" size="sm" :icon="Save" @click="save">
          {{ isEdit ? 'Simpan Perubahan' : 'Tambah ke Katalog' }}
        </UiButton>
      </div>
    </div>

    <UiCard v-if="isMissing">
      <UiEmptyState
        title="Produk Tidak Ditemukan"
        description="Produk yang ingin Anda edit sudah dihapus atau tidak pernah ada di katalog."
      >
        <template #actions>
          <RouterLink to="/products" class="btn btn-primary btn-sm">Kembali ke Katalog</RouterLink>
        </template>
      </UiEmptyState>
    </UiCard>

    <form v-else class="grid grid-cols-1 gap-6 xl:grid-cols-3" @submit.prevent="save">
      <div class="space-y-6 xl:col-span-2">
        <UiAlert v-if="formError" variant="error" title="Data belum lengkap" dismissible>
          <p>{{ formError }}</p>
        </UiAlert>

        <UiCard title="Informasi Dasar" subtitle="Identitas produk yang tampil di katalog dan invoice.">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div class="sm:col-span-2">
              <UiInput
                v-model="form.name"
                label="Nama Produk"
                placeholder="Contoh: Aurora Wireless Headphones Pro"
              />
            </div>
            <UiInput v-model="form.sku" label="SKU" placeholder="AUD-AUR-001" hint="Harus unik antar produk." />
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <UiSelect v-model="form.category" :options="PRODUCT_CATEGORIES" label="Kategori" />
            <UiSelect
              v-model="form.status"
              :options="PRODUCT_STATUSES"
              label="Status Draft"
              hint="Dipakai saat produk tidak dipublikasikan."
            />
          </div>
        </UiCard>

        <UiCard title="Harga & Stok" subtitle="Harga jual, diskon kampanye, dan ketersediaan gudang.">
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <UiInputCurrency v-model="form.price" label="Harga Jual" currency="IDR" />
            <UiInputPercent v-model="form.discount" label="Diskon" :max="90" :show-slider="true" />
            <div class="flex flex-col gap-1.5">
              <label class="label-text" for="product-stock">Stok Tersedia</label>
              <input
                id="product-stock"
                v-model.number="form.stock"
                type="number"
                min="0"
                class="input input-bordered"
                placeholder="0"
              />
              <span class="text-xs text-base-content/55">Jumlah unit yang siap dijual.</span>
            </div>
          </div>

          <div class="mt-4 grid grid-cols-1 gap-3 rounded-box border border-base-300 bg-base-200/40 p-4 sm:grid-cols-3">
            <div>
              <p class="text-[11px] font-semibold  text-base-content/45">Harga Normal</p>
              <p
                class="mt-1 font-mono text-sm font-semibold"
                :class="discountValue > 0 ? 'text-base-content/60 line-through' : 'text-base-content'"
              >
                {{ formatIDR(priceValue) }}
              </p>
            </div>
            <div>
              <p class="text-[11px] font-semibold  text-base-content/45">Harga Setelah Diskon</p>
              <p class="mt-1 font-mono text-sm font-bold text-primary">{{ formatIDR(finalPrice) }}</p>
            </div>
            <div>
              <p class="text-[11px] font-semibold  text-base-content/45">Hemat Pelanggan</p>
              <p class="mt-1 font-mono text-sm font-bold text-success">{{ formatIDR(savings) }}</p>
            </div>
          </div>
        </UiCard>

        <UiCard
          title="Galeri Produk"
          subtitle="Foto pertama dipakai sebagai thumbnail katalog."
        >
          <UiFileUpload
            v-model="form.files"
            mode="gallery"
            label="Foto Produk"
            hint="Unggah hingga 8 foto. Format JPG/PNG maksimal 5 MB per file."
            accept="image/*"
            :max-size-mb="5"
          />
        </UiCard>

        <UiCard title="Deskripsi" subtitle="Ceritakan keunggulan, spesifikasi, dan nilai jual produk.">
          <UiRichEditor
            v-model="form.description"
            label="Deskripsi Produk"
            placeholder="Tuliskan keunggulan, spesifikasi, dan nilai jual produk..."
            min-height="180px"
          />
        </UiCard>
      </div>

      <div class="space-y-6">
        <UiCard title="Publikasi" subtitle="Atur visibilitas produk di storefront.">
          <div class="space-y-4">
            <div class="flex items-center justify-between gap-3 rounded-box border border-base-300 bg-base-200/40 p-3.5">
              <span class="text-xs font-semibold text-base-content/70">Status setelah disimpan</span>
              <UiBadge :variant="statusVariant[statusPreview]" soft dot size="sm">
                {{ statusPreview }}
              </UiBadge>
            </div>

            <UiCheckbox
              v-model="form.publish"
              label="Publikasikan produk"
              description="Produk aktif dapat dibeli pelanggan setelah disimpan."
              variant="success"
            />

            <UiAlert variant="info" title="Tips katalog">
              <p>
                Tag yang spesifik membantu pencarian internal, sedangkan foto rasio 4:3 tampil paling rapi
                di kartu produk.
              </p>
            </UiAlert>
          </div>

          <template #footer>
            <div class="flex w-full flex-wrap items-center justify-end gap-2">
              <UiButton variant="ghost" size="sm" class="border border-base-300" @click="goBack">
                Batalkan
              </UiButton>
              <UiButton variant="primary" size="sm" type="submit" :icon="isEdit ? Save : Sparkles">
                {{ isEdit ? 'Simpan Perubahan' : 'Tambah ke Katalog' }}
              </UiButton>
            </div>
          </template>
        </UiCard>

        <UiCard title="Tag Produk" subtitle="Maksimal 6 tag untuk filter dan pencarian.">
          <UiSelectTag
            v-model="form.tags"
            :options="availableTags"
            label="Tag"
            placeholder="Tambah tag seperti ANC, Wireless..."
            :max-tags="6"
          />
        </UiCard>
      </div>
    </form>
  </div>
</template>
