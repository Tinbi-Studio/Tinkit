<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  ChevronDown,
  X,
  Search,
  Check,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from 'lucide-vue-next'
import type { ColorVariant } from '@/types/theme'
import UiFloatingPanel from '@/components/ui/UiFloatingPanel.vue'

export interface SelectOption {
  label: string
  value: any
  description?: string
  disabled?: boolean
  variant?: ColorVariant
  group?: string
  icon?: any
}

export interface UiSelectProps {
  modelValue?: any
  options?: Array<SelectOption | string | number>
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  searchable?: boolean
  clearable?: boolean
  disabled?: boolean
  pageSize?: number
  multiple?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<UiSelectProps>(), {
  modelValue: undefined,
  options: () => [],
  placeholder: 'Pilih opsi...',
  label: undefined,
  hint: undefined,
  error: undefined,
  searchable: true,
  clearable: true,
  disabled: false,
  pageSize: 6,
  multiple: false,
  size: 'md',
})

const emit = defineEmits<{
  'update:modelValue': [value: any]
  change: [value: any]
  open: []
  close: []
}>()

const triggerRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const isOpen = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const activeIndex = ref(-1)

// Normalize options to SelectOption objects
const normalizedOptions = computed<SelectOption[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return {
        label: String(opt),
        value: opt,
      }
    }
    return opt
  })
})

// Filter by search query
const filteredOptions = computed<SelectOption[]>(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return normalizedOptions.value

  return normalizedOptions.value.filter((opt) => {
    const matchLabel = opt.label.toLowerCase().includes(q)
    const matchDesc = opt.description ? opt.description.toLowerCase().includes(q) : false
    const matchGroup = opt.group ? opt.group.toLowerCase().includes(q) : false
    return matchLabel || matchDesc || matchGroup
  })
})

// Pagination calculation
const totalPages = computed(() => {
  if (!props.pageSize || props.pageSize <= 0) return 1
  return Math.ceil(filteredOptions.value.length / props.pageSize) || 1
})

const paginatedOptions = computed(() => {
  if (!props.pageSize || props.pageSize <= 0) return filteredOptions.value
  const start = (currentPage.value - 1) * props.pageSize
  return filteredOptions.value.slice(start, start + props.pageSize)
})

// Reset to page 1 whenever search query changes
watch(searchQuery, () => {
  currentPage.value = 1
  activeIndex.value = -1
})

// Currently selected option(s)
const selectedOption = computed<SelectOption | undefined>(() => {
  if (props.multiple) return undefined
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue)
})

const selectedOptionsList = computed<SelectOption[]>(() => {
  if (!props.multiple || !Array.isArray(props.modelValue)) return []
  return props.modelValue
    .map((val) => normalizedOptions.value.find((opt) => opt.value === val))
    .filter(Boolean) as SelectOption[]
})

const hasValue = computed(() => {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.length > 0
  }
  return props.modelValue !== undefined && props.modelValue !== null && props.modelValue !== ''
})

function isOptionSelected(opt: SelectOption): boolean {
  if (props.multiple) {
    return Array.isArray(props.modelValue) && props.modelValue.includes(opt.value)
  }
  return props.modelValue === opt.value
}

function selectOption(opt: SelectOption) {
  if (opt.disabled || props.disabled) return

  if (props.multiple) {
    const current = Array.isArray(props.modelValue) ? [...props.modelValue] : []
    const idx = current.indexOf(opt.value)
    if (idx === -1) {
      current.push(opt.value)
    } else {
      current.splice(idx, 1)
    }
    emit('update:modelValue', current)
    emit('change', current)
  } else {
    emit('update:modelValue', opt.value)
    emit('change', opt.value)
    isOpen.value = false
  }
}

function removeSelected(val: any, event?: Event) {
  event?.stopPropagation()
  if (props.disabled) return
  if (props.multiple && Array.isArray(props.modelValue)) {
    const updated = props.modelValue.filter((v) => v !== val)
    emit('update:modelValue', updated)
    emit('change', updated)
  }
}

