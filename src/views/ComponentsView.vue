<script setup lang="ts">
import { ref } from 'vue'
import {
  Sparkles,
  Search,
  Mail,
  Bell,
  Code2,
  Check,
  Palette,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Info,
  FolderPlus,
  Download,
  Share2,
  Trash2,
  Settings,
  Rocket,
  FileText,
  HelpCircle,
  Plus,
  Pencil,
  Eye,
  Copy,
  Heart,
  Bookmark,
  Bot,
  Brain,
  Cpu,
  Zap,
} from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import { useToast } from '@/stores/toast'
import UiCard from '@/components/ui/UiCard.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiBadge from '@/components/ui/UiBadge.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiTextarea from '@/components/ui/UiTextarea.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiInputCurrency from '@/components/ui/UiInputCurrency.vue'
import UiInputPercent from '@/components/ui/UiInputPercent.vue'
import UiRadioCard, { type RadioCardOption } from '@/components/ui/UiRadioCard.vue'
import UiTable from '@/components/ui/UiTable.vue'
import UiDataTable from '@/components/ui/UiDataTable.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiStepper, { type StepItem } from '@/components/ui/UiStepper.vue'
import UiProgress from '@/components/ui/UiProgress.vue'
import UiList, { type ListItem } from '@/components/ui/UiList.vue'
import UiTimeline, { type TimelineItem } from '@/components/ui/UiTimeline.vue'
import UiSpinner from '@/components/ui/UiSpinner.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiDropdown, { type DropdownItem } from '@/components/ui/UiDropdown.vue'
import UiTooltip from '@/components/ui/UiTooltip.vue'
import UiAccordion, { type AccordionItem } from '@/components/ui/UiAccordion.vue'
import UiCarousel, { type CarouselSlide } from '@/components/ui/UiCarousel.vue'
import UiVideoPlayer from '@/components/ui/UiVideoPlayer.vue'
import UiTabs, { type TabItem } from '@/components/ui/UiTabs.vue'
import UiCodeBlock from '@/components/ui/UiCodeBlock.vue'
import UiAvatar from '@/components/ui/UiAvatar.vue'
import UiChatMessage, { type MessageRole, type MessageStatus, type MessageAuthor } from '@/components/ui/UiChatMessage.vue'
import UiMessageScroll from '@/components/ui/UiMessageScroll.vue'
import UiJsonViewer from '@/components/ui/UiJsonViewer.vue'
import UiFileTree, { type FileTreeItem } from '@/components/ui/UiFileTree.vue'
import {
  HelpCircle as HelpIcon,
  Layers as LayersIcon,
  ShieldCheck,
  Video as VideoIcon,
  SlidersHorizontal,
  Folder,
  Code,
  Terminal,
  Send,
} from 'lucide-vue-next'
import UiPopover from '@/components/ui/UiPopover.vue'
import type { ColorVariant } from '@/types/theme'
import type { TableColumn } from '@/types/table'

const themeStore = useThemeStore()
const toast = useToast()

const variants: ColorVariant[] = [
  'primary',
  'secondary',
  'accent',
  'neutral',
  'info',
  'success',
  'warning',
  'error',
]

const demoModalOpen = ref(false)
const loadingDemo = ref(false)
const sampleName = ref('Tinkit Open Source')
const sampleEmail = ref('hello@tinkit.example')
const sampleNotes = ref('Rilis v0.3 menambahkan DataTable generik, Textarea auto-grow, dan perbaikan kontras dark mode.')
const sampleAutoGrow = ref('')
const togglePrimary = ref(true)
const toggleSecondary = ref(true)
const toggleAccent = ref(false)
const checkPrimary = ref(true)
const checkSecondary = ref(true)
const checkSuccess = ref(true)
const checkWarning = ref(false)
const checkError = ref(false)
const showCode = ref(false)

// Tag Select Demo State
const selectedTags = ref<string[]>(['vue', 'typescript', 'tailwind'])
const availableTagOptions = [
  { label: 'Vue 3.5', value: 'vue', variant: 'primary' as const },
  { label: 'TypeScript', value: 'typescript', variant: 'secondary' as const },
  { label: 'Tailwind CSS', value: 'tailwind', variant: 'accent' as const },
  { label: 'Bun Runtime', value: 'bun', variant: 'warning' as const },
  { label: 'Vite 6', value: 'vite', variant: 'info' as const },
  { label: 'Pinia Store', value: 'pinia', variant: 'success' as const },
  { label: 'Vue Router', value: 'router', variant: 'primary' as const },
]

// UiSelect Demo State (ala vueform/multiselect)
const selectedFramework = ref('vue')
const frameworkOptions = [
  { label: 'Vue 3 (Composition API)', value: 'vue', description: 'Reaktif, performa tinggi, dan ekosistem matang', variant: 'primary' as const },
  { label: 'React 19', value: 'react', description: 'Library populer dengan Server Components', variant: 'info' as const },
  { label: 'Svelte 5 (Runes)', value: 'svelte', description: 'Kompilator tanpa virtual DOM', variant: 'warning' as const },
  { label: 'Angular 18', value: 'angular', description: 'Framework enterprise berfitur lengkap', variant: 'error' as const },
  { label: 'Solid.js', value: 'solid', description: 'Reaktivitas murni dengan performa mendekati C', variant: 'secondary' as const },
  { label: 'Qwik', value: 'qwik', description: 'Resumability instan tanpa hidrasi', variant: 'accent' as const },
  { label: 'Astro 4', value: 'astro', description: 'Multi-framework static generator', variant: 'primary' as const },
  { label: 'Nuxt 3', value: 'nuxt', description: 'Full-stack SSR framework untuk Vue', variant: 'success' as const },
  { label: 'Next.js 15', value: 'next', description: 'Full-stack React framework', variant: 'neutral' as const },
  { label: 'Remix / React Router 7', value: 'remix', description: 'Standar web dan nested routing', variant: 'info' as const },
  { label: 'Ember.js', value: 'ember', description: 'Konvensi stabil jangka panjang', variant: 'warning' as const },
  { label: 'Preact', value: 'preact', description: 'Alternatif ringan 3KB untuk React', variant: 'secondary' as const },
]

const selectedRoles = ref(['frontend', 'uiux'])
const roleOptions = [
  { label: 'Frontend Developer', value: 'frontend', description: 'Vue, React, CSS Architecture' },
  { label: 'Backend Engineer', value: 'backend', description: 'Go, Node.js, PostgreSQL' },
  { label: 'UI/UX Designer', value: 'uiux', description: 'Figma, Design Tokens, User Journey' },
  { label: 'DevOps / SRE', value: 'devops', description: 'Docker, Kubernetes, CI/CD Pipelines' },
  { label: 'QA Automation', value: 'qa', description: 'Playwright, Cypress, E2E Testing' },
  { label: 'Product Manager', value: 'pm', description: 'Roadmap, User Stories, Scrum' },
  { label: 'Data Scientist', value: 'data', description: 'Python, Pandas, ML Pipelines' },
  { label: 'Mobile Engineer', value: 'mobile', description: 'Flutter, React Native, Swift' },
]

function triggerLoading() {
  loadingDemo.value = true
  setTimeout(() => {
    loadingDemo.value = false
  }, 1200)
}

// Toast Demo Helpers
function triggerToast(type: 'success' | 'error' | 'warning' | 'info' | 'primary') {
  switch (type) {
    case 'success':
      toast.success(
        'Data Berhasil Disimpan!',
        'Perubahan profil pengguna telah disimpan ke database cloud.'
      )
      break
    case 'error':
      toast.error(
        'Gagal Memproses Permintaan',
        'Terjadi kendala jaringan saat mencoba menghubungi webhook.'
      )
      break
    case 'warning':
      toast.warning(
        'Batas Kuota Hampir Penuh',
        'Penggunaan storage server Anda mencapai 85% dari kuota maksimal.'
      )
      break
    case 'info':
      toast.info(
        'Pembaruan Sistem Tersedia',
        'Versi Tinkit v0.2 siap diunduh dengan fitur form wizard baru.'
      )
      break
    case 'primary':
      toast.primary(
        'Tema Berhasil Diterapkan!',
        `Preset aktif kini menggunakan tema "${themeStore.currentPreset.name}".`
      )
      break
  }
}

// Simple Table Demo Data
const simpleColumns: TableColumn[] = [
  { key: 'name', label: 'Komponen UI' },
  { key: 'category', label: 'Kategori' },
  { key: 'status', label: 'Status Kesiapan' },
  { key: 'version', label: 'Versi', align: 'right' },
]

const simpleItems: Array<{
  name: string
  category: string
  status: string
  version: string
  variant: ColorVariant
}> = [
  { name: 'UiTextarea', category: 'Form Controls', status: 'Baru Dirilis', version: 'v0.3.0', variant: 'primary' },
  { name: 'UiSelectTag', category: 'Form Controls', status: 'Baru Dirilis', version: 'v0.2.0', variant: 'primary' },
  { name: 'UiDataTable', category: 'Data Display', status: 'Stabil', version: 'v0.2.0', variant: 'success' },
  { name: 'UiToastContainer', category: 'Feedback & Toast', status: 'Baru Dirilis', version: 'v0.2.0', variant: 'accent' },
  { name: 'UiAlert', category: 'Feedback & Alert', status: 'Redesigned', version: 'v0.2.0', variant: 'info' },
]

// Complex DataTable Demo Data
const dataTableColumns: TableColumn[] = [
  { key: 'task', label: 'Nama Tugas', sortable: true },
  { key: 'assignee', label: 'Penanggung Jawab', sortable: true },
  { key: 'priority', label: 'Prioritas', sortable: true },
  { key: 'budget', label: 'Estimasi Budget', sortable: true, align: 'right' },
  { key: 'status', label: 'Status Pengerjaan', sortable: true },
]

const dataTableItems = ref<
  Array<{
    id: number
    task: string
    assignee: string
    priority: string
    budget: string
    status: string
    variant: ColorVariant
  }>
>([
  { id: 101, task: 'Rancang Searchable Tag Select', assignee: 'Arif Pratama', priority: 'High', budget: 'Rp 3.500.000', status: 'Selesai', variant: 'success' },
  { id: 102, task: 'Buat Sistem Floating Toast', assignee: 'Larasati Dewi', priority: 'High', budget: 'Rp 2.800.000', status: 'Selesai', variant: 'success' },
  { id: 103, task: 'Redesign Alert & Glow Effect', assignee: 'Dimas Anggara', priority: 'Medium', budget: 'Rp 1.500.000', status: 'Selesai', variant: 'success' },
  { id: 104, task: 'Buat Complex DataTable ala Datatable.js', assignee: 'Arif Pratama', priority: 'Urgent', budget: 'Rp 4.200.000', status: 'Selesai', variant: 'success' },
  { id: 105, task: 'Integrasi Global Search & Pagination', assignee: 'Karina Putri', priority: 'Medium', budget: 'Rp 1.900.000', status: 'Dalam Proses', variant: 'warning' },
  { id: 106, task: 'Testing Kompatibilitas Bun di Windows', assignee: 'Fajar Nugroho', priority: 'Low', budget: 'Rp 800.000', status: 'Review', variant: 'info' },
  { id: 107, task: 'Penyusunan Dokumentasi OpenAPI', assignee: 'Maya Kusuma', priority: 'Low', budget: 'Rp 1.100.000', status: 'Dalam Proses', variant: 'warning' },
  { id: 108, task: 'Optimasi CSS Bundle & Tree Shaking', assignee: 'Bima Prakoso', priority: 'Medium', budget: 'Rp 2.100.000', status: 'Selesai', variant: 'success' },
])

