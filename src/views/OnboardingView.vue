<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/stores/toast'
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Cloud,
  Users,
  HelpCircle,
  ShoppingBag,
  Building2,
  Globe,
  Rocket,
  ShieldCheck,
  Layers,
  Zap,
  KeyRound,
  Mail,
  Phone,
  MessageSquare,
  Store,
  Boxes,
  CreditCard,
  FileCheck2,
} from 'lucide-vue-next'
import { formatIDR } from '@/data/products'
import UiStepper from '@/components/ui/UiStepper.vue'
import AppBrand from '@/components/brand/AppBrand.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiInputCurrency from '@/components/ui/UiInputCurrency.vue'
import UiInputPercent from '@/components/ui/UiInputPercent.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiRadioCard, { type RadioCardOption } from '@/components/ui/UiRadioCard.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiList, { type ListItem } from '@/components/ui/UiList.vue'
import UiTimeline, { type TimelineItem } from '@/components/ui/UiTimeline.vue'
import UiAccordion from '@/components/ui/UiAccordion.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'

const router = useRouter()
const toast = useToast()

const step = ref(0)
const finishing = ref(false)
const timer = ref<number | null>(null)
const showHelp = ref(false)

const steps = [
  { id: 'workspace', title: 'Workspace', subtitle: 'Identitas toko', icon: Store },
  { id: 'business', title: 'Profil Bisnis', subtitle: 'Skala & target', icon: Boxes },
  { id: 'team', title: 'Tim', subtitle: 'Kolaborator & fitur', icon: Users },
  { id: 'activate', title: 'Aktivasi', subtitle: 'Tinjau & mulai', icon: Rocket },
]

const form = ref({
  name: 'Tinkit Commerce',
  slug: 'tinkit-commerce',
  industry: 'ecommerce',
  companySize: '11-50',
  businessModel: 'ecommerce' as string | number,
  gmv: 750000000 as number | null,
  margin: 32 as number | null,
  launchDate: '2026-12-01',
  description:
    '<p>Tinkit Commerce menjual perangkat audio, perkakas kerja, dan furnitur premium untuk kreator dan tim remote di Indonesia.</p>',
  logo: [] as UploadedFileItem[],
  team: ['rina.kartika@tinkit.example', 'dimas.pratama@tinkit.example'],
  role: 'admin',
  features: ['analytics', 'automation'] as string[],
  welcomeNote:
    '<p>Selamat datang di Tinkit! Tim kami akan membantu proses migrasi katalog dan pelatihan penggunaan dashboard.</p>',
  useSampleData: true,
  agreeTerms: false,
})

const industryOptions = [
  { label: 'E-commerce & Retail', value: 'ecommerce' },
  { label: 'Fashion & Lifestyle', value: 'fashion' },
  { label: 'Elektronik & Gadget', value: 'electronics' },
  { label: 'Furnitur & Interior', value: 'furniture' },
  { label: 'Makanan & Minuman', value: 'fnb' },
]

const companySizeOptions = [
  { label: '1-10 karyawan', value: '1-10' },
  { label: '11-50 karyawan', value: '11-50' },
  { label: '51-200 karyawan', value: '51-200' },
  { label: '201-1000 karyawan', value: '201-1000' },
]

const roleOptions = [
  { label: 'Admin', value: 'admin', description: 'Akses penuh ke seluruh modul' },
  { label: 'Operations', value: 'ops', description: 'Pesanan, inventori, dan fulfillment' },
  { label: 'Finance', value: 'finance', description: 'Invoice, refund, dan laporan' },
  { label: 'Viewer', value: 'viewer', description: 'Hanya melihat dashboard' },
]

const teamSuggestions = [
  'rina.kartika@tinkit.example',
  'dimas.pratama@tinkit.example',
  'nadia.putri@tinkit.example',
  'fajar.nugroho@tinkit.example',
  'siti.aminah@tinkit.example',
  'hendra.wijaya@tinkit.example',
]