function clearSelection(event?: Event) {
  event?.stopPropagation()
  if (props.disabled) return
  const emptyVal = props.multiple ? [] : undefined
  emit('update:modelValue', emptyVal)
  emit('change', emptyVal)
  searchQuery.value = ''
}

function toggleDropdown() {
  if (props.disabled) return
  if (isOpen.value) {
    closeDropdown()
    return
  }
  isOpen.value = true
  emit('open')
  setTimeout(() => {
    searchInputRef.value?.focus()
  }, 50)
}

function closeDropdown() {
  if (!isOpen.value) return
  isOpen.value = false
  searchQuery.value = ''
  emit('close')
}

function prevPage(event?: Event) {
  event?.stopPropagation()
  event?.preventDefault()
  if (currentPage.value > 1) {
    currentPage.value--
    activeIndex.value = 0
  }
}

function nextPage(event?: Event) {
  event?.stopPropagation()
  event?.preventDefault()
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    activeIndex.value = 0
  }
}

function goToPage(page: number, event?: Event) {
  event?.stopPropagation()
  event?.preventDefault()
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    activeIndex.value = 0
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (props.disabled) return

  if (event.key === 'ArrowDown') {
    event.preventDefault()
    if (!isOpen.value) {
      toggleDropdown()
      return
    }
    const len = paginatedOptions.value.length
    if (len > 0) {
      activeIndex.value = (activeIndex.value + 1) % len
    }
  } else if (event.key === 'ArrowUp') {
    event.preventDefault()
    const len = paginatedOptions.value.length
    if (len > 0) {
      activeIndex.value = (activeIndex.value - 1 + len) % len
    }
  } else if (event.key === 'ArrowRight' && totalPages.value > 1) {
    if (currentPage.value < totalPages.value) {
      event.preventDefault()
      currentPage.value++
      activeIndex.value = 0
    }
  } else if (event.key === 'ArrowLeft' && totalPages.value > 1) {
    if (currentPage.value > 1) {
      event.preventDefault()
      currentPage.value--
      activeIndex.value = 0
    }
  } else if (event.key === 'Enter') {
    event.preventDefault()
    if (isOpen.value && activeIndex.value >= 0 && activeIndex.value < paginatedOptions.value.length) {
      selectOption(paginatedOptions.value[activeIndex.value])
    } else if (!isOpen.value) {
      toggleDropdown()
    }
  } else if (event.key === 'Escape') {
    closeDropdown()
  }
}

const optionsListRef = ref<HTMLElement | null>(null)

watch(currentPage, () => {
  if (optionsListRef.value) {
    optionsListRef.value.scrollTop = 0
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'min-h-[34px] px-2.5 py-1 text-xs'
    case 'lg':
      return 'min-h-[46px] px-4 py-2.5 text-base'
    case 'md':
    default:
      return 'min-h-[40px] px-3.5 py-2 text-sm'
  }
})
</script>

