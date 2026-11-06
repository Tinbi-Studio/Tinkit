<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useToast } from '@/stores/toast'
import {
  Rocket,
  Layers,
  Users,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Send,
  Sparkles,
  Cpu,
  Boxes,
  Zap,
} from 'lucide-vue-next'
import UiStepper from '@/components/ui/UiStepper.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiAlert from '@/components/ui/UiAlert.vue'
import UiRadioCard, { type RadioCardOption } from '@/components/ui/UiRadioCard.vue'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const currentStep = ref(Number(route.query.step) || 0)

const steps = [
  { id: 'info', title: 'Informasi Dasar', subtitle: 'Identitas & jadwal', icon: Rocket },
  { id: 'stack', title: 'Arsitektur & Stack', subtitle: 'Teknologi & skala', icon: Layers },
  { id: 'team', title: 'Tim & Dokumen', subtitle: 'Kolaborator & berkas', icon: Users },
  { id: 'review', title: 'Tinjau & Rilis', subtitle: 'Konfirmasi akhir', icon: CheckCircle2 },
]

// Form State across steps
const projectForm = ref({
  name: 'Tinkit Cloud Console v2',
  code: 'TNK-2026',
  category: 'saas',
  priority: 'high',
  targetDate: '2026-08-15',
  description: '<p>Platform manajemen infrastruktur terpusat dengan pemantauan metrik <strong>real-time</strong> dan automasi deployment multi-region.</p>',
  architecture: 'microservices',
  cloudProvider: 'aws',
  techTags: ['Vue 3', 'TypeScript', 'Go', 'PostgreSQL', 'Docker', 'Kubernetes'],
  budgetRange: '150 - 300 Juta IDR',
  leadEmail: 'arif.budiman@tinkit.example',
  members: ['rina.kartika@tinkit.example', 'dimas.pratama@tinkit.example'],
  enableCiCd: true,
  enableAuditLog: true,
  files: [] as UploadedFileItem[],
})

const categoryOptions = [
  { label: 'Enterprise SaaS Platform', value: 'saas', description: 'Aplikasi web multi-tenant berbasis langganan' },
  { label: 'Internal Admin & CRM', value: 'crm', description: 'Dashboard operasional dan analitik internal' },
  { label: 'Fintech & Payment Gateway', value: 'fintech', description: 'Sistem transaksi keuangan berkeamanan tinggi' },
  { label: 'AI & Data Pipeline', value: 'ai', description: 'Pemrosesan data skala besar dan inferensi model' },
]

const priorityOptions = [
  { label: 'Tinggi (Critical Launch)', value: 'high' },
  { label: 'Menengah (Standard Q3)', value: 'medium' },
  { label: 'Rendah (Eksplorasi R&D)', value: 'low' },
]

const cloudOptions = [
  { label: 'Amazon Web Services (AWS Jakarta)', value: 'aws', description: 'ap-southeast-3 (Jakarta Region)' },
  { label: 'Google Cloud Platform (GCP)', value: 'gcp', description: 'asia-southeast2 (Jakarta Region)' },
  { label: 'Alibaba Cloud Indonesia', value: 'aliyun', description: 'Data center lokal terakreditasi' },
  { label: 'On-Premise / Private Cloud', value: 'onprem', description: 'Infrastruktur server mandiri' },
]

