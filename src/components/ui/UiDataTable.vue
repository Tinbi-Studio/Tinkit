<script setup lang="ts" generic="T extends Record<string, any>">
import { ref, computed, watch } from 'vue'
import {
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  FileText,
  Trash2,
  X,
} from 'lucide-vue-next'
import type { TableColumn, SortDirection } from '@/types/table'
import UiButton from '@/components/ui/UiButton.vue'
import UiInput from '@/components/ui/UiInput.vue'
import { exportToCSV, exportToXLSX, exportToPDF } from '@/utils/exportData'

export interface UiDataTableProps<T = Record<string, any>> {
  columns: TableColumn<T>[]
  items: T[]
  selectable?: boolean
  searchable?: boolean
  pageSizeOptions?: number[]
  initialPageSize?: number
  rowKey?: string
  exportTitle?: string
}

const props = withDefaults(defineProps<UiDataTableProps<T>>(), {
  selectable: true,
  searchable: true,
  pageSizeOptions: () => [5, 10, 25, 50],
  initialPageSize: 5,
  rowKey: 'id',
  exportTitle: 'Tinkit Enterprise Data Report',
})

const emit = defineEmits<{
  'selection-change': [selectedRows: any[]]
  'bulk-delete': [selectedRows: any[]]
}>()

// State
const searchQuery = ref('')
const sortKey = ref<string | null>(null)
const sortDirection = ref<SortDirection>(null)
const currentPage = ref(1)
const pageSize = ref(props.initialPageSize)
const selectedKeys = ref<Set<any>>(new Set())

// Row Key Helper
function getKey(row: any, fallbackIndex: number) {
  return row[props.rowKey] !== undefined ? row[props.rowKey] : fallbackIndex
}

// 1. Filtered Items (Global Search across all columns)
const filteredItems = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()
  if (!query) return props.items

  return props.items.filter((item: any) => {
    return Object.values(item).some((val) => {
      if (val === null || val === undefined) return false
      return String(val).toLowerCase().includes(query)
    })
  })
})

// 2. Sorted Items
const sortedItems = computed(() => {
  if (!sortKey.value || !sortDirection.value) return filteredItems.value

  const key = sortKey.value
  const dir = sortDirection.value === 'asc' ? 1 : -1

  return [...filteredItems.value].sort((a: any, b: any) => {
    const valA = a[key]
    const valB = b[key]

    if (valA === valB) return 0
    if (valA === null || valA === undefined) return 1
    if (valB === null || valB === undefined) return -1

    if (typeof valA === 'number' && typeof valB === 'number') {
      return (valA - valB) * dir
    }

    return String(valA).localeCompare(String(valB)) * dir
  })
})

// 3. Paginated Items
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(sortedItems.value.length / pageSize.value))
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return sortedItems.value.slice(start, start + pageSize.value)
})

// Reset to page 1 on search or page size change
watch([searchQuery, pageSize], () => {
  currentPage.value = 1
})

// Selection Logic
const isAllSelected = computed(() => {
  if (paginatedItems.value.length === 0) return false
  return paginatedItems.value.every((row, idx) =>
    selectedKeys.value.has(getKey(row, idx)),
  )
})

const selectedRows = computed(() => {
  return props.items.filter((row, idx) => selectedKeys.value.has(getKey(row, idx)))
})

function toggleSelectAll() {
  if (isAllSelected.value) {
    paginatedItems.value.forEach((row, idx) => {
      selectedKeys.value.delete(getKey(row, idx))
    })
  } else {
    paginatedItems.value.forEach((row, idx) => {
      selectedKeys.value.add(getKey(row, idx))
    })
  }
  emit('selection-change', selectedRows.value)
}

function toggleSelectRow(row: any, idx: number) {
  const key = getKey(row, idx)
  if (selectedKeys.value.has(key)) {
    selectedKeys.value.delete(key)
  } else {
    selectedKeys.value.add(key)
  }
  emit('selection-change', selectedRows.value)
}

function isRowSelected(row: any, idx: number): boolean {
  return selectedKeys.value.has(getKey(row, idx))
}

function clearSelection() {
  selectedKeys.value.clear()
  emit('selection-change', [])
}