function handleBulkDelete(rows: any[]) {
  const idsToDelete = new Set(rows.map((r) => r.id))
  dataTableItems.value = dataTableItems.value.filter((item) => !idsToDelete.has(item.id))
  toast.success('Pilihan Berhasil Dihapus', `${rows.length} tugas telah dihapus dari tabel.`)
}

// Financial & Percentage Input Demo State
const demoCurrencyValue = ref<number | null>(47500000)
const demoSelectedCurrency = ref('IDR')
const demoPercentValue = ref<number | null>(18.5)

// Phase 3 New Components Demo State
const demoDate = ref('2026-10-18')
const demoRichText = ref(
  '<h3>Catatan Rilis Tinkit v0.3</h3><p>Editor ini mendukung format <strong>tebal</strong>, <em>miring</em>, <u>garis bawah</u>, daftar poin, dan tampilan kode HTML langsung.</p><ul><li>Komponen Date Picker interaktif</li><li>Upload File Drag & Drop serta Galeri Multi-Foto</li><li>Wizard Stepper & Timeline</li></ul>'
)

const singleUploadFiles = ref<UploadedFileItem[]>([
  {
    id: 'f1',
    name: 'Laporan-Keuangan-Q4-2026.pdf',
    size: 2458000,
    type: 'application/pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    progress: 100,
    status: 'done',
  },
  {
    id: 'f2',
    name: 'config-production.env',
    size: 1420,
    type: 'text/plain',
    url: 'data:text/plain;charset=utf-8,APP_ENV=production%0APORT=8080%0ADATABASE_URL=postgresql://user:secret@localhost:5432/tinkit%0ACACHE_TTL=3600%0ADEBUG=false',
    progress: 100,
    status: 'done',
  },
  {
    id: 'f3',
    name: 'arsip-backup-biner.tar.gz',
    size: 15420000,
    type: 'application/gzip',
    progress: 100,
    status: 'done',
  },
])

const dropzoneFiles = ref<UploadedFileItem[]>([
  {
    id: 'f2',
    name: 'Backup-Database-Cluster.zip',
    size: 8420000,
    type: 'application/zip',
    progress: 100,
    status: 'done',
  },
  {
    id: 'f4',
    name: 'sample-design-mockup.png',
    size: 642000,
    type: 'image/png',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    progress: 100,
    status: 'done',
  },
])

const multiPhotoFiles = ref<UploadedFileItem[]>([
  {
    id: 'p1',
    name: 'ui-dashboard-preview.jpg',
    size: 540200,
    type: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80',
    progress: 100,
    status: 'done',
  },
  {
    id: 'p2',
    name: 'analytics-dark-theme.jpg',
    size: 489100,
    type: 'image/jpeg',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80',
    progress: 100,
    status: 'done',
  },
])

const demoStepIndex = ref(1)
const demoSteps: StepItem[] = [
  { id: 1, title: 'Konfigurasi Awal', subtitle: 'Pilih nama & region' },
  { id: 2, title: 'Integrasi Database', subtitle: 'Koneksi PostgreSQL' },
  { id: 3, title: 'Verifikasi & Deploy', subtitle: 'Siap diluncurkan' },
]

// AI Model Selection / Radio Cards Demo State
const selectedAiModel = ref('claude-3-7')
const aiModelOptions: RadioCardOption[] = [
  {
    value: 'gpt-4o',
    title: 'GPT-4o Omnimodal',
    subtitle: 'High-speed reasoning & multimodal analysis',
    description: 'Model multimodal flagship dari OpenAI dengan throughput tinggi untuk pemrosesan teks, audio, dan gambar secara instan.',
    icon: Bot,
    badge: 'Multi-Modal',
    badgeVariant: 'success',
    tags: ['128k Tokens', 'Vision', 'Realtime Audio'],
    meta: '92 tps • $5/M',
  },
  {
    value: 'claude-3-7',
    title: 'Claude 3.7 Sonnet',
    subtitle: 'Hybrid thought & deep coding intelligence',
    description: 'Standar terdepan untuk penalaran kode kompleks, arsitektur sistem, dan evaluasi berbasis rantai pemikiran (hybrid thinking).',
    icon: Brain,
    badge: 'State of the Art',
    badgeVariant: 'primary',
    tags: ['200k Window', 'Deep Thinking', 'Coding SOTA'],
    meta: '75 tps • $3/M',
    recommended: true,
  },
  {
    value: 'deepseek-r1',
    title: 'DeepSeek R1 Distill',
    subtitle: 'Open weight mathematical & algorithmic reasoning',
    description: 'Arsitektur Mixture-of-Experts open weights dengan efisiensi komputasi tinggi untuk kalkulasi saintifik dan inferensi lokal.',
    icon: Cpu,
    badge: 'Cost Efficient',
    badgeVariant: 'info',
    tags: ['MoE 671B', 'Open Weights', 'Self-Hosted'],
    meta: '110 tps • $0.55/M',
  },
  {
    value: 'gemini-2-flash',
    title: 'Gemini 2.0 Flash',
    subtitle: 'Ultra-low latency sub-second responses',
    description: 'Dioptimalkan untuk respon secepat kilat pada task agen otonom, streaming interaktif, dan context caching masif.',
    icon: Zap,
    badge: 'Sub-second',
    badgeVariant: 'warning',
    tags: ['1M Context', 'Search Grounding', 'Fast Stream'],
    meta: '160 tps • $0.10/M',
  },
]

const demoProgressValue = ref(72)

const demoListItems: ListItem[] = [
  {
    id: 1,
    title: 'Deployment Cluster Asia-Southeast (Jakarta)',
    subtitle: '8 Nodes aktif • Uptime 99.98% selama 30 hari terakhir',
    badge: 'Healthy',
    badgeVariant: 'success',
    meta: '14ms',
    icon: Rocket,
    variant: 'primary',
  },
  {
    id: 2,
    title: 'Sinkronisasi Dokumentasi API OpenAPI 3.1',
    subtitle: 'Diperbarui otomatis melalui GitHub Actions pipeline',
    badge: 'Synced',
    badgeVariant: 'info',
    meta: '2m lalu',
    icon: FileText,
    variant: 'secondary',
  },
  {
    id: 3,
    title: 'Peringatan Kapasitas Penyimpanan Object Storage',
    subtitle: 'Bucket media-assets mencapai 82% dari batas kuota bulanan',
    badge: '82% Used',
    badgeVariant: 'warning',
    meta: '820 GB',
    icon: AlertTriangle,
    variant: 'warning',
  },
]

const demoTimelineItems: TimelineItem[] = [
  {
    id: 1,
    title: 'Komponen Baru Berhasil Ditambahkan',
    description: 'Menambahkan DatePicker, FileUpload (3 mode), RichEditor, Stepper, Progress, List, Timeline, Spinner, EmptyState, Dropdown, Tooltip, dan Popover.',
    time: 'Baru saja',
    variant: 'primary',
    badge: 'v0.3.0',
    author: 'Arif Pratama',
  },
  {
    id: 2,
    title: 'Optimasi Kontras Tema Gelap & Terang',
    description: 'Seluruh komponen telah diuji pada 6 preset warna di mode terang maupun gelap.',
    time: '1 jam lalu',
    variant: 'success',
    badge: 'Verified',
    author: 'Larasati Dewi',
  },
  {
    id: 3,
    title: 'Inisialisasi Repositori Open Source',
    description: 'Membangun arsitektur dasar menggunakan Vue 3.5, Vite 6, Bun, dan TypeScript.',
    time: 'Kemarin',
    variant: 'secondary',
    badge: 'Init',
    author: 'Tim Inti Tinkit',
  },
]

const demoDropdownItems: DropdownItem[] = [
  { label: 'Unduh Laporan PDF', value: 'download', icon: Download, badge: 'PDF' },
  { label: 'Bagikan ke Anggota Tim', value: 'share', icon: Share2 },
  { label: 'Pengaturan Modul', value: 'settings', icon: Settings },
  { divider: true },
  { label: 'Hapus Permanen', value: 'delete', icon: Trash2, danger: true },
]

// Accordion Demo Data
const activeAccordionId = ref<string | number>('acc-1')
const activeMultiAccordionIds = ref<(string | number)[]>(['multi-1', 'multi-2'])
const demoAccordionItems: AccordionItem[] = [
  {
    id: 'acc-1',
    title: 'Bagaimana cara mengganti preset tema di Tinkit?',
    content: 'Tinkit menyediakan 8 preset warna bawaan (Daybreak, Midnight, Aurora, Nebula, Sunset, Ocean, Matcha, Berry) yang didukung mode terang & gelap. Anda dapat mengganti tema langsung melalui theme switcher di pojok kanan atas atau lewat API useThemeStore().',
    icon: Palette,
    badge: 'Populer',
    badgeVariant: 'primary',
  },
  {
    id: 'acc-2',
    title: 'Apakah seluruh komponen mendukung TypeScript dan aksesibilitas?',
    content: 'Ya, seluruh pustaka komponen Tinkit dibangun 100% menggunakan TypeScript strictly-typed (diverifikasi via vue-tsc) dan dilengkapi atribut ARIA yang tepat untuk navigasi keyboard dan screen reader.',
    icon: ShieldCheck,
    badge: 'WCAG AA',
    badgeVariant: 'success',
  },
  {
    id: 'acc-3',
    title: 'Bagaimana cara menambahkan validasi form kustom?',
    content: 'Anda dapat menggabungkan komponen form Tinkit dengan library validasi standar Vue seperti VeeValidate atau Zod, atau menggunakan reactive state bawaan Vue 3 dengan properti error dan hint yang telah disediakan.',
    icon: HelpIcon,
  },
]

const demoSeparatedAccordionItems: AccordionItem[] = [
  {
    id: 'multi-1',
    title: 'Arsitektur CSS & Design Tokens Modular',
    content: 'Semua token warna, kelengkungan sudut (--rounded-btn, --rounded-box), dan shadow diatur melalui variabel CSS murni yang bereaksi otomatis saat tema diganti.',
    icon: LayersIcon,
  },
  {
    id: 'multi-2',
    title: 'Komponen Video Player dengan Kontrol Kustom',
    content: 'Dilengkapi tombol putar/jeda terpusat, pengatur kecepatan putar (0.5x - 2x), pengatur volume slider, timeline scrubber, mode layar penuh, dan pintasan lompat 10 detik.',
    icon: VideoIcon,
  },
  {
    id: 'multi-3',
    title: 'Carousel Responsif dengan Swipe Gesture',
    content: 'Mendukung autoplay interval, navigasi panah, dot indicators, touch swipe untuk perangkat mobile, serta pratinjau thumbnail interaktif.',
    icon: SlidersHorizontal,
  },
]