const architectureOptions: RadioCardOption[] = [
  {
    value: 'microservices',
    title: 'Microservices Mesh',
    subtitle: 'Decoupled Service Cluster',
    description: 'Layanan terdistribusi dengan skalabilitas independen, isolasi domain ketat, dan failover otomatis.',
    icon: Boxes,
    badge: 'Enterprise',
    badgeVariant: 'primary',
    tags: ['gRPC', 'Docker', 'K8s'],
    meta: '< 15ms Latency',
    recommended: true,
  },
  {
    value: 'modular-monolith',
    title: 'Modular Monolith',
    subtitle: 'High Velocity Architecture',
    description: 'Basis kode tunggal berstruktur modular dengan kecepatan rilis tinggi dan kompleksitas operasi terendah.',
    icon: Cpu,
    badge: 'Popular',
    badgeVariant: 'info',
    tags: ['Go / Node', 'Single Binary'],
    meta: 'Low Ops Cost',
  },
  {
    value: 'serverless',
    title: 'Serverless Edge',
    subtitle: 'Event-driven Scale-to-Zero',
    description: 'Eksekusi berbasis fungsi terdistribusi di edge network tanpa perlu konfigurasi atau patching VM server.',
    icon: Zap,
    badge: 'Ultra Fast',
    badgeVariant: 'warning',
    tags: ['Edge Workers', 'Zero-Idle'],
    meta: 'Global Edge',
  },
]

const techSuggestions = [
  'Vue 3',
  'TypeScript',
  'Tailwind CSS',
  'Go',
  'Rust',
  'Node.js',
  'PostgreSQL',
  'Redis',
  'Kafka',
  'Docker',
  'Kubernetes',
  'Terraform',
]

const memberSuggestions = [
  'rina.kartika@tinkit.example',
  'dimas.pratama@tinkit.example',
  'nadia.putri@tinkit.example',
  'fajar.nugroho@tinkit.example',
  'siti.aminah@tinkit.example',
]

