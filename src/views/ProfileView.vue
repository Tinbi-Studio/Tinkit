<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/stores/toast'
import {
  User,
  Shield,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Save,
  KeyRound,
  Smartphone,
  Check,
  Briefcase,
  Flag,
  Languages,
  CheckCircle2,
  Users,
  FolderKanban,
  Activity,
  UserCheck,
  MessageSquare,
} from 'lucide-vue-next'
import UiCard from '@/components/ui/UiCard.vue'
import UiTimeline from '@/components/ui/UiTimeline.vue'
import type { TimelineItem } from '@/components/ui/UiTimeline.vue'
import UiDatePicker from '@/components/ui/UiDatePicker.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import UiSelectTag from '@/components/ui/UiSelectTag.vue'
import UiRichEditor from '@/components/ui/UiRichEditor.vue'
import UiFileUpload, { type UploadedFileItem } from '@/components/ui/UiFileUpload.vue'
import UiProgress from '@/components/ui/UiProgress.vue'

const toast = useToast()

const activeTab = ref('overview')
const profileTabs = [
  { id: 'overview', label: 'Profile', icon: User },
  { id: 'edit', label: 'Account Settings', icon: Briefcase },
  { id: 'security', label: 'Security', icon: Shield },
]

// Profile Data
const profile = ref({
  firstName: 'Arif',
  lastName: 'Budiman',
  role: 'Principal Product Designer & Frontend Architect',
  email: 'arif.budiman@tinkit.example',
  phone: '+62 812-3456-7890',
  location: 'Jakarta Selatan, Indonesia',
  birthDate: '1995-08-17',
  department: 'design',
  skills: ['Vue 3', 'TypeScript', 'Tailwind CSS', 'Design System', 'UI/UX Architecture'],
  bio: '<p>Berfokus pada pengembangan <strong>Design System</strong> berskala enterprise yang modular, aksesibel, dan mudah dikustomisasi lintas produk digital.</p><ul><li>10+ tahun pengalaman di industri SaaS &amp; Fintech</li><li>Kontributor aktif ekosistem Vue &amp; Tailwind CSS</li></ul>',
})

const departmentOptions = [
  { label: 'Design Studio & UX', value: 'design', description: 'Product Design, Research & Design System' },
  { label: 'Core Engineering', value: 'engineering', description: 'Frontend, Backend & Cloud Infrastructure' },
  { label: 'Product Management', value: 'product', description: 'Product Strategy & Growth' },
  { label: 'Data & Analytics', value: 'data', description: 'Business Intelligence & Machine Learning' },
]

const skillSuggestions = [
  'Vue 3',
  'TypeScript',
  'Tailwind CSS',
  'Design System',
  'UI/UX Architecture',
  'Figma',
  'Node.js',
  'GraphQL',
  'Accessibility (WCAG)',
  'Performance Optimization',
]

const avatarFiles = ref<UploadedFileItem[]>([])

const security = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactor: true,
  loginAlerts: true,
})

const timelineActivities: TimelineItem[] = [
  {
    id: 1,
    title: '12 Invoices have been paid',
    description: 'Invoices have been paid to the company akun utama PT Nusantara Digital.',
    time: '12 min ago',
    badge: 'Invoices.pdf',
    variant: 'primary',
  },
  {
    id: 2,
    title: 'Client Meeting with John @10:15am',
    description: 'Project meeting bersama tim arsitektur desain untuk rilis v2.4.',
    time: '45 min ago',
    badge: 'Zoom Call',
    variant: 'success',
  },
  {
    id: 3,
    title: 'Create a new project for client',
    description: '6 team members in a project — repositori Tinkit Enterprise UI Kit.',
    time: '2 Day Ago',
    badge: '6 Members',
    variant: 'info',
  },
  {
    id: 4,
    title: 'Audit Keamanan & Rotasi API Key',
    description: 'Mengaktifkan autentikasi dua faktor (2FA) dan memperbarui kunci SSH produksi.',
    time: '5 Day Ago',
    variant: 'warning',
  },
]

const connections = [
  { name: 'Cecilia Payne', connections: '45 Connections', initials: 'CP', avatarClass: 'avatar-soft-primary', connected: true },
  { name: 'Curtis Fletcher', connections: '1.32k Connections', initials: 'CF', avatarClass: 'avatar-soft-success', connected: false },
  { name: 'Alice Stone', connections: '125 Connections', initials: 'AS', avatarClass: 'avatar-soft-info', connected: false },
  { name: 'Darrell Barnes', connections: '456 Connections', initials: 'DB', avatarClass: 'avatar-soft-warning', connected: true },
  { name: 'Eugenia Moore', connections: '1.2k Connections', initials: 'EM', avatarClass: 'avatar-soft-error', connected: true },
]

