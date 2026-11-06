<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useToast } from '@/stores/toast'
import {
  Eye,
  EyeOff,
  Sun,
  Moon,
  Palette,
  TrendingUp,
  ShoppingCart,
  Mail,
  Lock,
  User,
  ShieldCheck,
  Check,
} from 'lucide-vue-next'
import ThemeCustomizerDrawer from '@/components/layout/ThemeCustomizerDrawer.vue'
import AppBrand from '@/components/brand/AppBrand.vue'
import UiInput from '@/components/ui/UiInput.vue'
import UiCheckbox from '@/components/ui/UiCheckbox.vue'
import UiButton from '@/components/ui/UiButton.vue'

const router = useRouter()
const themeStore = useThemeStore()
const toast = useToast()

const isRegister = ref(false)
const showPassword = ref(false)
const loading = ref(false)

const form = ref({
  name: '',
  email: 'arif.budiman@tinkit.example',
  password: 'Password123!',
  remember: true,
})

const errors = ref({
  name: '',
  email: '',
  password: '',
})

const passwordChecks = computed(() => [
  { label: 'Minimal 8 karakter', valid: form.value.password.length >= 8 },
  { label: 'Huruf besar & kecil', valid: /[a-z]/.test(form.value.password) && /[A-Z]/.test(form.value.password) },
  { label: 'Mengandung angka', valid: /\d/.test(form.value.password) },
])

function validate(): boolean {
  errors.value = { name: '', email: '', password: '' }

  if (isRegister.value && !form.value.name.trim()) {
    errors.value.name = 'Nama lengkap wajib diisi.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Masukkan alamat email yang valid.'
  }
  if (form.value.password.length < 8) {
    errors.value.password = 'Kata sandi minimal 8 karakter.'
  }

  return !errors.value.name && !errors.value.email && !errors.value.password
}

function handleSubmit() {
  if (!validate()) return

  loading.value = true
  setTimeout(() => {
    loading.value = false
    toast.success(
      isRegister.value ? 'Registrasi Berhasil!' : 'Selamat Datang Kembali!',
      `Anda masuk sebagai ${form.value.email}`,
    )
    router.push('/')
  }, 500)
}

function socialLogin(provider: string) {
  toast.info(`Masuk dengan ${provider}`, 'Demo template: integrasi OAuth belum diaktifkan.')
}

function toggleMode() {
  isRegister.value = !isRegister.value
  errors.value = { name: '', email: '', password: '' }
}
</script>

