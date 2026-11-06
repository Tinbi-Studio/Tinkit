<script lang="ts">
export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  locale: string
  decimals: number
  countryCode: string
}

export const DEFAULT_CURRENCIES: CurrencyConfig[] = [
  // Asia Tenggara (ASEAN)
  { code: 'IDR', symbol: 'Rp', name: 'Indonesia (Rupiah)', locale: 'id-ID', decimals: 0, countryCode: 'id' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore (Dollar)', locale: 'en-SG', decimals: 2, countryCode: 'sg' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysia (Ringgit)', locale: 'ms-MY', decimals: 2, countryCode: 'my' },
  { code: 'THB', symbol: '฿', name: 'Thailand (Baht)', locale: 'th-TH', decimals: 2, countryCode: 'th' },
  { code: 'PHP', symbol: '₱', name: 'Philippines (Peso)', locale: 'en-PH', decimals: 2, countryCode: 'ph' },
  { code: 'VND', symbol: '₫', name: 'Vietnam (Dong)', locale: 'vi-VN', decimals: 0, countryCode: 'vn' },
  { code: 'BND', symbol: 'B$', name: 'Brunei (Dollar)', locale: 'ms-BN', decimals: 2, countryCode: 'bn' },
  { code: 'KHR', symbol: '៛', name: 'Cambodia (Riel)', locale: 'en-KH', decimals: 2, countryCode: 'kh' },
  { code: 'LAK', symbol: '₭', name: 'Laos (Kip)', locale: 'en-LA', decimals: 0, countryCode: 'la' },
  { code: 'MMK', symbol: 'K', name: 'Myanmar (Kyat)', locale: 'en-MM', decimals: 0, countryCode: 'mm' },

  // Asia Timur & Selatan
  { code: 'JPY', symbol: '¥', name: 'Japan (Yen)', locale: 'ja-JP', decimals: 0, countryCode: 'jp' },
  { code: 'CNY', symbol: '¥', name: 'China (Yuan Renminbi)', locale: 'zh-CN', decimals: 2, countryCode: 'cn' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong (Dollar)', locale: 'en-HK', decimals: 2, countryCode: 'hk' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan (New Dollar)', locale: 'zh-TW', decimals: 2, countryCode: 'tw' },
  { code: 'KRW', symbol: '₩', name: 'South Korea (Won)', locale: 'ko-KR', decimals: 0, countryCode: 'kr' },
  { code: 'INR', symbol: '₹', name: 'India (Rupee)', locale: 'en-IN', decimals: 2, countryCode: 'in' },
  { code: 'PKR', symbol: '₨', name: 'Pakistan (Rupee)', locale: 'en-PK', decimals: 2, countryCode: 'pk' },
  { code: 'BDT', symbol: '৳', name: 'Bangladesh (Taka)', locale: 'en-BD', decimals: 2, countryCode: 'bd' },
  { code: 'LKR', symbol: 'Rs', name: 'Sri Lanka (Rupee)', locale: 'en-LK', decimals: 2, countryCode: 'lk' },

  // Amerika & Oseania
  { code: 'USD', symbol: '$', name: 'United States (Dollar)', locale: 'en-US', decimals: 2, countryCode: 'us' },
  { code: 'CAD', symbol: 'CA$', name: 'Canada (Dollar)', locale: 'en-CA', decimals: 2, countryCode: 'ca' },
  { code: 'AUD', symbol: 'A$', name: 'Australia (Dollar)', locale: 'en-AU', decimals: 2, countryCode: 'au' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand (Dollar)', locale: 'en-NZ', decimals: 2, countryCode: 'nz' },
  { code: 'BRL', symbol: 'R$', name: 'Brazil (Real)', locale: 'pt-BR', decimals: 2, countryCode: 'br' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexico (Peso)', locale: 'es-MX', decimals: 2, countryCode: 'mx' },
  { code: 'ARS', symbol: '$', name: 'Argentina (Peso)', locale: 'es-AR', decimals: 2, countryCode: 'ar' },
  { code: 'CLP', symbol: '$', name: 'Chile (Peso)', locale: 'es-CL', decimals: 0, countryCode: 'cl' },
  { code: 'COP', symbol: '$', name: 'Colombia (Peso)', locale: 'es-CO', decimals: 2, countryCode: 'co' },

  // Eropa
  { code: 'EUR', symbol: '€', name: 'European Union (Euro)', locale: 'de-DE', decimals: 2, countryCode: 'eu' },
  { code: 'GBP', symbol: '£', name: 'United Kingdom (Pound)', locale: 'en-GB', decimals: 2, countryCode: 'gb' },
  { code: 'CHF', symbol: 'CHF', name: 'Switzerland (Franc)', locale: 'de-CH', decimals: 2, countryCode: 'ch' },
  { code: 'SEK', symbol: 'kr', name: 'Sweden (Krona)', locale: 'sv-SE', decimals: 2, countryCode: 'se' },
  { code: 'NOK', symbol: 'kr', name: 'Norway (Krone)', locale: 'nb-NO', decimals: 2, countryCode: 'no' },
  { code: 'DKK', symbol: 'kr', name: 'Denmark (Krone)', locale: 'da-DK', decimals: 2, countryCode: 'dk' },
  { code: 'PLN', symbol: 'zł', name: 'Poland (Zloty)', locale: 'pl-PL', decimals: 2, countryCode: 'pl' },
  { code: 'CZK', symbol: 'Kč', name: 'Czechia (Koruna)', locale: 'cs-CZ', decimals: 2, countryCode: 'cz' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungary (Forint)', locale: 'hu-HU', decimals: 0, countryCode: 'hu' },
  { code: 'TRY', symbol: '₺', name: 'Turkey (Lira)', locale: 'tr-TR', decimals: 2, countryCode: 'tr' },
  { code: 'RUB', symbol: '₽', name: 'Russia (Ruble)', locale: 'ru-RU', decimals: 2, countryCode: 'ru' },

  // Timur Tengah & Afrika (Menggunakan locale Latin agar tetap angka 0-9 dan simbol bersih)
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Arabia (Riyal)', locale: 'en-SA', decimals: 2, countryCode: 'sa' },
  { code: 'AED', symbol: 'AED', name: 'United Arab Emirates (Dirham)', locale: 'en-AE', decimals: 2, countryCode: 'ae' },
  { code: 'QAR', symbol: 'QAR', name: 'Qatar (Riyal)', locale: 'en-QA', decimals: 2, countryCode: 'qa' },
  { code: 'KWD', symbol: 'KWD', name: 'Kuwait (Dinar)', locale: 'en-KW', decimals: 3, countryCode: 'kw' },
  { code: 'BHD', symbol: 'BHD', name: 'Bahrain (Dinar)', locale: 'en-BH', decimals: 3, countryCode: 'bh' },
  { code: 'OMR', symbol: 'OMR', name: 'Oman (Rial)', locale: 'en-OM', decimals: 3, countryCode: 'om' },
  { code: 'JOD', symbol: 'JOD', name: 'Jordan (Dinar)', locale: 'en-JO', decimals: 3, countryCode: 'jo' },
  { code: 'EGP', symbol: 'E£', name: 'Egypt (Pound)', locale: 'en-EG', decimals: 2, countryCode: 'eg' },
  { code: 'ZAR', symbol: 'R', name: 'South Africa (Rand)', locale: 'en-ZA', decimals: 2, countryCode: 'za' },
  { code: 'NGN', symbol: '₦', name: 'Nigeria (Naira)', locale: 'en-NG', decimals: 2, countryCode: 'ng' },
]
</script>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import { ChevronDown, Check, Search, X } from 'lucide-vue-next'
import UiFloatingPanel from '@/components/ui/UiFloatingPanel.vue'

const props = withDefaults(
  defineProps<{
    modelValue?: number | null
    currency?: string
    currencies?: CurrencyConfig[]
    allowChangeCurrency?: boolean
    label?: string
    placeholder?: string
    hint?: string
    error?: string
    size?: 'sm' | 'md' | 'lg'
    disabled?: boolean
    min?: number
    max?: number
  }>(),
  {
    modelValue: null,
    currency: 'IDR',
    currencies: () => DEFAULT_CURRENCIES,
    allowChangeCurrency: true,
    label: undefined,
    placeholder: '0',
    hint: undefined,
    error: undefined,
    size: 'md',
    disabled: false,
    min: undefined,
    max: undefined,
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number | null): void
  (e: 'update:currency', value: string): void
  (e: 'change', value: number | null): void
}>()

const activeCurrencyCode = ref(props.currency)
const isDropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref('')
const inputElementRef = ref<HTMLInputElement | null>(null)

const isFocused = ref(false)
const displayValue = ref('')

const currentCurrency = computed<CurrencyConfig>(() => {
  return (
    props.currencies.find((c) => c.code === activeCurrencyCode.value) ||
    props.currencies[0] ||
    DEFAULT_CURRENCIES[0]
  )
})

const filteredCurrencies = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return props.currencies
  return props.currencies.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.symbol.toLowerCase().includes(q) ||
      c.countryCode.toLowerCase().includes(q)
  )
})

