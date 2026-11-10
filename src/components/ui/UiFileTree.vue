<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch, type Component } from 'vue'
import {
  Check,
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Copy,
  Database,
  File,
  FileArchive,
  FileCode,
  FileImage,
  FileJson,
  FileLock,
  FileSpreadsheet,
  FileTerminal,
  FileText,
  Folder,
  FolderGit2,
  FolderOpen,
  List,
  Network,
  Package,
  Search,
  Settings,
  X,
} from 'lucide-vue-next'
import type { ColorVariant } from '@/types/theme'
import UiTooltip from '@/components/ui/UiTooltip.vue'

export type GitFileStatus =
  | 'added'
  | 'modified'
  | 'deleted'
  | 'renamed'
  | 'untracked'
  | 'conflicted'

export interface FileTreeItem {
  id: string
  name: string
  type: 'folder' | 'file'
  children?: FileTreeItem[]
  size?: string
  modified?: string
  icon?: Component | unknown
  badge?: string
  badgeVariant?: ColorVariant
  disabled?: boolean
  /** GitLab-style extensions */
  status?: GitFileStatus
  additions?: number
  deletions?: number
  lastCommit?: string
  submodule?: boolean
}

export interface UiFileTreeProps {
  items: FileTreeItem[]
  modelValue?: string
  expandedIds?: string[]
  defaultExpandedIds?: string[]
  defaultExpandAll?: boolean
  searchable?: boolean
  showSize?: boolean
  showHeader?: boolean
  title?: string
  maxHeight?: string
  bordered?: boolean
  compact?: boolean
  /** GitLab-style enhancements */
  compactFolders?: boolean
  sortFoldersFirst?: boolean
  defaultViewMode?: 'tree' | 'flat'
  showViewToggle?: boolean
  showBreadcrumbs?: boolean
  showGitStatus?: boolean
  showModified?: boolean
  showCopyPath?: boolean
}

const props = withDefaults(defineProps<UiFileTreeProps>(), {
  items: () => [],
  modelValue: undefined,
  expandedIds: undefined,
  defaultExpandedIds: () => [],
  defaultExpandAll: false,
  searchable: true,
  showSize: true,
  showHeader: true,
  title: 'Project Explorer',
  maxHeight: '460px',
  bordered: true,
  compact: false,
  compactFolders: true,
  sortFoldersFirst: true,
  defaultViewMode: 'tree',
  showViewToggle: true,
  showBreadcrumbs: true,
  showGitStatus: true,
  showModified: false,
  showCopyPath: true,
})

const emit = defineEmits<{
  'update:modelValue': [id: string]
  'update:expandedIds': [ids: string[]]
  select: [item: FileTreeItem, path: string]
  toggle: [item: FileTreeItem, expanded: boolean]
  'copy-path': [path: string, item: FileTreeItem]
}>()

interface CompactSegment {
  id: string
  name: string
  path: string
  item: FileTreeItem
}

interface FlatFileRow {
  item: FileTreeItem
  depth: number
  path: string
  parentId?: string
  ancestorIds: string[]
  isFolder: boolean
  isExpanded: boolean
  hasChildren: boolean
  isMatch: boolean
  hasModifiedDescendant: boolean
  compactedSegments?: CompactSegment[]
  compactedIds: string[]
}

const searchInputRef = ref<HTMLInputElement | null>(null)
const treeContainerRef = ref<HTMLElement | null>(null)
const searchQuery = ref('')
const internalSelectedId = ref<string | undefined>(props.modelValue)
const internalExpandedSet = ref<Set<string>>(new Set())
// Menyimpan state ekspansi khusus saat mode pencarian aktif agar tetap bisa di-collapse/expand manual
const searchExpandedSet = ref<Set<string>>(new Set())
const hasInitialized = ref(false)

const viewMode = ref<'tree' | 'flat'>(props.defaultViewMode)
const isCompactFoldersEnabled = ref<boolean>(props.compactFolders)
const copiedRowId = ref<string | null>(null)
const copiedBreadcrumb = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.compactFolders,
  (val) => {
    isCompactFoldersEnabled.value = val
  },
)

watch(
  () => props.defaultViewMode,
  (val) => {
    viewMode.value = val
  },
)

function sortTreeNodes(nodes: FileTreeItem[]): FileTreeItem[] {
  if (!props.sortFoldersFirst) return nodes
  return [...nodes].sort((a, b) => {
    if (a.type !== b.type) {
      return a.type === 'folder' ? -1 : 1
    }
    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
  })
}

function collectAllFolderIds(nodes: FileTreeItem[], target = new Set<string>()): Set<string> {
  for (const node of nodes) {
    if (node.type === 'folder') {
      target.add(node.id)
      if (node.children?.length) {
        collectAllFolderIds(node.children, target)
      }
    }
  }
  return target
}

function collectSingleChildChainIds(node: FileTreeItem, target: Set<string>) {
  target.add(node.id)
  if (
    node.type === 'folder' &&
    node.children?.length === 1 &&
    node.children[0]?.type === 'folder' &&
    !node.children[0].disabled
  ) {
    collectSingleChildChainIds(node.children[0], target)
  }
}