const projectTeams = [
  { title: 'React Developers', members: '72 Members', tag: 'Developer', badgeClass: 'badge-soft badge-primary', avatarClass: 'avatar-soft-primary', short: 'RD' },
  { title: 'Support Team', members: '122 Members', tag: 'Support', badgeClass: 'badge-soft badge-warning', avatarClass: 'avatar-soft-warning', short: 'ST' },
  { title: 'UI Designers', members: '7 Members', tag: 'Designer', badgeClass: 'badge-soft badge-info', avatarClass: 'avatar-soft-info', short: 'UI' },
  { title: 'Vue.js Developers', members: '289 Members', tag: 'Developer', badgeClass: 'badge-soft badge-error', avatarClass: 'avatar-soft-error', short: 'VJ' },
  { title: 'Digital Marketing', members: '24 Members', tag: 'Marketing', badgeClass: 'badge-soft badge-secondary', avatarClass: 'avatar-soft-secondary', short: 'DM' },
]

function saveProfile() {
  toast.success('Profil Diperbarui', 'Perubahan informasi akun Anda telah disimpan.')
}

function updatePassword() {
  if (!security.value.currentPassword || !security.value.newPassword) {
    toast.error('Gagal Memperbarui', 'Harap isi kata sandi saat ini dan kata sandi baru.')
    return
  }
  security.value.currentPassword = ''
  security.value.newPassword = ''
  security.value.confirmPassword = ''
  toast.success('Kata Sandi Diperbarui', 'Kata sandi akun Anda berhasil diganti.')
}
</script>

