<script setup lang="ts">
import { ref, computed } from 'vue'
import { useToast } from '@/stores/toast'
import {
  Search,
  UserPlus,
  FileSpreadsheet,
  FileText,
  Trash2,
  Edit3,
  Eye,
  ArrowUpDown,
  Users,
  UserCheck,
  Clock,
  Crown,
  Monitor,
  PieChart,
  User,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
} from 'lucide-vue-next'
import UiStatCard from '@/components/ui/UiStatCard.vue'
import UiModal from '@/components/ui/UiModal.vue'
import UiEmptyState from '@/components/ui/UiEmptyState.vue'
import UiSelect from '@/components/ui/UiSelect.vue'
import { exportToXLSX, exportToPDF } from '@/utils/exportData'
import UiFloatingPanel from '@/components/ui/UiFloatingPanel.vue'

interface UserRecord {
  id: number
  name: string
  handle: string
  email: string
  role: 'Admin' | 'Editor' | 'Author' | 'Maintainer' | 'Subscriber'
  department: string
  plan: string
  status: 'Active' | 'Pending' | 'Inactive'
  joinedAt: string
  avatarBg: string
}

const toast = useToast()

const users = ref<UserRecord[]>([
  { id: 1, name: 'Arif Budiman', handle: '@arifb', email: 'arif.budiman@tinkit.example', role: 'Admin', department: 'Engineering', plan: 'Enterprise', status: 'Active', joinedAt: '12 Jan 2024', avatarBg: 'avatar-soft-primary' },
  { id: 2, name: 'Rina Kartika', handle: '@rinak', email: 'rina.kartika@tinkit.example', role: 'Maintainer', department: 'Design Studio', plan: 'Team', status: 'Active', joinedAt: '04 Feb 2024', avatarBg: 'avatar-soft-info' },
  { id: 3, name: 'Dimas Pratama', handle: '@dimasp', email: 'dimas.pratama@tinkit.example', role: 'Editor', department: 'Engineering', plan: 'Company', status: 'Active', joinedAt: '19 Mar 2024', avatarBg: 'avatar-soft-warning' },
  { id: 4, name: 'Nadia Putri', handle: '@nadiap', email: 'nadia.putri@tinkit.example', role: 'Author', department: 'Product', plan: 'Basic', status: 'Pending', joinedAt: '28 Apr 2024', avatarBg: 'avatar-soft-error' },
  { id: 5, name: 'Fajar Nugroho', handle: '@fajarn', email: 'fajar.nugroho@tinkit.example', role: 'Subscriber', department: 'Marketing', plan: 'Basic', status: 'Active', joinedAt: '15 Mei 2024', avatarBg: 'avatar-soft-success' },
  { id: 6, name: 'Siti Aminah', handle: '@sitia', email: 'siti.aminah@tinkit.example', role: 'Admin', department: 'Finance', plan: 'Enterprise', status: 'Active', joinedAt: '02 Jun 2024', avatarBg: 'avatar-soft-primary' },
  { id: 7, name: 'Hendra Wijaya', handle: '@hendraw', email: 'hendra.wijaya@tinkit.example', role: 'Maintainer', department: 'Engineering', plan: 'Team', status: 'Inactive', joinedAt: '21 Jul 2024', avatarBg: 'avatar-soft-secondary' },
  { id: 8, name: 'Maya Sari', handle: '@mayas', email: 'maya.sari@tinkit.example', role: 'Editor', department: 'Customer Success', plan: 'Company', status: 'Active', joinedAt: '09 Agu 2024', avatarBg: 'avatar-soft-warning' },
  { id: 9, name: 'Reza Rahadian', handle: '@rezar', email: 'reza.rahadian@tinkit.example', role: 'Author', department: 'Design Studio', plan: 'Team', status: 'Active', joinedAt: '14 Sep 2024', avatarBg: 'avatar-soft-info' },
  { id: 10, name: 'Larasati Dewi', handle: '@larasatid', email: 'larasati.dewi@tinkit.example', role: 'Subscriber', department: 'Product', plan: 'Basic', status: 'Pending', joinedAt: '30 Okt 2024', avatarBg: 'avatar-soft-success' },
  { id: 11, name: 'Bima Sakti', handle: '@bimas', email: 'bima.sakti@tinkit.example', role: 'Editor', department: 'Engineering', plan: 'Enterprise', status: 'Active', joinedAt: '11 Nov 2024', avatarBg: 'avatar-soft-primary' },
  { id: 12, name: 'Putri Ayu', handle: '@putria', email: 'putri.ayu@tinkit.example', role: 'Subscriber', department: 'Marketing', plan: 'Basic', status: 'Inactive', joinedAt: '05 Des 2024', avatarBg: 'avatar-soft-error' },
])