function expandSingleChildChainsForSet(nodes: FileTreeItem[], target: Set<string>) {
  for (const node of nodes) {
    if (node.type === 'folder') {
      if (target.has(node.id)) {
        collectSingleChildChainIds(node, target)
      }
      if (node.children?.length) {
        expandSingleChildChainsForSet(node.children, target)
      }
    }
  }
}

function initExpandedState() {
  if (props.expandedIds !== undefined) {
    const next = new Set(props.expandedIds)
    expandSingleChildChainsForSet(props.items, next)
    internalExpandedSet.value = next
    return
  }
  if (props.defaultExpandAll) {
    internalExpandedSet.value = collectAllFolderIds(props.items)
    return
  }
  if (props.defaultExpandedIds && props.defaultExpandedIds.length > 0) {
    const next = new Set(props.defaultExpandedIds)
    expandSingleChildChainsForSet(props.items, next)
    internalExpandedSet.value = next
    return
  }
  const rootFolders = new Set<string>()
  for (const item of props.items) {
    if (item.type === 'folder') {
      collectSingleChildChainIds(item, rootFolders)
    }
  }
  internalExpandedSet.value = rootFolders
}

// Inisialisasi awal hanya saat komponen pertama kali punya item, tidak mereset saat user klik collapseAll
watch(
  () => props.items.length,
  (newLen) => {
    if (!hasInitialized.value && newLen > 0) {
      initExpandedState()
      hasInitialized.value = true
    }
  },
  { immediate: true },
)

watch(
  () => props.defaultExpandAll,
  () => {
    initExpandedState()
  },
)

watch(
  () => (props.defaultExpandedIds ? props.defaultExpandedIds.join('|') : ''),
  (newKey, oldKey) => {
    if (newKey !== oldKey && props.expandedIds === undefined) {
      initExpandedState()
    }
  },
)

watch(
  () => props.expandedIds,
  (next) => {
    if (next !== undefined) {
      internalExpandedSet.value = new Set(next)
    }
  },
  { deep: true },
)

watch(
  () => props.modelValue,
  (next) => {
    internalSelectedId.value = next
  },
)

const activeSelectedId = computed(() =>
  props.modelValue !== undefined ? props.modelValue : internalSelectedId.value,
)

const normalizedQuery = computed(() => searchQuery.value.trim().toLowerCase())

// Map folder modification status & search matches
const treeMetadata = computed(() => {
  const query = normalizedQuery.value
  const matchedIds = new Set<string>()
  const visibleIds = new Set<string>()
  const autoExpandedFolderIds = new Set<string>()
  const modifiedFolderIds = new Set<string>()
  const itemPathMap = new Map<string, { item: FileTreeItem; path: string; ancestorIds: string[] }>()

  function traverse(
    node: FileTreeItem,
    ancestors: FileTreeItem[],
    parentPath: string,
  ): { match: boolean; hasGitChange: boolean } {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name
    const ancestorIds = ancestors.map((a) => a.id)
    itemPathMap.set(node.id, { item: node, path: currentPath, ancestorIds })

    const selfMatch = query
      ? node.name.toLowerCase().includes(query) || currentPath.toLowerCase().includes(query)
      : false

    const selfGitChange = Boolean(
      node.status || (node.additions && node.additions > 0) || (node.deletions && node.deletions > 0),
    )

    let childMatch = false
    let childGitChange = false

    if (node.children?.length) {
      for (const child of node.children) {
        const res = traverse(child, [...ancestors, node], currentPath)
        if (res.match) childMatch = true
        if (res.hasGitChange) childGitChange = true
      }
    }

    if (node.type === 'folder' && childGitChange) {
      modifiedFolderIds.add(node.id)
    }

    if (query) {
      if (selfMatch) {
        matchedIds.add(node.id)
      }
      if (selfMatch || childMatch) {
        visibleIds.add(node.id)
        for (const anc of ancestors) {
          visibleIds.add(anc.id)
          autoExpandedFolderIds.add(anc.id)
        }
        if (node.type === 'folder' && childMatch) {
          autoExpandedFolderIds.add(node.id)
        }
      }
    }

    return {
      match: selfMatch || childMatch,
      hasGitChange: selfGitChange || childGitChange,
    }
  }

  for (const root of props.items) {
    traverse(root, [], '')
  }

  return {
    matchedIds,
    visibleIds,
    autoExpandedFolderIds,
    modifiedFolderIds,
    itemPathMap,
  }
})

// Saat kata kunci pencarian berubah, otomatis buka folder yang memiliki hasil cocok,
// namun tetap izinkan pengguna melakukan collapseAll / expandAll / toggle manual setelahnya.
watch(normalizedQuery, (q) => {
  if (q) {
    searchExpandedSet.value = new Set(treeMetadata.value.autoExpandedFolderIds)
  } else {
    searchExpandedSet.value = new Set()
  }
})

const activeAncestorSet = computed<Set<string>>(() => {
  if (!activeSelectedId.value) return new Set()
  const meta = treeMetadata.value.itemPathMap.get(activeSelectedId.value)
  return new Set(meta ? [...meta.ancestorIds, activeSelectedId.value] : [])
})

const selectedItemMeta = computed(() => {
  if (!activeSelectedId.value) return null
  return treeMetadata.value.itemPathMap.get(activeSelectedId.value) || null
})