<template>
  <div class="space-y-6">
    <!-- 1. Tinkit Profile Header Card (Ref: pages-profile-user.html) -->
    <div class="card overflow-hidden">
      <!-- Top Colorful Banner -->
      <div
        class="h-40 sm:h-52 w-full relative overflow-hidden"
        style="background: linear-gradient(120deg, rgb(var(--p)) 0%, rgb(var(--s)) 55%, rgb(var(--in)) 100%);"
      >
        <!-- Subtle geometric mesh pattern -->
        <svg class="absolute inset-0 h-full w-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="profileGrid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" stroke-width="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#profileGrid)" />
        </svg>
      </div>

      <!-- Bottom Info Bar with Overlapping Rounded-XL Avatar -->
      <div class="px-6 pb-6">
        <div class="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-10 relative z-10">
          <div class="flex flex-col sm:flex-row sm:items-end gap-5">
            <!-- Avatar Box -->
            <div class="h-28 w-28 rounded-box bg-base-100 p-1.5 shadow-md shrink-0">
              <div class="flex h-full w-full items-center justify-center rounded-field bg-primary text-3xl font-bold text-primary-content">
                AB
              </div>
            </div>

            <!-- User Name & Metadata List -->
            <div class="pt-1 sm:pb-1">
              <h4 class="text-xl sm:text-2xl font-bold text-base-content">
                {{ profile.firstName }} {{ profile.lastName }}
              </h4>
              <ul class="mt-2 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-base-content/65">
                <li class="flex items-center gap-1.5">
                  <Briefcase class="h-4 w-4 text-base-content/50" />
                  <span>UX Designer</span>
                </li>
                <li class="flex items-center gap-1.5">
                  <MapPin class="h-4 w-4 text-base-content/50" />
                  <span>{{ profile.location }}</span>
                </li>
                <li class="flex items-center gap-1.5">
                  <Calendar class="h-4 w-4 text-base-content/50" />
                  <span>Joined April 2021</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Connected / Edit Action Button -->
          <div class="sm:pb-1">
            <button
              class="btn btn-primary gap-2"
              @click="activeTab = activeTab === 'edit' ? 'overview' : 'edit'"
            >
              <UserCheck class="h-4 w-4" />
              {{ activeTab === 'edit' ? 'View Profile' : 'Connected' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 2. Tinkit Horizontal Navigation Pills -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="tab in profileTabs"
        :key="tab.id"
        type="button"
        class="btn btn-sm h-10 px-5 gap-2 rounded-btn font-medium transition-all"
        :class="
          activeTab === tab.id
            ? 'btn-primary'
            : 'bg-transparent border-transparent text-base-content/70 hover:bg-primary/10 hover:text-primary shadow-none'
        "
        @click="activeTab = tab.id"
      >
        <component :is="tab.icon" class="h-4 w-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- TAB 1: PROFILE OVERVIEW (Matches Tinkit pages-profile-user.html 4-col + 8-col layout) -->
    <div v-if="activeTab === 'overview'" class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Left Column (lg:col-span-4): ABOUT Card + OVERVIEW Card -->
      <div class="space-y-6 lg:col-span-4">
        <!-- About & Contacts Card -->
        <div class="card p-5 space-y-5">
          <div>
            <p class="text-xs font-semibold text-base-content/45 mb-3">
              About
            </p>
            <ul class="space-y-3 text-sm text-base-content/80">
              <li class="flex items-center gap-2.5">
                <User class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Full Name:</span>
                <span>{{ profile.firstName }} {{ profile.lastName }}</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Check class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Status:</span>
                <span>Active</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Briefcase class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Role:</span>
                <span>Principal Designer</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Flag class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Country:</span>
                <span>Indonesia</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Languages class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Languages:</span>
                <span>Indonesian, English</span>
              </li>
            </ul>
          </div>

          <div class="border-t border-base-300/70 pt-4">
            <p class="text-xs font-semibold text-base-content/45 mb-3">
              Contacts
            </p>
            <ul class="space-y-3 text-sm text-base-content/80">
              <li class="flex items-center gap-2.5">
                <Phone class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Contact:</span>
                <span>{{ profile.phone }}</span>
              </li>
              <li class="flex items-center gap-2.5">
                <MessageSquare class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Skype:</span>
                <span>arif.budiman</span>
              </li>
              <li class="flex items-center gap-2.5">
                <Mail class="h-4 w-4 text-base-content/50 shrink-0" />
                <span class="font-medium text-base-content/65">Email:</span>
                <span class="truncate">{{ profile.email }}</span>
              </li>
            </ul>
          </div>

          <div class="border-t border-base-300/70 pt-4">
            <p class="text-xs font-semibold text-base-content/45 mb-3">
              Skills
            </p>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="skill in profile.skills"
                :key="skill"
                class="badge badge-soft badge-primary px-2.5 py-0.5 text-xs font-medium"
              >
                {{ skill }}
              </span>
            </div>
          </div>
        </div>

        <!-- Overview Stats Card -->
        <div class="card p-5">
          <p class="text-xs font-semibold text-base-content/45 mb-3">
            Overview
          </p>
          <ul class="space-y-3 text-sm text-base-content/80">
            <li class="flex items-center gap-2.5">
              <CheckCircle2 class="h-4 w-4 text-primary shrink-0" />
              <span class="font-medium text-base-content/65">Task Compiled:</span>
              <span class="font-semibold text-base-content">13.5k</span>
            </li>
            <li class="flex items-center gap-2.5">
              <FolderKanban class="h-4 w-4 text-success shrink-0" />
              <span class="font-medium text-base-content/65">Projects Compiled:</span>
              <span class="font-semibold text-base-content">146</span>
            </li>
            <li class="flex items-center gap-2.5">
              <Users class="h-4 w-4 text-info shrink-0" />
              <span class="font-medium text-base-content/65">Connections:</span>
              <span class="font-semibold text-base-content">897</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Right Column (lg:col-span-8): Activity Timeline + Connections & Teams -->
      <div class="space-y-6 lg:col-span-8">
        <!-- Activity Timeline Card -->
        <div class="card p-5">
          <div class="flex items-center gap-2.5 mb-5">
            <Activity class="h-5 w-5 text-base-content/60" />
            <h5 class="card-title">Activity Timeline</h5>
          </div>
          <UiTimeline :items="timelineActivities" />
        </div>

        <!-- Connections & Teams 2-Col Sub-grid -->
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <!-- Connections Card -->
          <div class="card p-5">
            <h5 class="card-title mb-4">Connections</h5>
            <ul class="space-y-3.5">
              <li
                v-for="conn in connections"
                :key="conn.name"
                class="flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold" :class="conn.avatarClass">
                    {{ conn.initials }}
                  </div>
                  <div class="min-w-0">
                    <h6 class="text-sm font-semibold text-base-content truncate">{{ conn.name }}</h6>
                    <p class="text-xs text-base-content/55">{{ conn.connections }}</p>
                  </div>
                </div>
                <button
                  class="btn btn-xs btn-square"
                  :class="conn.connected ? 'btn-primary' : 'bg-primary/15 text-primary border-transparent hover:bg-primary/25 shadow-none'"
                  @click="conn.connected = !conn.connected"
                >
                  <UserCheck class="h-3.5 w-3.5" />
                </button>
              </li>
            </ul>
          </div>

          <!-- Teams Card -->
          <div class="card p-5">
            <h5 class="card-title mb-4">Teams</h5>
            <ul class="space-y-3.5">
              <li
                v-for="team in projectTeams"
                :key="team.title"
                class="flex items-center justify-between gap-3"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold" :class="team.avatarClass">
                    {{ team.short }}
                  </div>
                  <div class="min-w-0">
                    <h6 class="text-sm font-semibold text-base-content truncate">{{ team.title }}</h6>
                    <p class="text-xs text-base-content/55">{{ team.members }}</p>
                  </div>
                </div>
                <span class="badge px-2.5 py-0.5 text-xs font-medium shrink-0" :class="team.badgeClass">
                  {{ team.tag }}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 2: EDIT ACCOUNT -->
    <UiCard
      v-else-if="activeTab === 'edit'"
      title="Account Settings"
      subtitle="Perbarui informasi personal, departemen, keahlian, serta foto profil Anda"
    >
      <form class="space-y-5" @submit.prevent="saveProfile">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="form-control">
            <label class="label"><span class="label-text">First Name</span></label>
            <input v-model="profile.firstName" type="text" class="input" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Last Name</span></label>
            <input v-model="profile.lastName" type="text" class="input" required />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="form-control">
            <label class="label"><span class="label-text">Email</span></label>
            <input v-model="profile.email" type="email" class="input" required />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Phone Number</span></label>
            <input v-model="profile.phone" type="text" class="input" />
          </div>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <UiDatePicker
            v-model="profile.birthDate"
            label="Birth Date"
            placeholder="Select date"
          />
          <UiSelect
            v-model="profile.department"
            :options="departmentOptions"
            label="Department"
            placeholder="Select department"
          />
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="form-control">
            <label class="label"><span class="label-text">Role / Title</span></label>
            <input v-model="profile.role" type="text" class="input" />
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Location</span></label>
            <input v-model="profile.location" type="text" class="input" />
          </div>
        </div>

        <UiSelectTag
          v-model="profile.skills"
          :options="skillSuggestions"
          label="Skills & Competencies"
          placeholder="Ketik keahlian lalu tekan Enter..."
          :max-tags="8"
        />

        <UiRichEditor
          v-model="profile.bio"
          label="Professional Biography"
          placeholder="Tulis ringkasan pengalaman Anda..."
          min-height="130px"
        />

        <UiFileUpload
          v-model="avatarFiles"
          label="Upload Avatar / Portfolio"
          accept="image/*,.pdf"
          :max-size-mb="5"
          hint="PNG, JPG, WebP atau PDF hingga 5 MB"
        />

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" class="btn btn-ghost btn-sm" @click="activeTab = 'overview'">Cancel</button>
          <button type="submit" class="btn btn-primary btn-sm gap-2">
            <Save class="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </form>
    </UiCard>

    <!-- TAB 3: SECURITY -->
    <div v-else-if="activeTab === 'security'" class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <UiCard
        title="Change Password"
        subtitle="Gunakan kombinasi huruf besar, angka, dan simbol minimal 8 karakter"
        class="lg:col-span-7"
      >
        <form class="space-y-4" @submit.prevent="updatePassword">
          <div class="form-control">
            <label class="label"><span class="label-text">Current Password</span></label>
            <input v-model="security.currentPassword" type="password" class="input" placeholder="••••••••" />
          </div>
          <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div class="form-control">
              <label class="label"><span class="label-text">New Password</span></label>
              <input v-model="security.newPassword" type="password" class="input" placeholder="••••••••" />
            </div>
            <div class="form-control">
              <label class="label"><span class="label-text">Confirm New Password</span></label>
              <input v-model="security.confirmPassword" type="password" class="input" placeholder="••••••••" />
            </div>
          </div>
          <div class="flex justify-end pt-2">
            <button type="submit" class="btn btn-primary btn-sm gap-2">
              <KeyRound class="h-4 w-4" />
              Save Password
            </button>
          </div>
        </form>
      </UiCard>

      <UiCard
        title="Two-steps Verification & Devices"
        subtitle="Kelola proteksi ekstra dan perangkat yang sedang aktif"
        class="lg:col-span-5"
      >
        <div class="space-y-4">
          <div class="flex items-center justify-between rounded-box border border-base-300/80 p-3.5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-field avatar-soft-primary">
                <Smartphone class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold">Two-Factor Authentication (2FA)</p>
                <p class="text-xs text-base-content/55">Wajibkan kode OTP saat masuk dari perangkat baru</p>
              </div>
            </div>
            <input v-model="security.twoFactor" type="checkbox" class="toggle toggle-primary" />
          </div>

          <div class="flex items-center justify-between rounded-box border border-base-300/80 p-3.5">
            <div class="flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-field avatar-soft-info">
                <Mail class="h-5 w-5" />
              </div>
              <div>
                <p class="text-sm font-semibold">Unusual Login Alerts</p>
                <p class="text-xs text-base-content/55">Kirim peringatan email saat ada sesi mencurigakan</p>
              </div>
            </div>
            <input v-model="security.loginAlerts" type="checkbox" class="toggle toggle-primary" />
          </div>

          <div class="pt-2">
            <UiProgress :value="92" label="Account Security Score" variant="success" />
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>
