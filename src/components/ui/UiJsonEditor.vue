<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from 'vue'
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Code2,
  Copy,
  FileCode2,
  ListTree,
  Minimize2,
  Network,
  RotateCcw,
  Search,
  Sparkles,
  Table2,
  X,
} from 'lucide-vue-next'
import { EditorView, basicSetup } from 'codemirror'
import { Compartment, EditorState } from '@codemirror/state'
import { keymap } from '@codemirror/view'
import { indentWithTab } from '@codemirror/commands'
import { json, jsonParseLinter } from '@codemirror/lang-json'
import { linter, lintGutter } from '@codemirror/lint'
import { HighlightStyle, syntaxHighlighting, foldAll, unfoldAll } from '@codemirror/language'
import { tags as t } from '@lezer/highlight'
import UiTooltip from '@/components/ui/UiTooltip.vue'

export type JsonEditorMode = 'code' | 'tree' | 'table' | 'graph'

export interface UiJsonEditorProps {
  modelValue?: unknown
  initialData?: unknown
  title?: string
  defaultMode?: JsonEditorMode
  defaultExpandDepth?: number
  searchable?: boolean
  copyable?: boolean
  showLineNumbers?: boolean
  maxHeight?: string
  readOnly?: boolean
}

const props = withDefaults(defineProps<UiJsonEditorProps>(), {
  modelValue: undefined,
  initialData: () => ({}),
  title: 'editor.json',
  defaultMode: 'code',
  defaultExpandDepth: 2,
  searchable: true,
  copyable: true,
  showLineNumbers: true,
  maxHeight: '480px',
  readOnly: false,
})

