import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import ComponentsView from '@/views/ComponentsView.vue'
import UsersTableView from '@/views/UsersTableView.vue'
import ProjectWizardView from '@/views/ProjectWizardView.vue'
import ProfileView from '@/views/ProfileView.vue'
import LoginView from '@/views/LoginView.vue'
import ErrorView from '@/views/ErrorView.vue'
import ProductsView from '@/views/ProductsView.vue'
import ProductDetailView from '@/views/ProductDetailView.vue'
import ProductEditorView from '@/views/ProductEditorView.vue'
import OrdersView from '@/views/OrdersView.vue'
import InboxView from '@/views/InboxView.vue'
import AnalyticsView from '@/views/AnalyticsView.vue'
import SettingsView from '@/views/SettingsView.vue'
import OnboardingView from '@/views/OnboardingView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: {
        title: 'Dashboard Overview',
        subtitle: 'Ringkasan analitik, performa, dan aktivitas sistem Tinkit',
      },
    },
    {
      path: '/components',
      name: 'components',
      component: ComponentsView,
      meta: {
        title: 'UI Components Showcase',
        subtitle: 'Katalog 20+ komponen semantik modular di atas murni Tailwind CSS',
      },
    },
    {
      path: '/project-wizard',
      name: 'project-wizard',
      component: ProjectWizardView,
      meta: {
        title: 'Project Wizard Demo',
        subtitle: 'Alur pembuatan proyek 4 langkah dengan Stepper, Rich Editor & Multi-Upload',
      },
    },
    {
      path: '/users',
      name: 'users',
      component: UsersTableView,
      meta: {
        title: 'Users & Data Management',
        subtitle: 'Contoh tabel data dengan filter, pencarian, dan modal CRUD',
      },
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsView,
      meta: {
        title: 'Product Catalog',
        subtitle: 'Katalog produk dengan filter lanjutan, DataTable, dan form CRUD lengkap',
      },
    },
    {
      path: '/products/new',
      name: 'product-new',
      component: ProductEditorView,
      meta: {
        title: 'Tambah Produk Baru',
        subtitle: 'Lengkapi atribut katalog, harga, stok, dan media produk baru',
      },
    },
    {
      path: '/products/:id/edit',
      name: 'product-edit',
      component: ProductEditorView,
      meta: {
        title: 'Edit Produk',
        subtitle: 'Perbarui atribut katalog, harga, stok, dan media produk',
      },
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductDetailView,
      meta: {
        title: 'Product Detail',
        subtitle: 'Halaman detail produk dengan galeri, ulasan, Q&A, dokumen, dan pengaturan harga',
      },
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView,
      meta: {
        title: 'Orders & Invoices',
        subtitle: 'Manajemen pesanan, fulfillment, pembayaran, dan proses refund multi-kanal',
      },
    },
    {
      path: '/inbox',
      name: 'inbox',
      component: InboxView,
      meta: {
        title: 'Support Inbox',
        subtitle: 'Ruang kerja support dengan percakapan real-time, catatan internal, dan riwayat pesanan',
      },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: AnalyticsView,
      meta: {
        title: 'Analytics & Insights',
        subtitle: 'Performa pendapatan, kanal akuisisi, funnel konversi, dan laporan terjadwal',
      },
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        title: 'Workspace Settings',
        subtitle: 'Konfigurasi workspace, billing, notifikasi, keamanan, dan integrasi API',
      },
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: OnboardingView,
      meta: {
        title: 'Workspace Onboarding',
        layout: 'blank',
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView,
      meta: {
        title: 'User Profile & Settings',
        subtitle: 'Profil pengguna, linimasa aktivitas, pengaturan keamanan & sesi aktif',
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
      meta: {
        title: 'Authentication — Sign In & Register',
        layout: 'blank',
      },
    },
    {
      path: '/error/:code?',
      name: 'error',
      component: ErrorView,
      meta: {
        title: 'Error Pages Showcase (403, 404, 500)',
        subtitle: 'Tampilan halaman status HTTP Error 403, 404, dan 500',
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/error/404',
    },
  ],
})

export default router
