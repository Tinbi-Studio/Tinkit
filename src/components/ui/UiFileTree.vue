<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import {
  ChevronDown,
  ChevronRight,
  ChevronsDownUp,
  ChevronsUpDown,
  Database,
  File,
  FileArchive,
  FileCode,
  FileImage,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  Search,
  X,
} from 'lucide-vue-next'
import type { ColorVariant } from '@/types/theme'
import UiTooltip from '@/components/ui/UiTooltip.vue'

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
  maxHeight: '420px',
  bordered: true,
  compact: false,
})

const emit = defineEmits<{
  'update:modelValue': [id: string]
  'update:expandedIds': [ids: string[]]
  select: [item: FileTreeItem, path: string]
  toggle: [item: FileTreeItem, expanded: boolean]
}>()

interface FlatFileRow {
  item: FileTreeItem
  depth: number
  path: string
  isFolder: boolean
  isExpanded: boolean
  hasChildren: boolean
  isMatch: boolean
}

const searchQuery = ref('')
const internalSelectedId = ref<string | undefined>(props.modelValue)
const internalExpandedSet = ref<Set<string>>(new Set())

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

function initExpandedState() {
  if (props.expandedIds !== undefined) {
    internalExpandedSet.value = new Set(props.expandedIds)
    return
  }
  if (props.defaultExpandAll) {
    internalExpandedSet.value = collectAllFolderIds(props.items)
    return
  }
  if (props.defaultExpandedIds.length > 0) {
    internalExpandedSet.value = new Set(props.defaultExpandedIds)
    return
  }
  // By default expand top-level folders so tree looks inviting out-of-the-box
  const rootFolders = new Set<string>()
  for (const item of props.items) {
    if (item.type === 'folder') {
      rootFolders.add(item.id)
    }
  }
  internalExpandedSet.value = rootFolders
}

watch(
  () => [props.items, props.defaultExpandAll, props.defaultExpandedIds],
  () => {
    initExpandedState()
  },
  { immediate: true },
)

watch(
  () => props.expandedIds,
  (next) => {
    if (next !== undefined) {
      internalExpandedSet.value = new Set(next)
    }
  },
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

// Compute matching node IDs and visible ancestor folders when searching
const searchFilterState = computed(() => {
  const query = normalizedQuery.value
  const matchedIds = new Set<string>()
  const visibleIds = new Set<string>()
  const autoExpandedFolderIds = new Set<string>()

  if (!query) {
    return { matchedIds, visibleIds, autoExpandedFolderIds }
  }

  function traverse(node: FileTreeItem, ancestors: FileTreeItem[]): boolean {
    const selfMatch = node.name.toLowerCase().includes(query)
    let childMatch = false

    if (node.children?.length) {
      for (const child of node.children) {
        if (traverse(child, [...ancestors, node])) {
          childMatch = true
        }
      }
    }

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
      return true
    }

    return false
  }

  for (const root of props.items) {
    traverse(root, [])
  }

  return { matchedIds, visibleIds, autoExpandedFolderIds }
})

function isFolderExpanded(id: string): boolean {
  if (normalizedQuery.value) {
    return (
      searchFilterState.value.autoExpandedFolderIds.has(id) ||
      internalExpandedSet.value.has(id)
    )
  }
  return internalExpandedSet.value.has(id)
}

function updateExpandedSet(nextSet: Set<string>) {
  internalExpandedSet.value = nextSet
  emit('update:expandedIds', Array.from(nextSet))
}

function toggleFolder(item: FileTreeItem) {
  if (item.type !== 'folder' || item.disabled) return
  const next = new Set(internalExpandedSet.value)
  const willExpand = !next.has(item.id)
  if (willExpand) {
    next.add(item.id)
  } else {
    next.delete(item.id)
  }
  updateExpandedSet(next)
  emit('toggle', item, willExpand)
}

function expandAll() {
  updateExpandedSet(collectAllFolderIds(props.items))
}

function collapseAll() {
  updateExpandedSet(new Set())
}

const flatRows = computed<FlatFileRow[]>(() => {
  const rows: FlatFileRow[] = []
  const query = normalizedQuery.value
  const { matchedIds, visibleIds } = searchFilterState.value

  function walk(nodes: FileTreeItem[], depth: number, parentPath: string) {
    for (const item of nodes) {
      if (query && !visibleIds.has(item.id)) {
        continue
      }

      const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name
      const isFolder = item.type === 'folder'
      const hasChildren = Boolean(isFolder && item.children && item.children.length > 0)
      const isExpanded = isFolder && isFolderExpanded(item.id)
      const isMatch = Boolean(query && matchedIds.has(item.id))

      rows.push({
        item,
        depth,
        path: currentPath,
        isFolder,
        isExpanded,
        hasChildren,
        isMatch,
      })

      if (isFolder && isExpanded && item.children?.length) {
        walk(item.children, depth + 1, currentPath)
      }
    }
  }

  walk(props.items, 0, '')
  return rows
})