<template>
  <div class="relative min-h-screen flex bg-base-100 text-base-content">
    <!-- Top-left Brand Logo (Shared across Cover & Form) -->
    <RouterLink
      to="/"
      class="fixed left-6 top-6 z-30 flex items-center group"
      aria-label="Tinkit dashboard"
    >
      <AppBrand size="md" />
    </RouterLink>

    <!-- Floating Top-Right Theme Controls -->
    <div class="fixed right-6 top-6 z-30 flex items-center gap-2">
      <button
        class="btn btn-sm btn-ghost bg-base-100/80 backdrop-blur border border-base-300/80"
        @click="themeStore.toggleDarkLight()"
      >
        <Sun v-if="themeStore.isDark" class="h-4 w-4 text-warning" />
        <Moon v-else class="h-4 w-4" />
      </button>
      <button
        class="btn btn-sm btn-primary gap-1.5"
        @click="themeStore.customizerOpen = true"
      >
        <Palette class="h-4 w-4" />
        <span class="hidden sm:inline">Theme</span>
      </button>
    </div>

    <!-- LEFT 7/12 PANEL: Tinkit Authentication Cover Showcase (bg-base-200) -->
    <div class="relative hidden items-center justify-center overflow-hidden bg-base-200 p-12 lg:flex lg:w-7/12 xl:w-8/12">
      <!-- Theme-aware ambient glow -->
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,var(--accent-soft),transparent_55%)]" />
      <div class="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[var(--accent-soft)] blur-3xl" />
      <!-- Subtle bottom decorative wave/tree mask -->
      <svg
        class="pointer-events-none absolute bottom-0 left-0 right-0 w-full h-40 text-base-300/50"
        viewBox="0 0 1200 180"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 120 C 320 40, 580 170, 900 90 C 1060 50, 1150 95, 1200 75 L 1200 180 L 0 180 Z"
          fill="currentColor"
        />
      </svg>

      <!-- Center Visual Composition: Floating Stat Cards + Main CRM Dashboard Preview -->
      <div class="relative z-10 w-full max-w-2xl">
        <!-- Floating Top-Left Stat Card (Total Profit Sparkline) -->
        <div class="card absolute -top-36 left-0 z-20 w-52 p-4 hidden xl:block animate-fade-in">
          <div class="flex items-center justify-between mb-2">
            <div class="flex h-9 w-9 items-center justify-center avatar-soft-success">
              <TrendingUp class="h-5 w-5" />
            </div>
            <span class="text-xs font-semibold text-success">+38.2%</span>
          </div>
          <p class="text-xs text-base-content/55">Total Sales</p>
          <h4 class="text-xl font-bold text-base-content mt-0.5">Rp 134,8 Jt</h4>
          <span class="badge badge-soft badge-secondary mt-2 text-[0.6875rem]">Last Six Month</span>
        </div>

        <!-- Main Center CRM Preview Card -->
        <div class="card p-6 sm:p-8 shadow-xl">
          <div class="flex items-center justify-between border-b border-base-300/70 pb-4 mb-6">
            <div>
              <h5 class="card-title">Tinkit Enterprise CRM Analytics</h5>
              <p class="card-subtitle">Real-time performance & multi-theme workspace</p>
            </div>
            <span class="badge badge-soft badge-primary px-3 py-1 text-xs font-medium">
              Live v2.4
            </span>
          </div>

          <!-- Simulated Weekly Overview & Project Progress inside Cover -->
          <div class="grid grid-cols-12 gap-6 items-center">
            <div class="col-span-7 space-y-3">
              <div class="flex items-end justify-between gap-2.5 h-36 px-3 pt-4 pb-2 rounded-box bg-base-200/60">
                <div
                  v-for="(h, idx) in [42, 60, 48, 92, 65, 54, 76]"
                  :key="idx"
                  class="flex-1 flex flex-col items-center gap-1.5 h-full justify-end"
                >
                  <div
                    class="w-3 rounded-t-full transition-all"
                    :class="
                      idx === 3
                        ? 'bg-primary shadow-[0_4px_10px_0_rgb(var(--p)/0.45)]'
                        : 'bg-primary/20'
                    "
                    :style="{ height: `${h}%` }"
                  />
                </div>
              </div>
              <div class="flex items-center justify-between text-xs text-base-content/55 px-1">
                <span>Weekly Overview</span>
                <span class="font-semibold text-primary">62% Target Reached</span>
              </div>
            </div>

            <!-- Donut Ring Preview -->
            <div class="col-span-5 flex flex-col items-center justify-center p-4 rounded-box bg-base-200/40">
              <div class="relative flex h-28 w-28 items-center justify-center">
                <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90">
                  <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" class="text-base-300" stroke-width="10" />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="rgb(var(--p))"
                    stroke-width="10"
                    stroke-dasharray="165 240"
                    stroke-linecap="round"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="rgb(var(--su))"
                    stroke-width="10"
                    stroke-dasharray="50 240"
                    stroke-dashoffset="-175"
                    stroke-linecap="round"
                  />
                </svg>
                <div class="absolute inset-0 flex flex-col items-center justify-center">
                  <span class="text-lg font-bold text-base-content">89k</span>
                  <span class="text-[0.65rem] text-base-content/55">Sessions</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Bottom-Right Card (Total Orders) -->
        <div class="card absolute -bottom-36 right-0 z-20 w-52 p-4 hidden xl:block animate-fade-in">
          <div class="flex items-center justify-between mb-2">
            <div class="flex h-9 w-9 items-center justify-center avatar-soft-primary">
              <ShoppingCart class="h-5 w-5" />
            </div>
            <span class="text-xs font-semibold text-success">+22%</span>
          </div>
          <h4 class="text-xl font-bold text-base-content">155k</h4>
          <p class="text-xs text-base-content/55">Total Orders</p>
        </div>
      </div>
    </div>

    <!-- RIGHT 5/12 PANEL: Tinkit Clean Authentication Form (bg-base-100) -->
    <div class="flex w-full items-center justify-center bg-base-100 px-6 pb-10 pt-24 sm:px-12 lg:w-5/12 lg:px-12 lg:py-12 xl:w-4/12">
      <div class="w-full max-w-sm">
        <!-- Heading -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold tracking-tight text-base-content">
            {{ isRegister ? 'Mulai perjalanan Anda' : 'Selamat datang kembali' }}
          </h1>
          <p class="mt-1.5 text-sm leading-relaxed text-[var(--text-muted)]">
            {{
              isRegister
                ? 'Buat akun untuk mengelola workspace, tim, dan analitik dalam satu tempat.'
                : 'Masuk untuk melanjutkan pekerjaan dan memantau performa workspace Anda.'
            }}
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-4" novalidate @submit.prevent="handleSubmit">
          <UiInput
            v-if="isRegister"
            v-model="form.name"
            label="Nama lengkap"
            placeholder="Nama lengkap Anda"
            :error="errors.name"
          >
            <template #icon-left>
              <User class="h-4 w-4" />
            </template>
          </UiInput>

          <UiInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="nama@perusahaan.com"
            :error="errors.email"
          >
            <template #icon-left>
              <Mail class="h-4 w-4" />
            </template>
          </UiInput>

          <div>
            <UiInput
              v-model="form.password"
              label="Kata sandi"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              :error="errors.password"
            >
              <template #icon-left>
                <Lock class="h-4 w-4" />
              </template>
              <template #icon-right>
                <button
                  type="button"
                  class="rounded p-0.5 text-[var(--text-faint)] transition-colors hover:text-[var(--text)]"
                  :aria-label="showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'"
                  @click="showPassword = !showPassword"
                >
                  <EyeOff v-if="showPassword" class="h-4 w-4" />
                  <Eye v-else class="h-4 w-4" />
                </button>
              </template>
            </UiInput>

            <div v-if="isRegister" class="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-3">
              <span
                v-for="check in passwordChecks"
                :key="check.label"
                class="inline-flex items-center gap-1 text-[10px] font-medium"
                :class="check.valid ? 'text-success' : 'text-[var(--text-faint)]'"
              >
                <Check class="h-3 w-3" :class="check.valid ? '' : 'opacity-30'" />
                {{ check.label }}
              </span>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-start justify-between gap-3 text-sm">
            <div class="flex items-start gap-2">
              <UiCheckbox v-model="form.remember" size="sm" class="mt-0.5" />
              <span
                class="cursor-pointer text-xs leading-relaxed text-[var(--text-muted)]"
                @click="form.remember = !form.remember"
              >
                {{ isRegister ? 'Saya setuju dengan syarat & kebijakan privasi' : 'Ingat saya di perangkat ini' }}
              </span>
            </div>
            <button
              v-if="!isRegister"
              type="button"
              class="shrink-0 text-xs font-semibold text-[var(--accent)] hover:underline"
              @click="toast.info('Reset Kata Sandi', 'Tautan pemulihan telah dikirim ke email Anda.')"
            >
              Lupa kata sandi?
            </button>
          </div>

          <UiButton
            type="submit"
            variant="primary"
            size="lg"
            block
            :loading="loading"
          >
            {{ isRegister ? 'Buat Akun' : 'Masuk ke Dashboard' }}
          </UiButton>
        </form>

        <!-- Toggle Sign In / Create Account -->
        <p class="mt-6 text-center text-sm text-[var(--text-muted)]">
          {{ isRegister ? 'Sudah punya akun?' : 'Belum punya akun?' }}
          <button
            type="button"
            class="ml-1 font-semibold text-[var(--accent)] hover:underline"
            @click="toggleMode"
          >
            {{ isRegister ? 'Masuk di sini' : 'Daftar sekarang' }}
          </button>
        </p>

        <!-- Divider -->
        <div class="my-6 flex items-center gap-3">
          <span class="h-px flex-1 bg-[var(--border)]" />
          <span class="text-[11px] font-medium text-[var(--text-faint)]">atau lanjutkan dengan</span>
          <span class="h-px flex-1 bg-[var(--border)]" />
        </div>

        <!-- Social Auth -->
        <div class="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-btn border border-[var(--border)] bg-[var(--surface-input)] text-xs font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
            @click="socialLogin('Google')"
          >
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z" />
              <path fill="#FBBC05" d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.79.14-1.56.38-2.29V6.62H1.29A11.95 11.95 0 0 0 0 12c0 1.94.47 3.77 1.29 5.38l3.98-3.09Z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
            </svg>
            Google
          </button>
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center gap-2 rounded-btn border border-[var(--border)] bg-[var(--surface-input)] text-xs font-semibold text-[var(--text)] transition-colors hover:bg-[var(--surface-hover)]"
            @click="socialLogin('GitHub')"
          >
            <svg class="h-4 w-4 shrink-0" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            GitHub
          </button>
        </div>

        <p class="mt-6 flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-faint)]">
          <ShieldCheck class="h-3.5 w-3.5" />
          Data Anda dienkripsi dan tidak dibagikan ke pihak ketiga.
        </p>
      </div>
    </div>

    <ThemeCustomizerDrawer />
  </div>
</template>