const emit = defineEmits<{
  'update:modelValue': [value: unknown]
  change: [value: unknown]
  error: [message: string | null]
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

const modes: { id: JsonEditorMode; label: string; icon: unknown }[] = [
  { id: 'code', label: 'Code', icon: Code2 },
  { id: 'tree', label: 'Tree', icon: ListTree },
  { id: 'table', label: 'Table', icon: Table2 },
  { id: 'graph', label: 'Graph', icon: Network },
]

// ─── Internal State ──────────────────────────────────────────────
const rawTextContent = ref('')
const mode = ref<JsonEditorMode>(props.defaultMode)
const searchQuery = ref('')
const parseError = ref<string | null>(null)
const copiedAll = ref(false)
const copiedRowId = ref<string | null>(null)
const expandedPaths = ref<Set<string>>(new Set())
const searchExpandedSet = ref<Set<string>>(new Set())
const cursor = ref({ line: 1, col: 1 })

let copyAllTimer: ReturnType<typeof setTimeout> | null = null
let copyRowTimer: ReturnType<typeof setTimeout> | null = null

const currentSource = computed(() =>
  props.modelValue !== undefined ? props.modelValue : props.initialData,
)

watch(
  currentSource,
  (newVal) => {
    // Lewati echo dari v-model agar teks tidak direformat saat mengetik
    try {
      if (rawTextContent.value && JSON.stringify(JSON.parse(rawTextContent.value)) === JSON.stringify(newVal)) return
    } catch {
      // teks sedang tidak valid, lanjutkan sinkronisasi
    }
    try {
      rawTextContent.value = JSON.stringify(newVal, null, 2)
    } catch {
      rawTextContent.value = String(newVal ?? '{}')
    }
  },
  { immediate: true, deep: true },
)

const parsedResult = computed<{ ok: boolean; value: unknown; error?: string }>(() => {
  const trimmed = rawTextContent.value.trim()
  if (!trimmed) return { ok: true, value: null }
  try {
    return { ok: true, value: JSON.parse(trimmed) }
  } catch (err) {
    return { ok: false, value: null, error: err instanceof Error ? err.message : 'Format JSON tidak valid' }
  }
})

watch(
  parsedResult,
  (res) => {
    parseError.value = res.error || null
    emit('error', res.error || null)
    if (res.ok) {
      emit('update:modelValue', res.value)
      emit('change', res.value)
    }
  },
  { immediate: true },
)

// ─── CodeMirror ──────────────────────────────────────────────────
const editorHost = ref<HTMLElement | null>(null)
const editorView = shallowRef<EditorView | null>(null)
const readOnlyCompartment = new Compartment()

const tinkitHighlight = HighlightStyle.define([
  { tag: t.propertyName, class: 'text-primary font-semibold' },
  { tag: t.string, class: 'text-success' },
  { tag: t.number, class: 'text-info font-semibold' },
  { tag: t.bool, class: 'text-warning font-semibold' },
  { tag: t.null, class: 'text-error/85 italic' },
  { tag: [t.brace, t.squareBracket], class: 'font-bold text-base-content' },
  { tag: [t.separator, t.punctuation], class: 'text-[var(--text-muted)]' },
])

const tinkitTheme = EditorView.theme({
  '&': { height: '100%', fontSize: '12px', backgroundColor: 'transparent', color: 'inherit' },
  '&.cm-focused': { outline: 'none' },
  '.cm-scroller': {
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
    lineHeight: '1.65',
  },
  '.cm-gutters': {
    backgroundColor: 'var(--surface-raised)',
    borderRight: '1px solid var(--border)',
    color: 'var(--text-faint)',
  },
  '.cm-activeLine': { backgroundColor: 'rgb(var(--p) / 0.06)' },
  '.cm-activeLineGutter': { backgroundColor: 'rgb(var(--p) / 0.1)', color: 'rgb(var(--p))' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'rgb(var(--p))', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': {
    backgroundColor: 'rgb(var(--p) / 0.2) !important',
  },
  '.cm-matchingBracket': {
    backgroundColor: 'rgb(var(--p) / 0.18)',
    outline: '1px solid rgb(var(--p) / 0.4)',
  },
  '.cm-foldGutter .cm-gutterElement': { cursor: 'pointer', padding: '0 4px' },
  '.cm-foldPlaceholder': {
    backgroundColor: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    color: 'var(--text-muted)',
    borderRadius: '4px',
    padding: '0 6px',
  },
  '.cm-tooltip': {
    backgroundColor: 'var(--surface-raised)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
  },
  '.cm-panels': { backgroundColor: 'var(--surface-raised)', color: 'inherit' },
  '.cm-searchMatch': { backgroundColor: 'rgb(250 204 21 / 0.3)' },
})

onMounted(() => {
  if (!editorHost.value) return
  editorView.value = new EditorView({
    parent: editorHost.value,
    state: EditorState.create({
      doc: rawTextContent.value,
      extensions: [
        basicSetup,
        keymap.of([
          indentWithTab,
          { key: 'Mod-Shift-f', run: () => (handleBeautify(), true) },
        ]),
        json(),
        linter(jsonParseLinter(), { delay: 250 }),
        lintGutter(),
        syntaxHighlighting(tinkitHighlight),
        tinkitTheme,
        readOnlyCompartment.of(EditorState.readOnly.of(props.readOnly)),
        EditorView.updateListener.of((u) => {
          if (u.docChanged) rawTextContent.value = u.state.doc.toString()
          if (u.docChanged || u.selectionSet) {
            const head = u.state.selection.main.head
            const line = u.state.doc.lineAt(head)
            cursor.value = { line: line.number, col: head - line.from + 1 }
          }
        }),
      ],
    }),
  })
})

onBeforeUnmount(() => editorView.value?.destroy())

// Sinkronisasi perubahan eksternal (format/minify/reset/props) ke editor
watch(rawTextContent, (text) => {
  const view = editorView.value
  if (!view || view.state.doc.toString() === text) return
  view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: text } })
})

watch(
  () => props.readOnly,
  (ro) => editorView.value?.dispatch({
    effects: readOnlyCompartment.reconfigure(EditorState.readOnly.of(ro)),
  }),
)

// ─── Helpers ─────────────────────────────────────────────────────
function detectType(val: unknown): JsonValueType {
  if (val === null || val === undefined) return 'null'
  if (Array.isArray(val)) return 'array'
  if (typeof val === 'object') return 'object'
  if (typeof val === 'number') return 'number'
  if (typeof val === 'boolean') return 'boolean'
  return 'string'
}

function entriesOf(val: unknown): [string | number, unknown][] {
  if (Array.isArray(val)) return val.map((v, i) => [i, v])
  if (val && typeof val === 'object') return Object.entries(val as Record<string, unknown>)
  return []
}

function formatChildPath(parentPath: string, key: string | number, isArrayItem: boolean): string {
  if (isArrayItem) return `${parentPath}[${key}]`
  if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(String(key))) {
    return parentPath === '$' ? `$.${key}` : `${parentPath}.${key}`
  }
  return `${parentPath}["${String(key).replace(/"/g, '\\"')}"]`
}