const treeStats = computed(() => {
  let folders = 0
  let files = 0
  function countNodes(nodes: FileTreeItem[]) {
    for (const n of nodes) {
      if (n.type === 'folder') {
        folders += 1
        if (n.children?.length) countNodes(n.children)
      } else {
        files += 1
      }
    }
  }
  countNodes(props.items)
  return { folders, files }
})

function resolveFileIcon(row: FlatFileRow): { icon: Component | unknown; colorClass: string } {
  if (row.item.icon) {
    return { icon: row.item.icon, colorClass: 'text-primary' }
  }

  if (row.isFolder) {
    return {
      icon: row.isExpanded ? FolderOpen : Folder,
      colorClass: 'text-warning',
    }
  }

  const name = row.item.name.toLowerCase()
  const ext = name.includes('.') ? name.split('.').pop() || '' : ''

  if (['vue', 'ts', 'tsx', 'js', 'jsx', 'py', 'go', 'rs', 'html', 'css', 'scss'].includes(ext)) {
    return { icon: FileCode, colorClass: 'text-info' }
  }
  if (['json', 'yaml', 'yml', 'toml', 'env', 'lock'].includes(ext)) {
    return { icon: FileJson, colorClass: 'text-secondary' }
  }
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(ext)) {
    return { icon: FileImage, colorClass: 'text-success' }
  }
  if (['zip', 'tar', 'gz', 'rar', '7z', 'tgz'].includes(ext)) {
    return { icon: FileArchive, colorClass: 'text-error' }
  }
  if (['sql', 'db', 'sqlite', 'prisma'].includes(ext)) {
    return { icon: Database, colorClass: 'text-accent' }
  }
  if (['md', 'txt', 'log', 'csv', 'pdf'].includes(ext)) {
    return { icon: FileText, colorClass: 'text-[var(--text-muted)]' }
  }

  return { icon: File, colorClass: 'text-[var(--text-muted)]' }
}

function handleRowClick(row: FlatFileRow) {
  if (row.item.disabled) return

  if (row.isFolder) {
    toggleFolder(row.item)
  }

  internalSelectedId.value = row.item.id
  emit('update:modelValue', row.item.id)
  emit('select', row.item, row.path)
}

function handleRowKeydown(event: KeyboardEvent, index: number, row: FlatFileRow) {
  if (row.item.disabled) return

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleRowClick(row)
    return
  }

  if (event.key === 'ArrowRight' && row.isFolder && !row.isExpanded) {
    event.preventDefault()
    toggleFolder(row.item)
    return
  }

  if (event.key === 'ArrowLeft' && row.isFolder && row.isExpanded) {
    event.preventDefault()
    toggleFolder(row.item)
    return
  }

  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    const nextIndex = event.key === 'ArrowDown' ? index + 1 : index - 1
    const container = (event.currentTarget as HTMLElement | null)?.parentElement
    const buttons = container?.querySelectorAll<HTMLElement>('[data-tree-row="true"]')
    if (buttons && buttons[nextIndex]) {
      buttons[nextIndex].focus()
    }
  }
}
</script>