const breadcrumbSegments = computed(() => {
  const meta = selectedItemMeta.value
  if (!meta) return []
  const parts = meta.path.split('/')
  const result: { name: string; path: string; isLast: boolean }[] = []
  let acc = ''
  parts.forEach((part, index) => {
    acc = acc ? `${acc}/${part}` : part
    result.push({
      name: part,
      path: acc,
      isLast: index === parts.length - 1,
    })
  })
  return result
})

function isFolderExpanded(id: string): boolean {
  if (normalizedQuery.value) {
    return searchExpandedSet.value.has(id)
  }
  return internalExpandedSet.value.has(id)
}

function updateExpandedSet(nextSet: Set<string>) {
  internalExpandedSet.value = new Set(nextSet)
  if (normalizedQuery.value) {
    searchExpandedSet.value = new Set(nextSet)
  }
  emit('update:expandedIds', Array.from(nextSet))
}

function toggleFolderRow(row: FlatFileRow) {
  if (!row.isFolder || row.item.disabled) return
  const activeSet = normalizedQuery.value ? searchExpandedSet.value : internalExpandedSet.value
  const next = new Set(activeSet)
  const targetIds = row.compactedIds.length > 0 ? row.compactedIds : [row.item.id]
  const willExpand = !row.isExpanded

  for (const id of targetIds) {
    if (willExpand) {
      next.add(id)
    } else {
      next.delete(id)
    }
  }

  if (normalizedQuery.value) {
    searchExpandedSet.value = next
  } else {
    internalExpandedSet.value = next
    emit('update:expandedIds', Array.from(next))
  }

  emit('toggle', row.item, willExpand)
}

function expandAll() {
  if (viewMode.value === 'flat') {
    viewMode.value = 'tree'
  }
  const allFolderIds = collectAllFolderIds(props.items)
  updateExpandedSet(allFolderIds)
}

function collapseAll() {
  if (viewMode.value === 'flat') {
    viewMode.value = 'tree'
  }
  updateExpandedSet(new Set())
}

const flatRows = computed<FlatFileRow[]>(() => {
  const rows: FlatFileRow[] = []
  const query = normalizedQuery.value
  const { matchedIds, visibleIds, modifiedFolderIds } = treeMetadata.value

  // Flat View Mode (like GitLab MR flat files view)
  if (viewMode.value === 'flat') {
    function collectFiles(nodes: FileTreeItem[], parentPath: string, ancestorIds: string[]) {
      const sorted = sortTreeNodes(nodes)
      for (const item of sorted) {
        if (query && !visibleIds.has(item.id)) continue
        const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name
        if (item.type === 'file') {
          rows.push({
            item,
            depth: 0,
            path: currentPath,
            parentId: ancestorIds[ancestorIds.length - 1],
            ancestorIds,
            isFolder: false,
            isExpanded: false,
            hasChildren: false,
            isMatch: Boolean(query && matchedIds.has(item.id)),
            hasModifiedDescendant: false,
            compactedIds: [item.id],
          })
        } else if (item.children?.length) {
          collectFiles(item.children, currentPath, [...ancestorIds, item.id])
        }
      }
    }
    collectFiles(props.items, '', [])
    return rows
  }

  // Tree View Mode (with GitLab Single-Child Folder Compaction)
  function walk(
    nodes: FileTreeItem[],
    depth: number,
    parentPath: string,
    ancestorIds: string[],
  ) {
    const sorted = sortTreeNodes(nodes)

    for (const rawItem of sorted) {
      if (query && !visibleIds.has(rawItem.id)) {
        continue
      }

      let currentItem = rawItem
      let currentPath = parentPath ? `${parentPath}/${rawItem.name}` : rawItem.name
      const compactedSegments: CompactSegment[] = [
        { id: rawItem.id, name: rawItem.name, path: currentPath, item: rawItem },
      ]
      const compactedIds: string[] = [rawItem.id]

      // Squash single-child folders when compactFolders is enabled
      if (isCompactFoldersEnabled.value && currentItem.type === 'folder' && !currentItem.disabled) {
        while (currentItem.children) {
          const visibleChildren = query
            ? currentItem.children.filter((c) => visibleIds.has(c.id))
            : currentItem.children

          if (
            visibleChildren.length === 1 &&
            visibleChildren[0]?.type === 'folder' &&
            !visibleChildren[0].disabled
          ) {
            const nextChild = visibleChildren[0]
            currentPath = `${currentPath}/${nextChild.name}`
            compactedSegments.push({
              id: nextChild.id,
              name: nextChild.name,
              path: currentPath,
              item: nextChild,
            })
            compactedIds.push(nextChild.id)
            currentItem = nextChild
          } else {
            break
          }
        }
      }

      const isFolder = currentItem.type === 'folder'
      const hasChildren = Boolean(isFolder && currentItem.children && currentItem.children.length > 0)
      // Menggunakan .some() agar folder gabungan maupun tunggal selalu sinkron saat dibuka/ditutup
      const isExpanded = isFolder && compactedIds.some((id) => isFolderExpanded(id))
      const isMatch = Boolean(query && compactedIds.some((id) => matchedIds.has(id)))
      const hasModifiedDescendant = Boolean(
        isFolder && compactedIds.some((id) => modifiedFolderIds.has(id)),
      )

      rows.push({
        item: currentItem,
        depth,
        path: currentPath,
        parentId: ancestorIds[ancestorIds.length - 1],
        ancestorIds,
        isFolder,
        isExpanded,
        hasChildren,
        isMatch,
        hasModifiedDescendant,
        compactedSegments: compactedSegments.length > 1 ? compactedSegments : undefined,
        compactedIds,
      })

      if (isFolder && isExpanded && currentItem.children?.length) {
        walk(currentItem.children, depth + 1, currentPath, [...ancestorIds, ...compactedIds])
      }
    }
  }

  walk(props.items, 0, '', [])
  return rows
})

