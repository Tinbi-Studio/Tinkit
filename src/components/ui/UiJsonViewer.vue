<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import {
  Braces,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Code2,
  Copy,
  ListTree,
  Search,
  X,
} from 'lucide-vue-next'
import UiTooltip from '@/components/ui/UiTooltip.vue'

export interface UiJsonViewerProps {
  data: unknown
  title?: string
  defaultExpandDepth?: number
  searchable?: boolean
  copyable?: boolean
  showLineNumbers?: boolean
  showDataTypes?: boolean
  maxHeight?: string
}

const props = withDefaults(defineProps<UiJsonViewerProps>(), {
  title: 'data.json',
  defaultExpandDepth: 2,
  searchable: true,
  copyable: true,
  showLineNumbers: true,
  showDataTypes: false,
  maxHeight: '440px',
})

const emit = defineEmits<{
  select: [payload: { path: string; key: string | number | null; value: unknown }]
  copy: [text: string]
}>()

type JsonValueType = 'object' | 'array' | 'string' | 'number' | 'boolean' | 'null'

interface JsonFlatRow {
  id: string
  path: string
  depth: number
  key: string | number | null
  value: unknown
  valueType: JsonValueType
  rowKind: 'leaf' | 'collapsed' | 'open' | 'close'
  isLast: boolean
  childCount: number
  openBracket?: '{' | '['
  closeBracket?: '}' | ']'
  isMatch: boolean
}

const searchQuery = ref('')
const rawMode = ref(false)
const copiedAll = ref(false)
const copiedRowId = ref<string | null>(null)
const expandedPaths = ref<Set<string>>(new Set())

let copyAllTimer: ReturnType<typeof setTimeout> | null = null
let copyRowTimer: ReturnType<typeof setTimeout> | null = null

const parsedResult = computed<{ ok: boolean; value: unknown; error?: string }>(() => {
  if (typeof props.data === 'string') {
    const trimmed = props.data.trim()
    if (
      (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
      (trimmed.startsWith('[') && trimmed.endsWith(']'))
    ) {
      try {
        return { ok: true, value: JSON.parse(trimmed) }
      } catch (err) {
        return {
          ok: false,
          value: null,
          error: err instanceof Error ? err.message : 'Format JSON tidak valid',
        }
      }
    }
  }
  return { ok: true, value: props.data }
})

function detectType(val: unknown): JsonValueType {
  if (val === null || val === undefined) return 'null'
  if (Array.isArray(val)) return 'array'
  if (typeof val === 'object') return 'object'
  if (typeof val === 'number') return 'number'
  if (typeof val === 'boolean') return 'boolean'
  return 'string'
}

function formatChildPath(parentPath: string, key: string | number, isArrayItem: boolean): string {
  if (isArrayItem) {
    return `${parentPath}[${key}]`
  }
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(String(key))) {
    return parentPath === '$' ? `$.${key}` : `${parentPath}.${key}`
  }
  return `${parentPath}["${String(key).replace(/"/g, '\\"')}"]`
}

function collectExpandablePaths(
  value: unknown,
  currentPath = '$',
  depth = 0,
  maxDepth = Infinity,
  target = new Set<string>(),
): Set<string> {
  const type = detectType(value)
  if ((type === 'object' || type === 'array') && value !== null) {
    const entries =
      type === 'array'
        ? (value as unknown[]).map((v, i) => [i, v] as const)
        : Object.entries(value as Record<string, unknown>)

    if (entries.length > 0 && depth < maxDepth) {
      target.add(currentPath)
      for (const [k, child] of entries) {
        const nextPath = formatChildPath(currentPath, k, type === 'array')
        collectExpandablePaths(child, nextPath, depth + 1, maxDepth, target)
      }
    }
  }
  return target
}

function initDefaultExpanded() {
  if (!parsedResult.value.ok) return
  expandedPaths.value = collectExpandablePaths(
    parsedResult.value.value,
    '$',
    0,
    props.defaultExpandDepth,
  )
}