// Carousel Demo Data
const activeSlideIndex = ref(0)
const demoCarouselSlides: CarouselSlide[] = [
  {
    id: 'c1',
    title: 'Infrastruktur Cloud Berkecepatan Tinggi',
    description: 'Monitor performa server microservices dan jaringan global dengan latensi di bawah 20ms.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'c2',
    title: 'Analitik Data Cerdas & Visualisasi Real-Time',
    description: 'Grafik interaktif dan metrik performa bisnis yang terintegrasi secara modular.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'c3',
    title: 'Desain Modern & Aksesibilitas Optimal',
    description: 'Dibuat dengan Tailwind CSS & DaisyUI semantik berstandar kontras WCAG AA.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  },
]

// Tabs Demo Data (Attached variant, Pills, Underline)
const attachedTab = ref('code')
const demoTabItems: TabItem[] = [
  { id: 'code', label: 'AppConfig.ts', icon: Code, badge: 'TypeScript', badgeVariant: 'primary' },
  { id: 'env', label: '.env.production', icon: Terminal, badge: 'Protected', badgeVariant: 'warning' },
  { id: 'output', label: 'Dist Assets', icon: Folder, badge: '3 Files', badgeVariant: 'info' },
]

const pillsTab = ref('profile')
const demoPillTabs: TabItem[] = [
  { id: 'profile', label: 'Profil Akun', icon: Settings },
  { id: 'notifications', label: 'Notifikasi', badge: 3, badgeVariant: 'error' },
  { id: 'integrations', label: 'Webhook API' },
]

// CodeBlock Showcase Data (Programming, Database, Markdown)
const activeCodeLang = ref('sql')
const codeSnippets: Record<string, { code: string; language: string; filename: string; highlightLines?: number[] }> = {
  sql: {
    language: 'sql',
    filename: 'queries/analytics_rollup.sql',
    highlightLines: [5, 6, 7],
    code: `-- Analisis pendapatan bulanan per departemen dengan window function
WITH monthly_metrics AS (
  SELECT
    DATE_TRUNC('month', o.created_at) AS report_month,
    d.department_name,
    SUM(o.amount_usd) AS gross_revenue,
    COUNT(DISTINCT o.customer_id) AS active_accounts,
    RANK() OVER (PARTITION BY DATE_TRUNC('month', o.created_at) ORDER BY SUM(o.amount_usd) DESC) as dept_rank
  FROM enterprise_orders o
  INNER JOIN departments d ON o.department_id = d.id
  WHERE o.status = 'COMPLETED'
    AND o.created_at >= NOW() - INTERVAL '6 MONTH'
  GROUP BY 1, 2
)
SELECT * FROM monthly_metrics WHERE dept_rank <= 3;`,
  },
  typescript: {
    language: 'typescript',
    filename: 'services/clusterManager.ts',
    highlightLines: [8, 9],
    code: `import { ref, computed } from 'vue'

export interface ClusterNode {
  id: string
  region: 'ap-southeast-3' | 'us-east-1'
  loadAvg: number
  status: 'healthy' | 'degraded' | 'offline'
}

export async function pingNodes(nodes: ClusterNode[]): Promise<boolean> {
  const healthyCount = nodes.filter((n) => n.status === 'healthy').length
  return (healthyCount / nodes.length) >= 0.8
}`,
  },
  python: {
    language: 'python',
    filename: 'pipeline/fastapi_agent.py',
    highlightLines: [6],
    code: `from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Tinkit Intelligent Inference API", version="0.4.0")

class InferencePayload(BaseModel):
    prompt: str
    temperature: float = 0.7
    max_tokens: int = 2048

@app.post("/v1/agent/complete")
async def execute_reasoning(payload: InferencePayload):
    # Streaming LLM inference with grounding checks
    return {"status": "ok", "response": f"Processed {len(payload.prompt)} chars"}`,
  },
  markdown: {
    language: 'markdown',
    filename: 'README.md',
    highlightLines: [3, 7],
    code: `# Tinkit Admin Template

Clean & colorful open-source Vue 3 + Tailwind CSS admin dashboard.

## Quick Start

\`\`\`bash
# Install dependencies with Bun
bun install

# Start Vite hot-reloading development server
bun run dev
\`\`\`

> [!NOTE]
> Semua komponen didesain 100% type-safe dengan **strict TypeScript**.`,
  },
}

interface DemoChatMessageItem {
  id: number
  role: MessageRole
  author?: MessageAuthor
  timestamp?: string
  status?: MessageStatus
  content: string
}

// Chat Demo State (Messages & Interactive input)
const chatInputText = ref('')
const messageScrollRef = ref<InstanceType<typeof UiMessageScroll> | null>(null)
const demoChatMessages = ref<DemoChatMessageItem[]>([
  {
    id: 1,
    role: 'system',
    content: 'Enkripsi end-to-end aktif. Sesi percakapan kolaboratif dimulai.',
  },
  {
    id: 2,
    role: 'assistant',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      status: 'online',
    },
    timestamp: '14:20',
    content: 'Halo tim! Apakah modul verifikasi wizard dan preview file sudah siap untuk di-review ke staging?',
  },
  {
    id: 3,
    role: 'user',
    author: {
      name: 'Arif Budiman (Anda)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    timestamp: '14:22',
    status: 'read',
    content: 'Sudah selesai Sarah! Seluruh tooling gambar (zoom, pan drag, rotate, flip) dan body scroll lock sudah lolos pengujian browser.',
  },
  {
    id: 4,
    role: 'assistant',
    author: {
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      status: 'online',
    },
    timestamp: '14:23',
    content: 'Luar biasa cepat! Mari kita push ke branch release v0.4.0 sekarang',
  },
])

function sendDemoChatMessage() {
  const text = chatInputText.value.trim()
  if (!text) return

  demoChatMessages.value.push({
    id: Date.now(),
    role: 'user',
    author: {
      name: 'Arif Budiman (Anda)',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    },
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    status: 'sent',
    content: text,
  })

  chatInputText.value = ''

  // Simulate auto-reply from peer/assistant
  setTimeout(() => {
    demoChatMessages.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      author: {
        name: 'Sarah Jenkins',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        status: 'online',
      },
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: `Pesan diterima: "${text}". Auto-scrolling berjalan lancar`,
    })
  }, 900)
}

// 26. JSON Viewer Demo State
const activeJsonPreset = ref<'cluster' | 'OrderPayload' | 'themeConfig'>('cluster')
const showJsonTypes = ref(false)
const jsonPresets: Record<'cluster' | 'OrderPayload' | 'themeConfig', { title: string; data: unknown }> = {
  cluster: {
    title: 'cluster-telemetry.json',
    data: {
      service: 'tinkit-edge-gateway',
      version: '0.4.2',
      healthy: true,
      region: 'ap-southeast-1',
      uptimeSeconds: 184920,
      maintenanceNote: null,
      limits: {
        maxConnections: 10000,
        rateLimitPerMinute: 1200,
        retryPolicy: {
          maxAttempts: 3,
          backoffMs: 250,
          jitter: true,
        },
      },
      nodes: [
        { id: 'node-jkt-01', ip: '10.24.1.11', cpuLoad: 0.42, role: 'primary', active: true },
        { id: 'node-sgp-02', ip: '10.24.1.12', cpuLoad: 0.31, role: 'replica', active: true },
        { id: 'node-bdg-03', ip: '10.24.1.15', cpuLoad: 0.78, role: 'worker', active: false },
      ],
    },
  },
  OrderPayload: {
    title: 'webhook-invoice-paid.json',
    data: {
      event: 'invoice.paid',
      webhookId: 'wh_9928174810',
      timestamp: '2026-11-09T15:30:00Z',
      customer: {
        id: 'cus_tinkit_88',
        name: 'PT Nusantara Cloud Digital',
        email: 'billing@nusantaracloud.id',
        taxVerified: true,
      },
      items: [
        { sku: 'TK-ENT-YEAR', plan: 'Tinkit Enterprise Annual', qty: 1, amountIdr: 14500000 },
        { sku: 'TK-ADD-SEAT', plan: 'Extra 10 Developer Seats', qty: 2, amountIdr: 3000000 },
      ],
      payment: {
        channel: 'QRIS_INSTANT',
        paidAmountIdr: 17500000,
        feeIdr: 0,
        settled: true,
      },
    },
  },
  themeConfig: {
    title: 'theme-studio-export.json',
    data: {
      preset: 'tinkit',
      darkMode: false,
      radiusScale: 'lg',
      fontFamily: 'Inter',
      contentWidth: 'compact',
      tokens: {
        primary: '34 40 49',
        secondary: '82 101 122',
        accent: '34 40 49',
        roundedBox: '0.625rem',
        roundedBtn: '0.5rem',
      },
    },
  },
}

// 27. File Tree Explorer Demo State
const selectedTreeFileId = ref('file-json-viewer')
const selectedTreeFilePath = ref('src/components/ui/UiJsonViewer.vue')
const demoFileTreeItems: FileTreeItem[] = [
  {
    id: 'folder-src',
    name: 'src',
    type: 'folder',
    badge: 'Core',
    badgeVariant: 'primary',
    children: [
      {
        id: 'folder-assets',
        name: 'assets',
        type: 'folder',
        children: [
          { id: 'file-themes-css', name: 'themes.css', type: 'file', size: '18.4 KB', badge: '9 Presets', badgeVariant: 'accent' },
          { id: 'file-components-css', name: 'components.css', type: 'file', size: '21.2 KB' },
          { id: 'file-logo-svg', name: 'tinkit-symbol-ink.png', type: 'file', size: '4.8 KB' },
        ],
      },
      {
        id: 'folder-components',
        name: 'components',
        type: 'folder',
        children: [
          {
            id: 'folder-ui',
            name: 'ui',
            type: 'folder',
            badge: '27 Kits',
            badgeVariant: 'info',
            children: [
              { id: 'file-json-viewer', name: 'UiJsonViewer.vue', type: 'file', size: '11.6 KB', badge: 'Baru', badgeVariant: 'success' },
              { id: 'file-file-tree', name: 'UiFileTree.vue', type: 'file', size: '10.2 KB', badge: 'Baru', badgeVariant: 'success' },
              { id: 'file-code-block', name: 'UiCodeBlock.vue', type: 'file', size: '8.4 KB' },
              { id: 'file-data-table', name: 'UiDataTable.vue', type: 'file', size: '14.1 KB' },
            ],
          },
          {
            id: 'folder-kanban',
            name: 'kanban',
            type: 'folder',
            children: [
              { id: 'file-kanban-col', name: 'KanbanColumn.vue', type: 'file', size: '5.3 KB' },
              { id: 'file-kanban-card', name: 'KanbanTaskCard.vue', type: 'file', size: '6.1 KB' },
            ],
          },
        ],
      },
      {
        id: 'folder-views',
        name: 'views',
        type: 'folder',
        children: [
          { id: 'file-kanban-view', name: 'KanbanView.vue', type: 'file', size: '16.8 KB', badge: 'Page', badgeVariant: 'primary' },
          { id: 'file-dashboard-view', name: 'DashboardView.vue', type: 'file', size: '19.5 KB' },
          { id: 'file-components-view', name: 'ComponentsView.vue', type: 'file', size: '64.0 KB' },
        ],
      },
    ],
  },
  {
    id: 'folder-config',
    name: 'config & schema',
    type: 'folder',
    children: [
      { id: 'file-pkg-json', name: 'package.json', type: 'file', size: '1.3 KB' },
      { id: 'file-tailwind', name: 'tailwind.config.ts', type: 'file', size: '3.2 KB' },
      { id: 'file-schema-sql', name: 'migrations-v4.sql', type: 'file', size: '7.9 KB' },
      { id: 'file-release-zip', name: 'tinkit-dist-v0.4.tar.gz', type: 'file', size: '142 KB' },
    ],
  },
  {
    id: 'file-readme',
    name: 'README.md',
    type: 'file',
    size: '9.5 KB',
  },
]

const selectedTreeItemDetail = ref<FileTreeItem>({
  id: 'file-json-viewer',
  name: 'UiJsonViewer.vue',
  type: 'file',
  size: '11.6 KB',
  badge: 'Baru',
  badgeVariant: 'success',
})

