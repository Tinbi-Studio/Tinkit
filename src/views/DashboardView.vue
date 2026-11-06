<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from '@/stores/toast'
import {
  ShoppingCart,
  ShoppingBag,
  MoreVertical,
  Calendar,
  ChevronUp,
  ChevronDown,
  Crown,
  Edit3,
  Monitor,
  PieChart,
  User,
  Smartphone,
  Globe,
  Landmark,
  Palette,
  RefreshCw,
  Share2,
  Download,
} from 'lucide-vue-next'
import UiStatCard from '@/components/ui/UiStatCard.vue'
import UiDropdown, { type DropdownItem } from '@/components/ui/UiDropdown.vue'

const router = useRouter()
const toast = useToast()

// 1. Sparkline data for Total Profit (Mini Bar Chart) & Total Growth (Smooth Area Chart)
const profitBars = [
  { label: 'Jan', h: 48, color: 'bg-primary' },
  { label: 'Feb', h: 72, color: 'bg-error' },
  { label: 'Mar', h: 58, color: 'bg-primary' },
  { label: 'Apr', h: 86, color: 'bg-error' },
  { label: 'Mei', h: 64, color: 'bg-primary' },
  { label: 'Jun', h: 95, color: 'bg-primary' },
]

// 2. Organic Sessions Donut/Radial Gauge
interface OrganicRegion {
  country: string
  sessions: string
  percent: number
  color: string
  strokeClass: string
  dotClass: string
}

const organicRegions: OrganicRegion[] = [
  { country: 'USA', sessions: '32.4k', percent: 36, color: 'rgb(var(--p))', strokeClass: 'text-primary', dotClass: 'bg-primary' },
  { country: 'Indonesia', sessions: '24.8k', percent: 28, color: 'rgb(var(--su))', strokeClass: 'text-success', dotClass: 'bg-success' },
  { country: 'India', sessions: '16.1k', percent: 18, color: 'rgb(var(--wa))', strokeClass: 'text-warning', dotClass: 'bg-warning' },
  { country: 'Canada', sessions: '9.8k', percent: 11, color: 'rgb(var(--in))', strokeClass: 'text-info', dotClass: 'bg-info' },
  { country: 'Japan', sessions: '5.9k', percent: 7, color: 'rgb(var(--s))', strokeClass: 'text-secondary', dotClass: 'bg-secondary' },
]

const selectedRegion = ref<OrganicRegion | null>(null)

// 3. Project Timeline (Gantt Chart) & Project List Split Card
interface TimelineTask {
  person: string
  task: string
  startCol: number // 0 to 100%
  widthCol: number // width %
  badgeBg: string
}

const ganttTasks: TimelineTask[] = [
  {
    person: 'jaqueline',
    task: 'Development Apps',
    startCol: 4,
    widthCol: 48,
    badgeBg: 'bg-primary text-primary-content shadow-[0_2px_6px_0_rgb(var(--p)/0.4)]',
  },
  {
    person: 'Janelle',
    task: 'UI Design',
    startCol: 18,
    widthCol: 46,
    badgeBg: 'bg-success text-success-content shadow-[0_2px_6px_0_rgb(var(--su)/0.4)]',
  },
  {
    person: 'Wellington',
    task: 'IOS Application',
    startCol: 34,
    widthCol: 50,
    badgeBg: 'bg-secondary text-secondary-content shadow-[0_2px_6px_0_rgb(var(--s)/0.4)]',
  },
  {
    person: 'Blake',
    task: 'Web App Wireframing',
    startCol: 12,
    widthCol: 54,
    badgeBg: 'bg-info text-info-content shadow-[0_2px_6px_0_rgb(var(--in)/0.4)]',
  },
  {
    person: 'Quinn',
    task: 'Prototyping',
    startCol: 42,
    widthCol: 54,
    badgeBg: 'bg-warning text-warning-content shadow-[0_2px_6px_0_rgb(var(--wa)/0.4)]',
  },
]

const ganttMonths = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']