const businessModelOptions: RadioCardOption[] = [
  {
    value: 'ecommerce',
    title: 'D2C Store',
    subtitle: 'Toko online milik sendiri',
    description: 'Fokus pada katalog internal, promo mandiri, dan pelanggan berulang.',
    icon: ShoppingBag,
    badge: 'Populer',
    badgeVariant: 'primary',
    tags: ['Website', 'Retail'],
    meta: 'Recommended',
    recommended: true,
  },
  {
    value: 'marketplace',
    title: 'Multi-channel',
    subtitle: 'Marketplace & sosial',
    description: 'Sinkronisasi stok dan pesanan dari beberapa kanal penjualan sekaligus.',
    icon: Globe,
    badge: 'Scale-up',
    badgeVariant: 'info',
    tags: ['Tokopedia', 'Shopee'],
    meta: 'Omnichannel',
  },
  {
    value: 'b2b',
    title: 'Wholesale B2B',
    subtitle: 'Pesanan korporat',
    description: 'Harga bertingkat, purchase order, dan termin pembayaran untuk klien bisnis.',
    icon: Building2,
    badge: 'Enterprise',
    badgeVariant: 'secondary',
    tags: ['PO', 'Net 30'],
    meta: 'High volume',
  },
]

const featureItems = [
  { value: 'analytics', label: 'Analytics & insight', description: 'Dashboard pendapatan dan funnel konversi' },
  { value: 'automation', label: 'Otomasi operasional', description: 'Aturan stok, refund, dan notifikasi' },
  { value: 'api', label: 'API & webhook', description: 'Integrasi dengan sistem internal' },
  { value: 'loyalty', label: 'Program loyalitas', description: 'Poin dan tier pelanggan' },
]

const helpChannels: ListItem[] = [
  {
    id: 'chat',
    title: 'Live chat support',
    subtitle: 'Respon < 5 menit pada jam kerja',
    icon: MessageSquare,
    variant: 'primary',
    badge: 'Online',
    badgeVariant: 'success',
  },
  {
    id: 'email',
    title: 'onsite@tinkit.example',
    subtitle: 'Implementasi dan migrasi data',
    icon: Mail,
    variant: 'info',
    meta: '24 jam',
  },
  {
    id: 'phone',
    title: '+62 21 5088 1200',
    subtitle: 'Senin - Jumat, 09:00 - 18:00 WIB',
    icon: Phone,
    variant: 'warning',
    meta: 'Hunting',
  },
]

const onboardingTips = [
  {
    id: 'import',
    title: 'Bagaimana cara impor katalog produk?',
    content:
      'Setelah workspace aktif, buka menu Products lalu gunakan tombol impor. Format CSV minimal berisi kolom nama, SKU, harga, dan stok. Migrasi hingga 5.000 baris didukung langsung.',
    badge: 'Data',
    badgeVariant: 'primary' as const,
  },
  {
    id: 'invite',
    title: 'Kapan anggota tim menerima undangan?',
    content:
      'Undangan dikirim setelah workspace diaktifkan. Anggota memiliki 7 hari untuk menerima tautan sebelum undangan kedaluwarsa dan perlu dikirim ulang.',
    badge: 'Tim',
    badgeVariant: 'info' as const,
  },
  {
    id: 'trial',
    title: 'Apakah ada masa uji coba?',
    content:
      'Workspace baru mendapat 14 hari akses penuh tanpa kartu kredit. Anda dapat mengunduh seluruh data kapan pun sebelum memilih paket berbayar.',
    badge: 'Billing',
    badgeVariant: 'warning' as const,
  },
]

const activationTimeline: TimelineItem[] = [
  {
    id: 'a1',
    title: 'Workspace dibuat',
    description: 'Domain, pengaturan awal, dan hak akses owner disiapkan otomatis.',
    time: 'Instan',
    variant: 'success',
    icon: CheckCircle2,
    badge: 'Automatic',
  },
  {
    id: 'a2',
    title: 'Undangan tim dikirim',
    description: `${form.value.team.length} kolaborator menerima email undangan.`,
    time: '< 1 menit',
    variant: 'primary',
    icon: Users,
    badge: 'Email',
  },
  {
    id: 'a3',
    title: 'Data contoh dimuat',
    description: 'Produk, pesanan, dan pelanggan demo siap dijelajahi tim.',
    time: '2 menit',
    variant: 'info',
    icon: Layers,
    badge: 'Seeding',
  },
  {
    id: 'a4',
    title: 'Sesi onboarding dijadwalkan',
    description: 'Success manager menghubungi Anda untuk sesi 45 menit.',
    time: 'H+1',
    variant: 'warning',
    icon: FileCheck2,
    badge: 'Calendar',
  },
]

