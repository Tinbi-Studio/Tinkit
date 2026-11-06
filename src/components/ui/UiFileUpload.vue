<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue'
import {
  UploadCloud,
  FileText,
  Image as ImageIcon,
  Film,
  FileArchive,
  CheckCircle2,
  Trash2,
  Eye,
  Plus,
  X,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Download,
  FlipHorizontal,
  RefreshCw,
} from 'lucide-vue-next'
import { lockScroll, unlockScroll } from '@/utils/scrollLock'
import UiTooltip from '@/components/ui/UiTooltip.vue'

export interface UploadedFileItem {
  id: string
  name: string
  size: number
  type: string
  url?: string
  progress: number
  status: 'uploading' | 'done' | 'error'
}

export interface UiFileUploadProps {
  modelValue?: UploadedFileItem[]
  mode?: 'file' | 'dropzone' | 'gallery'
  label?: string
  hint?: string
  accept?: string
  multiple?: boolean
  maxSizeMb?: number
}

const props = withDefaults(defineProps<UiFileUploadProps>(), {
  modelValue: () => [],
  mode: 'dropzone',
  label: undefined,
  hint: undefined,
  accept: '*/*',
  multiple: true,
  maxSizeMb: 10,
})

const emit = defineEmits<{
  'update:modelValue': [files: UploadedFileItem[]]
  change: [files: UploadedFileItem[]]
}>()

const fileInputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)
const internalFiles = ref<UploadedFileItem[]>([...props.modelValue])
const previewImageUrl = ref<string | null>(null)
const previewImageTitle = ref<string>('')
const previewFileType = ref<'image' | 'pdf' | 'text' | null>(null)
const previewTextContent = ref<string>('')
const createdUrls: string[] = []