function formatLeafValue(val: unknown, type: JsonValueType): string {
  if (type === 'null') return 'null'
  if (type === 'string') return JSON.stringify(String(val))
  return String(val)
}

function getValueColorClass(type: JsonValueType): string {
  switch (type) {
    case 'string': return 'text-success'
    case 'number': return 'text-info font-semibold'
    case 'boolean': return 'text-warning font-semibold'
    case 'null': return 'text-error/85 italic'
    default: return 'text-base-content'
  }
}

// ─── Stats (status bar) ──────────────────────────────────────────
const stats = computed(() => {
  const text = rawTextContent.value
  let keys = 0
  let depth = 0
  function walk(v: unknown, d: number) {
    depth = Math.max(depth, d)
    const type = detectType(v)
    if (type === 'object') keys += Object.keys(v as object).length
    for (const [, c] of entriesOf(v)) walk(c, d + 1)
  }
  if (parsedResult.value.ok) walk(parsedResult.value.value, 0)
  const bytes = new Blob([text]).size
  const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
  return { lines: text.split('\n').length, keys, depth, size }
})

const rootSummary = computed(() => {
  if (!parsedResult.value.ok) return 'Error Sintaks'
  const val = parsedResult.value.value
  const type = detectType(val)
  if (type === 'array') return `${(val as unknown[]).length} items`
  if (type === 'object') return `${Object.keys(val as object).length} keys`
  return type
})

// ─── Actions ─────────────────────────────────────────────────────
function handleBeautify() {
  if (!parsedResult.value.ok || !rawTextContent.value.trim()) return
  rawTextContent.value = JSON.stringify(parsedResult.value.value, null, 2)
}

function handleMinify() {
  if (!parsedResult.value.ok) return
  rawTextContent.value = JSON.stringify(parsedResult.value.value)
}

function handleReset() {
  try {
    rawTextContent.value = JSON.stringify(currentSource.value, null, 2)
  } catch {
    rawTextContent.value = '{}'
  }
}

function copyText(text: string) {
  navigator.clipboard?.writeText(text)
  emit('copy', text)
}

function copyFullJson() {
  copyText(rawTextContent.value)
  copiedAll.value = true
  if (copyAllTimer) clearTimeout(copyAllTimer)
  copyAllTimer = setTimeout(() => (copiedAll.value = false), 1800)
}

// ─── Tree Mode ───────────────────────────────────────────────────
function collectExpandablePaths(
  value: unknown,
  currentPath = '$',
  depth = 0,
  maxDepth = Infinity,
  target = new Set<string>(),
): Set<string> {
  const entries = entriesOf(value)
  if (entries.length > 0 && depth < maxDepth) {
    target.add(currentPath)
    const isArr = Array.isArray(value)
    for (const [k, child] of entries) {
      collectExpandablePaths(child, formatChildPath(currentPath, k, isArr), depth + 1, maxDepth, target)
    }
  }
  return target
}

watch(
  () => parsedResult.value.ok,
  (ok) => {
    if (ok) {
      expandedPaths.value = collectExpandablePaths(parsedResult.value.value, '$', 0, props.defaultExpandDepth)
    }
  },
  { immediate: true },
)

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

const searchMatchInfo = computed(() => {
  const query = normalizedQuery.value
  const matchedPaths = new Set<string>()
  const ancestorPaths = new Set<string>()
  if (!query || !parsedResult.value.ok) return { matchedPaths, ancestorPaths }

  function walk(val: unknown, path: string, key: string | number | null, ancestors: string[]) {
    const type = detectType(val)
    const keyMatches = key !== null && String(key).toLowerCase().includes(query)
    const valMatches =
      type !== 'object' && type !== 'array' && String(val ?? 'null').toLowerCase().includes(query)
    if (keyMatches || valMatches) {
      matchedPaths.add(path)
      ancestors.forEach((a) => ancestorPaths.add(a))
    }
    const isArr = type === 'array'
    for (const [k, child] of entriesOf(val)) {
      walk(child, formatChildPath(path, k, isArr), k, [...ancestors, path])
    }
  }

  walk(parsedResult.value.value, '$', null, [])
  return { matchedPaths, ancestorPaths }
})

watch(normalizedQuery, (q) => {
  searchExpandedSet.value = q ? new Set(searchMatchInfo.value.ancestorPaths) : new Set()
})

function isPathExpanded(path: string): boolean {
  if (normalizedQuery.value) {
    return searchMatchInfo.value.ancestorPaths.has(path) || searchExpandedSet.value.has(path)
  }
  return expandedPaths.value.has(path)
}