function nextStep() {
  if (currentStep.value === 0 && !projectForm.value.name.trim()) {
    toast.error('Nama Proyek Wajib Diisi', 'Silakan masukkan nama proyek sebelum melanjutkan.')
    return
  }
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function prevStep() {
  if (currentStep.value > 0) {
    currentStep.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function submitProject() {
  toast.success(
    'Proyek Berhasil Dibuat!',
    `Ruang kerja "${projectForm.value.name}" (${projectForm.value.code}) siap digunakan.`,
  )
  router.push('/')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h4 class="text-xl font-bold text-[var(--text)]">Create Project Wizard</h4>
        <p class="mt-0.5 text-sm text-[var(--text-muted)]">
          Inisialisasi proyek enterprise baru melalui panduan bertahap yang terstruktur.
        </p>
      </div>
      <span class="badge badge-soft badge-primary gap-1.5 px-3 py-1 text-xs font-medium self-start sm:self-auto">
        <Sparkles class="h-3.5 w-3.5" />
        Step {{ currentStep + 1 }} of {{ steps.length }}
      </span>
    </div>

    <!-- Unified Tinkit Form Wizard Card (Stepper Header + Active Form Body + Footer) -->
    <div class="card overflow-visible">
      <!-- Top Horizontal Stepper Header -->
      <div class="rounded-t-box border-b border-[var(--border)] bg-[var(--surface-2)] p-5 sm:px-6">
        <UiStepper v-model="currentStep" :steps="steps" clickable />
      </div>

      <!-- Step Content Body -->
      <div class="p-6 sm:p-8">
        <!-- STEP 1: Informasi Dasar -->
        <div v-if="currentStep === 0" class="space-y-6">
          <div class="border-b border-[var(--border)] pb-3">
            <h5 class="card-title">1. Informasi Dasar Proyek</h5>
            <p class="card-subtitle mt-0.5">Tentukan nama, kode identifikasi, kategori, serta jadwal target rilis</p>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div class="form-control sm:col-span-2">
              <label class="label"><span class="label-text">Nama Proyek <span class="text-error">*</span></span></label>
              <input
                v-model="projectForm.name"
                type="text"
                class="input"
                placeholder="Contoh: Tinkit Cloud Console v2"
              />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Kode Proyek</span></label>
              <input
                v-model="projectForm.code"
                type="text"
                class="input font-mono uppercase"
                placeholder="TNK-2026"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <UiSelect
              v-model="projectForm.category"
              :options="categoryOptions"
              label="Kategori Produk"
            />
            <UiSelect
              v-model="projectForm.priority"
              :options="priorityOptions"
              label="Prioritas Eksekusi"
            />
            <UiDatePicker
              v-model="projectForm.targetDate"
              label="Target Rilis Produksi"
            />
          </div>

          <UiRichEditor
            v-model="projectForm.description"
            label="Deskripsi & Ruang Lingkup Proyek"
            placeholder="Jelaskan objektif utama dan hasil yang diharapkan..."
          />
        </div>

        <!-- STEP 2: Arsitektur & Stack -->
        <div v-else-if="currentStep === 1" class="space-y-6">
          <div class="border-b border-[var(--border)] pb-3">
            <h5 class="card-title">2. Arsitektur & Stack Teknologi</h5>
            <p class="card-subtitle mt-0.5">Pilih pola arsitektur sistem, penyedia cloud, serta pustaka teknologi</p>
          </div>

          <!-- Architecture Radio Cards (Modern AI Model Selection Style) -->
          <div class="form-control space-y-2">
            <div class="flex items-center justify-between">
              <label class="label p-0"><span class="label-text font-semibold">Pola Fondasi Arsitektur</span></label>
              <span class="text-xs text-[var(--text-muted)]">Pilih pola sistem yang paling sesuai kebutuhan throughput</span>
            </div>
            <UiRadioCard
              v-model="projectForm.architecture"
              :options="architectureOptions"
              :columns="3"
            />
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 pt-2">
            <UiSelect
              v-model="projectForm.cloudProvider"
              :options="cloudOptions"
              label="Penyedia Cloud & Region"
            />
            <div class="form-control">
              <label class="label"><span class="label-text">Estimasi Alokasi Anggaran</span></label>
              <input v-model="projectForm.budgetRange" type="text" class="input" />
            </div>
          </div>

          <div class="pt-1">
            <UiSelectTag
              v-model="projectForm.techTags"
              :options="techSuggestions"
              label="Tech Stack & Infrastruktur"
              placeholder="Tambah teknologi (contoh: Vue 3, Docker)..."
              :max-tags="10"
            />
          </div>
        </div>

        <!-- STEP 3: Tim & Dokumen -->
        <div v-else-if="currentStep === 2" class="space-y-6">
          <div class="border-b border-[var(--border)] pb-3">
            <h5 class="card-title">3. Tim Kolaborator & Dokumen</h5>
            <p class="card-subtitle mt-0.5">Tentukan penanggung jawab teknis dan unggah dokumen spesifikasi (PRD/RFC)</p>
          </div>

          <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div class="form-control">
              <label class="label"><span class="label-text">Email Technical Lead</span></label>
              <input v-model="projectForm.leadEmail" type="email" class="input" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Otomasi & Kepatuhan</span></label>
              <div class="flex flex-col gap-3 rounded-box border border-[var(--border)] p-3.5 bg-[var(--surface-input)]">
                <label class="flex cursor-pointer items-center justify-between text-xs font-medium text-[var(--text)]">
                  <span>Aktifkan Pipeline CI/CD Otomatis</span>
                  <input v-model="projectForm.enableCiCd" type="checkbox" class="toggle toggle-primary toggle-sm" />
                </label>
                <label class="flex cursor-pointer items-center justify-between text-xs font-medium text-[var(--text)]">
                  <span>Rekam Audit Log Keamanan (ISO 27001)</span>
                  <input v-model="projectForm.enableAuditLog" type="checkbox" class="toggle toggle-primary toggle-sm" />
                </label>
              </div>
            </div>
          </div>

          <UiSelectTag
            v-model="projectForm.members"
            :options="memberSuggestions"
            label="Undang Anggota Tim (Email)"
            placeholder="Ketik email anggota lalu tekan Enter..."
          />

          <UiFileUpload
            v-model="projectForm.files"
            label="Lampiran Dokumen Arsitektur / PRD"
            accept=".pdf,.doc,.docx,image/*"
            :max-size-mb="10"
            hint="Unggah diagram arsitektur, PDF spesifikasi, atau mockup UI"
          />
        </div>

        <!-- STEP 4: Tinjau & Rilis -->
        <div v-else-if="currentStep === 3" class="space-y-6">
          <div class="border-b border-[var(--border)] pb-3">
            <h5 class="card-title">4. Tinjau Konfigurasi & Rilis Proyek</h5>
            <p class="card-subtitle mt-0.5">Periksa kembali seluruh parameter sebelum menginisialisasi repositori dan ruang kerja</p>
          </div>

          <UiAlert
            variant="success"
            title="Siap Diinisialisasi"
          >
            Seluruh parameter wajib telah terpenuhi. Sistem akan otomatis membuat repositori Git dan
            kanal notifikasi tim.
          </UiAlert>

          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="rounded-box border border-[var(--border)] bg-[var(--surface-input)] p-4 space-y-2.5">
              <h4 class="text-xs font-semibold text-[var(--text-faint)]">
                Identitas Proyek
              </h4>
              <div class="text-sm space-y-1.5 text-[var(--text)]">
                <p><span class="text-[var(--text-muted)]">Nama:</span> <strong class="font-semibold">{{ projectForm.name }}</strong></p>
                <p><span class="text-[var(--text-muted)]">Kode:</span> <span class="badge badge-soft badge-primary text-xs font-mono">{{ projectForm.code }}</span></p>
                <p><span class="text-[var(--text-muted)]">Target Rilis:</span> {{ projectForm.targetDate || '-' }}</p>
                <p><span class="text-[var(--text-muted)]">Estimasi Anggaran:</span> {{ projectForm.budgetRange }}</p>
              </div>
            </div>

            <div class="rounded-box border border-[var(--border)] bg-[var(--surface-input)] p-4 space-y-2.5">
              <h4 class="text-xs font-semibold text-[var(--text-faint)]">
                Infrastruktur & Tim
              </h4>
              <div class="text-sm space-y-1.5 text-[var(--text)]">
                <p><span class="text-[var(--text-muted)]">Arsitektur:</span> <strong class="capitalize font-semibold">{{ projectForm.architecture }}</strong></p>
                <p><span class="text-[var(--text-muted)]">Tech Lead:</span> {{ projectForm.leadEmail }}</p>
                <p><span class="text-[var(--text-muted)]">Anggota Tim:</span> {{ projectForm.members.length }} kolaborator</p>
                <p><span class="text-[var(--text-muted)]">Berkas Lampiran:</span> {{ projectForm.files.length }} file</p>
              </div>
            </div>
          </div>

          <div class="rounded-box border border-[var(--border)] p-4 bg-[var(--surface-input)]">
            <h4 class="text-xs font-semibold text-[var(--text-faint)] mb-2.5">
              Tech Stack Terpilih
            </h4>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="tag in projectForm.techTags"
                :key="tag"
                class="badge badge-soft badge-primary px-2.5 py-0.5 text-xs font-medium"
              >
                {{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation Footer -->
      <div class="rounded-b-box flex items-center justify-between border-t border-[var(--border)] bg-[var(--surface-1)] px-6 py-4">
        <button
          type="button"
          class="btn btn-outline btn-sm gap-2"
          :disabled="currentStep === 0"
          @click="prevStep"
        >
          <ArrowLeft class="h-4 w-4" />
          Previous
        </button>

        <button
          v-if="currentStep < steps.length - 1"
          type="button"
          class="btn btn-primary btn-sm gap-2"
          @click="nextStep"
        >
          Next
          <ArrowRight class="h-4 w-4" />
        </button>

        <button
          v-else
          type="button"
          class="btn btn-success btn-sm gap-2"
          @click="submitProject"
        >
          <Send class="h-4 w-4" />
          Submit & Launch Project
        </button>
      </div>
    </div>
  </div>
</template>