const treeStats = computed(() => {
  let folders = 0
  let files = 0
  let modified = 0
  function countNodes(nodes: FileTreeItem[]) {
    for (const n of nodes) {
      if (n.type === 'folder') {
        folders += 1
        if (n.children?.length) countNodes(n.children)
      } else {
        files += 1
        if (n.status) modified += 1
      }
    }
  }
  countNodes(props.items)
  return { folders, files, modified }
})

const allFolderIdsCount = computed(() => collectAllFolderIds(props.items).size)
const isAllExpanded = computed(() => {
  if (allFolderIdsCount.value === 0) return false
  const activeSet = normalizedQuery.value ? searchExpandedSet.value : internalExpandedSet.value
  return activeSet.size >= allFolderIdsCount.value
})
const isAllCollapsed = computed(() => {
  const activeSet = normalizedQuery.value ? searchExpandedSet.value : internalExpandedSet.value
  return activeSet.size === 0
})

function resolveFileIcon(row: FlatFileRow): { icon: Component | unknown; colorClass: string } {
  if (row.item.icon) {
    return { icon: row.item.icon, colorClass: 'text-primary' }
  }

  if (row.isFolder) {
    if (row.item.submodule) {
      return { icon: FolderGit2, colorClass: 'text-info' }
    }
    return {
      icon: row.isExpanded ? FolderOpen : Folder,
      colorClass: 'text-warning',
    }
  }

  const name = row.item.name.toLowerCase()
  const ext = name.includes('.') ? name.split('.').pop() || '' : ''

  if (name === 'package.json' || name === 'cargo.toml' || name === 'composer.json') {
    return { icon: Package, colorClass: 'text-error' }
  }
  if (name.startsWith('.env') || ['pem', 'key', 'crt', 'lock'].includes(ext)) {
    return { icon: FileLock, colorClass: 'text-warning' }
  }
  if (
    name === 'dockerfile' ||
    name.startsWith('docker-compose') ||
    ['sh', 'bash', 'zsh', 'bat', 'ps1'].includes(ext)
  ) {
    return { icon: FileTerminal, colorClass: 'text-accent' }
  }
  if (['config.js', 'config.ts', 'tsconfig.json', 'vite.config.ts'].some((k) => name.endsWith(k))) {
    return { icon: Settings, colorClass: 'text-secondary' }
  }
  if (
    ['vue', 'ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs', 'html', 'css', 'scss', 'php', 'rb', 'java'].includes(
      ext,
    )
  ) {
    return { icon: FileCode, colorClass: 'text-info' }
  }
  if (['json', 'yaml', 'yml', 'toml', 'xml'].includes(ext)) {
    return { icon: FileJson, colorClass: 'text-secondary' }
  }
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'avif'].includes(ext)) {
    return { icon: FileImage, colorClass: 'text-success' }
  }
  if (['zip', 'tar', 'gz', 'rar', '7z', 'tgz'].includes(ext)) {
    return { icon: FileArchive, colorClass: 'text-error' }
  }
  if (['sql', 'db', 'sqlite', 'prisma'].includes(ext)) {
    return { icon: Database, colorClass: 'text-accent' }
  }
  if (['csv', 'xlsx', 'xls', 'parquet'].includes(ext)) {
    return { icon: FileSpreadsheet, colorClass: 'text-success' }
  }
  if (['md', 'mdx', 'txt', 'log', 'pdf', 'doc', 'docx'].includes(ext)) {
    return { icon: FileText, colorClass: 'text-[var(--text-muted)]' }
  }

  return { icon: File, colorClass: 'text-[var(--text-muted)]' }
}

function getGitStatusConfig(status?: GitFileStatus): {
  label: string
  title: string
  className: string
} | null {
  if (!status) return null
  const map: Record<GitFileStatus, { label: string; title: string; className: string }> = {
    added: {
      label: 'A',
      title: 'Added',
      className: 'bg-success/15 text-success border-success/30',
    },
    modified: {
      label: 'M',
      title: 'Modified',
      className: 'bg-warning/15 text-warning border-warning/30',
    },
    deleted: {
      label: 'D',
      title: 'Deleted',
      className: 'bg-error/15 text-error border-error/30',
    },
    renamed: {
      label: 'R',
      title: 'Renamed',
      className: 'bg-info/15 text-info border-info/30',
    },
    untracked: {
      label: 'U',
      title: 'Untracked',
      className: 'bg-success/15 text-success border-success/30',
    },
    conflicted: {
      label: '!',
      title: 'Conflict',
      className: 'bg-error text-error-content border-error',
    },
  }
  return map[status]
}