function togglePath(path: string) {
  const targetSet = normalizedQuery.value ? searchExpandedSet : expandedPaths
  const next = new Set(targetSet.value)
  next.has(path) ? next.delete(path) : next.add(path)
  targetSet.value = next
}

function expandAll() {
  if (mode.value === 'code') {
    if (editorView.value) unfoldAll(editorView.value)
    return
  }
  if (!parsedResult.value.ok) return
  const all = collectExpandablePaths(parsedResult.value.value)
  expandedPaths.value = all
  searchExpandedSet.value = all
}

function collapseAll() {
  if (mode.value === 'code') {
    if (editorView.value) foldAll(editorView.value)
    return
  }
  expandedPaths.value = new Set(['$'])
  searchExpandedSet.value = new Set()
}

const flatRows = computed<JsonFlatRow[]>(() => {
  if (!parsedResult.value.ok) return []
  const rows: JsonFlatRow[] = []
  const query = normalizedQuery.value
  const { matchedPaths } = searchMatchInfo.value

  function buildRows(val: unknown, path: string, key: string | number | null, depth: number, isLast: boolean) {
    const type = detectType(val)
    const isMatch = Boolean(query && matchedPaths.has(path))
    const base = { path, depth, key, value: val, valueType: type, isLast, isMatch }

    if (type === 'object' || type === 'array') {
      const isArr = type === 'array'
      const entries = entriesOf(val)
      const brackets = {
        childCount: entries.length,
        openBracket: (isArr ? '[' : '{') as '[' | '{',
        closeBracket: (isArr ? ']' : '}') as ']' | '}',
      }
      if (entries.length === 0 || !isPathExpanded(path)) {
        rows.push({ ...base, ...brackets, id: `${path}:collapsed`, rowKind: 'collapsed' })
        return
      }
      rows.push({ ...base, ...brackets, id: `${path}:open`, rowKind: 'open' })
      entries.forEach(([childKey, childVal], index) => {
        buildRows(childVal, formatChildPath(path, childKey, isArr), isArr ? null : childKey, depth + 1, index === entries.length - 1)
      })
      rows.push({ ...base, ...brackets, id: `${path}:close`, key: null, rowKind: 'close', isMatch: false })
      return
    }
    rows.push({ ...base, id: `${path}:leaf`, rowKind: 'leaf', childCount: 0 })
  }

  buildRows(parsedResult.value.value, '$', null, 0, true)
  return rows
})

function copyNodeValue(row: JsonFlatRow) {
  let text = ''
  try {
    text = row.valueType === 'string' ? String(row.value) : JSON.stringify(row.value, null, 2)
  } catch {
    text = String(row.value)
  }
  copyText(text)
  copiedRowId.value = row.id
  if (copyRowTimer) clearTimeout(copyRowTimer)
  copyRowTimer = setTimeout(() => (copiedRowId.value = null), 1500)
}

// ─── Table Mode ──────────────────────────────────────────────────
const tablePath = ref<(string | number)[]>([])

watch(() => parsedResult.value.ok, () => (tablePath.value = []))

const tableTarget = computed(() => {
  let cur: unknown = parsedResult.value.value
  for (const seg of tablePath.value) {
    cur = (cur as Record<string | number, unknown>)?.[seg]
  }
  return cur
})

const tableModel = computed(() => {
  const target = tableTarget.value
  const type = detectType(target)
  if (type === 'array') {
    const arr = target as unknown[]
    const objectRows = arr.every((r) => detectType(r) === 'object')
    if (objectRows && arr.length > 0) {
      const cols: string[] = []
      for (const r of arr) for (const k of Object.keys(r as object)) if (!cols.includes(k)) cols.push(k)
      return {
        columns: ['#', ...cols],
        rows: arr.map((r, i) => ({
          key: i,
          cells: [{ value: i, nav: null }, ...cols.map((c) => ({ value: (r as Record<string, unknown>)[c], nav: [i, c] as (string | number)[] }))],
        })),
      }
    }
    return {
      columns: ['#', 'Nilai'],
      rows: arr.map((v, i) => ({ key: i, cells: [{ value: i, nav: null }, { value: v, nav: [i] }] })),
    }
  }
  if (type === 'object') {
    return {
      columns: ['Key', 'Nilai'],
      rows: Object.entries(target as Record<string, unknown>).map(([k, v]) => ({
        key: k,
        cells: [{ value: k, nav: null }, { value: v, nav: [k] }],
      })),
    }
  }
  return { columns: ['Nilai'], rows: [{ key: 0, cells: [{ value: target, nav: null }] }] }
})