<template>
  <div class="relative flex flex-col gap-1.5 w-full">
    <!-- Optional Label -->
    <span v-if="label" class="label-text">
      {{ label }}
    </span>

    <!-- Multiselect Control Box -->
    <div
      ref="triggerRef"
      tabindex="0"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="isOpen"
      :aria-disabled="disabled"
      class="relative w-full form-surface flex items-center justify-between gap-2 cursor-pointer select-none"
      :class="[
        sizeClasses,
        isOpen ? 'form-surface-active' : '',
        disabled ? 'opacity-50 cursor-not-allowed bg-base-200/50' : '',
        error ? 'border-error ring-1 ring-error/20' : '',
      ]"
      @click="toggleDropdown"
      @keydown="handleKeyDown"
    >
      <!-- Left: Value Display or Placeholder -->
      <div class="flex-1 flex flex-wrap items-center gap-1.5 overflow-hidden">
        <!-- Multiple Mode: Tags / Chips -->
        <template v-if="multiple">
          <span
            v-for="opt in selectedOptionsList"
            :key="opt.value"
            class="badge badge-sm badge-soft badge-primary gap-1 pl-2 pr-1 py-0.5 font-medium"
          >
            <span>{{ opt.label }}</span>
            <button
              type="button"
              class="rounded-full p-0.5 opacity-65 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
              :disabled="disabled"
              @click="removeSelected(opt.value, $event)"
            >
              <X class="h-3 w-3" />
            </button>
          </span>

          <span
            v-if="selectedOptionsList.length === 0"
            class="text-[var(--text-faint)] text-sm truncate"
          >
            {{ placeholder }}
          </span>
        </template>

        <!-- Single Mode: Value -->
        <template v-else>
          <div v-if="selectedOption" class="flex items-center gap-2 truncate">
            <span
              v-if="selectedOption.variant"
              class="h-2 w-2 rounded-full shrink-0"
              :class="`bg-${selectedOption.variant}`"
            />
            <component
              :is="selectedOption.icon"
              v-else-if="selectedOption.icon"
              class="h-4 w-4 shrink-0 text-primary"
            />
            <span class="text-base-content font-medium truncate">
              {{ selectedOption.label }}
            </span>
            <span
              v-if="selectedOption.description"
              class="text-xs text-[var(--text-muted)] truncate hidden sm:inline"
            >
              • {{ selectedOption.description }}
            </span>
          </div>

          <span
            v-else
            class="text-[var(--text-faint)] truncate text-sm"
          >
            {{ placeholder }}
          </span>
        </template>
      </div>

      <!-- Right: Clear Button & Chevron -->
      <div class="flex items-center gap-1 shrink-0 text-[var(--text-faint)]">
        <button
          v-if="clearable && hasValue && !disabled"
          type="button"
          class="btn btn-ghost btn-xs btn-circle h-5 w-5 hover:text-base-content"
          title="Kosongkan pilihan"
          @click="clearSelection"
        >
          <X class="h-3.5 w-3.5" />
        </button>

        <ChevronDown
          class="h-4 w-4 transition-transform duration-200"
          :class="isOpen ? 'rotate-180 text-primary' : ''"
        />
      </div>
    </div>

    <!-- Dropdown Menu -->
    <UiFloatingPanel
      :open="isOpen && !disabled"
      :anchor="triggerRef"
      :offset="6"
      match-width
      panel-role="listbox"
      aria-label="Pilihan"
      panel-class="flex flex-col overflow-hidden rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] shadow-xl"
      @close="closeDropdown"
    >
        <!-- Search Input Bar (when searchable = true) -->
        <div
          v-if="searchable"
          class="p-2 border-b border-[var(--border)] bg-[var(--surface-1)]"
          @click.stop
        >
          <div class="relative w-full">
            <Search
              class="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-faint)]"
            />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              placeholder="Cari pilihan..."
              class="w-full rounded-field border border-[var(--border)] bg-[var(--surface-input)] pl-8 pr-3 py-1.5 text-xs text-base-content placeholder:text-[var(--text-faint)] focus:outline-none focus:border-[var(--accent)] focus:shadow-[0_0_0_2px_var(--ring)] transition-[border-color,box-shadow]"
              @keydown="handleKeyDown"
            />
          </div>
        </div>

        <!-- Options List -->
        <div ref="optionsListRef" class="min-h-0 flex-1 overflow-y-auto p-1.5 space-y-0.5 max-h-64">
          <button
            v-for="(opt, idx) in paginatedOptions"
            :key="opt.value"
            type="button"
            :disabled="opt.disabled"
            class="flex w-full items-center justify-between rounded-btn px-3 py-2 text-xs font-semibold text-left transition-colors"
            :class="[
              opt.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              isOptionSelected(opt)
                ? 'bg-primary text-primary-content font-bold'
                : 'text-[var(--text)] hover:bg-[var(--surface-hover)]',
              activeIndex === idx ? 'ring-1 ring-primary/40 bg-[var(--surface-raised)] dark:bg-white/[0.06]' : '',
            ]"
            @click="selectOption(opt)"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <span
                v-if="opt.variant"
                class="h-2 w-2 rounded-full shrink-0"
                :class="`bg-${opt.variant}`"
              />
              <component
                :is="opt.icon"
                v-else-if="opt.icon"
                class="h-4 w-4 shrink-0 text-primary"
              />
              <div class="flex flex-col truncate">
                <span class="truncate">{{ opt.label }}</span>
                <span
                  v-if="opt.description"
                  class="text-[10px] font-normal text-[var(--text-muted)] truncate"
                >
                  {{ opt.description }}
                </span>
              </div>
            </div>

            <Check v-if="isOptionSelected(opt)" class="h-3.5 w-3.5 shrink-0 text-primary-content" />
          </button>

          <!-- Empty State -->
          <div
            v-if="paginatedOptions.length === 0"
            class="flex flex-col items-center justify-center py-6 px-3 text-center text-[var(--text-muted)]"
          >
            <Inbox class="h-6 w-6 mb-1 text-[var(--text-faint)]" />
            <p class="text-xs font-semibold">Tidak ada opsi ditemukan</p>
            <p v-if="searchQuery" class="text-[11px] text-[var(--text-faint)] mt-0.5">
              Tidak ada hasil untuk "{{ searchQuery }}"
            </p>
          </div>
        </div>

        <!-- Dropdown Footer with Pagination Info & Buttons -->
        <div
          v-if="totalPages > 1 || filteredOptions.length > 0"
          class="flex items-center justify-between px-3 py-2 border-t border-[var(--border)] bg-[var(--surface-1)] text-[11px] text-[var(--text-muted)] select-none"
          @click.stop
          @mousedown.stop
        >
          <!-- Count Info -->
          <span>
            Total <strong class="text-base-content font-bold">{{ filteredOptions.length }}</strong> opsi
          </span>

          <!-- Pagination Navigation -->
          <div v-if="totalPages > 1" class="flex items-center gap-1.5" @click.stop @mousedown.stop>
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle h-6 w-6"
              :disabled="currentPage <= 1"
              title="Halaman sebelumnya"
              @click.stop="prevPage($event)"
              @mousedown.stop.prevent
            >
              <ChevronLeft class="h-3.5 w-3.5" />
            </button>

            <!-- Page indicator pills for small totalPages, or compact numeric text -->
            <div class="flex items-center gap-1" @click.stop @mousedown.stop>
              <template v-if="totalPages <= 5">
                <button
                  v-for="p in totalPages"
                  :key="`page-${p}`"
                  type="button"
                  class="h-5 min-w-5 px-1.5 rounded text-[10px] font-bold transition-colors cursor-pointer"
                  :class="currentPage === p ? 'bg-primary text-primary-content shadow-xs' : 'text-[var(--text-muted)] hover:bg-[var(--surface-hover)] dark:hover:bg-white/[0.06]'"
                  @click.stop="goToPage(p, $event)"
                  @mousedown.stop.prevent
                >
                  {{ p }}
                </button>
              </template>
              <span v-else class="font-mono font-semibold px-1">
                {{ currentPage }} / {{ totalPages }}
              </span>
            </div>

            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle h-6 w-6"
              :disabled="currentPage >= totalPages"
              title="Halaman berikutnya"
              @click.stop="nextPage($event)"
              @mousedown.stop.prevent
            >
              <ChevronRight class="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
    </UiFloatingPanel>

    <!-- Hint or Error Message -->
    <span v-if="error" class="text-[11px] font-medium text-error">
      {{ error }}
    </span>
    <span v-else-if="hint" class="text-[11px] text-[var(--text-muted)]">
      {{ hint }}
    </span>
  </div>
</template>