const summaryItems = computed<ListItem[]>(() => [
  {
    id: 'workspace',
    title: form.value.name || 'Belum diberi nama',
    subtitle: 'Workspace',
    icon: Store,
    variant: 'primary',
    meta: form.value.slug ? `/${form.value.slug}` : '—',
  },
  {
    id: 'model',
    title:
      businessModelOptions.find((option) => option.value === form.value.businessModel)?.title ??
      'Belum dipilih',
    subtitle: 'Model bisnis',
    icon: CreditCard,
    variant: 'info',
  },
  {
    id: 'gmv',
    title: form.value.gmv ? formatIDR(form.value.gmv) : 'Belum diisi',
    subtitle: 'GMV bulanan',
    icon: ShoppingBag,
    variant: 'success',
  },
  {
    id: 'team',
    title: `${form.value.team.length} kolaborator`,
    subtitle: 'Tim',
    icon: Users,
    variant: 'secondary',
  },
])

const completion = computed(() => {
  const checks = [
    Boolean(form.value.name.trim()),
    Boolean(form.value.slug.trim()),
    Boolean(form.value.industry),
    Boolean(form.value.gmv),
    Boolean(form.value.launchDate),
    form.value.team.length > 0,
    form.value.features.length > 0,
    form.value.agreeTerms,
  ]
  return Math.round((checks.filter(Boolean).length / checks.length) * 100)
})

const canProceed = computed(() => {
  if (step.value === 0) return Boolean(form.value.name.trim() && form.value.slug.trim())
  if (step.value === 1) return form.value.gmv !== null && Boolean(form.value.launchDate)
  if (step.value === 2) return form.value.team.length > 0
  return form.value.agreeTerms
})

const nextHint = computed(() => {
  if (step.value === 0) return 'Isi nama dan slug workspace untuk melanjutkan.'
  if (step.value === 1) return 'Lengkapi GMV bulanan dan tanggal peluncuran.'
  if (step.value === 2) return 'Undang minimal satu kolaborator.'
  return 'Centang persetujuan untuk mengaktifkan workspace.'
})

const stepLabel = computed(() => `Langkah ${step.value + 1} dari ${steps.length}`)

function nextStep() {
  if (!canProceed.value) {
    toast.warning('Belum Lengkap', nextHint.value)
    return
  }
  if (step.value < steps.length - 1) step.value += 1
}

function prevStep() {
  if (step.value > 0) step.value -= 1
}

function skipStep() {
  if (step.value < steps.length - 1 && step.value !== 3) {
    step.value += 1
    toast.info('Langkah Dilewati', 'Data dapat dilengkapi nanti melalui menu Settings.')
  }
}

function finish() {
  if (!canProceed.value) {
    toast.error('Persetujuan Diperlukan', 'Centang syarat layanan sebelum mengaktifkan workspace.')
    return
  }
  if (finishing.value) return
  finishing.value = true
  timer.value = window.setTimeout(() => {
    finishing.value = false
    toast.success('Workspace Aktif!', `${form.value.name} siap digunakan. Selamat datang di Tinkit.`)
    router.push('/')
  }, 1600)
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }).format(
    new Date(value),
  )
}

