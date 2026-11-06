<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import {
  Menu,
  Search,
  Palette,
  Sun,
  Moon,
  Bell,
  Check,
  LayoutGrid,
  LayoutDashboard,
  Users,
  Wand2,
  Layers,
  User,
  Settings,
  LogOut,
  MailOpen,
  ShoppingCart,
  PieChart,
  AlertTriangle,
  Package,
  MessagesSquare,
  BarChart3,
  CalendarDays,
} from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import GitHubStarButton from '@/components/layout/GitHubStarButton.vue'

interface NotificationItem {
  id: string
  title: string
  description: string
  time: string
  unread: boolean
  initials?: string
  variant: 'primary' | 'success' | 'warning' | 'error' | 'info'
  icon?: any
}

const themeStore = useThemeStore()

const navbarWidthClass = computed(() => {
  switch (themeStore.contentWidth) {
    case 'full':
      return 'w-full max-w-none px-4 sm:px-8'
    case 'wide':
      return 'max-w-[1720px] w-full mx-auto px-4 sm:px-8'
    case 'compact':
    default:
      return 'max-w-[1440px] w-full mx-auto px-4 sm:px-6'
  }
})
const showPresetMenu = ref(false)
const showShortcuts = ref(false)
const showNotifications = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')

function closeAllMenus() {
  showPresetMenu.value = false
  showShortcuts.value = false
  showNotifications.value = false
  showUserMenu.value = false
}

const shortcuts = [
  {
    title: 'CRM Dashboard',
    subtitle: 'Sales & Analytics',
    to: '/',
    icon: LayoutDashboard,
    variant: 'primary',
  },
  {
    title: 'User Management',
    subtitle: 'Manage Contributors',
    to: '/users',
    icon: Users,
    variant: 'success',
  },
  {
    title: 'Project Wizard',
    subtitle: '4-Step Deployment',
    to: '/project-wizard',
    icon: Wand2,
    variant: 'warning',
  },
  {
    title: 'Kalender Tim',
    subtitle: 'Agenda Bulanan',
    to: '/calendar',
    icon: CalendarDays,
    variant: 'secondary',
  },
  {
    title: 'UI Components',
    subtitle: '22+ Semantic Kits',
    to: '/components',
    icon: Layers,
    variant: 'info',
  },
  {
    title: 'Product Catalog',
    subtitle: 'Inventory & Pricing',
    to: '/products',
    icon: Package,
    variant: 'primary',
  },
  {
    title: 'Orders',
    subtitle: 'Invoices & Refunds',
    to: '/orders',
    icon: ShoppingCart,
    variant: 'warning',
  },
  {
    title: 'Support Inbox',
    subtitle: 'Live Conversations',
    to: '/inbox',
    icon: MessagesSquare,
    variant: 'success',
  },
  {
    title: 'Analytics',
    subtitle: 'Revenue & Funnels',
    to: '/analytics',
    icon: BarChart3,
    variant: 'info',
  },
  {
    title: 'Settings',
    subtitle: 'Workspace & Billing',
    to: '/settings',
    icon: Settings,
    variant: 'error',
  },
]

const notifications = ref<NotificationItem[]>([
  {
    id: '1',
    title: 'Congratulation Arif!',
    description: 'Won the monthly best seller gold badge ($42.8k target)',
    time: '1h ago',
    unread: true,
    initials: 'AP',
    variant: 'primary',
  },
  {
    id: '2',
    title: 'Whoo! You have a new order',
    description: 'ACME Inc. made new enterprise order Rp 14.500.000',
    time: '3h ago',
    unread: true,
    variant: 'success',
    icon: ShoppingCart,
  },
  {
    id: '3',
    title: 'Monthly report is generated',
    description: 'October monthly CRM financial report is ready to review',
    time: '1 day ago',
    unread: true,
    variant: 'info',
    icon: PieChart,
  },
  {
    id: '4',
    title: 'CPU Utilization Alert',
    description: 'Cluster ap-southeast-1 CPU utilization is at 84.2%',
    time: '2 days ago',
    unread: false,
    variant: 'warning',
    icon: AlertTriangle,
  },
])