watch(
  () => [props.data, props.defaultExpandDepth],
  () => {
    initDefaultExpanded()
  },
  { immediate: true },
)

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

// Collect paths that match search query and their ancestor paths
const searchMatchInfo = computed(() => {
  const query = normalizedQuery.value
  const matchedPaths = new Set<string>()
  const ancestorPaths = new Set<string>()

  if (!query || !parsedResult.value.ok) {
    return { matchedPaths, ancestorPaths, count: 0 }
  }

  function walk(val: unknown, path: string, key: string | number | null, ancestors: string[]) {
    const type = detectType(val)
    const keyMatches = key !== null && String(key).toLowerCase().includes(query)
    const valMatches =
      type !== 'object' &&
      type !== 'array' &&
      String(val ?? 'null')
        .toLowerCase()
        .includes(query)

    if (keyMatches || valMatches) {
      matchedPaths.add(path)
      for (const anc of ancestors) {
        ancestorPaths.add(anc)
      }
    }

    if (type === 'object' || type === 'array') {
      const entries =
        type === 'array'
          ? (val as unknown[]).map((v, i) => [i, v] as const)
          : Object.entries(val as Record<string, unknown>)

      const nextAncestors = [...ancestors, path]
      for (const [k, child] of entries) {
        walk(child, formatChildPath(path, k, type === 'array'), k, nextAncestors)
      }
    }
  }

  walk(parsedResult.value.value, '$', null, [])
  return { matchedPaths, ancestorPaths, count: matchedPaths.size }
})

function isPathExpanded(path: string): boolean {
  if (normalizedQuery.value) {
    return searchMatchInfo.value.ancestorPaths.has(path) || expandedPaths.value.has(path)
  }
  return expandedPaths.value.has(path)
}

function togglePath(path: string) {
  const next = new Set(expandedPaths.value)
  if (next.has(path)) {
    next.delete(path)
  } else {
    next.add(path)
  }
  expandedPaths.value = next
}

function expandAll() {
  if (!parsedResult.value.ok) return
  expandedPaths.value = collectExpandablePaths(parsedResult.value.value, '$', 0, Infinity)
}

function collapseAll() {
  expandedPaths.value = new Set(['$'])
}

const flatRows = computed<JsonFlatRow[]>(() => {
  if (!parsedResult.value.ok) return []

  const rows: JsonFlatRow[] = []
  const query = normalizedQuery.value
  const { matchedPaths } = searchMatchInfo.value

  function buildRows(
    val: unknown,
    path: string,
    key: string | number | null,
    depth: number,
    isLast: boolean,
  ) {
    const type = detectType(val)
    const isMatch = Boolean(query && matchedPaths.has(path))

    if (type === 'object' || type === 'array') {
      const isArr = type === 'array'
      const entries = isArr
        ? (val as unknown[]).map((v, i) => [i, v] as const)
        : Object.entries((val as Record<string, unknown>) ?? {})
      const count = entries.length
      const openBracket = isArr ? '[' : '{'
      const closeBracket = isArr ? ']' : '}'

      if (count === 0 || !isPathExpanded(path)) {
        rows.push({
          id: `${path}:collapsed`,
          path,
          depth,
          key,
          value: val,
          valueType: type,
          rowKind: 'collapsed',
          isLast,
          childCount: count,
          openBracket,
          closeBracket,
          isMatch,
        })
        return
      }

      rows.push({
        id: `${path}:open`,
        path,
        depth,
        key,
        value: val,
        valueType: type,
        rowKind: 'open',
        isLast,
        childCount: count,
        openBracket,
        closeBracket,
        isMatch,
      })

      entries.forEach(([childKey, childVal], index) => {
        const childPath = formatChildPath(path, childKey, isArr)
        buildRows(
          childVal,
          childPath,
          isArr ? null : childKey,
          depth + 1,
          index === entries.length - 1,
        )
      })

      rows.push({
        id: `${path}:close`,
        path,
        depth,
        key: null,
        value: val,
        valueType: type,
        rowKind: 'close',
        isLast,
        childCount: count,
        openBracket,
        closeBracket,
        isMatch: false,
      })
      return
    }

    rows.push({
      id: `${path}:leaf`,
      path,
      depth,
      key,
      value: val,
      valueType: type,
      rowKind: 'leaf',
      isLast,
      childCount: 0,
      isMatch,
    })
  }

  buildRows(parsedResult.value.value, '$', null, 0, true)
  return rows
})