/**
 * Helper formatter yang selalu mengunci numberingSystem ke 'latn' (angka normal 0-9)
 * meskipun user meng-custom prop currencies dengan locale 'ar-SA' atau 'bn-BD'.
 */
function createLatinFormatter(options?: Intl.NumberFormatOptions) {
  return new Intl.NumberFormat(currentCurrency.value.locale, {
    numberingSystem: 'latn',
    ...options,
  })
}

// Deteksi karakter pemisah ribuan & desimal secara akurat berdasarkan locale (selalu Latin)
const separators = computed(() => {
  const parts = createLatinFormatter().formatToParts(12345.6)
  const group = parts.find((p) => p.type === 'group')?.value || '.'
  const decimal = parts.find((p) => p.type === 'decimal')?.value || ','
  return { group, decimal }
})

/**
 * Memformat input secara real-time saat diketik:
 * - Membedakan pemisah ribuan lama dengan desimal yang baru diketik
 * - Selalu menghasilkan angka normal (0-9)
 */
function formatNumberWithMask(raw: string): string {
  if (!raw) return ''

  const allowNegative = props.min === undefined || props.min < 0
  const isNegative = allowNegative && raw.trim().startsWith('-')
  const { group: grpSep, decimal: decSep } = separators.value
  const maxDecimals = currentCurrency.value.decimals

  // Jika mata uang tidak memiliki desimal (seperti IDR / JPY), semua tanda titik/koma adalah ribuan
  if (maxDecimals === 0) {
    const digits = raw.replace(/\D/g, '')
    if (!digits) return isNegative ? '-' : ''
    const formattedInt = createLatinFormatter({
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(BigInt(digits))
    return (isNegative ? '-' : '') + formattedInt
  }

  // Untuk mata uang berdesimal (USD, EUR, OMR, SAR, dll.):
  let normalized = raw

  // 1. Jika user mengetik "." atau "," tepat di akhir string, anggap dia ingin membuat desimal
  if (raw.endsWith('.') || raw.endsWith(',')) {
    const bodyWithoutExistingGrp = raw.slice(0, -1).split(grpSep).join('')
    if (!bodyWithoutExistingGrp.includes(decSep)) {
      normalized = bodyWithoutExistingGrp + decSep
    } else {
      normalized = bodyWithoutExistingGrp
    }
  } else {
    // 2. Hapus pemisah ribuan eksisting terlebih dahulu agar tidak tertukar dengan desimal
    normalized = raw.split(grpSep).join('')
  }

  // Bersihkan semua karakter selain angka 0-9 dan pemisah desimal aktif
  const escapedDec = decSep.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const clean = normalized.replace(new RegExp(`[^0-9${escapedDec}]`, 'g'), '')

  const parts = clean.split(decSep)
  const integerDigits = parts[0] || ''
  const hasDecimalPoint = parts.length > 1
  const fractionDigits = parts.slice(1).join('').slice(0, maxDecimals)

  if (!integerDigits && !hasDecimalPoint) {
    return isNegative ? '-' : ''
  }

  let formattedInteger = ''
  if (integerDigits) {
    formattedInteger = createLatinFormatter({
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(BigInt(integerDigits))
  } else if (hasDecimalPoint) {
    formattedInteger = '0'
  }

  let result = (isNegative ? '-' : '') + formattedInteger
  if (hasDecimalPoint) {
    result += decSep + fractionDigits
  }

  return result
}

function parseToNumber(formatted: string): number | null {
  if (!formatted || formatted === '-') return null
  const { group: grpSep, decimal: decSep } = separators.value

  let clean = formatted.split(grpSep).join('')
  if (decSep !== '.') {
    clean = clean.replace(decSep, '.')
  }
  clean = clean.replace(/[^0-9.-]/g, '')

  if (!clean || clean === '-' || clean === '.') return null
  const num = parseFloat(clean)
  return isNaN(num) ? null : num
}

function syncDisplayFromModel() {
  if (props.modelValue === null || props.modelValue === undefined || isNaN(props.modelValue)) {
    displayValue.value = ''
    return
  }
  displayValue.value = createLatinFormatter({
    minimumFractionDigits: isFocused.value ? 0 : currentCurrency.value.decimals,
    maximumFractionDigits: currentCurrency.value.decimals,
  }).format(props.modelValue)
}

watch(
  () => props.currency,
  (newVal) => {
    activeCurrencyCode.value = newVal
    syncDisplayFromModel()
  }
)

watch(
  () => props.modelValue,
  (newVal) => {
    if (isFocused.value) {
      const currentParsed = parseToNumber(displayValue.value)
      if (currentParsed === newVal) return
    }
    syncDisplayFromModel()
  },
  { immediate: true }
)

function onFocus() {
  isFocused.value = true
  if (props.modelValue !== null && props.modelValue !== undefined && !isNaN(props.modelValue)) {
    displayValue.value = createLatinFormatter({
      minimumFractionDigits: 0,
      maximumFractionDigits: currentCurrency.value.decimals,
    }).format(props.modelValue)
  }
}

function calculateNextCursorPosition(
  rawValue: string,
  oldCursorPos: number,
  maskedValue: string
): number {
  const { decimal: decSep } = separators.value

  const leftSlice = rawValue.slice(0, oldCursorPos)
  const targetDigitsCount = (leftSlice.match(/\d/g) || []).length
  const endedWithDecimalTrigger =
    currentCurrency.value.decimals > 0 && (leftSlice.endsWith('.') || leftSlice.endsWith(','))

  if (targetDigitsCount === 0) {
    if (maskedValue.startsWith('-') && leftSlice.includes('-')) return 1
    return 0
  }

  let seenDigits = 0
  for (let i = 0; i < maskedValue.length; i++) {
    if (/\d/.test(maskedValue[i])) {
      seenDigits++
      if (seenDigits === targetDigitsCount) {
        if (endedWithDecimalTrigger && maskedValue[i + 1] === decSep) {
          return i + 2
        }
        return i + 1
      }
    }
  }

  return maskedValue.length
}

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  const raw = target.value

  if (!raw.trim()) {
    displayValue.value = ''
    emit('update:modelValue', null)
    emit('change', null)
    return
  }

  const prevCursor = target.selectionStart ?? raw.length
  const masked = formatNumberWithMask(raw)

  displayValue.value = masked
  target.value = masked

  const nextCursor = calculateNextCursorPosition(raw, prevCursor, masked)
  nextTick(() => {
    inputElementRef.value?.setSelectionRange(nextCursor, nextCursor)
  })

  const numericVal = parseToNumber(masked)
  if (numericVal !== null) {
    let finalVal = numericVal
    if (props.min !== undefined && finalVal < props.min) finalVal = props.min
    if (props.max !== undefined && finalVal > props.max) finalVal = props.max
    emit('update:modelValue', finalVal)
    emit('change', finalVal)
  } else {
    emit('update:modelValue', null)
    emit('change', null)
  }
}

function onBlur() {
  isFocused.value = false
  const numericVal = parseToNumber(displayValue.value)
  if (numericVal !== null) {
    let clamped = numericVal
    if (props.min !== undefined && clamped < props.min) clamped = props.min
    if (props.max !== undefined && clamped > props.max) clamped = props.max
    if (clamped !== props.modelValue) {
      emit('update:modelValue', clamped)
      emit('change', clamped)
    }
  }
  syncDisplayFromModel()
}

function toggleDropdown() {
  if (props.disabled || !props.allowChangeCurrency) return
  isDropdownOpen.value = !isDropdownOpen.value
  if (isDropdownOpen.value) {
    searchQuery.value = ''
    nextTick(() => {
      searchInputRef.value?.focus()
    })
  }
}

function selectCurrency(curr: CurrencyConfig) {
  activeCurrencyCode.value = curr.code
  emit('update:currency', curr.code)
  isDropdownOpen.value = false
  syncDisplayFromModel()
}

function closeDropdown() {
  isDropdownOpen.value = false
  searchQuery.value = ''
}
</script>

<template>
  <div class="relative flex flex-col gap-1.5 w-full">
    <label v-if="label" class="label-text">
      {{ label }}
    </label>

    <!-- Wrapper strictly identical to standard .input -->
    <div
      class="w-full form-surface flex items-center focus-within:!outline-none focus-within:!border-[var(--accent)] focus-within:!shadow-[0_0_0_2px_var(--ring)]"
      :class="[
        error ? '!border-error focus-within:!border-error focus-within:!shadow-[0_0_0_2px_rgb(var(--er)/0.22)]' : '',
        disabled ? 'opacity-50 cursor-not-allowed bg-base-200/50' : '',
        size === 'sm' ? 'h-8 text-xs' : size === 'lg' ? 'h-12 text-base' : 'h-10 text-sm'
      ]"
    >
      <!-- Premium Currency Dropdown Trigger -->
      <div ref="dropdownRef" class="relative h-full shrink-0">
        <button
          v-if="allowChangeCurrency"
          type="button"
          :disabled="disabled"
          class="flex h-full items-center gap-1.5 rounded-l-field border-r border-[var(--border)] bg-[var(--surface-1)] px-3 text-xs font-bold text-base-content transition-colors hover:bg-[var(--surface-raised)] focus:outline-none"
          :class="isDropdownOpen && 'bg-[var(--surface-raised)] text-[var(--accent)] border-primary/40'"
          title="Klik untuk memilih mata uang atau cari negara"
          @click="toggleDropdown"
        >
          <!-- flag-icons CSS class -->
          <span
            class="fi rounded-xs shadow-2xs shrink-0 text-sm"
            :class="`fi-${currentCurrency.countryCode}`"
          />
          <!-- Display currency symbol -->
          <span class="font-mono tracking-tight font-bold text-base-content">{{ currentCurrency.symbol }}</span>
          <ChevronDown
            class="h-3.5 w-3.5 text-[var(--text-faint)] transition-transform duration-200"
            :class="isDropdownOpen && 'rotate-180 text-primary'"
          />
        </button>
        <span
          v-else
          class="flex h-full items-center gap-1.5 rounded-l-field border-r border-[var(--border)] bg-[var(--surface-1)] px-3.5 text-xs font-bold text-base-content/85 select-none font-mono"
        >
          <span
            class="fi rounded-xs shadow-2xs shrink-0 text-sm"
            :class="`fi-${currentCurrency.countryCode}`"
          />
          <span>{{ currentCurrency.symbol }}</span>
        </span>

        <!-- Floating Popover Menu with Country Search -->
        <UiFloatingPanel
          :open="isDropdownOpen"
          :anchor="dropdownRef"
          :offset="6"
          panel-role="listbox"
          aria-label="Pilih mata uang"
          panel-class="w-64 overflow-y-auto rounded-panel border border-[var(--border)] bg-[var(--surface-overlay)] p-2 shadow-2xl"
          @close="closeDropdown"
        >
            <!-- Search Box Inside Dropdown -->
            <div class="relative mb-2">
              <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[var(--text-faint)] pointer-events-none" />
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Cari negara / valuta..."
                class="w-full rounded-field bg-[var(--surface-input)] pl-8 pr-7 py-1.5 text-xs text-base-content placeholder:text-[var(--text-faint)] focus:outline-none border border-[var(--border)] focus:border-[var(--accent)] focus:shadow-[0_0_0_2px_var(--ring)] transition-[border-color,box-shadow]"
              />
              <button
                v-if="searchQuery"
                type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-faint)] hover:text-base-content"
                @click="searchQuery = ''"
              >
                <X class="h-3 w-3" />
              </button>
            </div>

            <div class="px-2 py-1 text-[10px] font-bold text-[var(--text-faint)]">
              Daftar Mata Uang ({{ filteredCurrencies.length }})
            </div>

            <!-- Scrollable Currency List -->
            <div class="max-h-56 overflow-y-auto space-y-0.5">
              <button
                v-for="curr in filteredCurrencies"
                :key="curr.code"
                type="button"
                class="flex w-full items-center justify-between rounded-btn px-2.5 py-2 text-xs transition-colors cursor-pointer select-none"
                :class="
                  activeCurrencyCode === curr.code
                    ? 'bg-[var(--accent-soft)] font-bold text-[var(--accent)]'
                    : 'text-base-content hover:bg-[var(--surface-raised)] dark:hover:bg-white/[0.06]'
                "
                @click="selectCurrency(curr)"
              >
                <div class="flex items-center gap-2.5 truncate pr-2">
                  <span
                    class="fi rounded-xs shadow-2xs shrink-0 text-base"
                    :class="`fi-${curr.countryCode}`"
                  />
                  <div class="text-left truncate">
                    <p class="font-medium text-xs text-base-content truncate leading-tight">{{ curr.name }}</p>
                    <p class="text-[10px] text-[var(--text-muted)] font-mono leading-none mt-1">{{ curr.code }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1.5 shrink-0">
                  <span class="font-mono text-xs text-[var(--text-muted)] font-bold">{{ curr.symbol }}</span>
                  <Check v-if="activeCurrencyCode === curr.code" class="h-3.5 w-3.5 stroke-[2.5]" />
                </div>
              </button>

              <div v-if="filteredCurrencies.length === 0" class="py-4 text-center text-xs text-[var(--text-muted)]">
                Negara atau valuta tidak ditemukan
              </div>
            </div>
        </UiFloatingPanel>
      </div>

      <!-- Numeric Input with Realtime Masking -->
      <input
        ref="inputElementRef"
        type="text"
        inputmode="decimal"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        class="w-full h-full bg-transparent px-3 text-sm font-mono text-base-content outline-none ring-0 border-0 focus:outline-none focus:ring-0 focus:border-0 placeholder:text-[var(--text-faint)] shadow-none"
        :class="size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'"
        @focus="onFocus"
        @input="onInput"
        @blur="onBlur"
      />

      <!-- Currency Code pill badge at the end -->
      <div class="pr-3 pl-1 shrink-0 select-none">
        <span class="rounded bg-[var(--surface-1)] border border-[var(--border)] px-2 py-0.5 text-xs font-bold text-[var(--text-muted)] font-mono">
          {{ currentCurrency.code }}
        </span>
      </div>
    </div>

    <!-- Error or Hint message -->
    <span v-if="error" class="text-xs font-medium text-error">
      {{ error }}
    </span>
    <span v-else-if="hint" class="text-xs text-[var(--text-muted)]">
      {{ hint }}
    </span>
  </div>
</template>
