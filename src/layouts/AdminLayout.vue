<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppNavbar from '@/components/layout/AppNavbar.vue'
import ThemeCustomizerDrawer from '@/components/layout/ThemeCustomizerDrawer.vue'
import UiToastContainer from '@/components/ui/UiToastContainer.vue'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()

const containerWidthClass = computed(() => {
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
</script>

<template>
  <div class="relative flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
    <!-- Left Vertical Navigation Menu -->
    <AppSidebar />

    <!-- Main Layout Page Wrapper -->
    <div class="relative z-10 flex flex-1 flex-col min-w-0">
      <!-- Detached Sticky Navbar -->
      <AppNavbar />

      <!-- Content Wrapper (Consistent 24px gap below navbar & dynamic content width: compact | wide | full) -->
      <main
        class="flex-1 pt-6 pb-8 transition-all duration-200"
        :class="containerWidthClass"
      >
        <slot />
      </main>

      <!-- Content Footer -->
      <footer
        class="py-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] transition-all duration-200"
        :class="containerWidthClass"
      >
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            © {{ new Date().getFullYear() }}, dibuat oleh
            <span class="font-semibold text-primary">Tinkit Open-Source</span>
          </div>
          <div class="flex flex-wrap items-center gap-5">
            <RouterLink to="/" class="hover:text-primary transition-colors">
              CRM Dashboard
            </RouterLink>
            <RouterLink to="/components" class="hover:text-primary transition-colors">
              UI Components
            </RouterLink>
            <RouterLink to="/users" class="hover:text-primary transition-colors">
              Users List
            </RouterLink>
            <button
              type="button"
              class="hover:text-primary transition-colors cursor-pointer"
              @click="themeStore.customizerOpen = true"
            >
              Theme Studio
            </button>
          </div>
        </div>
      </footer>
    </div>

    <!-- Slide-over Live Theme Studio -->
    <ThemeCustomizerDrawer />

    <!-- Global Floating Toast Container -->
    <UiToastContainer />
  </div>
</template>