function splitHighlight(text: string): { text: string; highlight: boolean }[] {
  const query = normalizedQuery.value
  if (!query) return [{ text, highlight: false }]
  const lowerText = text.toLowerCase()
  const idx = lowerText.indexOf(query)
  if (idx === -1) return [{ text, highlight: false }]

  const parts: { text: string; highlight: boolean }[] = []
  if (idx > 0) {
    parts.push({ text: text.slice(0, idx), highlight: false })
  }
  parts.push({ text: text.slice(idx, idx + query.length), highlight: true })
  if (idx + query.length < text.length) {
    parts.push({ text: text.slice(idx + query.length), highlight: false })
  }
  return parts
}

function isRowSelected(row: FlatFileRow): boolean {
  if (!activeSelectedId.value) return false
  return row.compactedIds.includes(activeSelectedId.value) || activeSelectedId.value === row.item.id
}

function handleRowClick(row: FlatFileRow) {
  if (row.item.disabled) return

  if (row.isFolder) {
    toggleFolderRow(row)
  }

  internalSelectedId.value = row.item.id
  emit('update:modelValue', row.item.id)
  emit('select', row.item, row.path)
}

function selectByBreadcrumbPath(targetPath: string) {
  for (const [id, entry] of treeMetadata.value.itemPathMap.entries()) {
    if (entry.path === targetPath) {
      internalSelectedId.value = id
      emit('update:modelValue', id)
      emit('select', entry.item, entry.path)
      break
    }
  }
}

async function copyPathToClipboard(path: string, item?: FileTreeItem, fromBreadcrumb = false) {
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(path)
    }
    if (copyTimeout) clearTimeout(copyTimeout)
    if (fromBreadcrumb) {
      copiedBreadcrumb.value = true
    } else if (item) {
      copiedRowId.value = item.id
    }
    if (item) {
      emit('copy-path', path, item)
    }
    copyTimeout = setTimeout(() => {
      copiedRowId.value = null
      copiedBreadcrumb.value = false
    }, 1600)
  } catch {
    // Fallback silent ignore
  }
}

function focusRowByIndex(index: number) {
  const buttons = treeContainerRef.value?.querySelectorAll<HTMLElement>('[data-tree-row="true"]')
  if (buttons && buttons[index]) {
    buttons[index].focus()
  }
}

function handleRowKeydown(event: KeyboardEvent, index: number, row: FlatFileRow) {
  if (row.item.disabled) return

  if (event.key === '/' && props.searchable) {
    event.preventDefault()
    searchInputRef.value?.focus()
    return
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleRowClick(row)
    return
  }

  if (event.key === 'ArrowRight' && viewMode.value === 'tree') {
    event.preventDefault()
    if (row.isFolder && !row.isExpanded) {
      toggleFolderRow(row)
    } else if (row.isFolder && row.isExpanded && row.hasChildren) {
      focusRowByIndex(index + 1)
    }
    return
  }

  if (event.key === 'ArrowLeft' && viewMode.value === 'tree') {
    event.preventDefault()
    if (row.isFolder && row.isExpanded) {
      toggleFolderRow(row)
    } else if (row.parentId) {
      const parentIndex = flatRows.value.findIndex((r) =>
        r.compactedIds.includes(row.parentId!),
      )
      if (parentIndex !== -1) {
        focusRowByIndex(parentIndex)
      }
    }
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const nextIndex = event.key === 'ArrowDown' ? index + 1 : index - 1
    focusRowByIndex(nextIndex)
    return
  }

  if (event.key === 'Home') {
    event.preventDefault()
    focusRowByIndex(0)
    return
  }

  if (event.key === 'End') {
    event.preventDefault()
    focusRowByIndex(flatRows.value.length - 1)
  }
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if (
    e.key === '/' &&
    props.searchable &&
    treeContainerRef.value?.contains(document.activeElement) &&
    document.activeElement !== searchInputRef.value
  ) {
    e.preventDefault()
    searchInputRef.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
  if (copyTimeout) clearTimeout(copyTimeout)
})

defineExpose({
  expandAll,
  collapseAll,
  focusSearch: () => nextTick(() => searchInputRef.value?.focus()),
})
</script>