function tableNavigate(nav: (string | number)[] | null, value: unknown) {
  const type = detectType(value)
  if (!nav || (type !== 'object' && type !== 'array')) return
  tablePath.value = [...tablePath.value, ...nav]
}

function containerLabel(value: unknown): string {
  const type = detectType(value)
  if (type === 'array') return `[ ${(value as unknown[]).length} items ]`
  return `{ ${Object.keys(value as object).length} keys }`
}

// ─── Graph Mode ──────────────────────────────────────────────────
interface GraphNode {
  id: string
  label: string
  type: 'object' | 'array' | 'primitive'
  fields: { key: string; value: unknown; type: JsonValueType }[]
  x: number
  y: number
  w: number
  h: number
}

const G = { colW: 260, nodeW: 210, rowH: 20, headerH: 26, pad: 8, gapY: 18 }

const graphLayout = computed(() => {
  const nodes: GraphNode[] = []
  const edges: { from: GraphNode; to: GraphNode; label: string }[] = []
  if (!parsedResult.value.ok) return { nodes, edges, width: 0, height: 0 }

  let cursorY = 0
  function place(val: unknown, label: string, depth: number, id: string): GraphNode {
    const type = detectType(val)
    const isContainer = type === 'object' || type === 'array'
    const fields: GraphNode['fields'] = []
    const childEntries: [string, unknown][] = []
    if (isContainer) {
      for (const [k, v] of entriesOf(val)) {
        const vt = detectType(v)
        if (vt === 'object' || vt === 'array') childEntries.push([String(k), v])
        else fields.push({ key: String(k), value: v, type: vt })
      }
    } else {
      fields.push({ key: '', value: val, type })
    }
    const h = G.headerH + Math.max(fields.length, isContainer && !fields.length ? 1 : 0) * G.rowH + G.pad
    const node: GraphNode = {
      id, label, type: isContainer ? (type as 'object' | 'array') : 'primitive',
      fields, x: depth * G.colW, y: 0, w: G.nodeW, h,
    }
    nodes.push(node)

    const children = childEntries.map(([k, v]) => {
      const child = place(v, k, depth + 1, `${id}.${k}`)
      edges.push({ from: node, to: child, label: k })
      return child
    })

    if (children.length) {
      const first = children[0]
      const last = children[children.length - 1]
      node.y = Math.max(0, (first.y + last.y + last.h) / 2 - h / 2)
      cursorY = Math.max(cursorY, node.y + h + G.gapY)
    } else {
      node.y = cursorY
      cursorY += h + G.gapY
    }
    return node
  }

  place(parsedResult.value.value, 'root', 0, '$')
  const width = Math.max(...nodes.map((n) => n.x + n.w)) + 20
  const height = Math.max(...nodes.map((n) => n.y + n.h)) + 20
  return { nodes, edges, width, height }
})

function edgePath(from: GraphNode, to: GraphNode): string {
  const x1 = from.x + from.w + 10
  const y1 = from.y + from.h / 2 + 10
  const x2 = to.x + 10
  const y2 = to.y + G.headerH / 2 + 10
  const mx = (x1 + x2) / 2
  return `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`
}
</script>