const prettyJsonString = computed(() => {
  if (!parsedResult.value.ok) return String(props.data ?? '')
  try {
    return JSON.stringify(parsedResult.value.value, null, 2)
  } catch {
    return String(props.data ?? '')
  }
})

const rootSummary = computed(() => {
  if (!parsedResult.value.ok) return 'Invalid JSON'
  const val = parsedResult.value.value
  const type = detectType(val)
  if (type === 'array') return `${(val as unknown[]).length} items`
  if (type === 'object' && val !== null) return `${Object.keys(val as object).length} keys`
  return type
})

function formatLeafValue(val: unknown, type: JsonValueType): string {
  if (type === 'null') return 'null'
  if (type === 'string') return JSON.stringify(String(val))
  return String(val)
}

function getValueColorClass(type: JsonValueType): string {
  switch (type) {
    case 'string':
      return 'text-success'
    case 'number':
      return 'text-info font-semibold'
    case 'boolean':
      return 'text-warning font-semibold'
    case 'null':
      return 'text-error/85 italic'
    default:
      return 'text-base-content'
  }
}

function copyFullJson() {
  const text = prettyJsonString.value
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  }
  copiedAll.value = true
  emit('copy', text)
  if (copyAllTimer) clearTimeout(copyAllTimer)
  copyAllTimer = setTimeout(() => {
    copiedAll.value = false
  }, 1800)
}

function copyNodeValue(row: JsonFlatRow) {
  let text = ''
  try {
    text =
      row.valueType === 'string'
        ? String(row.value)
        : JSON.stringify(row.value, null, 2)
  } catch {
    text = String(row.value)
  }
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text)
  }
  copiedRowId.value = row.id
  emit('copy', text)
  if (copyRowTimer) clearTimeout(copyRowTimer)
  copyRowTimer = setTimeout(() => {
    copiedRowId.value = null
  }, 1500)
}

function handleRowClick(row: JsonFlatRow) {
  if ((row.rowKind === 'open' || row.rowKind === 'collapsed') && row.childCount > 0) {
    togglePath(row.path)
  }
  emit('select', { path: row.path, key: row.key, value: row.value })
}
</script>