<template>
  <!-- Root menggunakan overflow-visible agar UiTooltip tidak pernah terpotong -->
  <div
    class="relative flex w-full flex-col overflow-visible rounded-box bg-base-100 text-base-content"
    :class="bordered ? 'border border-[var(--border)] shadow-xs' : ''"
  >
    <!-- GitLab-Style Top Header & Filter Toolbar (z-20 agar tooltip melayang di atas isi tree) -->
    <div
      v-if="showHeader"
      class="relative z-20 flex flex-col gap-2 rounded-t-box border-b border-[var(--border)] bg-[var(--surface-raised)] px-3 py-2.5"
    >
      <div class="flex flex-wrap items-center justify-between gap-2">
        <!-- Title & Stats -->
        <div class="flex items-center gap-2 min-w-0">
          <div class="flex h-6 w-6 shrink-0 items-center justify-center rounded-btn bg-warning/15 text-warning">
            <FolderOpen class="h-3.5 w-3.5" />
          </div>
          <span class="truncate text-xs font-bold tracking-tight text-base-content">
            {{ title }}
          </span>
          <span class="badge badge-xs badge-soft badge-neutral font-mono tabular-nums">
            {{ treeStats.folders }} folder · {{ treeStats.files }} file
          </span>
          <span
            v-if="showGitStatus && treeStats.modified > 0"
            class="badge badge-xs badge-soft badge-warning font-mono tabular-nums"
          >
            {{ treeStats.modified }} diubah
          </span>
        </div>

        <!-- Toolbar Actions -->
        <div class="flex items-center gap-1">
          <slot name="header-actions" />

          <!-- Tree vs Flat View Toggle -->
          <div
            v-if="showViewToggle"
            class="inline-flex items-center rounded-btn border border-[var(--border)] bg-base-100 p-0.5"
          >
            <UiTooltip text="Tampilan Pohon" position="bottom">
              <button
                type="button"
                class="flex h-5 w-6 items-center justify-center rounded-[4px] transition-colors cursor-pointer"
                :class="
                  viewMode === 'tree'
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-[var(--text-muted)] hover:text-base-content'
                "
                aria-label="Tree view"
                @click="viewMode = 'tree'"
              >
                <Network class="h-3.5 w-3.5" />
              </button>
            </UiTooltip>

            <UiTooltip text="Tampilan Daftar" position="bottom">
              <button
                type="button"
                class="flex h-5 w-6 items-center justify-center rounded-[4px] transition-colors cursor-pointer"
                :class="
                  viewMode === 'flat'
                    ? 'bg-primary/15 text-primary font-semibold'
                    : 'text-[var(--text-muted)] hover:text-base-content'
                "
                aria-label="Flat view"
                @click="viewMode = 'flat'"
              >
                <List class="h-3.5 w-3.5" />
              </button>
            </UiTooltip>
          </div>

          <!-- Compact Single-Child Folders Toggle -->
          <UiTooltip
            v-if="viewMode === 'tree'"
            :text="isCompactFoldersEnabled ? 'Folder Tunggal: Gabung' : 'Folder Tunggal: Pisah'"
            position="bottom"
          >
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square h-6 w-6"
              :class="
                isCompactFoldersEnabled ? 'text-primary bg-primary/10' : 'text-[var(--text-muted)]'
              "
              aria-label="Toggle compact single-child folders"
              @click="isCompactFoldersEnabled = !isCompactFoldersEnabled"
            >
              <FolderGit2 class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>

          <!-- Buka Semua Folder -->
          <UiTooltip text="Buka Semua Folder" position="bottom">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square h-6 w-6 transition-colors"
              :class="
                isAllExpanded && viewMode === 'tree'
                  ? 'text-primary bg-primary/10'
                  : 'text-[var(--text-muted)] hover:text-base-content'
              "
              aria-label="Expand all folders"
              @click="expandAll"
            >
              <ChevronsUpDown class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>

          <!-- Tutup Semua Folder (position="left" agar tidak terpotong di sisi kanan layar/container) -->
          <UiTooltip text="Tutup Semua Folder" position="left">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-square h-6 w-6 transition-colors"
              :class="
                isAllCollapsed && viewMode === 'tree'
                  ? 'text-primary bg-primary/10'
                  : 'text-[var(--text-muted)] hover:text-base-content'
              "
              aria-label="Collapse all folders"
              @click="collapseAll"
            >
              <ChevronsDownUp class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>
        </div>
      </div>

      <!-- Search Filter Bar with `/` Shortcut Hint -->
      <div v-if="searchable" class="relative flex items-center w-full">
        <Search class="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[var(--text-faint)]" />
        <input
          ref="searchInputRef"
          v-model="searchQuery"
          type="text"
          placeholder="Filter berkas atau direktori..."
          class="input input-xs h-7 w-full pl-8 pr-12 bg-base-100 border-[var(--border)] text-xs focus:border-primary"
          @keydown.esc="searchQuery = ''"
        />
        <div class="absolute right-2 flex items-center gap-1">
          <button
            v-if="searchQuery"
            type="button"
            class="flex h-4 w-4 items-center justify-center rounded-full text-[var(--text-muted)] hover:bg-[var(--surface-raised)] hover:text-base-content cursor-pointer"
            aria-label="Bersihkan filter"
            @click="searchQuery = ''"
          >
            <X class="h-3 w-3" />
          </button>
          <kbd
            v-else
            class="pointer-events-none hidden sm:inline-flex h-4 items-center rounded border border-[var(--border)] bg-[var(--surface-raised)] px-1 font-mono text-[10px] text-[var(--text-faint)]"
          >
            /
          </kbd>
        </div>
      </div>
    </div>

    <!-- Active Breadcrumb Path Bar (z-10 agar tooltip tidak tertutup baris tree) -->
    <div
      v-if="showBreadcrumbs && breadcrumbSegments.length > 0"
      class="relative z-10 flex items-center justify-between gap-2 border-b border-[var(--border)] bg-base-100/60 px-3 py-1.5 text-[11px]"
      :class="!showHeader ? 'rounded-t-box' : ''"
    >
      <div class="flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0 font-mono">
        <template v-for="seg in breadcrumbSegments" :key="seg.path">
          <button
            type="button"
            class="truncate rounded px-1 py-0.5 transition-colors cursor-pointer"
            :class="
              seg.isLast
                ? 'font-semibold text-base-content bg-[var(--surface-raised)]'
                : 'text-[var(--text-muted)] hover:text-primary hover:bg-primary/10'
            "
            @click="selectByBreadcrumbPath(seg.path)"
          >
            {{ seg.name }}
          </button>
          <span v-if="!seg.isLast" class="text-[var(--text-faint)] select-none">/</span>
        </template>
      </div>

      <UiTooltip :text="copiedBreadcrumb ? 'Path Disalin!' : 'Salin Relative Path'" position="left">
        <button
          type="button"
          class="btn btn-ghost btn-xs h-5 min-h-0 px-1.5 gap-1 text-[10px] text-[var(--text-muted)] hover:text-base-content shrink-0"
          @click="
            selectedItemMeta &&
              copyPathToClipboard(selectedItemMeta.path, selectedItemMeta.item, true)
          "
        >
          <Check v-if="copiedBreadcrumb" class="h-3 w-3 text-success" />
          <Copy v-else class="h-3 w-3" />
          <span class="hidden sm:inline">{{ copiedBreadcrumb ? 'Disalin' : 'Salin' }}</span>
        </button>
      </UiTooltip>
    </div>

    <!-- Tree Rows Container -->
    <div
      ref="treeContainerRef"
      class="overflow-auto py-1 select-none rounded-b-box"
      :class="!showHeader && (!showBreadcrumbs || breadcrumbSegments.length === 0) ? 'rounded-t-box' : ''"
      :style="{ maxHeight }"
      role="tree"
      aria-label="Hierarki Berkas Proyek"
    >
      <template v-if="flatRows.length > 0">
        <button
          v-for="(row, idx) in flatRows"
          :key="row.item.id"
          type="button"
          role="treeitem"
          data-tree-row="true"
          :aria-level="row.depth + 1"
          :aria-expanded="row.isFolder ? row.isExpanded : undefined"
          :aria-selected="isRowSelected(row)"
          :disabled="row.item.disabled"
          class="group relative flex w-full items-center justify-between gap-2 pr-2.5 pl-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary"
          :class="[
            compact ? 'h-7 text-xs' : 'h-8 text-[13px]',
            isRowSelected(row)
              ? 'bg-primary/10 text-base-content font-semibold before:absolute before:left-0 before:top-0 before:bottom-0 before:w-[3px] before:bg-primary'
              : row.isMatch
                ? 'bg-warning/10 text-base-content hover:bg-warning/15'
                : 'text-base-content hover:bg-[var(--surface-raised)]',
            row.item.disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
          ]"
          @click="handleRowClick(row)"
          @keydown="handleRowKeydown($event, idx, row)"
        >
          <!-- Left: Full-Height Indentation Guides + Chevron + Icon + Name -->
          <div class="flex h-full items-center min-w-0 flex-1">
            <!-- Full-Height GitLab Indentation Guide Lines -->
            <div v-if="viewMode === 'tree'" class="flex h-full items-center shrink-0">
              <span
                v-for="level in row.depth"
                :key="level"
                class="inline-flex h-full w-4 items-center justify-center"
              >
                <span
                  class="h-full w-px transition-colors"
                  :class="
                    row.ancestorIds[level - 1] &&
                    activeAncestorSet.has(row.ancestorIds[level - 1]!)
                      ? 'bg-primary/45'
                      : 'bg-[var(--border)] group-hover:bg-[var(--text-faint)]/40'
                  "
                />
              </span>
            </div>

            <!-- Folder Chevron or Spacer -->
            <span
              v-if="viewMode === 'tree'"
              class="mr-1 flex h-4 w-4 shrink-0 items-center justify-center rounded transition-colors"
            >
              <template v-if="row.isFolder">
                <ChevronDown
                  v-if="row.isExpanded"
                  class="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-base-content transition-transform duration-150"
                />
                <ChevronRight
                  v-else
                  class="h-3.5 w-3.5 text-[var(--text-muted)] group-hover:text-base-content transition-transform duration-150"
                />
              </template>
            </span>

            <!-- File / Folder Icon -->
            <component
              :is="resolveFileIcon(row).icon"
              class="mr-2 h-4 w-4 shrink-0 transition-transform group-hover:scale-[1.03]"
              :class="resolveFileIcon(row).colorClass"
            />

            <!-- File / Folder Name (Supports Compacted Folder Chains & Flat View Directory Prefix) -->
            <div class="flex items-center min-w-0 flex-1 truncate">
              <!-- Compacted Folder Chain (e.g. src / components / ui) -->
              <template v-if="row.compactedSegments && row.compactedSegments.length > 1">
                <span class="truncate font-semibold">
                  <template v-for="(seg, sIdx) in row.compactedSegments" :key="seg.id">
                    <span
                      :class="
                        sIdx < row.compactedSegments.length - 1
                          ? 'text-[var(--text-muted)] font-normal'
                          : 'text-base-content font-semibold'
                      "
                    >
                      <template
                        v-for="(part, pIdx) in splitHighlight(seg.name)"
                        :key="pIdx"
                      >
                        <mark
                          v-if="part.highlight"
                          class="rounded-[2px] bg-warning/35 px-0.5 text-base-content font-semibold"
                        >{{ part.text }}</mark>
                        <template v-else>{{ part.text }}</template>
                      </template>
                    </span>
                    <span
                      v-if="sIdx < row.compactedSegments.length - 1"
                      class="mx-0.5 text-[var(--text-faint)] font-normal"
                    >/</span>
                  </template>
                </span>
              </template>

              <!-- Standard Tree Row or Flat View Row -->
              <template v-else>
                <span
                  class="truncate"
                  :class="[
                    row.isFolder ? 'font-semibold' : 'font-mono text-xs',
                    row.item.status === 'deleted' ? 'line-through opacity-65' : '',
                  ]"
                >
                  <template v-for="(part, pIdx) in splitHighlight(row.item.name)" :key="pIdx">
                    <mark
                      v-if="part.highlight"
                      class="rounded-[2px] bg-warning/35 px-0.5 text-base-content font-semibold"
                    >{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </span>

                <!-- Directory Path Subtitle in Flat View -->
                <span
                  v-if="viewMode === 'flat' && row.path.includes('/')"
                  class="ml-2 truncate font-mono text-[11px] text-[var(--text-faint)]"
                >
                  {{ row.path.slice(0, row.path.lastIndexOf('/')) }}
                </span>
              </template>
            </div>
          </div>

          <!-- Right: Hover Copy Action + Git Diff Stats + Status + Badges + Size -->
          <div class="flex items-center gap-1.5 shrink-0">
            <!-- Hover Quick Actions -->
            <div
              class="hidden group-hover:flex group-focus-visible:flex items-center gap-1"
              @click.stop
            >
              <slot name="row-actions" :item="row.item" :path="row.path" />
              <span
                v-if="showCopyPath"
                role="button"
                tabindex="-1"
                class="flex h-5 w-5 items-center justify-center rounded text-[var(--text-muted)] hover:bg-base-100 hover:text-base-content"
                :title="`Salin path: ${row.path}`"
                @click.stop="copyPathToClipboard(row.path, row.item)"
              >
                <Check v-if="copiedRowId === row.item.id" class="h-3 w-3 text-success" />
                <Copy v-else class="h-3 w-3" />
              </span>
            </div>

            <slot
              name="item-extra"
              :item="row.item"
              :path="row.path"
              :selected="isRowSelected(row)"
            >
              <!-- Folder Modified Descendant Dot -->
              <span
                v-if="showGitStatus && row.isFolder && row.hasModifiedDescendant"
                class="h-2 w-2 rounded-full bg-warning"
                title="Berisi berkas yang dimodifikasi"
              />

              <!-- Git Diff Additions / Deletions (+12 -4) -->
              <span
                v-if="
                  showGitStatus &&
                  !row.isFolder &&
                  (row.item.additions !== undefined || row.item.deletions !== undefined)
                "
                class="inline-flex items-center gap-1 font-mono text-[11px] tabular-nums"
              >
                <span v-if="row.item.additions" class="text-success font-medium">
                  +{{ row.item.additions }}
                </span>
                <span v-if="row.item.deletions" class="text-error font-medium">
                  -{{ row.item.deletions }}
                </span>
              </span>

              <!-- Git Status Badge (A / M / D / R / U) -->
              <span
                v-if="showGitStatus && getGitStatusConfig(row.item.status)"
                class="inline-flex h-4 min-w-4 items-center justify-center rounded border px-1 font-mono text-[10px] font-bold leading-none"
                :class="getGitStatusConfig(row.item.status)?.className"
                :title="getGitStatusConfig(row.item.status)?.title"
              >
                {{ getGitStatusConfig(row.item.status)?.label }}
              </span>

              <!-- Custom Badge -->
              <span
                v-if="row.item.badge"
                class="badge badge-xs font-semibold"
                :class="`badge-soft badge-${row.item.badgeVariant || 'primary'}`"
              >
                {{ row.item.badge }}
              </span>

              <!-- Modified Relative Time -->
              <span
                v-if="showModified && row.item.modified"
                class="hidden sm:inline font-mono text-[11px] text-[var(--text-faint)] tabular-nums"
              >
                {{ row.item.modified }}
              </span>

              <!-- File Size -->
              <span
                v-if="showSize && row.item.size && !row.isFolder"
                class="font-mono text-[11px] text-[var(--text-faint)] tabular-nums"
              >
                {{ row.item.size }}
              </span>
            </slot>
          </div>
        </button>
      </template>

      <!-- Empty / No Match State -->
      <div v-else class="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
        <slot name="empty">
          <div class="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--surface-raised)] text-[var(--text-muted)]">
            <Search class="h-4 w-4" />
          </div>
          <p class="text-xs text-[var(--text-muted)]">
            Tidak ada berkas yang cocok dengan filter
            <strong class="font-mono text-base-content">"{{ searchQuery }}"</strong>.
          </p>
          <button
            v-if="searchQuery"
            type="button"
            class="btn btn-ghost btn-xs text-primary"
            @click="searchQuery = ''"
          >
            Reset pencarian
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>