<template>
  <div class="relative flex w-full flex-col overflow-visible rounded-box border border-[var(--border)] bg-base-100 text-base-content shadow-xs">
    <!-- Header & Toolbar -->
    <div class="relative z-20 flex flex-wrap items-center justify-between gap-2 rounded-t-box border-b border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-2.5">
      <div class="flex items-center gap-2 min-w-0">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-btn bg-primary/15 text-primary">
          <FileCode2 class="h-4 w-4" />
        </div>
        <span class="truncate font-mono text-xs font-bold text-base-content">{{ title }}</span>
        <span class="badge badge-xs font-mono" :class="parseError ? 'badge-soft badge-error' : 'badge-soft badge-primary'">
          {{ rootSummary }}
        </span>
      </div>

      <div class="flex flex-wrap items-center gap-1.5">
        <!-- Mode Switcher -->
        <div class="flex items-center rounded-btn border border-[var(--border)] bg-base-100 p-0.5">
          <button
            v-for="m in modes"
            :key="m.id"
            type="button"
            class="btn btn-xs h-6 px-2 gap-1 font-mono text-[11px] border-0"
            :class="mode === m.id ? 'btn-active bg-primary/15 text-primary' : 'btn-ghost text-[var(--text-muted)]'"
            :disabled="m.id !== 'code' && Boolean(parseError)"
            @click="mode = m.id"
          >
            <component :is="m.icon" class="h-3.5 w-3.5" />
            <span class="hidden sm:inline">{{ m.label }}</span>
          </button>
        </div>

        <!-- Search (Tree) -->
        <div v-if="searchable && mode === 'tree' && !parseError" class="relative flex items-center">
          <Search class="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[var(--text-faint)]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Cari data..."
            class="input input-xs h-7 w-32 sm:w-40 pl-7 pr-6 bg-base-100 border-[var(--border)] text-xs font-mono focus:border-primary"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-1.5 text-[var(--text-muted)] hover:text-base-content cursor-pointer"
            @click="searchQuery = ''"
          >
            <X class="h-3 w-3" />
          </button>
        </div>

        <template v-if="mode === 'code'">
          <UiTooltip text="Rapikan Format (Ctrl+Shift+F)" position="bottom">
            <button type="button" class="btn btn-ghost btn-xs h-7 px-2 gap-1 font-mono text-[11px]" :disabled="Boolean(parseError) || readOnly" @click="handleBeautify">
              <Sparkles class="h-3.5 w-3.5 text-warning" />
              <span class="hidden sm:inline">Format</span>
            </button>
          </UiTooltip>
          <UiTooltip text="Kecilkan Spasi (Minify)" position="bottom">
            <button type="button" class="btn btn-ghost btn-xs btn-square h-7 w-7" :disabled="Boolean(parseError) || readOnly" @click="handleMinify">
              <Minimize2 class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>
        </template>

        <template v-if="mode === 'code' || mode === 'tree'">
          <UiTooltip text="Buka Semua" position="bottom">
            <button type="button" class="btn btn-ghost btn-xs btn-square h-7 w-7" @click="expandAll">
              <ChevronsUpDown class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>
          <UiTooltip text="Lipat Semua" position="bottom">
            <button type="button" class="btn btn-ghost btn-xs btn-square h-7 w-7" @click="collapseAll">
              <ChevronsDownUp class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>
        </template>

        <UiTooltip text="Muat Ulang Data Asal" position="bottom">
          <button type="button" class="btn btn-ghost btn-xs btn-square h-7 w-7 text-[var(--text-muted)] hover:text-base-content" :disabled="readOnly" @click="handleReset">
            <RotateCcw class="h-3.5 w-3.5" />
          </button>
        </UiTooltip>

        <UiTooltip v-if="copyable" :text="copiedAll ? 'Tersalin!' : 'Salin JSON'" position="left">
          <button type="button" class="btn btn-ghost btn-xs h-7 px-2 gap-1 font-mono" :class="copiedAll ? 'text-success' : ''" @click="copyFullJson">
            <Check v-if="copiedAll" class="h-3.5 w-3.5 text-success" />
            <Copy v-else class="h-3.5 w-3.5" />
          </button>
        </UiTooltip>
      </div>
    </div>

    <!-- Body -->
    <div class="relative" :style="{ height: maxHeight }">
      <!-- Code Mode (CodeMirror, tetap hidup agar undo history terjaga) -->
      <div
        v-show="mode === 'code'"
        ref="editorHost"
        class="h-full overflow-hidden"
        :class="{ 'cm-hide-line-numbers': !showLineNumbers }"
      />

      <!-- Tree Mode -->
      <div v-if="mode === 'tree'" class="h-full overflow-auto py-2 font-mono text-xs leading-[1.65] select-text" role="tree">
        <div
          v-for="(row, idx) in flatRows"
          :key="row.id"
          role="treeitem"
          class="group flex items-center justify-between gap-2 px-3 py-0.5 transition-colors hover:bg-[var(--surface-raised)]"
          :class="[
            row.isMatch ? 'bg-warning/15 ring-1 ring-inset ring-warning/30' : '',
            (row.rowKind === 'open' || row.rowKind === 'collapsed') && row.childCount > 0 ? 'cursor-pointer' : '',
          ]"
          @click="(row.rowKind === 'open' || row.rowKind === 'collapsed') && row.childCount > 0 && togglePath(row.path)"
        >
          <div class="flex items-center min-w-0 flex-1">
            <span v-if="showLineNumbers" class="w-7 shrink-0 select-none pr-2.5 text-right text-[11px] tabular-nums text-[var(--text-faint)]">
              {{ idx + 1 }}
            </span>
            <div class="flex items-center shrink-0 select-none">
              <span v-for="level in row.depth" :key="level" class="inline-block h-5 w-4 border-l border-[var(--border)]" />
            </div>
            <span class="mr-1 flex h-4 w-4 shrink-0 items-center justify-center">
              <template v-if="(row.rowKind === 'open' || row.rowKind === 'collapsed') && row.childCount > 0">
                <ChevronDown v-if="row.rowKind === 'open'" class="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-primary" />
                <ChevronRight v-else class="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-primary" />
              </template>
            </span>
            <div class="flex flex-wrap items-baseline gap-1 min-w-0">
              <template v-if="row.key !== null">
                <span class="font-semibold text-primary">"{{ row.key }}"</span>
                <span class="text-[var(--text-muted)] mr-0.5">:</span>
              </template>
              <template v-if="row.rowKind === 'open'">
                <span class="font-bold">{{ row.openBracket }}</span>
                <span class="text-[10px] text-[var(--text-faint)] ml-1">
                  // {{ row.childCount }} {{ row.valueType === 'array' ? 'items' : 'keys' }}
                </span>
              </template>
              <template v-else-if="row.rowKind === 'collapsed'">
                <span class="font-bold">{{ row.openBracket }}</span>
                <span v-if="row.childCount > 0" class="mx-1 rounded bg-base-200 px-1.5 text-[11px] font-medium text-[var(--text-muted)] border border-[var(--border)]">
                  {{ row.childCount }} {{ row.valueType === 'array' ? 'items' : 'keys' }}
                </span>
                <span class="font-bold">{{ row.closeBracket }}<span v-if="!row.isLast" class="text-[var(--text-muted)]">,</span></span>
              </template>
              <template v-else-if="row.rowKind === 'close'">
                <span class="font-bold">{{ row.closeBracket }}<span v-if="!row.isLast" class="text-[var(--text-muted)]">,</span></span>
              </template>
              <template v-else>
                <span class="break-all" :class="getValueColorClass(row.valueType)">{{ formatLeafValue(row.value, row.valueType) }}</span>
                <span v-if="!row.isLast" class="text-[var(--text-muted)]">,</span>
              </template>
            </div>
          </div>
          <div v-if="row.rowKind !== 'close'" class="flex items-center gap-1.5 opacity-0 transition-opacity group-hover:opacity-100 shrink-0" @click.stop>
            <span class="hidden md:inline text-[10px] text-[var(--text-faint)] max-w-[160px] truncate">{{ row.path }}</span>
            <button
              v-if="copyable"
              type="button"
              class="btn btn-ghost btn-xs h-5 px-1.5 text-[var(--text-muted)] hover:text-primary"
              :title="`Salin nilai (${row.path})`"
              @click="copyNodeValue(row)"
            >
              <Check v-if="copiedRowId === row.id" class="h-3 w-3 text-success" />
              <Copy v-else class="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      <!-- Table Mode -->
      <div v-if="mode === 'table'" class="flex h-full flex-col">
        <!-- Breadcrumb -->
        <div class="flex flex-wrap items-center gap-1 border-b border-[var(--border)] px-3 py-1.5 font-mono text-[11px]">
          <button type="button" class="rounded px-1.5 py-0.5 hover:bg-[var(--surface-raised)]" :class="tablePath.length ? 'text-primary' : 'font-bold'" @click="tablePath = []">$</button>
          <template v-for="(seg, i) in tablePath" :key="i">
            <ChevronRight class="h-3 w-3 text-[var(--text-faint)]" />
            <button
              type="button"
              class="rounded px-1.5 py-0.5 hover:bg-[var(--surface-raised)]"
              :class="i === tablePath.length - 1 ? 'font-bold' : 'text-primary'"
              @click="tablePath = tablePath.slice(0, i + 1)"
            >
              {{ seg }}
            </button>
          </template>
        </div>
        <div class="flex-1 overflow-auto">
          <table class="w-full border-collapse font-mono text-xs">
            <thead class="sticky top-0 z-10 bg-[var(--surface-raised)]">
              <tr>
                <th
                  v-for="col in tableModel.columns"
                  :key="col"
                  class="whitespace-nowrap border-b border-r border-[var(--border)] px-3 py-1.5 text-left text-[11px] font-semibold text-[var(--text-muted)] last:border-r-0"
                >
                  {{ col }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in tableModel.rows" :key="row.key" class="hover:bg-[var(--surface-raised)]">
                <td
                  v-for="(cell, ci) in row.cells"
                  :key="ci"
                  class="whitespace-nowrap border-b border-r border-[var(--border)] px-3 py-1 last:border-r-0"
                  :class="ci === 0 ? 'text-primary font-semibold' : ''"
                >
                  <template v-if="ci === 0">{{ cell.value }}</template>
                  <button
                    v-else-if="detectType(cell.value) === 'object' || detectType(cell.value) === 'array'"
                    type="button"
                    class="rounded border border-[var(--border)] bg-base-200 px-1.5 text-[11px] text-[var(--text-muted)] hover:border-primary hover:text-primary"
                    @click="tableNavigate(cell.nav, cell.value)"
                  >
                    {{ containerLabel(cell.value) }}
                  </button>
                  <span v-else-if="cell.value === undefined" class="text-[var(--text-faint)]">—</span>
                  <span v-else :class="getValueColorClass(detectType(cell.value))">
                    {{ formatLeafValue(cell.value, detectType(cell.value)) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Graph Mode -->
      <div
        v-if="mode === 'graph'"
        class="h-full overflow-auto bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]"
      >
        <div class="relative" :style="{ width: `${graphLayout.width}px`, height: `${graphLayout.height}px` }">
          <svg class="absolute inset-0 pointer-events-none" :width="graphLayout.width" :height="graphLayout.height">
            <g v-for="(e, i) in graphLayout.edges" :key="i">
              <path :d="edgePath(e.from, e.to)" fill="none" stroke="rgb(var(--p) / 0.45)" stroke-width="1.5" />
            </g>
          </svg>
          <div
            v-for="node in graphLayout.nodes"
            :key="node.id"
            class="absolute overflow-hidden rounded-btn border border-[var(--border)] bg-base-100 font-mono text-[11px] shadow-sm"
            :style="{ left: `${node.x + 10}px`, top: `${node.y + 10}px`, width: `${node.w}px`, height: `${node.h}px` }"
          >
            <div class="flex items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-raised)] px-2" :style="{ height: `${G.headerH}px` }">
              <span class="truncate font-bold text-primary">{{ node.label }}</span>
              <span class="text-[10px] text-[var(--text-faint)]">{{ node.type === 'array' ? '[ ]' : node.type === 'object' ? '{ }' : '' }}</span>
            </div>
            <div class="px-2 pt-1">
              <div v-for="f in node.fields" :key="f.key" class="flex items-center gap-1.5 truncate" :style="{ height: `${G.rowH}px` }">
                <span v-if="f.key" class="shrink-0 text-[var(--text-muted)]">{{ f.key }}:</span>
                <span class="truncate" :class="getValueColorClass(f.type)">{{ formatLeafValue(f.value, f.type) }}</span>
              </div>
              <div v-if="!node.fields.length" class="italic text-[var(--text-faint)]" :style="{ height: `${G.rowH}px` }">
                {{ node.type === 'array' ? 'array' : 'object' }} bersarang
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error overlay untuk mode non-code -->
      <div v-if="mode !== 'code' && parseError" class="absolute inset-0 flex items-center justify-center bg-base-100 text-xs text-[var(--text-muted)]">
        Perbaiki kesalahan sintaks pada mode Code terlebih dahulu.
      </div>
    </div>

    <!-- Status Bar -->
    <div class="flex flex-wrap items-center justify-between gap-2 rounded-b-box border-t border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-1 font-mono text-[10.5px] text-[var(--text-muted)]">
      <div class="flex items-center gap-1.5 min-w-0">
        <span class="h-1.5 w-1.5 shrink-0 rounded-full" :class="parseError ? 'bg-error' : 'bg-success'" />
        <span class="truncate" :class="parseError ? 'text-error' : ''">{{ parseError ?? 'JSON valid' }}</span>
      </div>
      <div class="flex items-center gap-3 shrink-0">
        <span v-if="mode === 'code'">Ln {{ cursor.line }}, Col {{ cursor.col }}</span>
        <span>{{ stats.lines }} baris</span>
        <span>{{ stats.keys }} keys</span>
        <span>depth {{ stats.depth }}</span>
        <span>{{ stats.size }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cm-hide-line-numbers :deep(.cm-lineNumbers) {
  display: none;
}
</style>