<template>
  <div class="w-full overflow-hidden rounded-box border border-[var(--border)] bg-base-100 text-base-content shadow-xs">
    <!-- Top Header & Controls -->
    <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-2.5">
      <!-- Title & Root Summary -->
      <div class="flex items-center gap-2 min-w-0">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-btn bg-primary/12 text-primary">
          <Braces class="h-4 w-4" />
        </div>
        <span class="truncate font-mono text-xs font-bold text-base-content">
          {{ title }}
        </span>
        <span class="badge badge-xs badge-soft badge-primary font-mono">
          {{ rootSummary }}
        </span>
      </div>

      <!-- Right Toolbar: Search + Expand/Collapse + View Mode + Copy -->
      <div class="flex flex-wrap items-center gap-1.5">
        <!-- Search Input -->
        <div v-if="searchable && !rawMode" class="relative flex items-center">
          <Search class="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[var(--text-faint)]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari key / value..."
            class="input input-xs h-7 w-36 sm:w-44 pl-7 pr-6 bg-base-100 border-[var(--border)] text-xs font-mono focus:border-primary"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-1.5 text-[var(--text-muted)] hover:text-base-content cursor-pointer"
            aria-label="Hapus pencarian"
            @click="searchQuery = ''"
          >
            <X class="h-3 w-3" />
          </button>
        </div>

        <span
          v-if="normalizedQuery && !rawMode"
          class="badge badge-xs font-mono"
          :class="searchMatchInfo.count > 0 ? 'badge-soft badge-success' : 'badge-soft badge-error'"
        >
          {{ searchMatchInfo.count }} cocok
        </span>

        <!-- Expand / Collapse All -->
        <template v-if="!rawMode">
          <UiTooltip text="Buka Semua Node" position="top">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square h-7 w-7"
              aria-label="Expand all"
              @click="expandAll"
            >
              <ChevronsUpDown class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>

          <UiTooltip text="Tutup Semua Node" position="top">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square h-7 w-7"
              aria-label="Collapse all"
              @click="collapseAll"
            >
              <ChevronsDownUp class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>
        </template>

        <!-- Toggle Tree / Raw Mode -->
        <UiTooltip :text="rawMode ? 'Tampilan Pohon Interaktif' : 'Tampilan Raw JSON'" position="top">
          <button
            type="button"
            class="btn btn-xs h-7 px-2 gap-1 font-mono"
            :class="rawMode ? 'btn-active' : 'btn-ghost'"
            aria-label="Toggle Raw JSON"
            @click="rawMode = !rawMode"
          >
            <ListTree v-if="rawMode" class="h-3.5 w-3.5" />
            <Code2 v-else class="h-3.5 w-3.5" />
            <span class="hidden sm:inline text-[11px]">{{ rawMode ? 'Tree' : 'Raw' }}</span>
          </button>
        </UiTooltip>

        <!-- Copy Full JSON -->
        <UiTooltip v-if="copyable" :text="copiedAll ? 'Tersalin!' : 'Salin JSON'" position="top">
          <button
            type="button"
            class="btn btn-ghost btn-xs h-7 px-2 gap-1 font-mono"
            :class="copiedAll ? 'text-success' : ''"
            aria-label="Salin JSON"
            @click="copyFullJson"
          >
            <Check v-if="copiedAll" class="h-3.5 w-3.5 text-success" />
            <Copy v-else class="h-3.5 w-3.5" />
            <span class="hidden sm:inline text-[11px]">{{ copiedAll ? 'Tersalin' : 'Salin' }}</span>
          </button>
        </UiTooltip>
      </div>
    </div>

    <!-- Invalid JSON Error State -->
    <div v-if="!parsedResult.ok" class="p-4 font-mono text-xs text-error bg-error/10">
      <p class="font-bold">Gagal memproses data JSON:</p>
      <p class="mt-1">{{ parsedResult.error }}</p>
    </div>

    <!-- Raw JSON Mode -->
    <div
      v-else-if="rawMode"
      class="overflow-auto p-3.5 font-mono text-xs leading-relaxed bg-base-100 select-text"
      :style="{ maxHeight }"
    >
      <pre class="whitespace-pre text-base-content">{{ prettyJsonString }}</pre>
    </div>

    <!-- Interactive Tree Mode -->
    <div
      v-else
      class="overflow-auto py-2 font-mono text-xs leading-[1.65] select-text"
      :style="{ maxHeight }"
      role="tree"
    >
      <div
        v-for="(row, idx) in flatRows"
        :key="row.id"
        role="treeitem"
        :aria-expanded="
          row.rowKind === 'open'
            ? true
            : row.rowKind === 'collapsed' && row.childCount > 0
              ? false
              : undefined
        "
        class="group flex items-center justify-between gap-2 px-3 py-0.5 transition-colors hover:bg-[var(--surface-raised)]"
        :class="[
          row.isMatch ? 'bg-warning/15 ring-1 ring-inset ring-warning/30' : '',
          (row.rowKind === 'open' || row.rowKind === 'collapsed') && row.childCount > 0
            ? 'cursor-pointer'
            : '',
        ]"
        @click="handleRowClick(row)"
      >
        <!-- Left: Line Number + Indentation + Toggle + Key + Value -->
        <div class="flex items-center min-w-0 flex-1">
          <!-- Line Number -->
          <span
            v-if="showLineNumbers"
            class="w-7 shrink-0 select-none pr-2.5 text-right text-[11px] tabular-nums text-[var(--text-faint)]"
          >
            {{ idx + 1 }}
          </span>

          <!-- Indentation Guides -->
          <div class="flex items-center shrink-0 select-none">
            <span
              v-for="level in row.depth"
              :key="level"
              class="inline-block h-5 w-4 border-l border-[var(--border)]"
            />
          </div>

          <!-- Expand/Collapse Chevron for expandable rows -->
          <span class="mr-1 flex h-4 w-4 shrink-0 items-center justify-center">
            <template v-if="(row.rowKind === 'open' || row.rowKind === 'collapsed') && row.childCount > 0">
              <ChevronDown
                v-if="row.rowKind === 'open'"
                class="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-primary transition-colors"
              />
              <ChevronRight
                v-else
                class="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-primary transition-colors"
              />
            </template>
          </span>

          <!-- Content by Row Kind -->
          <div class="flex flex-wrap items-baseline gap-1 min-w-0">
            <!-- Key Name -->
            <template v-if="row.key !== null">
              <span class="font-semibold text-primary">
                "{{ row.key }}"
              </span>
              <span class="text-[var(--text-muted)] mr-0.5">:</span>
            </template>

            <!-- 1. Open Bracket Row -->
            <template v-if="row.rowKind === 'open'">
              <span class="font-bold text-base-content">{{ row.openBracket }}</span>
              <span class="text-[10px] text-[var(--text-faint)] ml-1">
                // {{ row.childCount }} {{ row.valueType === 'array' ? 'items' : 'keys' }}
              </span>
            </template>

            <!-- 2. Collapsed Object/Array Row -->
            <template v-else-if="row.rowKind === 'collapsed'">
              <span class="font-bold text-base-content">{{ row.openBracket }}</span>
              <span
                v-if="row.childCount > 0"
                class="mx-1 rounded bg-base-200 px-1.5 py-0.2 text-[11px] font-medium text-[var(--text-muted)] border border-[var(--border)]"
              >
                {{ row.childCount }} {{ row.valueType === 'array' ? 'items' : 'keys' }}
              </span>
              <span class="font-bold text-base-content">
                {{ row.closeBracket }}<span v-if="!row.isLast" class="text-[var(--text-muted)]">,</span>
              </span>
            </template>

            <!-- 3. Close Bracket Row -->
            <template v-else-if="row.rowKind === 'close'">
              <span class="font-bold text-base-content">
                {{ row.closeBracket }}<span v-if="!row.isLast" class="text-[var(--text-muted)]">,</span>
              </span>
            </template>

            <!-- 4. Leaf Primitive Value -->
            <template v-else>
              <span class="break-all" :class="getValueColorClass(row.valueType)">
                {{ formatLeafValue(row.value, row.valueType) }}
              </span>
              <span v-if="!row.isLast" class="text-[var(--text-muted)]">,</span>
              <span
                v-if="showDataTypes"
                class="ml-1.5 rounded bg-base-200/80 px-1 py-0.2 text-[10px] uppercase text-[var(--text-faint)]"
              >
                {{ row.valueType }}
              </span>
            </template>
          </div>
        </div>

        <!-- Right: Hover Path & Copy Action -->
        <div
          v-if="row.rowKind !== 'close'"
          class="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 shrink-0"
          @click.stop
        >
          <span class="hidden md:inline text-[10px] text-[var(--text-faint)] max-w-[180px] truncate">
            {{ row.path }}
          </span>
          <button
            v-if="copyable"
            type="button"
            class="btn btn-ghost btn-xs h-5 px-1.5 text-[10px] text-[var(--text-muted)] hover:text-primary"
            :title="`Salin nilai (${row.path})`"
            @click="copyNodeValue(row)"
          >
            <Check v-if="copiedRowId === row.id" class="h-3 w-3 text-success" />
            <Copy v-else class="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