function handleTreeSelect(item: FileTreeItem, path: string) {
  selectedTreeItemDetail.value = item
  selectedTreeFilePath.value = path
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top Header Banner -->
    <div class="card flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
      <div>
        <div class="flex items-center gap-2 mb-1.5">
          <UiBadge variant="primary" soft>Dual-API System</UiBadge>
          <UiBadge variant="secondary" soft>Enterprise UI</UiBadge>
        </div>
        <h1 class="text-xl font-bold text-base-content">
          Katalog Komponen Semantik UI
        </h1>
        <p class="text-[0.8125rem] text-base-content/60 mt-0.5">
          Gunakan class CSS semantik seperti <code class="font-mono text-primary">.btn .btn-primary</code>
          atau komponen Vue bertipe <code class="font-mono text-secondary">&lt;UiButton variant="primary"&gt;</code>.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="btn btn-soft btn-primary btn-sm"
          @click="showCode = !showCode"
        >
          <Code2 class="h-4 w-4" />
          {{ showCode ? 'Sembunyikan Snippet' : 'Tampilkan Snippet Kode' }}
        </button>
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="themeStore.customizerOpen = true"
        >
          <Palette class="h-4 w-4" />
          Ganti Tema
        </button>
      </div>
    </div>

    <!-- 1. Searchable Tag Select (Baru!) -->
    <UiCard
      title="1. Searchable Tag Select (<UiSelectTag>)"
      subtitle="Input multi-pilih dengan live search, chip badge yang bisa dihapus, keyboard navigation, dan opsi buat tag baru"
      accent-top="primary"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="space-y-4">
          <UiSelectTag
            v-model="selectedTags"
            :options="availableTagOptions"
            label="Keahlian & Tech Stack (Bisa Cari & Buat Tag Baru)"
            placeholder="Ketik untuk mencari atau menambah tag..."
            allow-create
          />
          <p class="text-xs text-base-content/60 leading-relaxed">
            Cobalah mengetik nama tag baru (misal: <em>Docker</em> atau <em>GraphQL</em>) lalu tekan <strong>Enter</strong>.
            Tekan <strong>Backspace</strong> ketika input kosong untuk menghapus tag terakhir.
          </p>
        </div>

        <div class="rounded-box border border-base-300 bg-base-200/50 p-4 space-y-2">
          <div class="flex items-center justify-between text-xs font-bold text-base-content/70">
            <span>Nilai Reaktif (v-model array):</span>
            <span class="badge badge-primary badge-sm font-mono">{{ selectedTags.length }} tag</span>
          </div>
          <pre class="rounded-btn bg-base-100 p-3 font-mono text-xs text-primary border border-base-300 overflow-x-auto">{{ JSON.stringify(selectedTags, null, 2) }}</pre>
        </div>
      </div>
    </UiCard>

    <!-- 2. Searchable & Paginated Select Option (Baru! ala vueform/multiselect) -->
    <UiCard
      title="2. Searchable & Paginated Select (<UiSelect>)"
      subtitle="Pengganti default select option dengan gaya ala vueform/multiselect: live search, pagination built-in, deskripsi item, single & multi select"
      accent-top="secondary"
    >
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Single Select with Pagination & Search -->
        <div class="space-y-4">
          <UiSelect
            v-model="selectedFramework"
            :options="frameworkOptions"
            label="Pilih Framework (Single Select + Live Search + Paginasi 5/Hal)"
            placeholder="Ketik untuk mencari framework..."
            :page-size="5"
            hint="Navigasi paginasi di bawah dropdown atau gunakan tombol panah kiri/kanan keyboard"
          />

          <div class="rounded-box border border-base-300 bg-base-200/50 p-3.5 flex items-center justify-between text-xs">
            <span class="text-base-content/70 font-medium">Framework Terpilih:</span>
            <span class="badge badge-primary font-bold">{{ selectedFramework }}</span>
          </div>
        </div>

        <!-- Multi Select with Pagination & Search -->
        <div class="space-y-4">
          <UiSelect
            v-model="selectedRoles"
            :options="roleOptions"
            label="Pilih Peran Tim (Multi-Select Tags + Paginasi 4/Hal)"
            placeholder="Pilih satu atau beberapa peran..."
            multiple
            :page-size="4"
            hint="Mendukung multi-select tag chip yang dapat dihapus individual atau sekaligus"
          />

          <div class="rounded-box border border-base-300 bg-base-200/50 p-3.5 flex items-center justify-between text-xs">
            <span class="text-base-content/70 font-medium">Peran Terpilih ({{ selectedRoles.length }}):</span>
            <div class="flex flex-wrap gap-1 justify-end max-w-xs">
              <span v-for="r in selectedRoles" :key="r" class="badge badge-secondary badge-xs font-semibold">
                {{ r }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- 3. Floating Toast System (Baru!) -->
    <UiCard
      title="3. Floating Toast Notifications (useToast)"
      subtitle="Sistem notifikasi mengambang dengan timer auto-dismiss, animasi halus, dan varian semantik"
      accent-top="secondary"
    >
      <div class="space-y-3">
        <span class="text-xs font-bold text-base-content/50 block">
          Klik tombol di bawah untuk memicu Toast Notifications secara live:
        </span>
        <div class="flex flex-wrap items-center gap-3">
          <UiButton variant="success" size="sm" @click="triggerToast('success')">
            <template #icon-left>
              <CheckCircle2 class="h-4 w-4" />
            </template>
            Toast Success
          </UiButton>
          <UiButton variant="error" size="sm" @click="triggerToast('error')">
            <template #icon-left>
              <XCircle class="h-4 w-4" />
            </template>
            Toast Error
          </UiButton>
          <UiButton variant="warning" size="sm" @click="triggerToast('warning')">
            <template #icon-left>
              <AlertTriangle class="h-4 w-4" />
            </template>
            Toast Warning
          </UiButton>
          <UiButton variant="info" size="sm" @click="triggerToast('info')">
            <template #icon-left>
              <Info class="h-4 w-4" />
            </template>
            Toast Info
          </UiButton>
          <UiButton variant="primary" size="sm" @click="triggerToast('primary')">
            <template #icon-left>
              <Sparkles class="h-4 w-4" />
            </template>
            Toast Primary
          </UiButton>
        </div>
      </div>
    </UiCard>

    <!-- 3. Redesigned Alerts (<UiAlert>) -->
    <UiCard
      title="3. Redesigned Alerts (<UiAlert>)"
      subtitle="Pesan umpan balik dengan gaya estetika yang lebih selaras dengan konsep Clean & Colorful"
      accent-top="accent"
    >
      <div class="space-y-4">
        <div>
          <span class="text-xs font-bold text-base-content/50 block mb-2">
            Varian Accent-Left (Garis Indikator Sisi Kiri - Elegan & Bersih)
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <UiAlert
              variant="info"
              style-type="accent-left"
              title="Informasi Arsitektur"
              dismissible
            >
              Komponen UI ini 100% modular dan terikat langsung dengan CSS Variables tema aktif.
            </UiAlert>
            <UiAlert
              variant="success"
              style-type="accent-left"
              title="Sinkronisasi Berhasil"
              dismissible
            >
              Seluruh aset build Vite telah diperbarui dan lulus pengecekan type-check.
            </UiAlert>
            <UiAlert
              variant="warning"
              style-type="accent-left"
              title="Peringatan Kuota"
              dismissible
            >
              Batas penggunaan API bulanan Anda telah mencapai 82% dari kuota.
            </UiAlert>
            <UiAlert
              variant="error"
              style-type="accent-left"
              title="Koneksi Terputus"
              dismissible
            >
              Tidak dapat menghubungi server cloud. Periksa pengaturan koneksi jaringan.
            </UiAlert>
          </div>
        </div>

        <div class="pt-2 border-t border-base-300/70">
          <span class="text-xs font-bold text-base-content/50 block mb-2">
            Varian Glass & Soft Pastel (Tanpa Solid Background)
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <UiAlert
              variant="primary"
              style-type="glass"
              title="Gaya Glassmorphism"
              dismissible
            >
              Efek latar transparan dengan aksen border berkilau yang halus di mata.
            </UiAlert>
            <UiAlert
              variant="secondary"
              style-type="soft"
              title="Gaya Soft Pastel"
              dismissible
            >
              Latar belakang pastel lembut dengan teks kontras tinggi untuk pengumuman harian.
            </UiAlert>
          </div>
        </div>

        <div class="pt-2 border-t border-base-300/70">
          <span class="text-xs font-bold text-base-content/50 block mb-2">
            Varian Solid Background (Opsi solid=true)
          </span>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            <UiAlert
              variant="primary"
              solid
              title="Solid Primary Alert"
              dismissible
            >
              Warna background solid penuh untuk pengumuman penting atau banner prioritas tinggi.
            </UiAlert>
            <UiAlert
              variant="success"
              solid
              title="Solid Success Alert"
              dismissible
            >
              Operasi berhasil diselesaikan dengan warna solid yang kontras dan tajam.
            </UiAlert>
            <UiAlert
              variant="warning"
              solid
              title="Solid Warning Alert"
              dismissible
            >
              Peringatan kuota atau atensi penting dengan teks kontras tinggi yang jelas terbaca.
            </UiAlert>
            <UiAlert
              variant="error"
              solid
              title="Solid Error Alert"
              dismissible
            >
              Kegagalan sistem darurat dengan warna merah tegas dan icon kontras tinggi.
            </UiAlert>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- 4. Tables: Simple Table vs Complex DataTable (Baru!) -->
    <div class="space-y-6">
      <!-- Simple Table -->
      <UiCard
        title="4. Simple Table Component (<UiTable>)"
        subtitle="Tabel sederhana yang bersih dengan zebra stripe dan hoverable rows"
        accent-top="info"
      >
        <UiTable :columns="simpleColumns" :items="simpleItems">
          <template #cell-status="{ item }">
            <UiBadge :variant="item.variant" soft size="sm">
              {{ item.status }}
            </UiBadge>
          </template>
          <template #cell-version="{ value }">
            <span class="font-mono text-xs font-bold text-primary">{{ value }}</span>
          </template>
        </UiTable>
      </UiCard>

      <!-- Complex DataTable -->
      <UiCard
        title="5. Complex DataTable Component (<UiDataTable>)"
        subtitle="DataTable lengkap tanpa dependensi eksternal: Global Search, Column Sorting, Multi-select Checkbox, Pagination, dan Ekspor CSV"
        accent-top="primary"
      >
        <UiDataTable
          :columns="dataTableColumns"
          :items="dataTableItems"
          :page-size-options="[5, 10, 20]"
          :initial-page-size="5"
          selectable
          searchable
          @bulk-delete="handleBulkDelete"
        >
          <template #cell-priority="{ value }">
            <UiBadge
              :variant="value === 'Urgent' ? 'error' : value === 'High' ? 'warning' : 'info'"
              soft
              size="sm"
            >
              {{ value }}
            </UiBadge>
          </template>
          <template #cell-budget="{ value }">
            <span class="font-bold text-base-content font-mono">{{ value }}</span>
          </template>
          <template #cell-status="{ item }">
            <UiBadge :variant="item.variant" soft dot size="sm">
              {{ item.status }}
            </UiBadge>
          </template>
        </UiDataTable>
      </UiCard>
    </div>

    <!-- 5. Buttons Showcase -->
    <UiCard
      title="6. Buttons (.btn & <UiButton>)"
      subtitle="Mendukung varian Solid, Soft Pastel (Clean & Colorful), Outline, Ghost, Ukuran, dan Loading state"
      accent-top="secondary"
    >
      <div class="space-y-5">
        <!-- Solid Buttons -->
        <div>
          <span class="text-xs font-bold text-base-content/50 block mb-2.5">
            Solid Semantic Variants
          </span>
          <div class="flex flex-wrap gap-2.5">
            <UiButton
              v-for="v in variants"
              :key="`solid-${v}`"
              :variant="v"
              class="capitalize"
            >
              {{ v }}
            </UiButton>
            <UiButton variant="ghost">Ghost</UiButton>
          </div>
        </div>

        <!-- Soft Pastel Buttons -->
        <div>
          <span class="text-xs font-bold text-base-content/50 block mb-2.5">
            Soft Pastel Variants (.btn-soft)
          </span>
          <div class="flex flex-wrap gap-2.5">
            <UiButton
              v-for="v in variants.filter((x) => x !== 'neutral')"
              :key="`soft-${v}`"
              :variant="v"
              soft
              class="capitalize"
            >
              Soft {{ v }}
            </UiButton>
          </div>
        </div>

        <!-- Sizes & Interactive States -->
        <div>
          <span class="text-xs font-bold text-base-content/50 block mb-2.5">
            Sizes & Interactive States
          </span>
          <div class="flex flex-wrap items-center gap-3">
            <UiButton variant="primary" size="xs">Extra Small (xs)</UiButton>
            <UiButton variant="secondary" size="sm">Small (sm)</UiButton>
            <UiButton variant="accent" size="md">Medium Default (md)</UiButton>
            <UiButton variant="primary" size="lg">Large Button (lg)</UiButton>
            <UiButton
              variant="success"
              :loading="loadingDemo"
              @click="triggerLoading"
            >
              Klik untuk Uji Loading
            </UiButton>
            <UiButton variant="primary" @click="demoModalOpen = true">
              <template #icon-left>
                <Sparkles class="h-4 w-4" />
              </template>
              Buka Modal Dialog
            </UiButton>
          </div>
        </div>

        <!-- NEW: Dedicated Icon Button Concept System -->
        <div class="pt-5 border-t border-base-300/80 dark:border-white/[0.08] space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span class="text-xs font-bold text-primary block">
                Konsep Icon Button (.btn-icon, .btn-square, .btn-circle)
              </span>
              <p class="text-xs text-base-content/65 mt-0.5">
                Rasio presisi 1:1 tanpa distorsi padding, ikon terpusat sempurna, dan 4 skala ukuran baku untuk UI modern.
              </p>
            </div>
            <UiBadge variant="primary" soft size="sm">Terkonsep & Aligned</UiBadge>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- Col 1: Shapes (Circle vs Square) -->
            <div class="rounded-box border border-base-300 bg-base-200/35 p-3.5 space-y-3">
              <span class="text-xs font-bold text-base-content block">1. Bentuk (Shapes)</span>
              <div class="flex items-center gap-3">
                <div class="text-center space-y-1">
                  <UiButton circle variant="primary" size="sm" :icon="Plus" title="Circle Shape" />
                  <span class="text-[10px] text-base-content/60 block">Circle (btn-circle)</span>
                </div>
                <div class="text-center space-y-1">
                  <UiButton square variant="primary" size="sm" :icon="Plus" title="Square Shape" />
                  <span class="text-[10px] text-base-content/60 block">Square (btn-square)</span>
                </div>
              </div>
            </div>

            <!-- Col 2: Size Scale (xs, sm, md, lg) -->
            <div class="rounded-box border border-base-300 bg-base-200/35 p-3.5 space-y-3">
              <span class="text-xs font-bold text-base-content block">2. Skala Ukuran (Sizes)</span>
              <div class="flex items-center gap-2">
                <div class="text-center">
                  <UiButton square variant="secondary" size="xs" :icon="Settings" title="Extra Small (28px)" />
                  <span class="text-[9px] font-mono text-base-content/50 block mt-1">28px (xs)</span>
                </div>
                <div class="text-center">
                  <UiButton square variant="secondary" size="sm" :icon="Settings" title="Small (34px)" />
                  <span class="text-[9px] font-mono text-base-content/50 block mt-1">34px (sm)</span>
                </div>
                <div class="text-center">
                  <UiButton square variant="secondary" size="md" :icon="Settings" title="Medium (40px)" />
                  <span class="text-[9px] font-mono text-base-content/50 block mt-1">40px (md)</span>
                </div>
                <div class="text-center">
                  <UiButton square variant="secondary" size="lg" :icon="Settings" title="Large (48px)" />
                  <span class="text-[9px] font-mono text-base-content/50 block mt-1">48px (lg)</span>
                </div>
              </div>
            </div>

            <!-- Col 3: Styles (Ghost, Soft, Outline, Solid) -->
            <div class="rounded-box border border-base-300 bg-base-200/35 p-3.5 space-y-3">
              <span class="text-xs font-bold text-base-content block">3. Gaya Semantik (Styles)</span>
              <div class="flex flex-wrap items-center gap-2">
                <UiButton circle variant="ghost" size="sm" :icon="Heart" title="Ghost" />
                <UiButton circle variant="primary" soft size="sm" :icon="Bookmark" title="Soft Primary" />
                <UiButton circle variant="error" soft size="sm" :icon="Trash2" title="Soft Error" />
                <UiButton circle outline size="sm" :icon="Share2" title="Outline Surface" />
                <UiButton circle variant="accent" size="sm" :icon="Sparkles" title="Solid Accent" />
              </div>
            </div>

            <!-- Col 4: Real-world Table Action Groups -->
            <div class="rounded-box border border-base-300 bg-base-200/35 p-3.5 space-y-3">
              <span class="text-xs font-bold text-base-content block">4. Aksi Tabel & Toolbar</span>
              <div class="flex items-center gap-1.5 p-1 rounded-btn bg-base-100 border border-base-300/80 w-fit">
                <button
                  type="button"
                  class="btn btn-square btn-xs btn-ghost text-base-content/70 hover:text-info hover:bg-info/10"
                  title="Detail"
                >
                  <Eye class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-square btn-xs btn-soft btn-primary"
                  title="Edit Data"
                >
                  <Pencil class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-square btn-xs btn-soft btn-error"
                  title="Hapus Data"
                >
                  <Trash2 class="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  class="btn btn-square btn-xs btn-outline"
                  title="Salin ID"
                >
                  <Copy class="h-3.5 w-3.5" />
                </button>
              </div>
              <span class="text-[11px] text-base-content/50 block">Grup tombol aksi seragam & konsisten</span>
            </div>
          </div>
        </div>
      </div>
    </UiCard>

    <!-- 6. Form Controls & Badges Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Form Controls -->
      <UiCard
        title="7. Standard Form Inputs & Toggles"
        subtitle="Kontrol form bersih yang otomatis mengikuti radius dan warna tema"
        accent-top="accent"
      >
        <div class="space-y-4">
          <UiInput
            v-model="sampleName"
            label="Nama Proyek"
            placeholder="Masukkan nama proyek..."
            hint="Menggunakan komponen <UiInput> dengan two-way binding v-model"
          >
            <template #icon-left>
              <Sparkles class="h-4 w-4" />
            </template>
          </UiInput>

          <UiInput
            v-model="sampleEmail"
            label="Alamat Email Maintainer"
            type="email"
            placeholder="nama@domain.com"
          >
            <template #icon-left>
              <Mail class="h-4 w-4" />
            </template>
          </UiInput>

          <UiInput
            model-value="input_tidak_valid"
            label="Contoh State Validasi Error"
            error="Format token tidak sesuai standar keamanan."
          >
            <template #icon-left>
              <Search class="h-4 w-4" />
            </template>
          </UiInput>

          <!-- Theme-Aligned Textarea -->
          <div class="pt-2 border-t border-base-300/70 space-y-3">
            <span class="text-xs font-bold text-base-content/50 block">
              Textarea Bertema (&lt;UiTextarea&gt;)
            </span>
            <UiTextarea
              v-model="sampleNotes"
              label="Catatan Rilis"
              placeholder="Tulis ringkasan perubahan rilis..."
              hint="Mengikuti radius, surface input, dan focus ring dari tema aktif."
              :rows="3"
              :maxlength="280"
              show-count
            />
            <UiTextarea
              v-model="sampleAutoGrow"
              label="Auto-Grow dengan Batas Tinggi"
              placeholder="Ketik pesan panjang — tinggi field mengikuti isi hingga 5 baris..."
              :rows="1"
              :max-rows="5"
              auto-grow
              :maxlength="2000"
              show-count
            />
            <UiTextarea
              model-value="Draf pesan yang gagal divalidasi."
              label="State Validasi Error"
              error="Pesan tidak boleh berisi tautan mencurigakan."
            />
          </div>

          <!-- Modern Select Option in Form -->
          <UiSelect
            v-model="selectedFramework"
            :options="frameworkOptions"
            label="Default Select Form (<UiSelect> ala multiselect)"
            placeholder="Pilih framework default proyek..."
            :page-size="5"
            hint="Mendukung live filter pencarian dan navigasi paginasi"
          />

          <!-- Checkboxes (Baru!) -->
          <div class="pt-2 border-t border-base-300/70 space-y-3">
            <span class="text-xs font-bold text-base-content/50 block">
              Theme-Aligned Checkboxes (.checkbox & &lt;UiCheckbox&gt;)
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <UiCheckbox
                v-model="checkPrimary"
                variant="primary"
                label="Primary Checkbox"
                description="Terikat langsung dengan tema aktif"
              />
              <UiCheckbox
                v-model="checkSecondary"
                variant="secondary"
                label="Secondary Checkbox"
                description="Warna pink neon semantik"
              />
              <UiCheckbox
                v-model="checkSuccess"
                variant="success"
                label="Success Checkbox"
                description="Status valid atau selesai"
              />
              <UiCheckbox
                v-model="checkWarning"
                variant="warning"
                label="Warning Checkbox"
                description="Aksen amber dengan kontras tinggi"
              />
              <UiCheckbox
                v-model="checkError"
                variant="error"
                label="Error Checkbox"
                description="Pilihan kritis atau perhatian"
              />
              <UiCheckbox
                :model-value="true"
                disabled
                label="Disabled Checkbox"
                description="State non-aktif terlindungi"
              />
            </div>

            <!-- Checkbox Sizes -->
            <div class="flex flex-wrap items-center gap-4 pt-1 text-xs text-base-content/70">
              <span class="font-semibold text-base-content/50">Ukuran:</span>
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-xs checkbox-primary" checked />
                <span>XS</span>
              </label>
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-sm checkbox-primary" checked />
                <span>SM (Default Table)</span>
              </label>
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-md checkbox-primary" checked />
                <span>MD</span>
              </label>
              <label class="inline-flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" class="checkbox checkbox-lg checkbox-primary" checked />
                <span>LG</span>
              </label>
            </div>
          </div>

          <!-- NEW: Currency & Percent Inputs -->
          <div class="pt-3 border-t border-base-300/70 space-y-3">
            <span class="text-xs font-bold text-primary block">
              Format Khusus: Currency &amp; Percentage (&lt;UiInputCurrency&gt; &amp; &lt;UiInputPercent&gt;)
            </span>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Currency with selector -->
              <UiInputCurrency
                v-model="demoCurrencyValue"
                v-model:currency="demoSelectedCurrency"
                label="Input Nilai Mata Uang (Dapat Ganti Valuta)"
                hint="Dapat memilih valuta (IDR, USD, EUR, SGD, JPY, GBP) dengan pemisah desimal otomatis"
              />

              <!-- Percentage input with slider -->
              <UiInputPercent
                v-model="demoPercentValue"
                label="Input Persentase Bunga / Rasio"
                hint="Terformat otomatis dengan simbol % dan slider penyesuaian instan"
                show-slider
                :min="0"
                :max="100"
              />
            </div>

            <!-- Preview Values State -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
              <div class="rounded-box border border-base-300 bg-base-200/50 p-2.5 flex items-center justify-between">
                <span class="text-base-content/70 font-sans">Raw Value (Number):</span>
                <span class="badge badge-primary font-bold">{{ demoCurrencyValue ?? 'null' }} ({{ demoSelectedCurrency }})</span>
              </div>
              <div class="rounded-box border border-base-300 bg-base-200/50 p-2.5 flex items-center justify-between">
                <span class="text-base-content/70 font-sans">Raw Value (Percent):</span>
                <span class="badge badge-secondary font-bold">{{ demoPercentValue ?? 'null' }}%</span>
              </div>
            </div>
          </div>

          <!-- Toggles -->
          <div class="pt-2 border-t border-base-300/70 flex flex-wrap items-center gap-6">
            <label class="inline-flex items-center gap-2.5 cursor-pointer text-xs font-semibold">
              <input v-model="togglePrimary" type="checkbox" class="toggle" />
              <span>Primary Toggle</span>
            </label>
            <label class="inline-flex items-center gap-2.5 cursor-pointer text-xs font-semibold">
              <input v-model="toggleSecondary" type="checkbox" class="toggle toggle-secondary" />
              <span>Secondary Toggle</span>
            </label>
            <label class="inline-flex items-center gap-2.5 cursor-pointer text-xs font-semibold">
              <input v-model="toggleAccent" type="checkbox" class="toggle toggle-accent" />
              <span>Accent Toggle</span>
            </label>
          </div>
        </div>
      </UiCard>

      <!-- Badges -->
      <UiCard
        title="8. Badges (.badge & <UiBadge>)"
        subtitle="Indikator status ringkas dengan opsi solid, soft pastel, outline, dan dot"
        accent-top="info"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap items-center gap-2.5">
            <UiBadge v-for="v in variants" :key="`badge-solid-${v}`" :variant="v" class="capitalize">
              {{ v }}
            </UiBadge>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <UiBadge
              v-for="v in variants.filter((x) => x !== 'neutral')"
              :key="`badge-soft-${v}`"
              :variant="v"
              soft
              dot
              class="capitalize"
            >
              {{ v }} status
            </UiBadge>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <UiBadge
              v-for="v in variants.filter((x) => x !== 'neutral')"
              :key="`badge-outline-${v}`"
              :variant="v"
              outline
              class="capitalize"
            >
              {{ v }} outline
            </UiBadge>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- 9. Date Picker & Rich Text Editor (WYSIWYG) -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <UiCard
        title="9. Interactive Date Picker (<UiDatePicker>)"
        subtitle="Kalender popup interaktif dengan navigasi bulan/tahun, tombol Hari Ini, dan format lokal"
        accent-top="primary"
      >
        <div class="space-y-4">
          <UiDatePicker
            v-model="demoDate"
            label="Pilih Tanggal Acara / Rilis (Dengan Pilihan Waktu)"
            hint="Klik untuk pilih tanggal, loncat bulan/tahun, dan atur jam"
            enable-time
          />

          <div class="rounded-box border border-base-300 bg-base-200/50 p-3.5 flex items-center justify-between text-xs">
            <span class="text-base-content/70 font-medium">Nilai ISO (v-model):</span>
            <span class="badge badge-primary font-mono">{{ demoDate || 'Kosong' }}</span>
          </div>
        </div>
      </UiCard>

      <div class="lg:col-span-2">
        <UiCard
          title="10. Rich Text Editor / WYSIWYG (<UiRichEditor>)"
          subtitle="Editor visual kaya fitur dengan toolbar pemformatan lengkap, penghitung kata, dan mode kode HTML"
          accent-top="secondary"
        >
          <UiRichEditor
            v-model="demoRichText"
            label="Konten Artikel / Dokumentasi"
            min-height="170px"
          />
        </UiCard>
      </div>
    </div>

    <!-- 11. File Upload Suite (3 Modes: File Preview, Drag & Drop, Multi-Photo Gallery) -->
    <UiCard
      title="11. File Upload Suite (<UiFileUpload> — 3 Mode Lengkap)"
      subtitle="Mendukung upload dengan daftar preview terupload, Drag & Drop Zone, serta Multi-Photo Gallery dengan lightbox"
      accent-top="accent"
    >
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Mode 1: Standard Button + Uploaded File Preview -->
        <div class="rounded-box border border-base-300 bg-base-200/25 p-4">
          <UiFileUpload
            v-model="singleUploadFiles"
            mode="file"
            label="A. Upload Tombol + Preview File Terupload"
            hint="Menampilkan nama, ukuran, progress bar, & status file"
          />
        </div>

        <!-- Mode 2: Drag & Drop Zone -->
        <div class="rounded-box border border-base-300 bg-base-200/25 p-4">
          <UiFileUpload
            v-model="dropzoneFiles"
            mode="dropzone"
            label="B. Upload Drag and Drop Zone"
            hint="Seret file apa saja ke area garis putus-putus"
          />
        </div>

        <!-- Mode 3: Multi-Photo Gallery Upload -->
        <div class="rounded-box border border-base-300 bg-base-200/25 p-4">
          <UiFileUpload
            v-model="multiPhotoFiles"
            mode="gallery"
            multiple
            label="C. Upload Banyak Foto Sekaligus (Gallery)"
            hint="Hover pada foto untuk preview ukuran penuh atau hapus"
          />
        </div>
      </div>
    </UiCard>

    <!-- 12. Wizard / Stepper & AI Model Card Selection -->
    <div class="space-y-6">
      <UiCard
        title="12. Multi-Step Form Wizard (<UiStepper>)"
        subtitle="Navigasi tahapan proses berurutan dengan status selesai, langkah aktif, dan tombol kontrol terintegrasi"
        accent-top="primary"
      >
        <UiStepper
          v-model="demoStepIndex"
          :steps="demoSteps"
          show-controls
          @finish="toast.success('Wizard Selesai!', 'Seluruh tahapan konfigurasi telah berhasil disimpan.')"
        >
          <template #default="{ currentStep, step }">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
              <div>
                <span class="badge badge-primary badge-sm mb-2">Tahap {{ currentStep + 1 }}</span>
                <h4 class="text-base font-extrabold text-base-content">{{ step?.title }}</h4>
                <p class="text-xs text-base-content/65 mt-1">
                  Ini adalah area konten dinamis untuk langkah <strong>{{ step?.title }}</strong> ({{ step?.subtitle }}).
                  Klik indikator langkah di atas atau tombol di bawah untuk berpindah tahap.
                </p>
              </div>
              <RouterLink to="/project-wizard" class="btn btn-soft btn-primary btn-sm shrink-0">
                Buka Halaman Demo Wizard Penuh
              </RouterLink>
            </div>
          </template>
        </UiStepper>
      </UiCard>

      <!-- Interactive Radio Card / Model Selection Card -->
      <UiCard
        title="Interactive Radio Card Selector (<UiRadioCard>)"
        subtitle="Pilihan kartu radio modern ala AI Model Selection dengan avatar icon, status check kustom, tag teknis, dan badge rekomendasi"
        accent-top="accent"
      >
        <div class="space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span class="text-xs font-semibold text-base-content/60">Pilih Mesin AI Utama</span>
              <p class="text-xs text-base-content/50">Digunakan pada agent reasoning engine dan pipeline otomatisasi</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-xs text-base-content/60">Model aktif:</span>
              <span class="badge badge-primary font-mono text-xs uppercase">{{ selectedAiModel }}</span>
            </div>
          </div>

          <UiRadioCard
            v-model="selectedAiModel"
            :options="aiModelOptions"
            :columns="4"
          />
        </div>
      </UiCard>
    </div>

    <!-- 13. Progress Bar & Spinners -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UiCard
        title="13. Progress Bars (<UiProgress>)"
        subtitle="Indikator progres dalam berbagai warna semantik, ukuran, serta animasi garis belang (striped)"
        accent-top="success"
      >
        <div class="space-y-4">
          <UiProgress :value="demoProgressValue" variant="primary" label="Primary Animated Striped" show-value striped animated />
          <UiProgress :value="88" variant="success" label="Success Completion" show-value size="sm" />
          <UiProgress :value="64" variant="secondary" label="Secondary Upload" show-value size="sm" />
          <UiProgress :value="45" variant="warning" label="Warning Storage Quota" show-value size="sm" striped />
          <UiProgress :value="28" variant="error" label="Error Threshold" show-value size="xs" />

          <div class="pt-2 flex items-center gap-2">
            <button type="button" class="btn btn-xs btn-outline" @click="demoProgressValue = Math.max(0, demoProgressValue - 15)">
              -15%
            </button>
            <button type="button" class="btn btn-xs btn-primary" @click="demoProgressValue = Math.min(100, demoProgressValue + 15)">
              +15%
            </button>
          </div>
        </div>
      </UiCard>

      <UiCard
        title="14. Loading Spinners (<UiSpinner>)"
        subtitle="3 gaya animasi pemuatan (Ring, Bouncing Dots, Pulse Ripple) dengan ukuran xs hingga xl"
        accent-top="info"
      >
        <div class="space-y-5">
          <div>
            <span class="text-[11px] font-bold text-base-content/50 block mb-2.5">
              Varian Warna (Ring Spinner)
            </span>
            <div class="flex flex-wrap items-center gap-5">
              <UiSpinner variant="primary" size="md" />
              <UiSpinner variant="secondary" size="md" />
              <UiSpinner variant="accent" size="md" />
              <UiSpinner variant="success" size="md" />
              <UiSpinner variant="warning" size="md" />
              <UiSpinner variant="error" size="md" />
              <UiSpinner variant="info" size="md" />
            </div>
          </div>

          <div class="pt-3 border-t border-base-300/70">
            <span class="text-[11px] font-bold text-base-content/50 block mb-2.5">
              Tipe & Label (Ring, Dots, Pulse)
            </span>
            <div class="flex flex-wrap items-center gap-6">
              <UiSpinner type="ring" variant="primary" size="md" label="Memuat data..." />
              <UiSpinner type="dots" variant="secondary" size="md" label="Menyinkronkan..." />
              <UiSpinner type="pulse" variant="accent" size="md" label="Menunggu sinyal..." />
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- 15. List & Timeline -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UiCard
        title="15. Structured List (<UiList>)"
        subtitle="Daftar item interaktif dengan ikon/avatar, subjudul, badge status, dan event klik"
        accent-top="secondary"
      >
        <UiList
          :items="demoListItems"
          @item-click="(item) => toast.info(item.title, item.subtitle)"
        />
      </UiCard>

      <UiCard
        title="16. Activity Timeline (<UiTimeline>)"
        subtitle="Linimasa vertikal untuk menampilkan log aktivitas, riwayat rilis, dan tahapan peristiwa"
        accent-top="primary"
      >
        <UiTimeline :items="demoTimelineItems" />
      </UiCard>
    </div>

    <!-- 17. Dropdown, Tooltip, Popover & Empty State -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <UiCard
        title="17. Dropdown, Tooltip & Popover"
        subtitle="Komponen floating overlay interaktif untuk menu aksi, petunjuk singkat, dan panel informasi"
        accent-top="warning"
      >
        <div class="space-y-6">
          <!-- Dropdowns -->
          <div>
            <span class="text-[11px] font-bold text-base-content/50 block mb-2.5">
              Dropdown Menu (&lt;UiDropdown&gt;)
            </span>
            <div class="flex flex-wrap items-center gap-3">
              <UiDropdown
                label="Menu Aksi Utama"
                variant="primary"
                size="sm"
                :items="demoDropdownItems"
                @select="(item) => toast.info('Dropdown Dipilih', `Anda memilih: ${item.label}`)"
              />
              <UiDropdown
                label="Opsi Lainnya"
                variant="soft"
                size="sm"
                :items="demoDropdownItems"
                @select="(item) => toast.info('Dropdown Dipilih', `Anda memilih: ${item.label}`)"
              />
            </div>
          </div>

          <!-- Tooltips -->
          <div class="pt-3 border-t border-base-300/70">
            <span class="text-[11px] font-bold text-base-content/50 block mb-2.5">
              Directional Tooltips (&lt;UiTooltip&gt;) — Arahkan Kursor
            </span>
            <div class="flex flex-wrap items-center gap-3">
              <UiTooltip text="Tooltip di bagian Atas (Top)" position="top" variant="neutral">
                <button type="button" class="btn btn-xs btn-outline">Hover Top</button>
              </UiTooltip>
              <UiTooltip text="Tooltip dengan warna Primary" position="bottom" variant="primary">
                <button type="button" class="btn btn-xs btn-soft btn-primary">Hover Bottom</button>
              </UiTooltip>
              <UiTooltip text="Tooltip di sebelah Kanan" position="right" variant="secondary">
                <button type="button" class="btn btn-xs btn-soft btn-secondary">Hover Right</button>
              </UiTooltip>
            </div>
          </div>

          <!-- Popover -->
          <div class="pt-3 border-t border-base-300/70">
            <span class="text-[11px] font-bold text-base-content/50 block mb-2.5">
              Rich Interactive Popover (&lt;UiPopover&gt;) — Klik Tombol
            </span>
            <div class="flex flex-wrap items-center gap-3">
              <UiPopover
                title="Informasi Cluster Server"
                subtitle="Region: ap-southeast-1 (Jakarta)"
                position="top"
              >
                <template #trigger>
                  <button type="button" class="btn btn-sm btn-secondary">
                    <HelpCircle class="h-4 w-4" />
                    Klik Buka Popover
                  </button>
                </template>
                <template #default="{ close }">
                  <div class="space-y-2.5">
                    <p>Server berjalan normal dengan beban CPU rata-rata <strong>24%</strong>.</p>
                    <UiProgress :value="24" variant="success" size="xs" />
                    <div class="flex justify-end pt-1">
                      <button type="button" class="btn btn-xs btn-primary" @click="close">
                        Tutup Panel
                      </button>
                    </div>
                  </div>
                </template>
              </UiPopover>
            </div>
          </div>
        </div>
      </UiCard>

      <UiCard
        title="18. Empty State (<UiEmptyState>)"
        subtitle="Tampilan placeholder bersih ketika daftar data, hasil pencarian, atau folder masih kosong"
        accent-top="error"
      >
        <UiEmptyState
          title="Belum Ada Dokumen Tersimpan"
          description="Mulai unggah dokumen proyek pertama Anda atau buat folder baru untuk mengelompokkan arsip tim."
          :icon="FolderPlus"
          variant="primary"
          compact
        >
          <template #actions>
            <UiButton
              variant="primary"
              size="sm"
              @click="toast.success('Folder Dibuat', 'Folder proyek baru berhasil disiapkan.')"
            >
              <template #icon-left>
                <FolderPlus class="h-4 w-4" />
              </template>
              Buat Folder Baru
            </UiButton>
          </template>
        </UiEmptyState>
      </UiCard>

      <!-- 19. Video Player Component -->
      <UiCard
        title="19. Video Player (<UiVideoPlayer>)"
        subtitle="Pemutar video kustom dengan kontrol scrubber, pengatur kecepatan putar (0.5x - 2x), volume, skip 10s, dan fullscreen"
        accent-top="primary"
        class="lg:col-span-2"
      >
        <div class="max-w-3xl mx-auto space-y-3">
          <UiVideoPlayer
            src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
            poster="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80"
            title="Tinkit Architecture & Interactive Demo (Big Buck Bunny Sample)"
          />
          <div class="flex flex-wrap items-center justify-between text-xs text-base-content/70 px-1 pt-1">
            <span>Mendukung keyboard space (play/pause), slider volume hover, dan overlay responsif.</span>
            <span class="badge badge-sm badge-outline font-mono">Aspect: 16/9</span>
          </div>
        </div>
      </UiCard>

      <!-- 20. Accordion Component -->
      <UiCard
        title="20. Accordion (<UiAccordion>)"
        subtitle="Komponen lipat konten dengan transisi CSS Grid, mode single/multiple expand, dan badge/icon"
        accent-top="secondary"
      >
        <div class="space-y-4">
          <div class="text-xs font-semibold text-base-content/70">
            Mode Single Expand (Default)
          </div>
          <UiAccordion
            v-model="activeAccordionId"
            :items="demoAccordionItems"
          />

          <div class="text-xs font-semibold text-base-content/70 pt-2">
            Mode Multiple Expand (Separated)
          </div>
          <UiAccordion
            v-model="activeMultiAccordionIds"
            :items="demoSeparatedAccordionItems"
            variant="separated"
            multiple
          />
        </div>
      </UiCard>

      <!-- 21. Carousel Component -->
      <UiCard
        title="21. Carousel (<UiCarousel>)"
        subtitle="Slider gambar/konten interaktif dengan tombol navigasi, indikator dot, swipe gesture mobile, dan thumbnails"
        accent-top="accent"
      >
        <div class="space-y-4">
          <UiCarousel
            v-model="activeSlideIndex"
            :slides="demoCarouselSlides"
            autoplay
            :interval="6000"
            show-thumbnails
          />
          <div class="flex items-center justify-between text-xs text-base-content/70 pt-1">
            <span>Slide aktif: <strong>#{{ activeSlideIndex + 1 }}</strong> dari {{ demoCarouselSlides.length }}</span>
            <span class="badge badge-xs badge-primary font-mono">Autoplay: Aktif (6s)</span>
          </div>
        </div>
      </UiCard>

      <!-- 22. Tabs Component (Attached variant & Pills) -->
      <UiCard
        title="22. Tabs with Attached Content (<UiTabs>)"
        subtitle="Pilihan tab yang menempel (attached) langsung dengan container kontennya, lengkap dengan varian underline & pills"
        accent-top="primary"
        class="lg:col-span-2"
      >
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Attached Tabs (Tab menyatu dengan box konten) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between text-xs font-semibold text-base-content/70">
              <span>Attached Variant (variant="attached")</span>
              <span class="badge badge-xs badge-primary">Menyatu dengan Konten</span>
            </div>

            <UiTabs
              v-model="attachedTab"
              :items="demoTabItems"
              variant="attached"
            >
              <template #code>
                <div class="font-mono text-xs space-y-2">
                  <div class="text-base-content/60">// Konfigurasi aplikasi frontend</div>
                  <pre class="bg-base-300/40 p-3 rounded-btn text-primary leading-relaxed overflow-x-auto">export const appConfig = {
  appName: 'Tinkit Admin',
  version: '0.4.0',
  themePreset: 'ocean',
  features: {
    attachedTabs: true,
    videoPlayer: true,
  }
}</pre>
                </div>
              </template>

              <template #env>
                <div class="font-mono text-xs space-y-2">
                  <div class="text-warning">// Environment Variables</div>
                  <pre class="bg-base-300/40 p-3 rounded-btn text-base-content/90 leading-relaxed overflow-x-auto">VITE_APP_BASE_URL=https://api.tinkit.example
VITE_ENABLE_ANALYTICS=true
VITE_STORAGE_DRIVER=s3
VITE_AUTH_PROVIDER=oauth2</pre>
                </div>
              </template>

              <template #output>
                <div class="text-xs space-y-2">
                  <div class="text-base-content/70">Ringkasan berkas hasil build aset terdistribusi:</div>
                  <ul class="space-y-1 font-mono text-[11px] text-base-content/85">
                    <li class="flex justify-between py-1 border-b border-base-300/60">
                      <span>dist/index.html</span>
                      <span class="text-success font-semibold">0.98 kB</span>
                    </li>
                    <li class="flex justify-between py-1 border-b border-base-300/60">
                      <span>dist/assets/index.js</span>
                      <span class="text-info font-semibold">165.3 kB</span>
                    </li>
                    <li class="flex justify-between py-1">
                      <span>dist/assets/index.css</span>
                      <span class="text-accent font-semibold">102.1 kB</span>
                    </li>
                  </ul>
                </div>
              </template>
            </UiTabs>
          </div>

          <!-- Other Variants: Underline & Pills -->
          <div class="space-y-6">
            <div class="space-y-3">
              <div class="text-xs font-semibold text-base-content/70">
                Underline Variant (variant="underline")
              </div>
              <UiTabs
                v-model="pillsTab"
                :items="demoPillTabs"
                variant="underline"
              >
                <template #profile>
                  <p class="text-xs text-base-content/80 leading-relaxed">
                    Kelola preferensi akun, foto profil pengguna, serta informasi dasar organisasi Anda.
                  </p>
                </template>
                <template #notifications>
                  <p class="text-xs text-base-content/80 leading-relaxed">
                    Pengaturan pemberitahuan email, push notifikasi web browser, dan alert audit keamanan server.
                  </p>
                </template>
                <template #integrations>
                  <p class="text-xs text-base-content/80 leading-relaxed">
                    Daftar webhook keluar (outbound webhooks) yang dikonfigurasi untuk bot Discord dan Slack tim.
                  </p>
                </template>
              </UiTabs>
            </div>

            <div class="space-y-3">
              <div class="text-xs font-semibold text-base-content/70">
                Boxed Segmented Variant (variant="boxed")
              </div>
              <UiTabs
                v-model="pillsTab"
                :items="demoPillTabs"
                variant="boxed"
              >
                <template #profile>
                  <div class="rounded-btn bg-base-200/50 p-3 text-xs text-base-content/70 border border-base-300">
                    Tab saat ini: <strong class="text-primary">Profil Akun</strong>
                  </div>
                </template>
                <template #notifications>
                  <div class="rounded-btn bg-base-200/50 p-3 text-xs text-base-content/70 border border-base-300">
                    Tab saat ini: <strong class="text-primary">Notifikasi (3 Tertunda)</strong>
                  </div>
                </template>
                <template #integrations>
                  <div class="rounded-btn bg-base-200/50 p-3 text-xs text-base-content/70 border border-base-300">
                    Tab saat ini: <strong class="text-primary">Webhook API</strong>
                  </div>
                </template>
              </UiTabs>
            </div>
          </div>
        </div>
      </UiCard>

      <!-- 23. Syntax Highlighted Code Block Component -->
      <UiCard
        title="23. Code Block (<UiCodeBlock>)"
        subtitle="Syntax highlighter modern berbasis Highlight.js yang mendukung berbagai bahasa pemrograman, query database SQL, dan Markdown"
        accent-top="secondary"
        class="lg:col-span-2"
      >
        <div class="space-y-4">
          <!-- Language selector pills -->
          <div class="flex flex-wrap items-center justify-between gap-3 pb-1 border-b border-[var(--border)]">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-xs font-semibold text-base-content/70 mr-1 select-none">Pilih Contoh:</span>
              <button
                type="button"
                class="btn btn-xs h-7 px-3 rounded-btn font-mono"
                :class="activeCodeLang === 'sql' ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
                :aria-pressed="activeCodeLang === 'sql'"
                @click="activeCodeLang = 'sql'"
              >
                SQL / Database
              </button>
              <button
                type="button"
                class="btn btn-xs h-7 px-3 rounded-btn font-mono"
                :class="activeCodeLang === 'typescript' ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
                :aria-pressed="activeCodeLang === 'typescript'"
                @click="activeCodeLang = 'typescript'"
              >
                TypeScript
              </button>
              <button
                type="button"
                class="btn btn-xs h-7 px-3 rounded-btn font-mono"
                :class="activeCodeLang === 'python' ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
                :aria-pressed="activeCodeLang === 'python'"
                @click="activeCodeLang = 'python'"
              >
                Python FastAPI
              </button>
              <button
                type="button"
                class="btn btn-xs h-7 px-3 rounded-btn font-mono"
                :class="activeCodeLang === 'markdown' ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
                :aria-pressed="activeCodeLang === 'markdown'"
                @click="activeCodeLang = 'markdown'"
              >
                Markdown (GFM)
              </button>
            </div>

            <div class="flex items-center gap-2 text-xs text-base-content/60">
              <span class="badge badge-xs badge-success">Copy Clipboard</span>
              <span class="badge badge-xs badge-info">Line Highlight</span>
              <span class="badge badge-xs badge-outline">Line Numbers</span>
            </div>
          </div>

          <!-- CodeBlock Render -->
          <UiCodeBlock
            :key="activeCodeLang"
            :code="codeSnippets[activeCodeLang].code"
            :language="codeSnippets[activeCodeLang].language"
            :filename="codeSnippets[activeCodeLang].filename"
            :highlight-lines="codeSnippets[activeCodeLang].highlightLines"
            max-height="340px"
          />
        </div>
      </UiCard>

      <!-- 24. Avatar Component (<UiAvatar>) -->
      <UiCard
        title="24. Avatar System (<UiAvatar>)"
        subtitle="Avatar profil fleksibel dengan fallback inisial otomatis, ragam ukuran (xs s/d 2xl), bentuk, border ring, dan status dot online/busy/away/offline"
        accent-top="primary"
      >
        <div class="space-y-6">
          <!-- Size Progression -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-base-content/70">
              Ukuran (xs, sm, md, lg, xl, 2xl)
            </div>
            <div class="flex flex-wrap items-end gap-3.5 pt-1">
              <UiAvatar size="xs" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" name="Arif" status="online" />
              <UiAvatar size="sm" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80" name="Sarah" status="away" />
              <UiAvatar size="md" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" name="Budi" status="busy" bordered />
              <UiAvatar size="lg" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80" name="Laras" status="online" />
              <UiAvatar size="xl" src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80" name="Dimas" status="offline" />
            </div>
          </div>

          <!-- Fallback Initials & Shapes -->
          <div class="space-y-2">
            <div class="text-xs font-semibold text-base-content/70">
              Fallback Inisial Huruf & Bentuk (Circle, Rounded, Square)
            </div>
            <div class="flex flex-wrap items-center gap-3 pt-1">
              <UiAvatar name="Arif Pratama" variant="primary" shape="circle" size="md" status="online" />
              <UiAvatar name="Larasati Dewi" variant="secondary" shape="rounded" size="md" status="away" />
              <UiAvatar name="Bima Sakti" variant="accent" shape="square" size="md" status="busy" />
              <UiAvatar name="Fajar Nugroho" variant="info" shape="rounded" size="md" />
              <UiAvatar name="Eka Saputra" variant="success" shape="circle" size="md" />
              <UiAvatar name="Wulan Sari" variant="warning" shape="circle" size="md" />
              <UiAvatar name="Rian Hidayat" variant="error" shape="rounded" size="md" />
            </div>
          </div>
        </div>
      </UiCard>

      <UiCard
        title="25. Chat Message & Auto-Scrolling (<UiChatMessage> & <UiMessageScroll>)"
        subtitle="Sistem percakapan Chat dengan auto-scrolling ke bawah, floating scroll button jika scroll ke atas, status dibaca, dan avatar peer"
        accent-top="secondary"
        class="lg:col-span-2"
      >
        <div class="max-w-2xl mx-auto rounded-box border border-[var(--border)] bg-base-100/70 overflow-hidden shadow-md flex flex-col h-[460px]">
          <!-- Chat Feed Header -->
          <div class="p-3.5 border-b border-[var(--border)] bg-[var(--surface-raised)] flex items-center justify-between shrink-0">
            <div class="flex items-center gap-2.5">
              <UiAvatar
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80"
                name="Sarah Jenkins"
                status="online"
                size="sm"
              />
              <div>
                <h4 class="text-xs font-bold text-base-content leading-tight">Sarah Jenkins</h4>
                <p class="text-[10px] text-success font-medium">Aktif Sekarang</p>
              </div>
            </div>

          </div>

          <!-- Message Scrolling Area -->
          <div class="flex-1 min-h-0 bg-base-200/40 relative">
            <UiMessageScroll ref="messageScrollRef">
              <UiChatMessage
                v-for="msg in demoChatMessages"
                :key="msg.id"
                :role="msg.role"
                :author="msg.author"
                :timestamp="msg.timestamp"
                :status="msg.status"
                :content="msg.content"
              />
            </UiMessageScroll>
          </div>

          <!-- Interactive Input Form -->
          <form
            class="p-2.5 border-t border-[var(--border)] bg-[var(--surface-raised)] flex items-center gap-2 shrink-0"
            @submit.prevent="sendDemoChatMessage"
          >
            <input
              v-model="chatInputText"
              type="text"
              placeholder="Tulis pesan Anda lalu tekan Enter..."
              class="input input-sm flex-1 bg-base-100 border-base-300 focus:border-primary text-xs"
            />
            <button
              type="submit"
              class="btn btn-sm btn-primary gap-1.5 h-8 px-3 shrink-0"
              :disabled="!chatInputText.trim()"
            >
              <Send class="h-3.5 w-3.5" />
              <span class="hidden sm:inline text-xs">Kirim</span>
            </button>
          </form>
        </div>
      </UiCard>

      <!-- 26. JSON Viewer Component (<UiJsonViewer>) -->
      <UiCard
        title="26. Interactive JSON Viewer (<UiJsonViewer>)"
        subtitle="Penampil struktur pohon JSON interaktif dengan pencarian key/value real-time, expand/collapse per node, salin path, dan mode Raw JSON"
        accent-top="primary"
        class="lg:col-span-2"
      >
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[var(--border)]">
            <div class="flex flex-wrap items-center gap-1.5">
              <span class="text-xs font-semibold text-base-content/70 mr-1">Dataset Contoh:</span>
              <button
                type="button"
                class="btn btn-xs h-7 px-3 rounded-btn font-mono"
                :class="activeJsonPreset === 'cluster' ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
                @click="activeJsonPreset = 'cluster'"
              >
                Cluster Telemetry
              </button>
              <button
                type="button"
                class="btn btn-xs h-7 px-3 rounded-btn font-mono"
                :class="activeJsonPreset === 'OrderPayload' ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
                @click="activeJsonPreset = 'OrderPayload'"
              >
                Webhook Invoice
              </button>
              <button
                type="button"
                class="btn btn-xs h-7 px-3 rounded-btn font-mono"
                :class="activeJsonPreset === 'themeConfig' ? 'btn-active' : 'btn-ghost text-[var(--text-muted)]'"
                @click="activeJsonPreset = 'themeConfig'"
              >
                Theme Tokens
              </button>
            </div>

            <div class="flex items-center gap-3">
              <UiCheckbox
                v-model="showJsonTypes"
                label="Tampilkan Tipe Data"
                size="sm"
                variant="primary"
              />
            </div>
          </div>

          <UiJsonViewer
            :key="activeJsonPreset"
            :data="jsonPresets[activeJsonPreset].data"
            :title="jsonPresets[activeJsonPreset].title"
            :default-expand-depth="2"
            :show-data-types="showJsonTypes"
            max-height="380px"
            @copy="toast.info('Disalin ke Clipboard', 'Data JSON berhasil disalin.')"
          />
        </div>
      </UiCard>

      <!-- 27. File Tree Explorer Component (<UiFileTree>) -->
      <UiCard
        title="27. File Tree Explorer (<UiFileTree>)"
        subtitle="Hierarki direktori & berkas dengan deteksi ikon ekstensi otomatis, pencarian filter folder, garis panduan indentasi, dan navigasi keyboard"
        accent-top="accent"
        class="lg:col-span-2"
      >
        <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-5 items-start">
          <UiFileTree
            v-model="selectedTreeFileId"
            :items="demoFileTreeItems"
            :default-expanded-ids="['folder-src', 'folder-components', 'folder-ui', 'folder-views']"
            title="tinkit-admin-template"
            max-height="380px"
            @select="handleTreeSelect"
          />

          <div class="rounded-box border border-[var(--border)] bg-[var(--surface-raised)] p-4 space-y-4">
            <div class="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
              <div>
                <p class="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  Inspector Node Terpilih
                </p>
                <h4 class="mt-0.5 font-mono text-sm font-bold text-base-content">
                  {{ selectedTreeItemDetail.name }}
                </h4>
              </div>
              <UiBadge
                :variant="selectedTreeItemDetail.type === 'folder' ? 'warning' : 'primary'"
                size="sm"
                soft
              >
                {{ selectedTreeItemDetail.type === 'folder' ? 'Folder Direktori' : 'Berkas' }}
              </UiBadge>
            </div>

            <div class="space-y-2.5 text-xs">
              <div class="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span class="text-[var(--text-muted)]">Path Lengkap</span>
                <code class="font-mono text-primary font-semibold">{{ selectedTreeFilePath }}</code>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span class="text-[var(--text-muted)]">Node ID</span>
                <code class="font-mono text-base-content">{{ selectedTreeItemDetail.id }}</code>
              </div>
              <div
                v-if="selectedTreeItemDetail.size"
                class="flex items-center justify-between py-1 border-b border-[var(--border)]"
              >
                <span class="text-[var(--text-muted)]">Ukuran Berkas</span>
                <span class="font-mono font-semibold text-base-content">{{ selectedTreeItemDetail.size }}</span>
              </div>
              <div
                v-if="selectedTreeItemDetail.children"
                class="flex items-center justify-between py-1 border-b border-[var(--border)]"
              >
                <span class="text-[var(--text-muted)]">Jumlah Sub-Item</span>
                <span class="font-mono font-semibold text-base-content">
                  {{ selectedTreeItemDetail.children.length }} item langsung
                </span>
              </div>
            </div>

            <div class="rounded-btn bg-base-100 border border-[var(--border)] p-3 text-xs text-[var(--text-muted)] leading-relaxed">
              Gunakan kolom pencarian di atas pohon direktori untuk memfilter nama berkas secara instan, atau gunakan tombol panah keyboard (<kbd class="font-mono text-base-content">↑</kbd> <kbd class="font-mono text-base-content">↓</kbd> <kbd class="font-mono text-base-content">←</kbd> <kbd class="font-mono text-base-content">→</kbd>) saat baris fokus.
            </div>
          </div>
        </div>
      </UiCard>
    </div>

    <!-- Interactive Demo Modal -->
    <UiModal
      v-model="demoModalOpen"
      title="Contoh Dialog Modal Tinkit"
      subtitle="Mendukung penutupan via tombol Esc, klik backdrop, dan kustomisasi penuh"
    >
      <div class="space-y-4 text-sm text-base-content/80">
        <p>
          Modal ini dibangun menggunakan komponen <code class="font-mono text-primary">&lt;UiModal&gt;</code>
          dan otomatis mengikuti kelengkungan sudut (<code class="font-mono">--rounded-box</code>) serta
          palet warna dari tema <strong>{{ themeStore.currentPreset.name }}</strong>.
        </p>
        <div class="rounded-btn bg-primary/10 border border-primary/20 p-3.5 flex items-center gap-3">
          <Bell class="h-5 w-5 text-primary shrink-0" />
          <span class="text-xs font-medium text-base-content">
            Anda dapat menggunakan modal ini untuk form konfirmasi, pratinjau detail, maupun pengaturan cepat.
          </span>
        </div>
      </div>

      <template #footer="{ close }">
        <UiButton variant="ghost" size="sm" @click="close">Batal</UiButton>
        <UiButton variant="primary" size="sm" @click="close">
          <template #icon-left>
            <Check class="h-4 w-4" />
          </template>
          Mengerti &amp; Tutup
        </UiButton>
      </template>
    </UiModal>
  </div>
</template>