watch(step, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

onUnmounted(() => {
  if (timer.value !== null) window.clearTimeout(timer.value)
})
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-base-200/40 px-4 py-8 sm:px-6 lg:px-8">
    <!-- Decorative background -->
    <div class="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
    <div class="pointer-events-none absolute -bottom-40 -right-24 h-80 w-80 rounded-full bg-secondary/10 blur-3xl" />

    <div class="relative mx-auto max-w-6xl space-y-6">
      <!-- Brand Header -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex items-center gap-3">
          <AppBrand size="md" />
          <p class="text-[11px] text-[var(--text-muted)]">Workspace setup wizard</p>
        </div>
        <div class="flex items-center gap-2.5">
          <UiBadge variant="primary" soft>{{ stepLabel }}</UiBadge>
          <UiButton variant="ghost" size="sm" class="border border-base-300" @click="showHelp = true">
            <HelpCircle class="h-4 w-4" />
            Butuh bantuan?
          </UiButton>
        </div>
      </div>

      <h1 class="text-2xl font-bold text-[var(--text)]">Workspace Setup</h1>

      <div class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <!-- Wizard Card -->
        <div class="card overflow-visible">
          <div class="rounded-t-box border-b border-[var(--border)] bg-[var(--surface-2)] px-2 py-1">
            <UiStepper v-model="step" :steps="steps" clickable />
          </div>

          <div class="border-b border-base-300/70 px-5 py-3">
            <div class="flex items-center justify-between text-[11px] text-base-content/55">
              <span>Kelengkapan konfigurasi</span>
              <span class="font-semibold text-base-content">{{ completion }}%</span>
            </div>
            <UiProgress :value="completion" :variant="completion === 100 ? 'success' : 'primary'" size="xs" class="mt-1.5" />
          </div>

          <!-- STEP 1 -->
          <div v-if="step === 0" class="space-y-5 p-5 sm:p-6">
            <div>
              <h5 class="text-sm font-bold text-base-content">Identitas Workspace</h5>
              <p class="mt-0.5 text-xs text-base-content/55">
                Informasi ini muncul pada invoice, email transaksional, dan halaman publik toko.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UiInput v-model="form.name" label="Nama Toko / Workspace" placeholder="Tinkit Commerce" />
              <UiInput v-model="form.slug" label="Slug URL" hint="tinkit.example/{slug}" />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UiSelect v-model="form.industry" :options="industryOptions" label="Industri" />
              <UiSelect v-model="form.companySize" :options="companySizeOptions" label="Ukuran Tim" />
            </div>

            <UiFileUpload
              v-model="form.logo"
              mode="dropzone"
              label="Logo Toko"
              accept="image/png,image/jpeg,image/svg+xml"
              :max-size-mb="2"
              hint="PNG, JPG, atau SVG. Disarankan rasio 1:1 minimal 512px."
            />

            <UiRichEditor
              v-model="form.description"
              label="Deskripsi Singkat"
              placeholder="Ceritakan produk dan keunggulan toko Anda..."
              min-height="110px"
            />
          </div>

          <!-- STEP 2 -->
          <div v-else-if="step === 1" class="space-y-5 p-5 sm:p-6">
            <div>
              <h5 class="text-sm font-bold text-base-content">Profil Bisnis</h5>
              <p class="mt-0.5 text-xs text-base-content/55">
                Data ini membantu kami menyesuaikan konfigurasi dashboard dan rekomendasi fitur.
              </p>
            </div>

            <div>
              <p class="label-text mb-2">Model Bisnis</p>
              <UiRadioCard v-model="form.businessModel" :options="businessModelOptions" :columns="3" gap="sm" />
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <UiInputCurrency
                v-model="form.gmv"
                label="GMV Bulanan (IDR)"
                currency="IDR"
                hint="Rata-rata 3 bulan terakhir"
              />
              <UiInputPercent
                v-model="form.margin"
                label="Target Margin Kotor"
                :min="0"
                :max="100"
                show-slider
              />
              <UiDatePicker v-model="form.launchDate" label="Rencana Peluncuran" />
            </div>

            <div>
              <p class="label-text mb-2">Fitur yang Diaktifkan</p>
              <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div
                  v-for="feature in featureItems"
                  :key="feature.value"
                  class="rounded-box border border-base-300 p-3.5"
                >
                  <UiCheckbox
                    v-model="form.features"
                    :value="feature.value"
                    :label="feature.label"
                    :description="feature.description"
                    variant="primary"
                  />
                </div>
              </div>
            </div>

            <UiAlert variant="info" style-type="soft" title="Estimasi hasil konfigurasi">
              <p>
                Dengan GMV {{ form.gmv ? formatIDR(form.gmv) : '—' }} per bulan dan margin target
                {{ form.margin ?? 0 }}%, dashboard akan menandai produk dengan kontribusi terbesar
                dan potensi optimasi harga.
              </p>
            </UiAlert>
          </div>

          <!-- STEP 3 -->
          <div v-else-if="step === 2" class="space-y-5 p-5 sm:p-6">
            <div>
              <h5 class="text-sm font-bold text-base-content">Undang Tim Anda</h5>
              <p class="mt-0.5 text-xs text-base-content/55">
                Tambahkan kolaborator dan tentukan peran awal mereka. Peran dapat diubah kapan saja.
              </p>
            </div>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <UiSelectTag
                v-model="form.team"
                :options="teamSuggestions"
                label="Email Kolaborator"
                placeholder="Ketik email lalu tekan Enter..."
                :max-tags="8"
                allow-create
              />
              <UiSelect v-model="form.role" :options="roleOptions" label="Peran Default" />
            </div>

            <UiRichEditor
              v-model="form.welcomeNote"
              label="Pesan Sambutan Tim"
              hint="Disertakan pada email undangan kolaborator."
              min-height="110px"
            />

            <div class="rounded-box border border-base-300 p-4">
              <UiCheckbox
                v-model="form.useSampleData"
                label="Muat data contoh ke workspace"
                description="Menambahkan 12 produk, pesanan, dan pelanggan demo agar tim dapat langsung mencoba."
                variant="success"
              />
            </div>

            <UiAlert variant="warning" style-type="soft" title="Undangan berlaku 7 hari">
              <p>
                Kolaborator yang belum menerima undangan dapat diundang ulang melalui menu
                <strong>Settings → Umum</strong> setelah workspace aktif.
              </p>
            </UiAlert>
          </div>

          <!-- STEP 4 -->
          <div v-else class="space-y-5 p-5 sm:p-6">
            <div>
              <h5 class="text-sm font-bold text-base-content">Tinjau &amp; Aktifkan</h5>
              <p class="mt-0.5 text-xs text-base-content/55">
                Periksa ringkasan konfigurasi sebelum workspace diinisialisasi.
              </p>
            </div>

            <UiAlert
              :variant="form.agreeTerms ? 'success' : 'info'"
              :title="form.agreeTerms ? 'Siap diaktifkan' : 'Satu langkah lagi'"
            >
              <p v-if="form.agreeTerms">
                Seluruh konfigurasi wajib sudah lengkap. Workspace akan dibuat beserta domain,
                undangan tim, dan data contoh.
              </p>
              <p v-else>
                Centang persetujuan syarat layanan di bawah untuk mengaktifkan workspace dan
                mengirim undangan tim.
              </p>
            </UiAlert>

            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div class="space-y-2.5 rounded-box border border-base-300 bg-base-200/30 p-4">
                <p class="text-[11px] font-semibold text-base-content/45">
                  Workspace
                </p>
                <div class="space-y-1.5 text-sm text-base-content">
                  <p><span class="text-base-content/50">Nama:</span> <strong>{{ form.name }}</strong></p>
                  <p><span class="text-base-content/50">Slug:</span> <code class="text-xs">/{{ form.slug }}</code></p>
                  <p><span class="text-base-content/50">Industri:</span> {{ industryOptions.find((item) => item.value === form.industry)?.label }}</p>
                  <p><span class="text-base-content/50">Peluncuran:</span> {{ formatDate(form.launchDate) }}</p>
                </div>
              </div>

              <div class="space-y-2.5 rounded-box border border-base-300 bg-base-200/30 p-4">
                <p class="text-[11px] font-semibold text-base-content/45">
                  Tim & Konfigurasi
                </p>
                <div class="space-y-1.5 text-sm text-base-content">
                  <p><span class="text-base-content/50">Kolaborator:</span> {{ form.team.length }} orang</p>
                  <p><span class="text-base-content/50">Peran default:</span> <span class="capitalize">{{ form.role }}</span></p>
                  <p><span class="text-base-content/50">Fitur:</span> {{ form.features.length }} aktif</p>
                  <p><span class="text-base-content/50">Data contoh:</span> {{ form.useSampleData ? 'Ya' : 'Tidak' }}</p>
                </div>
              </div>
            </div>

            <div class="rounded-box border border-base-300 p-4">
              <p class="mb-3 text-[11px] font-semibold text-base-content/45">
                Yang terjadi setelah aktivasi
              </p>
              <UiTimeline :items="activationTimeline" />
            </div>

            <UiCheckbox
              v-model="form.agreeTerms"
              label="Saya menyetujui Syarat Layanan dan Kebijakan Privasi Tinkit"
              description="Termasuk pemrosesan data pelanggan sesuai regulasi PDP Indonesia."
              variant="primary"
            />
          </div>

          <!-- Footer -->
          <div class="flex flex-col gap-3 rounded-b-box border-t border-[var(--border)] bg-[var(--surface-1)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex items-center gap-2 text-[11px] text-base-content/50">
              <Cloud class="h-3.5 w-3.5" />
              <span v-if="canProceed">Perubahan tersimpan otomatis</span>
              <span v-else>{{ nextHint }}</span>
            </div>

            <div class="flex items-center gap-2 self-end sm:self-auto">
              <UiButton variant="ghost" size="sm" :disabled="step === 0" @click="prevStep">
                <ArrowLeft class="h-4 w-4" />
                Kembali
              </UiButton>

              <UiButton
                v-if="step < steps.length - 1"
                variant="ghost"
                size="sm"
                class="border border-base-300"
                @click="skipStep"
              >
                Lewati
              </UiButton>

              <UiButton
                v-if="step < steps.length - 1"
                variant="primary"
                size="sm"
                :disabled="!canProceed"
                @click="nextStep"
              >
                Lanjutkan
                <ArrowRight class="h-4 w-4" />
              </UiButton>

              <UiButton
                v-else
                variant="success"
                size="sm"
                :disabled="!canProceed || finishing"
                @click="finish"
              >
                <UiSpinner v-if="finishing" size="xs" />
                <Rocket v-else class="h-4 w-4" />
                {{ finishing ? 'Mengaktifkan...' : 'Aktifkan Workspace' }}
              </UiButton>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="space-y-5">
          <div class="card p-5">
            <div class="flex items-center justify-between">
              <p class="text-xs font-bold text-base-content/45">Ringkasan</p>
              <UiTooltip text="Ringkasan diperbarui setiap kali Anda mengisi formulir">
                <HelpCircle class="h-3.5 w-3.5 text-base-content/40" />
              </UiTooltip>
            </div>
            <UiList :items="summaryItems" compact class="mt-3" />
            <div class="mt-4 rounded-box border border-base-300 p-3.5">
              <div class="flex items-center justify-between text-[11px] text-base-content/55">
                <span>Persiapan workspace</span>
                <span class="font-semibold text-base-content">{{ completion }}%</span>
              </div>
              <UiProgress :value="completion" :variant="completion === 100 ? 'success' : 'warning'" size="sm" class="mt-2" />
            </div>
          </div>

          <div class="card p-5">
            <div class="flex items-center gap-2">
              <ShieldCheck class="h-4 w-4 text-success" />
              <p class="text-xs font-bold text-base-content">Keamanan data</p>
            </div>
            <p class="mt-2 text-[11px] leading-relaxed text-base-content/55">
              Data dienkripsi saat transit dan disimpan di region Jakarta. Anda dapat mengekspor
              seluruh data kapan pun.
            </p>
            <div class="mt-3 flex flex-wrap gap-1.5">
              <UiBadge variant="success" soft size="sm">ISO 27001</UiBadge>
              <UiBadge variant="info" soft size="sm">PDP Ready</UiBadge>
              <UiBadge variant="secondary" soft size="sm">AES-256</UiBadge>
            </div>
          </div>

          <UiAccordion :items="onboardingTips" variant="separated" />

          <UiButton variant="ghost" size="sm" block class="border border-base-300" @click="skipStep">
            <Zap class="h-4 w-4" />
            Lewati & gunakan pengaturan default
          </UiButton>
        </aside>
      </div>

      <p class="text-center text-[10px] text-base-content/40">
        Butuh migrasi katalog dan pelatihan tim? Hubungi success manager melalui tombol bantuan di atas.
      </p>
    </div>

    <!-- Help Modal -->
    <UiModal v-model="showHelp" title="Bantuan Setup" subtitle="Tim implementasi siap membantu onboarding Anda." max-width="lg">
      <div class="space-y-4">
        <UiAlert variant="info" style-type="soft" title="Rata-rata setup selesai dalam 3 menit">
          <p>
            Sebagian besar workspace baru mengaktifkan toko pada hari yang sama setelah data
            pelanggan dan katalog berhasil dimigrasikan.
          </p>
        </UiAlert>

        <UiList :items="helpChannels" @item-click="(item) => toast.primary('Menghubungi Support', `Kanal ${item.title} dibuka.`)">
          <template #item-action="{ item }">
            <UiBadge v-if="item.badge" :variant="'success'" soft size="sm">{{ item.badge }}</UiBadge>
            <ArrowRight v-else class="h-3.5 w-3.5 text-base-content/40" />
          </template>
        </UiList>

        <UiAccordion :items="onboardingTips" variant="bordered" />
      </div>
      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Tutup</UiButton>
        <UiButton variant="primary" size="sm" :icon="KeyRound" @click="toast.success('Tiket Dibuat', 'Tim implementasi akan menghubungi Anda dalam 1 jam kerja.')">
          Ajukan Sesi Onboarding
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
