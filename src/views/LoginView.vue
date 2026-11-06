<script setup lang="ts">
import { ref } from 'vue'
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
} from 'lucide-vue-next'
import ThemeCustomizerDrawer from '@/components/layout/ThemeCustomizerDrawer.vue'
import AppBrand from '@/components/brand/AppBrand.vue'

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

function handleSubmit() {
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
    <div class="hidden lg:flex lg:w-7/12 xl:w-8/12 relative items-center justify-center overflow-hidden bg-base-200 p-12">
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
        <div class="card absolute -left-8 -top-10 z-20 w-52 p-4 hidden xl:block animate-fade-in">
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
        <div class="card absolute -bottom-8 -right-6 z-20 w-52 p-4 hidden xl:block animate-fade-in">
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
    <div class="flex w-full lg:w-5/12 xl:w-4/12 items-center justify-center bg-base-100 p-6 sm:p-12">
      <div class="w-full max-w-sm space-y-6">
        <!-- Heading -->
        <div>
          <h1 class="text-2xl font-semibold text-base-content">
            {{ isRegister ? 'Adventure starts here' : 'Welcome to Tinkit' }}
          </h1>
          <p class="mt-1.5 text-sm text-base-content/60">
            {{
              isRegister
                ? 'Make your app management easy and fun!'
                : 'Please sign-in to your account and start the adventure'
            }}
          </p>
        </div>

        <!-- Form -->
        <form class="space-y-4" @submit.prevent="handleSubmit">
          <div v-if="isRegister" class="form-control">
            <label class="label"><span class="label-text">Username / Full Name</span></label>
            <input
              v-model="form.name"
              type="text"
              class="input"
              placeholder="Enter your username"
              required
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Email or Username</span></label>
            <input
              v-model="form.email"
              type="email"
              class="input"
              placeholder="Enter your email or username"
              required
            />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text">Password</span></label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="input pr-10"
                placeholder="············"
                required
              />
              <button
                type="button"
                class=" absolute right-3 top-1/2 -translate-y-1/2 text-base-content/45 hover:text-base-content"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="h-4 w-4" />
                <Eye v-else class="h-4 w-4" />
              </button>
            </div>
          </div>

          <!-- Remember Me & Forgot Password -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex cursor-pointer items-center gap-2">
              <input v-model="form.remember" type="checkbox" class="checkbox checkbox-sm checkbox-primary" />
              <span class="text-base-content/75">
                {{ isRegister ? 'I agree to privacy policy & terms' : 'Remember Me' }}
              </span>
            </label>
            <button
              v-if="!isRegister"
              type="button"
              class="text-primary hover:underline text-sm"
              @click="toast.info('Reset Password', 'Tautan pemulihan telah dikirim ke email Anda.')"
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" class="btn btn-primary w-full" :disabled="loading">
            <span v-if="loading" class="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>{{ isRegister ? 'Sign up' : 'Sign in' }}</span>
          </button>
        </form>

        <!-- Toggle Sign In / Create Account -->
        <p class="text-center text-sm text-base-content/65">
          {{ isRegister ? 'Already have an account?' : 'New on our platform?' }}
          <button
            type="button"
            class="ml-1 font-medium text-primary hover:underline"
            @click="isRegister = !isRegister"
          >
            {{ isRegister ? 'Sign in instead' : 'Create an account' }}
          </button>
        </p>

        <!-- Divider -->
        <div class="divider text-xs text-base-content/45">or</div>

        <!-- Social Auth Icons (Facebook, Twitter, GitHub, Google style) -->
        <div class="flex items-center justify-center gap-3">
          <button
            type="button"
            class="btn btn-sm btn-square bg-[#4267B2]/15 text-[#4267B2] border-transparent hover:bg-[#4267B2]/25 shadow-none"
            title="Facebook"
            @click="handleSubmit"
          >
            <span class="text-xs font-bold">f</span>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-square bg-[#1DA1F2]/15 text-[#1DA1F2] border-transparent hover:bg-[#1DA1F2]/25 shadow-none"
            title="Twitter / X"
            @click="handleSubmit"
          >
            <span class="text-xs font-bold">𝕏</span>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-square bg-base-content/10 text-base-content border-transparent hover:bg-base-content/20 shadow-none"
            title="GitHub"
            @click="handleSubmit"
          >
            <span class="text-xs font-bold">GH</span>
          </button>
          <button
            type="button"
            class="btn btn-sm btn-square bg-[#DB4437]/15 text-[#DB4437] border-transparent hover:bg-[#DB4437]/25 shadow-none"
            title="Google"
            @click="handleSubmit"
          >
            <span class="text-xs font-bold">G</span>
          </button>
        </div>
      </div>
    </div>

    <ThemeCustomizerDrawer />
  </div>
</template>