// Filters & Sorting
const searchQuery = ref('')
const roleFilter = ref<string>('ALL')
const departmentFilter = ref<string>('ALL')
const statusFilter = ref<string>('ALL')
const sortField = ref<'name' | 'role' | 'department'>('name')
const sortAsc = ref(true)

const roleOptions = [
  { label: 'Select Role (All)', value: 'ALL' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Author', value: 'Author' },
  { label: 'Editor', value: 'Editor' },
  { label: 'Maintainer', value: 'Maintainer' },
  { label: 'Subscriber', value: 'Subscriber' },
]

const departmentOptions = [
  { label: 'Select Department (All)', value: 'ALL' },
  { label: 'Engineering', value: 'Engineering' },
  { label: 'Design Studio', value: 'Design Studio' },
  { label: 'Product', value: 'Product' },
  { label: 'Marketing', value: 'Marketing' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Customer Success', value: 'Customer Success' },
]

const statusOptions = [
  { label: 'Select Status (All)', value: 'ALL' },
  { label: 'Active', value: 'Active' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Inactive', value: 'Inactive' },
]

// Pagination & Selection
const currentPage = ref(1)
const pageSize = ref(7)
const pageSizeOptions = [5, 7, 10, 25]
const showPageSizeMenu = ref(false)
const pageSizeRef = ref<HTMLElement | null>(null)
const selectedIds = ref<number[]>([])

function selectPageSize(size: number) {
  pageSize.value = size
  currentPage.value = 1
  showPageSizeMenu.value = false
}

const userExportCols = [
  { key: 'name', label: 'Full Name' },
  { key: 'handle', label: 'Username' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'department', label: 'Department' },
  { key: 'plan', label: 'Plan' },
  { key: 'status', label: 'Status' },
]

function handleExportUsersXLSX() {
  exportToXLSX(userExportCols, filteredUsers.value, {
    filename: 'tinkit-users-list',
    sheetName: 'Users Directory',
    title: 'Tinkit Enterprise Users Directory',
  })
  toast.success('Ekspor XLSX Berhasil', `${filteredUsers.value.length} data pengguna berhasil diekspor ke Excel.`)
}

function handleExportUsersPDF() {
  exportToPDF(userExportCols, filteredUsers.value, {
    title: 'Tinkit Enterprise Users Directory',
  })
  toast.info('Menyiapkan PDF', 'Jendela cetak laporan PDF telah dibuka.')
}

const filteredUsers = computed(() => {
  return users.value
    .filter((u) => {
      const q = searchQuery.value.toLowerCase().trim()
      const matchQuery =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      const matchRole = roleFilter.value === 'ALL' || u.role === roleFilter.value
      const matchDept = departmentFilter.value === 'ALL' || u.department === departmentFilter.value
      const matchStatus = statusFilter.value === 'ALL' || u.status === statusFilter.value
      return matchQuery && matchRole && matchDept && matchStatus
    })
    .sort((a, b) => {
      const valA = a[sortField.value].toLowerCase()
      const valB = b[sortField.value].toLowerCase()
      return sortAsc.value ? valA.localeCompare(valB) : valB.localeCompare(valA)
    })
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredUsers.value.slice(start, start + pageSize.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / pageSize.value)))

const allVisibleSelected = computed(() => {
  if (paginatedUsers.value.length === 0) return false
  return paginatedUsers.value.every((u) => selectedIds.value.includes(u.id))
})

function toggleSelectAll() {
  if (allVisibleSelected.value) {
    selectedIds.value = selectedIds.value.filter(
      (id) => !paginatedUsers.value.some((u) => u.id === id),
    )
  } else {
    const newIds = new Set([...selectedIds.value, ...paginatedUsers.value.map((u) => u.id)])
    selectedIds.value = Array.from(newIds)
  }
}

function toggleSelectUser(id: number) {
  const idx = selectedIds.value.indexOf(id)
  if (idx === -1) selectedIds.value.push(id)
  else selectedIds.value.splice(idx, 1)
}

function toggleSort(field: 'name' | 'role' | 'department') {
  if (sortField.value === field) {
    sortAsc.value = !sortAsc.value
  } else {
    sortField.value = field
    sortAsc.value = true
  }
}

function resetFilters() {
  searchQuery.value = ''
  roleFilter.value = 'ALL'
  departmentFilter.value = 'ALL'
  statusFilter.value = 'ALL'
  currentPage.value = 1
}

function deleteSelected() {
  const count = selectedIds.value.length
  users.value = users.value.filter((u) => !selectedIds.value.includes(u.id))
  selectedIds.value = []
  toast.warning('Pengguna Dihapus', `${count} akun pengguna telah dihapus dari daftar.`)
}

function deleteSingleUser(user: UserRecord) {
  users.value = users.value.filter((u) => u.id !== user.id)
  selectedIds.value = selectedIds.value.filter((id) => id !== user.id)
  toast.warning('Pengguna Dihapus', `${user.name} telah dihapus.`)
}

// Add User Modal
const showAddModal = ref(false)
const newUser = ref({
  name: '',
  email: '',
  role: 'Editor' as UserRecord['role'],
  department: 'Engineering',
  plan: 'Team',
})

function handleAddUser() {
  if (!newUser.value.name.trim() || !newUser.value.email.trim()) {
    toast.error('Data Belum Lengkap', 'Harap isi nama lengkap dan alamat email.')
    return
  }
  const id = Math.max(0, ...users.value.map((u) => u.id)) + 1
  const handle = '@' + (newUser.value.name.toLowerCase().replace(/\s+/g, '').slice(0, 8) || `user${id}`)
  users.value.unshift({
    id,
    name: newUser.value.name.trim(),
    handle,
    email: newUser.value.email.trim(),
    role: newUser.value.role,
    department: newUser.value.department.trim() || 'Engineering',
    plan: newUser.value.plan,
    status: 'Active',
    joinedAt: 'Baru saja',
    avatarBg: 'avatar-soft-primary',
  })
  showAddModal.value = false
  toast.success('Pengguna Ditambahkan', `${newUser.value.name} berhasil didaftarkan.`)
  newUser.value = { name: '', email: '', role: 'Editor', department: 'Engineering', plan: 'Team' }
}

const roleMeta: Record<UserRecord['role'], { icon: any; colorClass: string }> = {
  Admin: { icon: Crown, colorClass: 'text-primary' },
  Author: { icon: Monitor, colorClass: 'text-error' },
  Editor: { icon: Edit3, colorClass: 'text-warning' },
  Maintainer: { icon: PieChart, colorClass: 'text-info' },
  Subscriber: { icon: User, colorClass: 'text-success' },
}

const statusBadgeMap: Record<UserRecord['status'], string> = {
  Active: 'badge-soft badge-success',
  Pending: 'badge-soft badge-warning',
  Inactive: 'badge-soft badge-neutral',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Top 4 Horizontal Stat Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <UiStatCard
        layout="horizontal"
        title="Session"
        value="21,459"
        change="+29%"
        trend="up"
        description="Total Users"
        variant="primary"
        :icon="Users"
      />
      <UiStatCard
        layout="horizontal"
        title="Paid Users"
        value="4,567"
        change="+18%"
        trend="up"
        description="Last week analytics"
        variant="error"
        :icon="UserPlus"
      />
      <UiStatCard
        layout="horizontal"
        title="Active Users"
        value="19,860"
        change="-14%"
        trend="down"
        description="Last week analytics"
        variant="success"
        :icon="UserCheck"
      />
      <UiStatCard
        layout="horizontal"
        title="Pending Users"
        value="237"
        change="+42%"
        trend="up"
        description="Last week analytics"
        variant="warning"
        :icon="Clock"
      />
    </div>

    <!-- Main Users List Card (Search Filters + Action Toolbar + Table + Pagination) -->
    <div class="card overflow-visible">
      <!-- 1. Search Filters Header Section -->
      <div class="p-5">
        <h5 class="card-title mb-4">Search Filters</h5>
        <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
          <UiSelect
            v-model="roleFilter"
            :options="roleOptions"
            placeholder="Select Role"
            @update:model-value="currentPage = 1"
          />
          <UiSelect
            v-model="departmentFilter"
            :options="departmentOptions"
            placeholder="Select Department"
            @update:model-value="currentPage = 1"
          />
          <UiSelect
            v-model="statusFilter"
            :options="statusOptions"
            placeholder="Select Status"
            @update:model-value="currentPage = 1"
          />
        </div>
      </div>

      <!-- 2. Datatable Action Toolbar -->
      <div class="flex flex-col gap-3 border-t border-base-300/80 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
        <!-- Left: Custom Polished Per-Page Selector + Bulk Delete -->
        <div class="flex flex-wrap items-center gap-3">
          <div
            ref="pageSizeRef"
            class="relative inline-flex items-center"
          >
            <button
              type="button"
              class="inline-flex h-9 items-center gap-2 rounded-btn border border-base-300 bg-base-100 px-3 text-xs font-medium text-base-content transition-all hover:border-base-content/40 focus:outline-none"
              :class="showPageSizeMenu ? 'border-primary ring-2 ring-primary/20' : ''"
              @click="showPageSizeMenu = !showPageSizeMenu"
            >
              <span class="text-base-content/55">Show</span>
              <span class="rounded bg-primary/15 px-1.5 py-0.5 font-mono text-xs font-bold text-primary">
                {{ pageSize }}
              </span>
              <span class="text-base-content/55">entries</span>
              <ChevronDown
                class="h-3.5 w-3.5 text-base-content/45 transition-transform duration-200"
                :class="showPageSizeMenu ? 'rotate-180 text-primary' : ''"
              />
            </button>

            <UiFloatingPanel
              :open="showPageSizeMenu"
              :anchor="pageSizeRef"
              :offset="6"
              panel-role="menu"
              aria-label="Baris per halaman"
              panel-class="w-36 rounded-panel border border-base-300 bg-base-100 p-1.5 shadow-xl"
              @close="showPageSizeMenu = false"
            >
                <div class="px-2.5 py-1 text-[10px] font-semibold text-base-content/45">
                  Rows Per Page
                </div>
                <button
                  v-for="size in pageSizeOptions"
                  :key="size"
                  type="button"
                  class="flex w-full items-center justify-between rounded-btn px-2.5 py-1.5 text-xs font-medium transition-colors"
                  :class="
                    pageSize === size
                      ? 'bg-primary/15 text-primary font-semibold'
                      : 'text-base-content/80 hover:bg-base-200'
                  "
                  @click="selectPageSize(size)"
                >
                  <span>{{ size }} entries</span>
                  <Check v-if="pageSize === size" class="h-3.5 w-3.5 text-primary" />
                </button>
            </UiFloatingPanel>
          </div>

          <button
            v-if="selectedIds.length > 0"
            class="btn btn-error btn-sm gap-1.5"
            @click="deleteSelected"
          >
            <Trash2 class="h-3.5 w-3.5" />
            Delete ({{ selectedIds.length }})
          </button>
        </div>

        <!-- Right: Search Input + Export XLSX + Export PDF + Add New User -->
        <div class="flex flex-wrap items-center gap-2.5">
          <div class="relative flex-1 sm:w-56 sm:flex-initial">
            <Search class="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-base-content/40" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search User..."
              class="input input-sm pl-9"
              @input="currentPage = 1"
            />
          </div>

          <button
            type="button"
            class="btn btn-soft btn-success btn-sm gap-1.5"
            title="Ekspor ke Excel (.xlsx)"
            @click="handleExportUsersXLSX"
          >
            <FileSpreadsheet class="h-4 w-4" />
            <span>XLSX</span>
          </button>

          <button
            type="button"
            class="btn btn-soft btn-error btn-sm gap-1.5"
            title="Ekspor ke PDF (.pdf)"
            @click="handleExportUsersPDF"
          >
            <FileText class="h-4 w-4" />
            <span>PDF</span>
          </button>

          <button class="btn btn-primary btn-sm gap-1.5" @click="showAddModal = true">
            <UserPlus class="h-4 w-4" />
            Add New User
          </button>
        </div>
      </div>

      <!-- 3. Tinkit Users Table -->
      <div v-if="filteredUsers.length > 0" class="overflow-x-auto border-t border-base-300/80">
        <table class="table">
          <thead>
            <tr>
              <th class="w-12">
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :checked="allVisibleSelected"
                  @change="toggleSelectAll"
                />
              </th>
              <th>
                <button
                  class="inline-flex items-center gap-1.5 hover:text-primary transition-colors uppercase"
                  @click="toggleSort('name')"
                >
                  User
                  <ArrowUpDown class="h-3.5 w-3.5 opacity-50" />
                </button>
              </th>
              <th>Email</th>
              <th>
                <button
                  class="inline-flex items-center gap-1.5 hover:text-primary transition-colors uppercase"
                  @click="toggleSort('role')"
                >
                  Role
                  <ArrowUpDown class="h-3.5 w-3.5 opacity-50" />
                </button>
              </th>
              <th>
                <button
                  class="inline-flex items-center gap-1.5 hover:text-primary transition-colors uppercase"
                  @click="toggleSort('department')"
                >
                  Plan / Dept
                  <ArrowUpDown class="h-3.5 w-3.5 opacity-50" />
                </button>
              </th>
              <th>Status</th>
              <th class="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="user in paginatedUsers"
              :key="user.id"
              :class="{ 'bg-primary/5': selectedIds.includes(user.id) }"
            >
              <td>
                <input
                  type="checkbox"
                  class="checkbox checkbox-sm"
                  :checked="selectedIds.includes(user.id)"
                  @change="toggleSelectUser(user.id)"
                />
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <div
                    class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold"
                    :class="user.avatarBg"
                  >
                    {{ getInitials(user.name) }}
                  </div>
                  <div>
                    <p class="font-medium text-base-content leading-snug">{{ user.name }}</p>
                    <p class="text-xs text-base-content/50">{{ user.handle }}</p>
                  </div>
                </div>
              </td>
              <td class="text-base-content/75">{{ user.email }}</td>
              <td>
                <div class="flex items-center gap-2">
                  <component
                    :is="roleMeta[user.role].icon"
                    class="h-4 w-4 shrink-0"
                    :class="roleMeta[user.role].colorClass"
                  />
                  <span class="text-base-content/85">{{ user.role }}</span>
                </div>
              </td>
              <td>
                <div>
                  <span class="font-medium text-base-content/85">{{ user.plan }}</span>
                  <span class="block text-xs text-base-content/50">{{ user.department }}</span>
                </div>
              </td>
              <td>
                <span class="badge px-2.5 py-0.5 text-xs font-medium" :class="statusBadgeMap[user.status]">
                  {{ user.status }}
                </span>
              </td>
              <td class="text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    class="btn btn-ghost btn-xs btn-square text-base-content/55 hover:text-error"
                    title="Delete"
                    @click="deleteSingleUser(user)"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                  <button
                    class="btn btn-ghost btn-xs btn-square text-base-content/55 hover:text-primary"
                    title="Preview"
                    @click="toast.info('Detail Pengguna', `Menampilkan profil ${user.name}`)"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    class="btn btn-ghost btn-xs btn-square text-base-content/55 hover:text-primary"
                    title="Edit"
                    @click="toast.info('Edit Pengguna', `Membuka form edit untuk ${user.name}`)"
                  >
                    <Edit3 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-else class="border-t border-base-300/80 p-6">
        <UiEmptyState
          title="Tidak Ada Pengguna Ditemukan"
          description="Coba sesuaikan kata kunci pencarian atau reset filter untuk melihat seluruh daftar pengguna."
        >
          <template #actions>
            <button type="button" class="btn btn-primary btn-sm" @click="resetFilters">
              Reset Filter
            </button>
          </template>
        </UiEmptyState>
      </div>

      <!-- 4. Pagination Footer -->
      <div
        v-if="filteredUsers.length > 0"
        class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between px-5 py-4 border-t border-base-300/80 text-xs text-base-content/60"
      >
        <div>
          Showing
          <span class="font-semibold text-base-content">{{ (currentPage - 1) * pageSize + 1 }}</span>
          to
          <span class="font-semibold text-base-content">{{ Math.min(currentPage * pageSize, filteredUsers.length) }}</span>
          of
          <span class="font-semibold text-base-content">{{ filteredUsers.length }}</span>
          entries
        </div>

        <div class="flex items-center gap-1">
          <button
            class="btn btn-xs btn-square bg-base-200/70 border-transparent text-base-content/70 hover:bg-primary/15 hover:text-primary shadow-none"
            :disabled="currentPage <= 1"
            @click="currentPage--"
          >
            <ChevronLeft class="h-3.5 w-3.5" />
          </button>
          <button
            v-for="p in totalPages"
            :key="p"
            class="btn btn-xs h-7 min-w-7 rounded-btn font-medium"
            :class="
              p === currentPage
                ? 'btn-primary'
                : 'bg-base-200/70 border-transparent text-base-content/70 hover:bg-primary/15 hover:text-primary shadow-none'
            "
            @click="currentPage = p"
          >
            {{ p }}
          </button>
          <button
            class="btn btn-xs btn-square bg-base-200/70 border-transparent text-base-content/70 hover:bg-primary/15 hover:text-primary shadow-none"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            <ChevronRight class="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Add User -->
    <UiModal
      v-model="showAddModal"
      title="Add New User"
      subtitle="Daftarkan anggota tim baru beserta peran dan departemennya."
    >
      <form class="space-y-4" @submit.prevent="handleAddUser">
        <div class="form-control">
          <label class="label"><span class="label-text">Full Name</span></label>
          <input v-model="newUser.name" type="text" class="input" placeholder="e.g. Jordan Stevenson" required />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text">Email</span></label>
          <input v-model="newUser.email" type="email" class="input" placeholder="jordan@tinkit.example" required />
        </div>
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div class="form-control">
            <label class="label"><span class="label-text">Select Role</span></label>
            <select v-model="newUser.role" class="select">
              <option value="Admin">Admin</option>
              <option value="Maintainer">Maintainer</option>
              <option value="Editor">Editor</option>
              <option value="Author">Author</option>
              <option value="Subscriber">Subscriber</option>
            </select>
          </div>
          <div class="form-control">
            <label class="label"><span class="label-text">Department</span></label>
            <input v-model="newUser.department" type="text" class="input" placeholder="Engineering" />
          </div>
        </div>
      </form>
      <template #footer>
        <button class="btn btn-ghost btn-sm" @click="showAddModal = false">Cancel</button>
        <button class="btn btn-primary btn-sm" @click="handleAddUser">Submit</button>
      </template>
    </UiModal>
  </div>
</template>