const projectList = [
  {
    title: 'IOS Application',
    tasks: 'Task 840/2.5K',
    avatarClass: 'avatar-soft-primary',
    icon: Smartphone,
  },
  {
    title: 'Web Application',
    tasks: 'Task 99/1.42k',
    avatarClass: 'avatar-soft-success',
    icon: Globe,
  },
  {
    title: 'Bank Dashboard',
    tasks: 'Task 58/100',
    avatarClass: 'avatar-soft-secondary',
    icon: Landmark,
  },
  {
    title: 'UI Kit Design',
    tasks: 'Task 120/350',
    avatarClass: 'avatar-soft-info',
    icon: Palette,
  },
]

// 4. Weekly Overview Bar Chart
const weeklyDays = [
  { day: 'Mon', val: 38, highlight: false },
  { day: 'Tue', val: 54, highlight: false },
  { day: 'Wed', val: 44, highlight: false },
  { day: 'Thu', val: 88, highlight: true },
  { day: 'Fri', val: 58, highlight: false },
  { day: 'Sat', val: 46, highlight: false },
  { day: 'Sun', val: 64, highlight: false },
]

// 5. Social Network Visits
const socialVisits = [
  {
    name: 'Facebook',
    category: 'Social Media',
    visits: '12,348',
    change: '+12%',
    positive: true,
    badgeClass: 'badge-soft badge-success',
    avatarBg: 'avatar-soft-primary',
    short: 'FB',
  },
  {
    name: 'Dribbble',
    category: 'Community',
    visits: '8,450',
    change: '+32%',
    positive: true,
    badgeClass: 'badge-soft badge-success',
    avatarBg: 'avatar-soft-error',
    short: 'DR',
  },
  {
    name: 'Twitter / X',
    category: 'Social Media',
    visits: '350',
    change: '-18%',
    positive: false,
    badgeClass: 'badge-soft badge-error',
    avatarBg: 'avatar-soft-info',
    short: 'TW',
  },
  {
    name: 'Instagram',
    category: 'Social Media',
    visits: '25,566',
    change: '+42%',
    positive: true,
    badgeClass: 'badge-soft badge-success',
    avatarBg: 'avatar-soft-secondary',
    short: 'IG',
  },
]

// 6. Meeting Schedule
const meetingSchedules = [
  {
    title: 'Call with Woods',
    datetime: '21 Jul | 08:20-10:30',
    tag: 'Business',
    badgeClass: 'badge-soft badge-primary',
    initials: 'CW',
    avatarClass: 'avatar-soft-primary',
  },
  {
    title: 'Conference call',
    datetime: '24 Jul | 11:30-12:00',
    tag: 'Dinner',
    badgeClass: 'badge-soft badge-warning',
    initials: 'CC',
    avatarClass: 'avatar-soft-warning',
  },
  {
    title: 'Meeting with Mark',
    datetime: '28 Jul | 05:00-6:45',
    tag: 'Meetup',
    badgeClass: 'badge-soft badge-secondary',
    initials: 'MM',
    avatarClass: 'avatar-soft-secondary',
  },
  {
    title: 'Meeting in Oakland',
    datetime: '03 Aug | 07:00-8:30',
    tag: 'Dinner',
    badgeClass: 'badge-soft badge-error',
    initials: 'MO',
    avatarClass: 'avatar-soft-error',
  },
  {
    title: 'Call with Hilda',
    datetime: '14 Aug | 04:15-05:30',
    tag: 'Meditation',
    badgeClass: 'badge-soft badge-success',
    initials: 'CH',
    avatarClass: 'avatar-soft-success',
  },
  {
    title: 'Meeting with Carl',
    datetime: '05 Oct | 10:00-12:45',
    tag: 'Business',
    badgeClass: 'badge-soft badge-primary',
    initials: 'MC',
    avatarClass: 'avatar-soft-info',
  },
]

// 7. Most Sales in Countries
const countrySales = [
  { country: 'Australia', sales: '18,879', percent: '15%', up: false },
  { country: 'Canada', sales: '10,357', percent: '85%', up: true },
  { country: 'Indonesia', sales: '4,860', percent: '48%', up: true },
  { country: 'United States', sales: '899', percent: '16%', up: false },
  { country: 'Brazil', sales: '18', percent: '12%', up: true },
]