// Sorting Action
function handleSort(col: TableColumn) {
  if (!col.sortable) return

  if (sortKey.value !== col.key) {
    sortKey.value = col.key
    sortDirection.value = 'asc'
  } else if (sortDirection.value === 'asc') {
    sortDirection.value = 'desc'
  } else {
    sortKey.value = null
    sortDirection.value = null
  }
}

// Export Actions (XLSX, PDF, CSV)
const exportColumns = computed(() =>
  props.columns.map((c) => ({ key: c.key, label: c.label })),
)

function handleExportXLSX() {
  exportToXLSX(exportColumns.value, sortedItems.value, {
    filename: 'tinkit-datatable',
    sheetName: 'Data Export',
    title: props.exportTitle,
  })
}

function handleExportPDF() {
  exportToPDF(exportColumns.value, sortedItems.value, {
    title: props.exportTitle,
  })
}

function handleExportCSV() {
  exportToCSV(exportColumns.value, sortedItems.value, 'tinkit-datatable')
}
</script>

<template>
  <div class="card card-bordered bg-base-100 overflow-visible">
    <!-- Top Toolbar: Search Bar & Export Actions (XLSX, PDF, CSV) -->
    <div class="p-4 sm:px-5 border-b border-base-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <!-- Left: Search Input -->
      <div v-if="searchable" class="w-full sm:w-72">
        <UiInput
          v-model="searchQuery"
          placeholder="Cari semua kolom..."
          size="sm"
        >
          <template #icon-left>
            <Search class="h-4 w-4" />
          </template>
        </UiInput>
      </div>
      <div v-else />

      <!-- Right Actions: Export XLSX, PDF, CSV & Custom Slots -->
      <div class="flex flex-wrap items-center gap-2 self-end sm:self-auto">
        <slot name="toolbar-right" />

        <UiButton
          variant="success"
          soft
          size="sm"
          title="Ekspor ke Microsoft Excel (.xlsx)"
          @click="handleExportXLSX"
        >
          <FileSpreadsheet class="h-4 w-4" />
          <span>Ekspor XLSX</span>
        </UiButton>

        <UiButton
          variant="error"
          soft
          size="sm"
          title="Ekspor ke Dokumen PDF (.pdf)"
          @click="handleExportPDF"
        >
          <FileText class="h-4 w-4" />
          <span>Ekspor PDF</span>
        </UiButton>

        <UiButton
          variant="ghost"
          size="sm"
          class="border border-base-300"
          title="Ekspor CSV"
          @click="handleExportCSV"
        >
          <Download class="h-4 w-4" />
          <span class="hidden sm:inline">CSV</span>
        </UiButton>
      </div>
    </div>

    <!-- Bulk Action Toolbar (When rows are selected) -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="selectedKeys.size > 0"
        class="bg-primary/10 border-b border-primary/20 px-4 py-2.5 flex items-center justify-between gap-3 text-xs"
      >
        <div class="flex items-center gap-2">
          <span class="badge badge-primary badge-sm font-bold">
            {{ selectedKeys.size }} terpilih
          </span>
          <span class="text-base-content/75 font-medium">dari total {{ items.length }} data</span>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="btn btn-ghost btn-xs text-error hover:bg-error/15"
            @click="emit('bulk-delete', selectedRows)"
          >
            <Trash2 class="h-3.5 w-3.5" />
            Hapus Pilihan
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs text-base-content/60"
            @click="clearSelection"
          >
            <X class="h-3.5 w-3.5" />
            Batal
          </button>
        </div>
      </div>
    </Transition>

    <!-- Table Element -->
    <div class="overflow-x-auto">
      <table class="table table-hover table-zebra">
        <thead>
          <tr>
            <!-- Select All Checkbox -->
            <th v-if="selectable" class="w-10 px-4 py-3.5">
              <input
                type="checkbox"
                class="checkbox checkbox-sm checkbox-primary"
                :checked="isAllSelected"
                @change="toggleSelectAll"
              />
            </th>

            <!-- Column Headers with Sorting -->
            <th
              v-for="col in columns"
              :key="col.key"
              :style="{ width: col.width }"
              class="select-none transition-colors"
              :class="[
                col.sortable ? 'cursor-pointer hover:bg-base-300/60' : '',
                col.align === 'center' ? 'text-center' : '',
                col.align === 'right' ? 'text-right' : 'text-left',
              ]"
              @click="handleSort(col)"
            >
              <div
                class="inline-flex items-center gap-1.5"
                :class="col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : ''"
              >
                <span>{{ col.label }}</span>
                <span v-if="col.sortable" class="text-base-content/40">
                  <ArrowUp v-if="sortKey === col.key && sortDirection === 'asc'" class="h-3.5 w-3.5 text-primary" />
                  <ArrowDown v-else-if="sortKey === col.key && sortDirection === 'desc'" class="h-3.5 w-3.5 text-primary" />
                  <ArrowUpDown v-else class="h-3.5 w-3.5" />
                </span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(row, idx) in paginatedItems"
            :key="getKey(row, idx)"
            :class="isRowSelected(row, idx) ? 'bg-primary/8' : ''"
          >
            <!-- Row Checkbox -->
            <td v-if="selectable" class="w-10 px-4 py-3.5">
              <input
                type="checkbox"
                class="checkbox checkbox-sm checkbox-primary"
                :checked="isRowSelected(row, idx)"
                @change="toggleSelectRow(row, idx)"
              />
            </td>

            <!-- Row Cells -->
            <td
              v-for="col in columns"
              :key="col.key"
              :class="[
                col.align === 'center' ? 'text-center' : '',
                col.align === 'right' ? 'text-right' : 'text-left',
              ]"
            >
              <slot :name="`cell-${col.key}`" :item="row" :value="row[col.key]">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>

          <!-- Empty State -->
          <tr v-if="paginatedItems.length === 0">
            <td :colspan="columns.length + (selectable ? 1 : 0)" class="py-12 text-center">
              <div class="flex flex-col items-center gap-2">
                <Search class="h-8 w-8 text-base-content/30" />
                <h6 class="text-xs font-bold text-base-content/70">Data Tidak Ditemukan</h6>
                <p class="text-xs text-base-content/50 max-w-xs">
                  Tidak ada data yang cocok dengan kriteria pencarian "{{ searchQuery }}".
                </p>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Bottom Pagination & Quick Per-Page Pills Footer -->
    <div class="p-4 sm:px-5 border-t border-base-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-base-content/70">
      <!-- Showing Info & Quick Segmented Pills -->
      <div class="flex flex-wrap items-center gap-3">
        <span>
          Menampilkan
          <strong class="font-bold text-base-content">
            {{ sortedItems.length === 0 ? 0 : (currentPage - 1) * pageSize + 1 }}
          </strong>
          -
          <strong class="font-bold text-base-content">
            {{ Math.min(currentPage * pageSize, sortedItems.length) }}
          </strong>
          dari
          <strong class="font-bold text-base-content">{{ sortedItems.length }}</strong>
          data
        </span>

        <!-- Segmented Quick Per-Page Switcher -->
        <div class="hidden md:inline-flex items-center rounded-btn border border-base-300/80 bg-base-200/50 p-0.5">
          <button
            v-for="size in pageSizeOptions"
            :key="size"
            type="button"
            class="rounded-btn px-2 py-0.5 text-[11px] font-semibold transition-all"
            :class="
              pageSize === size
                ? 'bg-primary text-primary-content shadow-none'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            "
            :aria-pressed="pageSize === size"
            @click="pageSize = size"
          >
            {{ size }}
          </button>
        </div>
      </div>

      <!-- Pagination Numbered Buttons -->
      <div class="flex items-center gap-1 self-end sm:self-auto">
        <button
          type="button"
          class="btn btn-xs btn-square bg-base-200/70 border-transparent text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] shadow-none"
          aria-label="Previous page"
          :disabled="currentPage <= 1"
          @click="currentPage--"
        >
          <ChevronLeft class="h-3.5 w-3.5" />
        </button>

        <button
          v-for="p in totalPages"
          :key="p"
          type="button"
          class="btn btn-xs h-7 min-w-7 rounded-btn font-medium"
          :class="
            p === currentPage
              ? 'btn-active'
              : 'bg-base-200/70 border-transparent text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] shadow-none'
          "
          :aria-current="p === currentPage ? 'page' : undefined"
          @click="currentPage = p"
        >
          {{ p }}
        </button>

        <button
          type="button"
          class="btn btn-xs btn-square bg-base-200/70 border-transparent text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] shadow-none"
          aria-label="Next page"
          :disabled="currentPage >= totalPages"
          @click="currentPage++"
        >
          <ChevronRight class="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  </div>
</template>