const unreadCount = computed(() => notifications.value.filter((n) => n.unread).length)

function markAllAsRead() {
  notifications.value.forEach((n) => (n.unread = false))
}

function markAsRead(id: string) {
  const item = notifications.value.find((n) => n.id === id)
  if (item) {
    item.unread = false
  }
}
</script>

<template>
  <!-- Tinkit Detached Sticky Navbar Container -->
  <header
    class="sticky top-0 z-30 pt-4 sm:pt-5 w-full transition-all duration-200"
    :class="navbarWidthClass"
  >
    <nav
      class="flex h-16 items-center justify-between gap-4 rounded-box bg-[var(--surface-1)] px-4 sm:px-5 backdrop-blur-md border border-[var(--border)] shadow-[0_0.25rem_0.875rem_0_rgba(38,43,67,0.08)] dark:shadow-[0_0.25rem_0.875rem_0_rgba(0,0,0,0.32)]"
    >
      <!-- Left: Hamburger + Clean Tinkit Search Bar -->
      <div class="flex items-center gap-3 flex-1">
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-circle lg:hidden"
          aria-label="Open menu"
          @click="themeStore.mobileSidebarOpen = true"
        >
          <Menu class="h-5 w-5" />
        </button>

        <div class="relative flex items-center w-full max-w-md">
          <Search class="h-4.5 w-4.5 text-[var(--text-muted)] shrink-0 mr-2.5" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search (Ctrl+/)"
            class="w-full bg-transparent text-sm text-[var(--text)] placeholder:text-[var(--text-faint)] focus:outline-none"
          />
          <kbd
            class="hidden sm:inline-flex items-center rounded border border-[var(--border)] bg-[var(--surface-input)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
          >
            ⌘K
          </kbd>
        </div>
      </div>

      <!-- Right: Tinkit Icon Actions (Theme, Shortcuts, Notifications, User Avatar) -->
      <div class="flex items-center gap-1 sm:gap-1.5">
        <!-- Backdrop when any dropdown is open -->
        <div
          v-if="showPresetMenu || showShortcuts || showNotifications || showUserMenu"
          class="fixed inset-0 z-40"
          @click="closeAllMenus"
        />

        <!-- 0. GitHub Repository & Live Stars -->
        <GitHubStarButton />

        <!-- 1. Theme Preset Switcher -->
        <div class="relative z-50">
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle"
            :class="{ 'bg-base-200': showPresetMenu }"
            title="Switch Color Theme"
            @click="
              showPresetMenu = !showPresetMenu;
              showShortcuts = false;
              showNotifications = false;
              showUserMenu = false
            "
          >
            <Palette class="h-[19px] w-[19px] text-base-content/75" />
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showPresetMenu"
              class="absolute right-0 mt-2.5 w-60 rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] p-2 shadow-xl"
            >
              <div class="px-2.5 py-1.5 text-xs font-medium text-[var(--text-muted)]">
                Theme Presets
              </div>
              <div class="space-y-0.5">
                <button
                  v-for="preset in themeStore.presets"
                  :key="preset.id"
                  type="button"
                  class="flex w-full items-center justify-between rounded-btn px-2.5 py-2 text-left text-xs font-medium transition-colors cursor-pointer"
                  :class="
                    themeStore.activeTheme === preset.id
                      ? 'bg-primary text-primary-content font-semibold'
                      : 'text-[var(--text)] hover:bg-[var(--surface-raised)]'
                  "
                  @click="themeStore.setTheme(preset.id); showPresetMenu = false"
                >
                  <div class="flex items-center gap-2.5">
                    <div
                      class="flex items-center gap-0.5 rounded-btn border border-[var(--border-strong)] p-1"
                      :style="{ backgroundColor: themeStore.isDark ? preset.preview.bg : preset.lightPreview.bg }"
                    >
                      <span
                        class="h-2.5 w-2.5 rounded-full"
                        :style="{ backgroundColor: themeStore.isDark ? preset.preview.primary : preset.lightPreview.primary }"
                      />
                      <span
                        class="h-2.5 w-2.5 rounded-full"
                        :style="{ backgroundColor: themeStore.isDark ? preset.preview.secondary : preset.lightPreview.secondary }"
                      />
                      <span
                        class="h-2.5 w-2.5 rounded-full"
                        :style="{ backgroundColor: themeStore.isDark ? preset.preview.accent : preset.lightPreview.accent }"
                      />
                    </div>
                    <span>{{ preset.name }}</span>
                  </div>
                  <Check v-if="themeStore.activeTheme === preset.id" class="h-3.5 w-3.5" />
                </button>
              </div>
              <div class="mt-2 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  class="btn btn-primary btn-xs btn-block"
                  @click="showPresetMenu = false; themeStore.customizerOpen = true"
                >
                  <Palette class="h-3.5 w-3.5" />
                  Open Theme Studio
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 2. Light / Dark Mode Switcher -->
        <button
          type="button"
          class="btn btn-ghost btn-sm btn-circle"
          :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
          @click="themeStore.toggleDarkLight"
        >
          <Sun v-if="themeStore.isDark" class="h-[19px] w-[19px] text-warning" />
          <Moon v-else class="h-[19px] w-[19px] text-base-content/75" />
        </button>

        <!-- 3. Quick Shortcuts Grid Dropdown (Tinkit Style) -->
        <div class="relative z-50">
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle"
            :class="{ 'bg-base-200': showShortcuts }"
            title="Quick Shortcuts"
            @click="
              showShortcuts = !showShortcuts;
              showPresetMenu = false;
              showNotifications = false;
              showUserMenu = false
            "
          >
            <LayoutGrid class="h-[19px] w-[19px] text-base-content/75" />
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showShortcuts"
              class="absolute right-0 mt-2.5 w-72 sm:w-80 rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] shadow-xl overflow-hidden"
            >
              <div class="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <h6 class="text-sm font-semibold text-base-content">Shortcuts</h6>
                <span class="badge badge-xs badge-soft badge-primary">Quick Links</span>
              </div>
              <div class="grid grid-cols-2 divide-x divide-y divide-[var(--border)]">
                <RouterLink
                  v-for="sc in shortcuts"
                  :key="sc.to"
                  :to="sc.to"
                  class="flex flex-col items-center justify-center p-4 text-center hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06] transition-colors"
                  @click="showShortcuts = false"
                >
                  <div
                    class="flex h-11 w-11 items-center justify-center rounded-field mb-2"
                    :class="`avatar-soft-${sc.variant}`"
                  >
                    <component :is="sc.icon" class="h-5 w-5" />
                  </div>
                  <span class="text-xs font-semibold text-base-content">{{ sc.title }}</span>
                  <span class="text-[11px] text-base-content/50 mt-0.5">{{ sc.subtitle }}</span>
                </RouterLink>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 4. Notifications Dropdown (Tinkit Style) -->
        <div class="relative z-50">
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle relative"
            :class="{ 'bg-base-200': showNotifications }"
            title="Notifications"
            @click="
              showNotifications = !showNotifications;
              showPresetMenu = false;
              showShortcuts = false;
              showUserMenu = false
            "
          >
            <Bell class="h-[19px] w-[19px] text-base-content/75" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-error ring-2 ring-base-100"
            />
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showNotifications"
              class="absolute right-0 mt-2.5 w-80 sm:w-96 rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] shadow-xl overflow-hidden"
            >
              <div class="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <h6 class="text-sm font-semibold text-base-content">Notification</h6>
                <div class="flex items-center gap-2">
                  <span
                    v-if="unreadCount > 0"
                    class="badge badge-xs badge-soft badge-primary font-semibold"
                  >
                    {{ unreadCount }} New
                  </span>
                  <button
                    type="button"
                    class="text-base-content/60 hover:text-base-content p-1 cursor-pointer"
                    title="Mark all as read"
                    @click="markAllAsRead"
                  >
                    <MailOpen class="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div class="max-h-80 overflow-y-auto divide-y divide-[var(--border)]">
                <div
                  v-for="item in notifications"
                  :key="item.id"
                  class="flex items-start gap-3.5 px-4 py-3 transition-colors cursor-pointer hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06]"
                  @click="markAsRead(item.id)"
                >
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    :class="`avatar-soft-${item.variant}`"
                  >
                    <component :is="item.icon" v-if="item.icon" class="h-4 w-4" />
                    <span v-else>{{ item.initials }}</span>
                  </div>

                  <div class="flex-1 min-w-0">
                    <h6 class="text-xs font-semibold text-base-content truncate mb-0.5">
                      {{ item.title }}
                    </h6>
                    <p class="text-xs text-base-content/65 line-clamp-2 leading-snug">
                      {{ item.description }}
                    </p>
                    <span class="text-[11px] text-base-content/45 mt-1 block">
                      {{ item.time }}
                    </span>
                  </div>

                  <span
                    v-if="item.unread"
                    class="h-2 w-2 rounded-full bg-primary shrink-0 mt-1.5"
                  />
                </div>
              </div>

              <div class="border-t border-base-300 p-3">
                <button
                  type="button"
                  class="btn btn-primary btn-sm btn-block"
                  @click="showNotifications = false"
                >
                  View all notifications
                </button>
              </div>
            </div>
          </Transition>
        </div>

        <!-- 5. User Profile Avatar Dropdown (Tinkit avatar-online style) -->
        <div class="relative z-50 ml-1">
          <button
            type="button"
            class="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs cursor-pointer hover:ring-2 hover:ring-primary/30 transition-all"
            title="Account Menu"
            @click="
              showUserMenu = !showUserMenu;
              showPresetMenu = false;
              showShortcuts = false;
              showNotifications = false
            "
          >
            <span>AP</span>
            <span
              class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-base-100"
            />
          </button>

          <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
          >
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2.5 w-56 rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] px-1 py-2 shadow-xl"
            >
              <div class="flex items-center gap-3 px-4 py-2 border-b border-[var(--border)] mb-1">
                <div class="relative flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-primary font-semibold text-xs">
                  AP
                  <span class="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-base-100" />
                </div>
                <div class="min-w-0">
                  <div class="text-xs font-semibold text-base-content truncate">Arif Pratama</div>
                  <div class="text-[11px] text-base-content/50 truncate">Admin</div>
                </div>
              </div>

              <div class="px-1.5 space-y-0.5">
                <RouterLink
                  to="/profile"
                  class="flex items-center gap-2.5 rounded-btn px-3 py-2 text-xs text-base-content/80 hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06] hover:text-base-content transition-colors"
                  @click="showUserMenu = false"
                >
                  <User class="h-4 w-4 text-base-content/60" />
                  <span>My Profile</span>
                </RouterLink>
                <RouterLink
                  to="/users"
                  class="flex items-center gap-2.5 rounded-btn px-3 py-2 text-xs text-base-content/80 hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06] hover:text-base-content transition-colors"
                  @click="showUserMenu = false"
                >
                  <Users class="h-4 w-4 text-base-content/60" />
                  <span>Users &amp; Roles</span>
                </RouterLink>
                <button
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-btn px-3 py-2 text-xs text-base-content/80 hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06] hover:text-base-content transition-colors cursor-pointer"
                  @click="showUserMenu = false; themeStore.customizerOpen = true"
                >
                  <Settings class="h-4 w-4 text-base-content/60" />
                  <span>Theme Settings</span>
                </button>
              </div>

              <div class="px-3 pt-2 mt-1 border-t border-[var(--border)]">
                <RouterLink
                  to="/login"
                  class="btn btn-error btn-sm btn-block"
                  @click="showUserMenu = false"
                >
                  <span>Logout</span>
                  <LogOut class="h-3.5 w-3.5" />
                </RouterLink>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </nav>
  </header>
</template>