<template>
  <div
    class="w-full overflow-hidden rounded-box bg-base-100 text-base-content"
    :class="bordered ? 'border border-[var(--border)] shadow-xs' : ''"
  >
    <!-- Header Bar -->
    <div
      v-if="showHeader"
      class="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] bg-[var(--surface-raised)] px-3.5 py-2.5"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div class="flex h-7 w-7 shrink-0 items-center justify-center rounded-btn bg-warning/15 text-warning">
          <FolderOpen class="h-4 w-4" />
        </div>
        <span class="truncate text-xs font-bold text-base-content">
          {{ title }}
        </span>
        <span class="badge badge-xs badge-soft badge-neutral font-mono">
          {{ treeStats.folders }} folder · {{ treeStats.files }} file
        </span>
      </div>

      <div class="flex items-center gap-1.5">
        <!-- Search Input -->
        <div v-if="searchable" class="relative flex items-center">
          <Search class="pointer-events-none absolute left-2.5 h-3.5 w-3.5 text-[var(--text-faint)]" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Filter berkas..."
            class="input input-xs h-7 w-36 sm:w-44 pl-7 pr-6 bg-base-100 border-[var(--border)] text-xs focus:border-primary"
          />
          <button
            v-if="searchQuery"
            type="button"
            class="absolute right-1.5 text-[var(--text-muted)] hover:text-base-content cursor-pointer"
            aria-label="Bersihkan filter"
            @click="searchQuery = ''"
          >
            <X class="h-3 w-3" />
          </button>
        </div>

        <UiTooltip text="Buka Semua Folder" position="top">
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square h-7 w-7"
            aria-label="Expand all folders"
            @click="expandAll"
          >
            <ChevronsUpDown class="h-3.5 w-3.5" />
          </button>
        </UiTooltip>

        <UiTooltip text="Tutup Semua Folder" position="top">
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-square h-7 w-7"
            aria-label="Collapse all folders"
            @click="collapseAll"
          >
            <ChevronsDownUp class="h-3.5 w-3.5" />
          </button>
        </UiTooltip>
      </div>
    </div>

    <!-- Tree Rows Container -->
    <div
      class="overflow-auto p-1.5 select-none"
      :style="{ maxHeight }"
      role="tree"
    >
      <template v-if="flatRows.length > 0">
        <button
          v-for="(row, idx) in flatRows"
          :key="row.item.id"
          type="button"
          role="treeitem"
          data-tree-row="true"
          :aria-expanded="row.isFolder ? row.isExpanded : undefined"
          :aria-selected="activeSelectedId === row.item.id"
          :disabled="row.item.disabled"
          class="group flex w-full items-center justify-between gap-2 rounded-btn px-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/35"
          :class="[
            compact ? 'py-1 text-xs' : 'py-1.5 text-[13px]',
            activeSelectedId === row.item.id
              ? 'bg-primary text-primary-content font-semibold'
              : row.isMatch
                ? 'bg-warning/15 text-base-content hover:bg-warning/25'
                : 'text-base-content hover:bg-[var(--surface-raised)]',
            row.item.disabled ? 'opacity-45 cursor-not-allowed' : 'cursor-pointer',
          ]"
          @click="handleRowClick(row)"
          @keydown="handleRowKeydown($event, idx, row)"
        >
          <!-- Left: Indentation + Chevron + Icon + Name -->
          <div class="flex items-center min-w-0 flex-1">
            <!-- Indentation Guide Lines -->
            <div class="flex items-center shrink-0">
              <span
                v-for="level in row.depth"
                :key="level"
                class="inline-block h-5 w-4 border-l"
                :class="
                  activeSelectedId === row.item.id
                    ? 'border-primary-content/30'
                    : 'border-[var(--border)]'
                "
              />
            </div>

            <!-- Folder Chevron or Spacer -->
            <span class="mr-1 flex h-4 w-4 shrink-0 items-center justify-center">
              <template v-if="row.isFolder">
                <ChevronDown
                  v-if="row.isExpanded"
                  class="h-3.5 w-3.5 transition-transform"
                  :class="
                    activeSelectedId === row.item.id
                      ? 'text-primary-content'
                      : 'text-[var(--text-muted)]'
                  "
                />
                <ChevronRight
                  v-else
                  class="h-3.5 w-3.5 transition-transform"
                  :class="
                    activeSelectedId === row.item.id
                      ? 'text-primary-content'
                      : 'text-[var(--text-muted)]'
                  "
                />
              </template>
            </span>

            <!-- File / Folder Icon -->
            <component
              :is="resolveFileIcon(row).icon"
              class="mr-2 h-4 w-4 shrink-0"
              :class="
                activeSelectedId === row.item.id
                  ? 'text-primary-content'
                  : resolveFileIcon(row).colorClass
              "
            />

            <!-- File / Folder Name -->
            <span
              class="truncate"
              :class="[
                row.isFolder ? 'font-semibold' : 'font-mono text-xs',
                row.isMatch && activeSelectedId !== row.item.id ? 'underline decoration-warning' : '',
              ]"
            >
              {{ row.item.name }}
            </span>
          </div>

          <!-- Right: Badge / Size / Custom Slot -->
          <div class="flex items-center gap-2 shrink-0">
            <slot name="item-extra" :item="row.item" :path="row.path" :selected="activeSelectedId === row.item.id">
              <span
                v-if="row.item.badge"
                class="badge badge-xs font-semibold"
                :class="
                  activeSelectedId === row.item.id
                    ? 'border-primary-content/30 bg-primary-content text-primary'
                    : `badge-soft badge-${row.item.badgeVariant || 'primary'}`
                "
              >
                {{ row.item.badge }}
              </span>

              <span
                v-if="showSize && row.item.size && !row.isFolder"
                class="font-mono text-[11px]"
                :class="
                  activeSelectedId === row.item.id
                    ? 'text-primary-content/85'
                    : 'text-[var(--text-faint)]'
                "
              >
                {{ row.item.size }}
              </span>
            </slot>
          </div>
        </button>
      </template>

      <!-- Empty / No Match State -->
      <div v-else class="py-8 text-center text-xs text-[var(--text-muted)]">
        <slot name="empty">
          Tidak ada berkas yang cocok dengan pencarian <strong>"{{ searchQuery }}"</strong>.
        </slot>
      </div>
    </div>
  </div>
</template>