// 8. CRM Users & Roles Table
interface CrmUserRow {
  id: number
  name: string
  handle: string
  email: string
  role: 'Admin' | 'Author' | 'Editor' | 'Maintainer' | 'Subscriber'
  status: 'Pending' | 'Active' | 'Inactive'
  initials: string
  avatarClass: string
}

const crmUsers: CrmUserRow[] = [
  {
    id: 1,
    name: 'Jordan Stevenson',
    handle: '@amiccoo',
    email: 'susanna.Lind57@gmail.com',
    role: 'Admin',
    status: 'Pending',
    initials: 'JS',
    avatarClass: 'avatar-soft-primary',
  },
  {
    id: 2,
    name: 'Benedetto Rossiter',
    handle: '@brossiter15',
    email: 'estelle.Bailey10@gmail.com',
    role: 'Editor',
    status: 'Active',
    initials: 'BR',
    avatarClass: 'avatar-soft-warning',
  },
  {
    id: 3,
    name: 'Bentlee Emblin',
    handle: '@bemblinf',
    email: 'milo86@hotmail.com',
    role: 'Author',
    status: 'Active',
    initials: 'BE',
    avatarClass: 'avatar-soft-error',
  },
  {
    id: 4,
    name: 'Bertha Biner',
    handle: '@bbinerh',
    email: 'lonnie35@hotmail.com',
    role: 'Editor',
    status: 'Pending',
    initials: 'BB',
    avatarClass: 'avatar-soft-info',
  },
  {
    id: 5,
    name: 'Beverlie Krabbe',
    handle: '@bkrabbe1d',
    email: 'ahmad_Collins@yahoo.com',
    role: 'Maintainer',
    status: 'Active',
    initials: 'BK',
    avatarClass: 'avatar-soft-success',
  },
  {
    id: 6,
    name: 'Bradan Rosebotham',
    handle: '@brosebothamz',
    email: 'tillman.Gleason68@hotmail.com',
    role: 'Editor',
    status: 'Pending',
    initials: 'BR',
    avatarClass: 'avatar-soft-secondary',
  },
  {
    id: 7,
    name: 'Bree Kilday',
    handle: '@bkildayr',
    email: 'otho21@gmail.com',
    role: 'Subscriber',
    status: 'Active',
    initials: 'BK',
    avatarClass: 'avatar-soft-primary',
  },
  {
    id: 8,
    name: 'Breena Gallemore',
    handle: '@bgallemore6',
    email: 'florencio.Little@hotmail.com',
    role: 'Subscriber',
    status: 'Inactive',
    initials: 'BG',
    avatarClass: 'avatar-soft-error',
  },
]

const roleMeta: Record<CrmUserRow['role'], { icon: any; colorClass: string }> = {
  Admin: { icon: Crown, colorClass: 'text-primary' },
  Editor: { icon: Edit3, colorClass: 'text-warning' },
  Author: { icon: Monitor, colorClass: 'text-error' },
  Maintainer: { icon: PieChart, colorClass: 'text-info' },
  Subscriber: { icon: User, colorClass: 'text-success' },
}

const statusBadgeMap: Record<CrmUserRow['status'], string> = {
  Pending: 'badge-soft badge-warning',
  Active: 'badge-soft badge-success',
  Inactive: 'badge-soft badge-neutral',
}

const cardMenuItems: DropdownItem[] = [
  { label: 'Refresh', value: 'refresh', icon: RefreshCw },
  { label: 'Share', value: 'share', icon: Share2 },
  { label: 'Update', value: 'update', icon: Download },
]