function syncFiles() {
  emit('update:modelValue', [...internalFiles.value])
  emit('change', [...internalFiles.value])
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} KB`
  const mb = kb / 1024
  return `${mb.toFixed(2)} MB`
}

function isImageFile(file: UploadedFileItem): boolean {
  return (
    file.type.startsWith('image/') ||
    /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(file.name) ||
    Boolean(file.url && file.url.startsWith('data:image')) ||
    Boolean(file.url && file.url.startsWith('https://images.unsplash.com'))
  )
}

function isPdfFile(file: UploadedFileItem): boolean {
  return (
    file.type === 'application/pdf' ||
    /\.pdf$/i.test(file.name)
  )
}

function isTextFile(file: UploadedFileItem): boolean {
  return (
    file.type.startsWith('text/') ||
    /\.(txt|md|json|csv|js|ts|html|css|xml|log)$/i.test(file.name)
  )
}

function isPreviewable(file: UploadedFileItem): boolean {
  if (!file.url) return false
  return isImageFile(file) || isPdfFile(file) || isTextFile(file)
}

function getFileIcon(type: string, name: string) {
  if (type.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name)) return ImageIcon
  if (type.startsWith('video/') || /\.(mp4|webm|mov)$/i.test(name)) return Film
  if (/\.(zip|rar|7z|tar|gz)$/i.test(name)) return FileArchive
  return FileText
}

function triggerFileDialog() {
  fileInputRef.value?.click()
}

function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    processFileList(input.files)
    input.value = ''
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function handleDragLeave(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
}

function handleDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    processFileList(event.dataTransfer.files)
  }
}

function processFileList(fileList: FileList) {
  const filesArray = Array.from(fileList)
  const toProcess = props.multiple ? filesArray : filesArray.slice(0, 1)

  if (!props.multiple) {
    internalFiles.value = []
  }

  toProcess.forEach((file) => {
    const isImg = file.type.startsWith('image/') || props.mode === 'gallery'
    const isDoc = file.type === 'application/pdf' || file.type.startsWith('text/')
    let objectUrl: string | undefined
    if (isImg || isDoc) {
      objectUrl = URL.createObjectURL(file)
      createdUrls.push(objectUrl)
    }

    const item: UploadedFileItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      size: file.size,
      type: file.type || 'application/octet-stream',
      url: objectUrl,
      progress: 25,
      status: 'uploading',
    }

    internalFiles.value.push(item)
    simulateUploadProgress(item.id)
  })

  syncFiles()
}

function simulateUploadProgress(itemId: string) {
  const timer = setInterval(() => {
    const target = internalFiles.value.find((f) => f.id === itemId)
    if (!target) {
      clearInterval(timer)
      return
    }
    if (target.progress < 100) {
      target.progress = Math.min(100, target.progress + 35)
    } else {
      target.status = 'done'
      clearInterval(timer)
      syncFiles()
    }
  }, 180)
}

function removeFile(id: string) {
  internalFiles.value = internalFiles.value.filter((f) => f.id !== id)
  syncFiles()
}

function clearAllFiles() {
  internalFiles.value = []
  syncFiles()
}

// Image Tooling state (Zoom, Rotation, Flip, Pan/Drag)
const zoomLevel = ref(1)
const rotationAngle = ref(0)
const isFlippedH = ref(false)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
let dragStartX = 0
let dragStartY = 0
let initialPanX = 0
let initialPanY = 0

function resetImageTools() {
  zoomLevel.value = 1
  rotationAngle.value = 0
  isFlippedH.value = false
  panX.value = 0
  panY.value = 0
  isPanning.value = false
}

function zoomIn() {
  if (zoomLevel.value < 3) {
    zoomLevel.value = Math.min(3, +(zoomLevel.value + 0.25).toFixed(2))
  }
}

function zoomOut() {
  if (zoomLevel.value > 0.5) {
    zoomLevel.value = Math.max(0.5, +(zoomLevel.value - 0.25).toFixed(2))
    if (zoomLevel.value <= 1) {
      panX.value = 0
      panY.value = 0
    }
  }
}

function startPan(e: MouseEvent | TouchEvent) {
  if (zoomLevel.value <= 1) return
  isPanning.value = true
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  dragStartX = clientX
  dragStartY = clientY
  initialPanX = panX.value
  initialPanY = panY.value
}

function onPan(e: MouseEvent | TouchEvent) {
  if (!isPanning.value) return
  const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
  const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
  panX.value = Math.round(initialPanX + (clientX - dragStartX))
  panY.value = Math.round(initialPanY + (clientY - dragStartY))
}

function endPan() {
  isPanning.value = false
}

function rotateClockwise() {
  rotationAngle.value = (rotationAngle.value + 90) % 360
}

function rotateCounterClockwise() {
  rotationAngle.value = (rotationAngle.value - 90 + 360) % 360
}

function toggleFlipHorizontal() {
  isFlippedH.value = !isFlippedH.value
}

function downloadCurrentFile() {
  if (!previewImageUrl.value) return
  const a = document.createElement('a')
  a.href = previewImageUrl.value
  a.download = previewImageTitle.value || 'download'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

function openPreview(file: UploadedFileItem) {
  if (!file.url) return

  resetImageTools()
  previewImageTitle.value = file.name
  if (isImageFile(file)) {
    previewFileType.value = 'image'
    previewImageUrl.value = file.url
  } else if (isPdfFile(file)) {
    previewFileType.value = 'pdf'
    previewImageUrl.value = file.url
  } else if (isTextFile(file)) {
    previewFileType.value = 'text'
    previewImageUrl.value = file.url
    // Fetch text preview if possible
    fetch(file.url)
      .then((res) => res.text())
      .then((txt) => {
        previewTextContent.value = txt.slice(0, 10000)
      })
      .catch(() => {
        previewTextContent.value = 'Gagal memuat pratinjau teks.'
      })
  }
}

let isLocked = false

watch(
  () => previewImageUrl.value,
  (hasPreview) => {
    if (hasPreview) {
      if (!isLocked) {
        lockScroll()
        isLocked = true
      }
    } else {
      if (isLocked) {
        unlockScroll()
        isLocked = false
      }
    }
  },
)

function closePreview() {
  previewImageUrl.value = null
  previewFileType.value = null
  previewTextContent.value = ''
  resetImageTools()
}

onUnmounted(() => {
  createdUrls.forEach((u) => URL.revokeObjectURL(u))
  if (isLocked) {
    unlockScroll()
    isLocked = false
  }
})
</script>

<template>
  <div class="w-full space-y-3">
    <!-- Header Label & Counter -->
    <div v-if="label || internalFiles.length > 0" class="flex items-center justify-between">
      <span v-if="label" class="text-xs font-semibold text-base-content/80">
        {{ label }}
      </span>
      <div v-if="internalFiles.length > 0" class="flex items-center gap-2">
        <span class="badge badge-xs badge-soft badge-primary font-mono">
          {{ internalFiles.length }} file
        </span>
        <button
          v-if="internalFiles.length > 1"
          type="button"
          class="text-[11px] font-semibold text-error hover:underline cursor-pointer"
          @click="clearAllFiles"
        >
          Hapus Semua
        </button>
      </div>
    </div>

    <!-- Hidden Native File Input -->
    <input
      ref="fileInputRef"
      type="file"
      class="hidden"
      :accept="mode === 'gallery' ? 'image/*' : accept"
      :multiple="multiple"
      @change="handleFileSelect"
    />

    <!-- MODE 1: COMPACT FILE BUTTON UPLOAD WITH PREVIEW -->
    <div v-if="mode === 'file'" class="space-y-3">
      <div class="flex flex-wrap items-center gap-3">
        <button
          type="button"
          class="btn btn-primary btn-sm"
          @click="triggerFileDialog"
        >
          <UploadCloud class="h-4 w-4" />
          Pilih File untuk Diunggah
        </button>
        <span class="text-xs text-base-content/55">
          Maks. {{ maxSizeMb }}MB per file
        </span>
      </div>
    </div>

    <!-- MODE 2: DRAG & DROP ZONE -->
    <div
      v-else-if="mode === 'dropzone'"
      class="relative flex flex-col items-center justify-center rounded-box border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer select-none"
      :class="
        isDragging
          ? 'border-primary bg-primary/10 scale-[1.01]'
          : 'border-base-300 bg-base-200/35 hover:border-primary/50 hover:bg-base-200/60'
      "
      @click="triggerFileDialog"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div
        class="flex h-12 w-12 items-center justify-center rounded-field mb-3 transition-transform"
        :class="isDragging ? 'bg-primary text-primary-content scale-110' : 'bg-primary/12 text-primary'"
      >
        <UploadCloud class="h-6 w-6" />
      </div>
      <p class="text-sm font-extrabold text-base-content">
        Seret & lepaskan file ke sini, atau <span class="text-primary underline">klik untuk memilih</span>
      </p>
      <p class="text-xs text-base-content/55 mt-1">
        Mendukung upload {{ multiple ? 'banyak file sekaligus' : '1 file' }} (Maks. {{ maxSizeMb }}MB)
      </p>
    </div>

    <!-- MODE 3: MULTI-PHOTO GALLERY UPLOAD -->
    <div
      v-else-if="mode === 'gallery'"
      class="space-y-3"
      @dragover="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="handleDrop"
    >
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        <!-- Uploaded Photo Thumbnails -->
        <div
          v-for="photo in internalFiles"
          :key="photo.id"
          class="group relative aspect-square rounded-box border border-base-300 bg-base-200 overflow-hidden shadow-xs"
        >
          <img
            v-if="photo.url"
            :src="photo.url"
            :alt="photo.name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div v-else class="flex h-full w-full items-center justify-center text-base-content/40">
            <ImageIcon class="h-8 w-8" />
          </div>

          <!-- Uploading Progress Overlay -->
          <div
            v-if="photo.status === 'uploading'"
            class="absolute inset-0 bg-neutral/60 backdrop-blur-2xs flex flex-col items-center justify-center p-3 text-base-content"
          >
            <span class="text-xs font-mono font-bold mb-1.5">{{ photo.progress }}%</span>
            <div class="w-full h-1.5 rounded-full bg-white/25 overflow-hidden">
              <div
                class="h-full bg-primary transition-all duration-150"
                :style="{ width: `${photo.progress}%` }"
              />
            </div>
          </div>

          <!-- Hover Action Overlay -->
          <div
            v-else
            class="absolute inset-0 bg-neutral/65 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 text-base-content"
          >
            <div class="flex items-center justify-end gap-1.5">
              <button
                v-if="photo.url"
                type="button"
                class="btn btn-xs btn-circle bg-white/20 hover:bg-white/35 border-none text-white h-7 w-7"
                title="Lihat ukuran penuh"
                @click.stop="openPreview(photo)"
              >
                <Eye class="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                class="btn btn-xs btn-circle bg-error/85 hover:bg-error border-none text-error-content h-7 w-7"
                title="Hapus foto"
                @click.stop="removeFile(photo.id)"
              >
                <Trash2 class="h-3.5 w-3.5" />
              </button>
            </div>

            <div class="truncate text-left">
              <p class="text-[11px] font-bold truncate">{{ photo.name }}</p>
              <p class="text-[10px] text-white/75 font-mono">{{ formatFileSize(photo.size) }}</p>
            </div>
          </div>
        </div>

        <!-- Add More Photos Tile -->
        <button
          type="button"
          class="aspect-square rounded-box border-2 border-dashed flex flex-col items-center justify-center gap-1.5 p-4 text-center transition-all cursor-pointer"
          :class="
            isDragging
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-base-300 bg-base-200/35 text-base-content/60 hover:border-primary hover:text-primary hover:bg-primary/5'
          "
          @click="triggerFileDialog"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-field bg-primary/12 text-primary">
            <Plus class="h-5 w-5" />
          </div>
          <span class="text-xs font-extrabold">Tambah Foto</span>
          <span class="text-[10px] text-base-content/45">Bisa pilih banyak</span>
        </button>
      </div>
    </div>

    <!-- UPLOADED FILE PREVIEW LIST (For mode="file" and mode="dropzone") -->
    <div v-if="mode !== 'gallery' && internalFiles.length > 0" class="space-y-2">
      <div
        v-for="item in internalFiles"
        :key="item.id"
        class="flex items-center justify-between gap-3 rounded-box border border-base-300 bg-base-100 p-3 shadow-2xs transition-all hover:border-primary/30"
      >
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <!-- Image Thumbnail or File Icon -->
          <div
            v-if="item.url && isImageFile(item)"
            class="h-11 w-11 shrink-0 rounded-btn overflow-hidden border border-base-300 bg-base-200 cursor-pointer"
            @click="openPreview(item)"
          >
            <img :src="item.url" :alt="item.name" class="h-full w-full object-cover" />
          </div>
          <div
            v-else
            class="flex h-11 w-11 shrink-0 items-center justify-center rounded-btn bg-primary/12 text-primary"
          >
            <component :is="getFileIcon(item.type, item.name)" class="h-5 w-5" />
          </div>

          <!-- File Info & Progress -->
          <div class="min-w-0 flex-1">
            <p class="text-xs font-bold text-base-content truncate">
              {{ item.name }}
            </p>

            <!-- Progress Bar or Completed Badge -->
            <div v-if="item.status === 'uploading'" class="mt-1.5 flex items-center gap-2">
              <div class="flex-1 h-1.5 rounded-full bg-base-300 overflow-hidden">
                <div
                  class="h-full bg-primary transition-all duration-150"
                  :style="{ width: `${item.progress}%` }"
                />
              </div>
              <span class="text-[10px] font-mono font-bold text-primary">{{ item.progress }}%</span>
            </div>
            <div v-else class="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-success">
              <CheckCircle2 class="h-3.5 w-3.5" />
              <span>Berhasil terupload</span>
            </div>
          </div>

          <!-- File Size (Vertically centered, aligned with icon/thumbnail) -->
          <span class="text-[11px] font-mono text-base-content/55 shrink-0 px-2 select-none self-center">
            {{ formatFileSize(item.size) }}
          </span>
        </div>

        <!-- Preview & Remove Actions -->
        <div class="flex items-center gap-1 shrink-0">
          <button
            v-if="isPreviewable(item)"
            type="button"
            class="btn btn-ghost btn-xs btn-circle h-7 w-7 text-base-content/60 hover:text-primary hover:bg-primary/10"
            title="Pratinjau berkas"
            @click="openPreview(item)"
          >
            <Eye class="h-4 w-4" />
          </button>
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle h-7 w-7 text-base-content/50 hover:text-error hover:bg-error/10"
            title="Hapus file"
            @click="removeFile(item.id)"
          >
            <Trash2 class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <span v-if="hint" class="block text-[11px] text-base-content/60">
      {{ hint }}
    </span>

    <!-- Unified File Lightbox Modal (Images, PDF, and Text) teleported to body with top z-index -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="previewImageUrl"
          class="fixed inset-0 z-[99999] flex items-center justify-center bg-neutral/80 backdrop-blur-xs p-4"
          @click="closePreview"
        >
          <div
            class="relative max-w-3xl w-full max-h-[85vh] flex flex-col rounded-panel bg-[var(--surface-overlay)] border border-[var(--border)] p-4 shadow-2xl"
            @click.stop
          >
            <div class="flex items-center justify-between pb-3 mb-3 border-b border-base-300">
              <div class="flex items-center gap-2 truncate pr-4">
                <span class="badge badge-primary badge-xs font-mono uppercase">
                  {{ previewFileType }}
                </span>
                <span class="text-xs font-bold text-base-content truncate">{{ previewImageTitle }}</span>
              </div>

              <!-- Top Action Controls (Download & Close) -->
              <div class="flex items-center gap-1 shrink-0">
                <UiTooltip text="Unduh Berkas" position="bottom" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 text-base-content/70 hover:text-primary hover:bg-primary/10"
                    aria-label="Unduh berkas"
                    @click="downloadCurrentFile"
                  >
                    <Download class="h-4 w-4" />
                  </button>
                </UiTooltip>
                <UiTooltip text="Tutup Pratinjau (Esc)" position="bottom" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 text-base-content/70 hover:text-error hover:bg-error/10"
                    aria-label="Tutup pratinjau"
                    @click="closePreview"
                  >
                    <X class="h-4 w-4" />
                  </button>
                </UiTooltip>
              </div>
            </div>

            <!-- Preview Content by File Type -->
            <div class="relative overflow-hidden flex-1 min-h-[300px] max-h-[70vh] flex items-center justify-center rounded-btn bg-base-200/60 p-2">
              <!-- Image Preview Container with Zoom/Rotate/Pan Transforms -->
              <div
                v-if="previewFileType === 'image'"
                class="flex h-full w-full items-center justify-center overflow-hidden select-none"
                :class="[
                  zoomLevel > 1 ? (isPanning ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
                ]"
                @mousedown="startPan"
                @mousemove="onPan"
                @mouseup="endPan"
                @mouseleave="endPan"
                @touchstart.passive="startPan"
                @touchmove.passive="onPan"
                @touchend="endPan"
              >
                <img
                  :src="previewImageUrl"
                  :alt="previewImageTitle"
                  draggable="false"
                  class="max-h-[64vh] max-w-full object-contain rounded-btn select-none shadow-md pointer-events-none"
                  :class="isPanning ? 'transition-none' : 'transition-transform duration-150'"
                  :style="{
                    transform: `translate(${panX}px, ${panY}px) scale(${zoomLevel}) rotate(${rotationAngle}deg) scaleX(${isFlippedH ? -1 : 1})`,
                  }"
                />
              </div>

              <!-- PDF Preview via Iframe -->
              <iframe
                v-else-if="previewFileType === 'pdf'"
                :src="previewImageUrl"
                class="w-full h-[65vh] rounded-btn border border-base-300"
                title="Pratinjau PDF"
              />

              <!-- Text / Code Preview -->
              <pre
                v-else-if="previewFileType === 'text'"
                class="w-full h-full max-h-[65vh] overflow-auto p-4 font-mono text-xs text-base-content bg-base-100 rounded-btn whitespace-pre-wrap select-text"
              >{{ previewTextContent || 'Memuat dokumen teks...' }}</pre>

              <!-- Floating Tooling Toolbar for Image Preview (Zoom In/Out, Rotate, Flip, Reset) -->
              <div
                v-if="previewFileType === 'image'"
                class="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-btn bg-[var(--surface-overlay)] backdrop-blur-md border border-[var(--border)] px-3 py-1.5 shadow-xl z-20 text-base-content"
              >
                <UiTooltip text="Perkecil (Zoom Out)" position="top" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 hover:bg-base-300/60"
                    aria-label="Perkecil (Zoom Out)"
                    :disabled="zoomLevel <= 0.5"
                    @click="zoomOut"
                  >
                    <ZoomOut class="h-3.5 w-3.5" />
                  </button>
                </UiTooltip>

                <span class="text-[11px] font-mono font-bold px-1.5 select-none min-w-[42px] text-center">
                  {{ Math.round(zoomLevel * 100) }}%
                </span>

                <UiTooltip text="Perbesar (Zoom In)" position="top" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 hover:bg-base-300/60"
                    aria-label="Perbesar (Zoom In)"
                    :disabled="zoomLevel >= 3"
                    @click="zoomIn"
                  >
                    <ZoomIn class="h-3.5 w-3.5" />
                  </button>
                </UiTooltip>

                <div class="h-4 w-px bg-base-300 mx-1" />

                <UiTooltip text="Putar Kiri 90°" position="top" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 hover:bg-base-300/60"
                    aria-label="Putar Berlawanan Jarum Jam"
                    @click="rotateCounterClockwise"
                  >
                    <RotateCcw class="h-3.5 w-3.5" />
                  </button>
                </UiTooltip>

                <UiTooltip text="Putar Kanan 90°" position="top" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 hover:bg-base-300/60"
                    aria-label="Putar Searah Jarum Jam"
                    @click="rotateClockwise"
                  >
                    <RotateCw class="h-3.5 w-3.5" />
                  </button>
                </UiTooltip>

                <div class="h-4 w-px bg-base-300 mx-1" />

                <UiTooltip text="Balik Horizontal" position="top" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 hover:bg-base-300/60"
                    :class="isFlippedH ? 'btn-active' : ''"
                    :aria-pressed="isFlippedH"
                    aria-label="Balik Horizontal"
                    @click="toggleFlipHorizontal"
                  >
                    <FlipHorizontal class="h-3.5 w-3.5" />
                  </button>
                </UiTooltip>

                <UiTooltip text="Reset Ukuran & Posisi" position="top" teleport>
                  <button
                    type="button"
                    class="btn btn-ghost btn-xs btn-circle h-7 w-7 hover:bg-base-300/60"
                    aria-label="Reset Ukuran & Posisi"
                    @click="resetImageTools"
                  >
                    <RefreshCw class="h-3.5 w-3.5" />
                  </button>
                </UiTooltip>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>
