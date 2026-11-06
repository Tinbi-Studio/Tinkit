<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  RotateCw,
  Settings,
  Check,
} from 'lucide-vue-next'
import UiTooltip from '@/components/ui/UiTooltip.vue'

export interface UiVideoPlayerProps {
  src: string
  poster?: string
  title?: string
  autoplay?: boolean
  loop?: boolean
  muted?: boolean
  preload?: 'auto' | 'metadata' | 'none'
  aspectRatio?: 'video' | 'square' | 'wide'
}

const props = withDefaults(defineProps<UiVideoPlayerProps>(), {
  poster: undefined,
  title: undefined,
  autoplay: false,
  loop: false,
  muted: false,
  preload: 'metadata',
  aspectRatio: 'video',
})

const emit = defineEmits<{
  play: []
  pause: []
  ended: []
  timeupdate: [currentTime: number]
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const playerContainerRef = ref<HTMLDivElement | null>(null)

// States
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(props.muted ? 0 : 1)
const isMuted = ref(props.muted)
const isFullscreen = ref(false)
const showControls = ref(true)
const playbackRate = ref(1)
const showSpeedMenu = ref(false)
let hideControlsTimeout: ReturnType<typeof setTimeout> | null = null

const playbackRates = [0.5, 0.75, 1, 1.25, 1.5, 2]

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

const progressPercent = computed(() => {
  if (!duration.value || duration.value === 0) return 0
  return (currentTime.value / duration.value) * 100
})

function togglePlay() {
  if (!videoRef.value) return
  if (videoRef.value.paused) {
    videoRef.value.play().catch(() => {})
  } else {
    videoRef.value.pause()
  }
}

function handleTimeUpdate() {
  if (!videoRef.value) return
  currentTime.value = videoRef.value.currentTime
  emit('timeupdate', currentTime.value)
}

function handleLoadedMetadata() {
  if (!videoRef.value) return
  duration.value = videoRef.value.duration
}

function handleSeek(e: MouseEvent) {
  const target = e.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const newProgress = Math.max(0, Math.min(1, clickX / rect.width))
  if (videoRef.value && duration.value) {
    videoRef.value.currentTime = newProgress * duration.value
  }
}

function toggleMute() {
  if (!videoRef.value) return
  isMuted.value = !isMuted.value
  videoRef.value.muted = isMuted.value
  if (!isMuted.value && volume.value === 0) {
    volume.value = 1
    videoRef.value.volume = 1
  }
}

function handleVolumeChange(e: Event) {
  const target = e.target as HTMLInputElement
  const val = parseFloat(target.value)
  volume.value = val
  if (videoRef.value) {
    videoRef.value.volume = val
    if (val === 0) {
      isMuted.value = true
      videoRef.value.muted = true
    } else {
      isMuted.value = false
      videoRef.value.muted = false
    }
  }
}

function skip(seconds: number) {
  if (!videoRef.value) return
  videoRef.value.currentTime = Math.max(0, Math.min(duration.value, videoRef.value.currentTime + seconds))
}

function setPlaybackRate(rate: number) {
  playbackRate.value = rate
  if (videoRef.value) {
    videoRef.value.playbackRate = rate
  }
  showSpeedMenu.value = false
}

async function toggleFullscreen() {
  if (!playerContainerRef.value) return

  if (!document.fullscreenElement) {
    await playerContainerRef.value.requestFullscreen().catch(() => {})
    isFullscreen.value = true
  } else {
    await document.exitFullscreen().catch(() => {})
    isFullscreen.value = false
  }
}

function onFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function resetHideControlsTimer() {
  showControls.value = true
  if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
  if (isPlaying.value) {
    hideControlsTimeout = setTimeout(() => {
      showControls.value = false
      showSpeedMenu.value = false
    }, 2800)
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', onFullscreenChange)
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', onFullscreenChange)
  if (hideControlsTimeout) clearTimeout(hideControlsTimeout)
})

const aspectRatioClass = computed(() => {
  switch (props.aspectRatio) {
    case 'square':
      return 'aspect-square'
    case 'wide':
      return 'aspect-[21/9]'
    case 'video':
    default:
      return 'aspect-video'
  }
})
</script>

<template>
  <div
    ref="playerContainerRef"
    class="relative w-full overflow-hidden rounded-box bg-black group select-none border border-[var(--border)] shadow-lg"
    :class="aspectRatioClass"
    @mousemove="resetHideControlsTimer"
    @mouseleave="isPlaying ? (showControls = false, showSpeedMenu = false) : null"
  >
    <!-- Video Element -->
    <video
      ref="videoRef"
      :src="src"
      :poster="poster"
      :autoplay="autoplay"
      :loop="loop"
      :muted="muted"
      :preload="preload"
      class="h-full w-full object-contain cursor-pointer"
      @play="isPlaying = true; emit('play')"
      @pause="isPlaying = false; showControls = true; emit('pause')"
      @ended="isPlaying = false; showControls = true; emit('ended')"
      @timeupdate="handleTimeUpdate"
      @loadedmetadata="handleLoadedMetadata"
      @click="togglePlay"
    />

    <!-- Big Center Play Button Overlay when Paused -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <button
        v-if="!isPlaying"
        type="button"
        class="absolute inset-0 m-auto h-16 w-16 flex items-center justify-center rounded-full bg-primary/90 text-primary-content shadow-2xl hover:bg-primary hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
        aria-label="Play video"
        @click="togglePlay"
      >
        <Play class="h-8 w-8 ml-1" />
      </button>
    </Transition>

    <!-- Top Overlay: Title -->
    <div
      v-if="title"
      class="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/30 to-transparent transition-opacity duration-300 z-20 pointer-events-none"
      :class="showControls ? 'opacity-100' : 'opacity-0'"
    >
      <h4 class="text-sm font-semibold text-white truncate drop-shadow-sm">
        {{ title }}
      </h4>
    </div>

    <!-- Bottom Controls Overlay -->
    <div
      class="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 z-20 flex flex-col gap-2"
      :class="showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'"
    >
      <!-- Timeline Progress Bar -->
      <div
        class="relative h-1.5 hover:h-2.5 w-full bg-white/20 hover:bg-white/30 rounded-full cursor-pointer transition-all duration-150 group/timeline flex items-center"
        @click="handleSeek"
      >
        <div
          class="h-full bg-primary rounded-full relative"
          :style="{ width: `${progressPercent}%` }"
        >
          <!-- Scrubber thumb -->
          <div class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 h-3.5 w-3.5 rounded-full bg-white shadow-md scale-0 group-hover/timeline:scale-100 transition-transform" />
        </div>
      </div>

      <!-- Action Buttons Row -->
      <div class="flex items-center justify-between gap-2 text-white text-xs pt-1">
        <!-- Left: Play/Pause, Replay/Skip, Volume, Time -->
        <div class="flex items-center gap-1.5 md:gap-2">
          <button
            type="button"
            class="btn btn-ghost btn-xs btn-circle text-white hover:bg-white/20 h-8 w-8"
            :aria-label="isPlaying ? 'Pause' : 'Play'"
            @click="togglePlay"
          >
            <Pause v-if="isPlaying" class="h-4 w-4" />
            <Play v-else class="h-4 w-4 ml-0.5" />
          </button>

          <!-- Skip -10s -->
          <UiTooltip text="Mundur 10 detik" position="top">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle text-white/80 hover:text-white hover:bg-white/20 h-8 w-8 hidden sm:inline-flex"
              aria-label="Skip backward 10s"
              @click="skip(-10)"
            >
              <RotateCcw class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>

          <!-- Skip +10s -->
          <UiTooltip text="Maju 10 detik" position="top">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle text-white/80 hover:text-white hover:bg-white/20 h-8 w-8 hidden sm:inline-flex"
              aria-label="Skip forward 10s"
              @click="skip(10)"
            >
              <RotateCw class="h-3.5 w-3.5" />
            </button>
          </UiTooltip>

          <!-- Volume Controls -->
          <div class="flex items-center gap-1 group/volume">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle text-white hover:bg-white/20 h-8 w-8"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
              @click="toggleMute"
            >
              <VolumeX v-if="isMuted || volume === 0" class="h-4 w-4 text-error" />
              <Volume2 v-else class="h-4 w-4" />
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              :value="isMuted ? 0 : volume"
              class="w-16 h-1 accent-primary bg-white/30 rounded-lg cursor-pointer hidden group-hover/volume:inline-block transition-all"
              @input="handleVolumeChange"
            />
          </div>

          <!-- Time Display -->
          <div class="font-mono text-[11px] text-white/90 select-none ml-1">
            <span>{{ formatTime(currentTime) }}</span>
            <span class="text-white/40 mx-1">/</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <!-- Right: Speed Menu, Fullscreen -->
        <div class="flex items-center gap-1.5 md:gap-2">
          <!-- Playback Speed Picker -->
          <div class="relative">
            <button
              type="button"
              class="btn btn-ghost btn-xs text-white hover:bg-white/20 h-8 px-2 font-mono text-[11px] flex items-center gap-1 rounded-md"
              @click="showSpeedMenu = !showSpeedMenu"
            >
              <Settings class="h-3.5 w-3.5" />
              <span>{{ playbackRate }}x</span>
            </button>

            <!-- Speed popover -->
            <div
              v-if="showSpeedMenu"
              class="absolute bottom-full right-0 mb-2 py-1 bg-neutral/95 backdrop-blur-md rounded-panel border border-neutral-content/10 shadow-2xl min-w-[100px] z-30"
            >
              <div class="text-[10px] uppercase font-bold text-neutral-content/50 px-3 py-1">
                Kecepatan
              </div>
              <button
                v-for="rate in playbackRates"
                :key="rate"
                type="button"
                class="w-full text-left px-3 py-1.5 text-xs hover:bg-white/10 flex items-center justify-between font-mono"
                :class="playbackRate === rate ? 'text-primary font-bold' : 'text-neutral-content/90'"
                @click="setPlaybackRate(rate)"
              >
                <span>{{ rate }}x</span>
                <Check v-if="playbackRate === rate" class="h-3.5 w-3.5 shrink-0 text-primary" />
              </button>
            </div>
          </div>

          <!-- Fullscreen -->
          <UiTooltip :text="isFullscreen ? 'Keluar Layar Penuh' : 'Layar Penuh'" position="top">
            <button
              type="button"
              class="btn btn-ghost btn-xs btn-circle text-white hover:bg-white/20 h-8 w-8"
              :aria-label="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
              @click="toggleFullscreen"
            >
              <Minimize v-if="isFullscreen" class="h-4 w-4" />
              <Maximize v-else class="h-4 w-4" />
            </button>
          </UiTooltip>
        </div>
      </div>
    </div>
  </div>
</template>