function handleCardAction(widgetName: string, item: DropdownItem) {
  toast.info(`${widgetName}: ${item.label ?? 'Action'}`, 'Data widget berhasil diperbarui.')
}
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-[var(--text)]">Dashboard</h1>
    <!-- ROW 1: Top 12-Col CRM Summary Grid (Matches Tinkit dashboards-crm.html) -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-12">
      <!-- 1. Congratulations Card (lg:col-span-4) -->
      <div class="card relative overflow-hidden p-5 lg:col-span-4 flex flex-col justify-between">
        <div class="relative z-10 pr-24">
          <h5 class="text-[1.0625rem] font-medium text-base-content leading-snug">
            Congratulations <span class="font-bold">Arif!</span>
          </h5>
          <p class="mt-1 text-[0.8125rem] text-base-content/55">Best seller of the month</p>

          <div class="mt-4">
            <h4 class="text-2xl font-bold text-primary tracking-tight">Rp 42,8 Jt</h4>
            <p class="mt-0.5 text-[0.8125rem] text-base-content/60">78% of target</p>
          </div>

          <button
            class="btn btn-primary btn-sm mt-4"
            @click="toast.success('Laporan Penjualan', 'Target bulan ini telah tercapai 78%.')"
          >
            View Sales
          </button>
        </div>

        <!-- Bottom-right Trophy Vector Illustration -->
        <div class="pointer-events-none absolute bottom-0 right-4 flex items-end">
          <svg class="h-32 w-28" viewBox="0 0 120 135" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Soft background arch -->
            <rect x="18" y="25" width="84" height="110" rx="12" fill="rgb(var(--p) / 0.08)" />
            <!-- Pedestal -->
            <rect x="38" y="106" width="44" height="16" rx="4" fill="#3b4056" />
            <rect x="45" y="98" width="30" height="10" rx="2" fill="#fdb528" />
            <rect x="50" y="92" width="20" height="8" rx="2" fill="#e59b13" />
            <!-- Stem -->
            <path d="M55 74H65V94H55V74Z" fill="#fdb528" />
            <!-- Handles -->
            <path
              d="M35 38H26C22.6863 38 20 40.6863 20 44V50C20 58.8366 27.1634 66 36 66H40"
              stroke="#fdb528"
              stroke-width="5"
              stroke-linecap="round"
            />
            <path
              d="M85 38H94C97.3137 38 100 40.6863 100 44V50C100 58.8366 92.8366 66 84 66H80"
              stroke="#fdb528"
              stroke-width="5"
              stroke-linecap="round"
            />
            <!-- Cup Body -->
            <path
              d="M34 30C34 27.7909 35.7909 26 38 26H82C84.2091 26 86 27.7909 86 30V52C86 66.3594 74.3594 78 60 78C45.6406 78 34 66.3594 34 52V30Z"
              fill="url(#trophyGold)"
            />
            <!-- Star Emblem -->
            <path
              d="M60 37L62.9 43.2L69.7 44.1L64.7 48.8L66 55.6L60 52.3L54 55.6L55.3 48.8L50.3 44.1L57.1 43.2L60 37Z"
              fill="#fff7db"
            />
            <defs>
              <linearGradient id="trophyGold" x1="34" y1="26" x2="86" y2="78" gradientUnits="userSpaceOnUse">
                <stop stop-color="#ffd966" />
                <stop offset="0.55" stop-color="#fdb528" />
                <stop offset="1" stop-color="#e09100" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      <!-- 2. Total Orders (lg:col-span-2) -->
      <div class="lg:col-span-2">
        <UiStatCard
          layout="vertical"
          title="Total Orders"
          value="155k"
          change="+22%"
          trend="up"
          badge-text="Last 4 Month"
          variant="primary"
          :icon="ShoppingCart"
          class="h-full"
        />
      </div>

      <!-- 3. Total Sales (lg:col-span-2) -->
      <div class="lg:col-span-2">
        <UiStatCard
          layout="vertical"
          title="Total Sales"
          value="13.4k"
          change="+38%"
          trend="up"
          badge-text="Last Six Month"
          variant="success"
          :icon="ShoppingBag"
          class="h-full"
        />
      </div>

      <!-- 4. Total Profit Sparkline Card (lg:col-span-2) -->
      <div class="card p-5 flex flex-col justify-between lg:col-span-2">
        <div>
          <div class="flex items-center gap-1.5">
            <h5 class="text-xl font-semibold text-base-content leading-tight">$88.5k</h5>
            <span class="text-[0.8125rem] font-medium text-error">-18%</span>
          </div>
          <p class="mt-0.5 text-[0.8125rem] text-base-content/60">Total Profit</p>
        </div>

        <!-- Mini Bar Sparkline -->
        <div class="mt-5 flex items-end justify-between gap-2 h-20 px-1">
          <div
            v-for="bar in profitBars"
            :key="bar.label"
            class="flex flex-1 flex-col items-center gap-1.5 h-full justify-end"
          >
            <div class="w-2.5 rounded-full bg-base-200 h-14 flex items-end overflow-hidden">
              <div
                class="w-full rounded-full transition-all duration-300"
                :class="bar.color"
                :style="{ height: `${bar.h}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Total Growth Sparkline Card (lg:col-span-2) -->
      <div class="card p-5 flex flex-col justify-between lg:col-span-2">
        <div>
          <div class="flex items-center gap-1.5">
            <h5 class="text-xl font-semibold text-base-content leading-tight">$27.9k</h5>
            <span class="text-[0.8125rem] font-medium text-success">+16%</span>
          </div>
          <p class="mt-0.5 text-[0.8125rem] text-base-content/60">Total Growth</p>
        </div>

        <!-- Smooth SVG Area Sparkline -->
        <div class="mt-4 h-20 w-full flex items-end">
          <svg viewBox="0 0 160 65" class="w-full h-16 overflow-visible">
            <defs>
              <linearGradient id="growthGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="rgb(var(--su))" stop-opacity="0.32" />
                <stop offset="100%" stop-color="rgb(var(--su))" stop-opacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d="M 4 50 C 28 50, 34 32, 56 36 C 78 40, 92 18, 116 24 C 134 28, 144 8, 156 10 L 156 62 L 4 62 Z"
              fill="url(#growthGrad)"
            />
            <path
              d="M 4 50 C 28 50, 34 32, 56 36 C 78 40, 92 18, 116 24 C 134 28, 144 8, 156 10"
              fill="none"
              stroke="rgb(var(--su))"
              stroke-width="3"
              stroke-linecap="round"
            />
            <circle cx="156" cy="10" r="4.5" class="fill-base-100 stroke-success" stroke-width="2.5" />
          </svg>
        </div>
      </div>
    </div>

    <!-- ROW 2: Organic Sessions (4 col) + Project Timeline Split Card (8 col) -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Organic Sessions Card (lg:col-span-4) -->
      <div class="card p-5 lg:col-span-4 flex flex-col justify-between">
        <div class="flex items-start justify-between">
          <div>
            <h5 class="card-title">Organic Sessions</h5>
            <p class="card-subtitle">Distribusi trafik berdasarkan negara</p>
          </div>
          <UiDropdown
            :items="cardMenuItems"
            align="right"
            @select="(item) => handleCardAction('Organic Sessions', item)"
          >
            <template #trigger>
              <button class="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-base-content">
                <MoreVertical class="h-4 w-4" />
              </button>
            </template>
          </UiDropdown>
        </div>

        <!-- Semi-segmented Donut Gauge SVG -->
        <div class="my-4 flex flex-col items-center justify-center">
          <div class="relative flex h-48 w-48 items-center justify-center">
            <svg viewBox="0 0 120 120" class="h-full w-full -rotate-90">
              <!-- Track circle -->
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="currentColor"
                class="text-base-200"
                stroke-width="12"
              />
              <!-- USA (36% -> 104 of 289) -->
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="rgb(var(--p))"
                stroke-width="12"
                stroke-dasharray="96 289"
                stroke-dashoffset="0"
                stroke-linecap="round"
                class="cursor-pointer transition-opacity hover:opacity-80"
                @mouseenter="selectedRegion = organicRegions[0] ?? null"
                @mouseleave="selectedRegion = null"
              />
              <!-- Indonesia (28% -> 81 of 289) -->
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="rgb(var(--su))"
                stroke-width="12"
                stroke-dasharray="73 289"
                stroke-dashoffset="-104"
                stroke-linecap="round"
                class="cursor-pointer transition-opacity hover:opacity-80"
                @mouseenter="selectedRegion = organicRegions[1] ?? null"
                @mouseleave="selectedRegion = null"
              />
              <!-- India (18% -> 52 of 289) -->
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="rgb(var(--wa))"
                stroke-width="12"
                stroke-dasharray="44 289"
                stroke-dashoffset="-185"
                stroke-linecap="round"
                class="cursor-pointer transition-opacity hover:opacity-80"
                @mouseenter="selectedRegion = organicRegions[2] ?? null"
                @mouseleave="selectedRegion = null"
              />
              <!-- Canada + Japan -->
              <circle
                cx="60"
                cy="60"
                r="46"
                fill="none"
                stroke="rgb(var(--in))"
                stroke-width="12"
                stroke-dasharray="42 289"
                stroke-dashoffset="-237"
                stroke-linecap="round"
                class="cursor-pointer transition-opacity hover:opacity-80"
                @mouseenter="selectedRegion = organicRegions[3] ?? null"
                @mouseleave="selectedRegion = null"
              />
            </svg>

            <div class="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-3xl font-bold text-base-content">
                {{ selectedRegion ? selectedRegion.sessions : '89k' }}
              </span>
              <span class="mt-0.5 text-xs text-base-content/55">
                {{ selectedRegion ? `${selectedRegion.country} (${selectedRegion.percent}%)` : '2026 Sessions' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom Legend Dots -->
        <div class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 pt-2 border-t border-base-300/60">
          <button
            v-for="reg in organicRegions"
            :key="reg.country"
            type="button"
            class="flex items-center gap-1.5 text-xs text-base-content/75 hover:text-base-content transition-colors"
            @mouseenter="selectedRegion = reg"
            @mouseleave="selectedRegion = null"
          >
            <span class="h-2.5 w-2.5 rounded-full" :class="reg.dotClass" />
            <span>{{ reg.country }}</span>
          </button>
        </div>
      </div>

      <!-- Project Timeline & Project List Split Card (lg:col-span-8) -->
      <div class="card overflow-hidden lg:col-span-8">
        <div class="grid grid-cols-1 md:grid-cols-12 h-full">
          <!-- Left 8 cols: Project Timeline Gantt Chart -->
          <div class="p-5 md:col-span-8 flex flex-col justify-between">
            <div>
              <h5 class="card-title">Project Timeline</h5>
              <p class="card-subtitle">Total 840 Task Completed</p>
            </div>

            <!-- Horizontal Gantt Rows -->
            <div class="mt-6 space-y-4">
              <div
                v-for="item in ganttTasks"
                :key="item.person"
                class="grid grid-cols-12 items-center gap-3"
              >
                <span class="col-span-3 text-xs font-medium text-base-content/70 truncate">
                  {{ item.person }}
                </span>
                <div class="col-span-9 relative h-7 rounded-md bg-base-200/70 flex items-center">
                  <!-- Vertical subtle grid lines -->
                  <div class="pointer-events-none absolute inset-0 grid grid-cols-6">
                    <div v-for="n in 6" :key="n" class="border-r border-dashed border-base-300/70 last:border-r-0" />
                  </div>
                  <!-- Gantt Pill Bar -->
                  <div
                    class="relative z-10 h-6 rounded-btn px-3 flex items-center text-[0.75rem] font-medium truncate transition-all hover:scale-[1.02]"
                    :class="item.badgeBg"
                    :style="{ marginLeft: `${item.startCol}%`, width: `${item.widthCol}%` }"
                  >
                    {{ item.task }}
                  </div>
                </div>
              </div>
            </div>

            <!-- X-Axis Month Labels -->
            <div class="mt-4 grid grid-cols-12 items-center gap-3 pt-2 border-t border-base-300/60">
              <div class="col-span-3" />
              <div class="col-span-9 grid grid-cols-6 text-center text-xs text-base-content/50">
                <span v-for="m in ganttMonths" :key="m">{{ m }}</span>
              </div>
            </div>
          </div>

          <!-- Right 4 cols: Project List -->
          <div class="p-5 md:col-span-4 border-t md:border-t-0 md:border-l border-base-300/80 flex flex-col justify-between">
            <div class="flex items-start justify-between">
              <div>
                <h5 class="card-title">Project List</h5>
                <p class="card-subtitle">4 Ongoing Project</p>
              </div>
              <UiDropdown
                :items="cardMenuItems"
                align="right"
                @select="(item) => handleCardAction('Project List', item)"
              >
                <template #trigger>
                  <button class="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-base-content">
                    <MoreVertical class="h-4 w-4" />
                  </button>
                </template>
              </UiDropdown>
            </div>

            <div class="mt-5 space-y-5 my-auto">
              <div
                v-for="proj in projectList"
                :key="proj.title"
                class="flex items-center gap-3.5"
              >
                <component :is="proj.icon" class="h-5 w-5 shrink-0 text-[var(--text-muted)]" />
                <div class="min-w-0 flex-1">
                  <h6 class="text-sm font-semibold text-base-content truncate">{{ proj.title }}</h6>
                  <p class="text-xs text-base-content/55">{{ proj.tasks }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ROW 3: Weekly Overview + Social Network Visits + Meeting Schedule (3 Equal Columns) -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <!-- 1. Weekly Overview Card -->
      <div class="card p-5 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h5 class="card-title">Weekly Overview</h5>
          <UiDropdown
            :items="cardMenuItems"
            align="right"
            @select="(item) => handleCardAction('Weekly Overview', item)"
          >
            <template #trigger>
              <button class="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-base-content">
                <MoreVertical class="h-4 w-4" />
              </button>
            </template>
          </UiDropdown>
        </div>

        <!-- Bar Chart with Peak Highlight Bar -->
        <div class="my-6">
          <div class="relative flex h-40 items-end justify-between gap-3 px-2 pt-4 border-b border-dashed border-base-300">
            <!-- Horizontal guide lines -->
            <div class="pointer-events-none absolute inset-x-0 top-4 bottom-6 flex flex-col justify-between">
              <div class="border-t border-dashed border-base-300/60" />
              <div class="border-t border-dashed border-base-300/60" />
              <div class="border-t border-dashed border-base-300/60" />
            </div>

            <div
              v-for="d in weeklyDays"
              :key="d.day"
              class="relative z-10 flex flex-1 flex-col items-center gap-2 h-full justify-end"
            >
              <div
                class="w-3.5 rounded-t-full transition-all duration-300"
                :class="
                  d.highlight
                    ? 'bg-primary shadow-[0_4px_10px_0_rgb(var(--p)/0.45)]'
                    : 'bg-primary/15 hover:bg-primary/30'
                "
                :style="{ height: `${d.val}%` }"
              />
            </div>
          </div>
          <div class="mt-2 flex justify-between px-2 text-xs text-base-content/50">
            <span v-for="d in weeklyDays" :key="d.day" class="flex-1 text-center">{{ d.day }}</span>
          </div>
        </div>

        <div>
          <div class="flex items-center gap-4 mb-4">
            <h4 class="text-2xl font-bold text-base-content">62%</h4>
            <p class="text-[0.8125rem] text-base-content/65 leading-snug">
              Your sales performance is 35% better compared to last month
            </p>
          </div>
          <button
            class="btn btn-primary w-full"
            @click="toast.info('Weekly Overview', 'Membuka rincian performa mingguan.')"
          >
            Details
          </button>
        </div>
      </div>

      <!-- 2. Social Network Visits Card -->
      <div class="card p-5 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h5 class="card-title">Social Network Visits</h5>
          <UiDropdown
            :items="cardMenuItems"
            align="right"
            @select="(item) => handleCardAction('Social Network Visits', item)"
          >
            <template #trigger>
              <button class="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-base-content">
                <MoreVertical class="h-4 w-4" />
              </button>
            </template>
          </UiDropdown>
        </div>

        <div class="my-4">
          <div class="flex items-center gap-2">
            <h4 class="text-2xl font-bold text-base-content">$24,895</h4>
            <span class="inline-flex items-center text-sm font-medium text-success">
              <ChevronUp class="h-4 w-4" />
              62%
            </span>
          </div>
          <p class="text-xs text-base-content/55">Last 1 Year Visits</p>
        </div>

        <ul class="space-y-4">
          <li
            v-for="item in socialVisits"
            :key="item.name"
            class="flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-field text-xs font-bold" :class="item.avatarBg">
                {{ item.short }}
              </div>
              <div class="min-w-0">
                <h6 class="text-sm font-semibold text-base-content truncate">{{ item.name }}</h6>
                <p class="text-xs text-base-content/55">{{ item.category }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2.5 shrink-0">
              <span class="text-sm font-semibold text-base-content">{{ item.visits }}</span>
              <span class="badge px-2.5 py-0.5 text-xs font-medium" :class="item.badgeClass">
                {{ item.change }}
              </span>
            </div>
          </li>
        </ul>
      </div>

      <!-- 3. Meeting Schedule Card -->
      <div class="card p-5 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4">
          <h5 class="card-title">Meeting Schedule</h5>
          <UiDropdown
            :items="cardMenuItems"
            align="right"
            @select="(item) => handleCardAction('Meeting Schedule', item)"
          >
            <template #trigger>
              <button class="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-base-content">
                <MoreVertical class="h-4 w-4" />
              </button>
            </template>
          </UiDropdown>
        </div>

        <ul class="space-y-3.5">
          <li
            v-for="meet in meetingSchedules"
            :key="meet.title"
            class="flex items-center justify-between gap-3"
          >
            <div class="flex items-center gap-3 min-w-0">
              <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-field text-xs font-semibold" :class="meet.avatarClass">
                {{ meet.initials }}
              </div>
              <div class="min-w-0">
                <h6 class="text-sm font-semibold text-base-content truncate">{{ meet.title }}</h6>
                <div class="flex items-center gap-1.5 text-xs text-base-content/55">
                  <Calendar class="h-3.5 w-3.5 shrink-0" />
                  <span class="truncate">{{ meet.datetime }}</span>
                </div>
              </div>
            </div>

            <span class="badge px-2.5 py-0.5 text-xs font-medium shrink-0" :class="meet.badgeClass">
              {{ meet.tag }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- ROW 4: Most Sales in Countries (4 col) + CRM Users & Roles Table (8 col) -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <!-- Most Sales in Countries (lg:col-span-4) -->
      <div class="card p-5 lg:col-span-4 flex flex-col justify-between">
        <div class="flex items-center justify-between">
          <h5 class="card-title">Most Sales in Countries</h5>
          <UiDropdown
            :items="cardMenuItems"
            align="right"
            @select="(item) => handleCardAction('Most Sales in Countries', item)"
          >
            <template #trigger>
              <button class="btn btn-ghost btn-xs btn-square text-base-content/50 hover:text-base-content">
                <MoreVertical class="h-4 w-4" />
              </button>
            </template>
          </UiDropdown>
        </div>

        <div class="my-4">
          <div class="flex items-center gap-2">
            <h3 class="text-2xl font-bold text-base-content">24,895</h3>
            <span class="badge badge-soft badge-success px-2.5 py-0.5 text-xs font-medium">
              +42%
            </span>
          </div>
          <p class="mt-0.5 text-xs text-base-content/55">Sales Last 90 Days</p>
        </div>

        <div class="border-t border-base-300/80 divide-y divide-base-300/70">
          <div
            v-for="row in countrySales"
            :key="row.country"
            class="flex items-center justify-between py-2.5 text-sm"
          >
            <span class="text-base-content/85">{{ row.country }}</span>
            <div class="flex items-center gap-5">
              <span class="font-semibold text-base-content">{{ row.sales }}</span>
              <div class="flex items-center gap-1 w-14 justify-end">
                <span class="font-medium text-base-content">{{ row.percent }}</span>
                <ChevronUp v-if="row.up" class="h-4 w-4 text-success" />
                <ChevronDown v-else class="h-4 w-4 text-error" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CRM Users & Roles Table (lg:col-span-8) -->
      <div class="card overflow-hidden lg:col-span-8">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in crmUsers"
                :key="u.id"
                class="cursor-pointer transition-colors"
                @click="router.push('/users')"
              >
                <td>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                      :class="u.avatarClass"
                    >
                      {{ u.initials }}
                    </div>
                    <div>
                      <div class="font-medium text-base-content hover:text-primary transition-colors">
                        {{ u.name }}
                      </div>
                      <div class="text-xs text-base-content/55">{{ u.handle }}</div>
                    </div>
                  </div>
                </td>
                <td class="text-base-content/70">{{ u.email }}</td>
                <td>
                  <div class="flex items-center gap-2">
                    <component
                      :is="roleMeta[u.role].icon"
                      class="h-4 w-4 shrink-0"
                      :class="roleMeta[u.role].colorClass"
                    />
                    <span class="text-base-content/80">{{ u.role }}</span>
                  </div>
                </td>
                <td>
                  <span class="badge px-2.5 py-0.5 text-xs font-medium" :class="statusBadgeMap[u.status]">
                    {{ u.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
