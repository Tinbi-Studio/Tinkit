<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  X,
  Palette,
  RotateCcw,
  Copy,
  Check,
  Sparkles,
} from 'lucide-vue-next'
import { useThemeStore } from '@/stores/theme'
import type { ContentWidth, FontFamilyId, RadiusScale } from '@/types/theme'

const themeStore = useThemeStore()
const copied = ref(false)

const radiusKeys: RadiusScale[] = ['none', 'sm', 'md', 'lg', 'full']
const contentWidthOptions: Array<{ id: ContentWidth; label: string; desc: string }> = [
  { id: 'compact', label: 'Compact', desc: 'Maks. 1440px (Default)' },
  { id: 'wide', label: 'Wide', desc: 'Maks. 1720px' },
  { id: 'full', label: 'Full Width', desc: '100% Layar Penuh' },
]

const fontKeys: FontFamilyId[] = ['inter', 'plus-jakarta-sans', 'system']
const contentWidthLabel = computed(
  () => contentWidthOptions.find((option) => option.id === themeStore.contentWidth)?.label ?? 'Compact',
)

async function copyCssConfig() {
  try {
    await navigator.clipboard.writeText(themeStore.exportThemeCSS())
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Fallback if clipboard blocked
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="themeStore.customizerOpen"
        class="fixed inset-0 z-50 bg-neutral/40 backdrop-blur-xs"
        @click="themeStore.customizerOpen = false"
      />
    </Transition>

    <Transition
      enter-active-class="transition-transform duration-300 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition-transform duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="themeStore.customizerOpen"
        class="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-[var(--border)] bg-[var(--surface-1)] text-[var(--text)] shadow-2xl"
      >
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-[var(--border)] px-6 py-4">
          <div class="flex items-center gap-2.5">
            <div class="flex h-9 w-9 items-center justify-center rounded-btn bg-[var(--accent-soft)] text-[var(--accent)]">
              <Palette class="h-5 w-5" />
            </div>
            <div>
              <h2 class="text-base font-extrabold text-[var(--text)]">Theme Studio</h2>
              <p class="text-xs text-[var(--text-muted)]">
                Adjustable Clean & Colorful Engine
              </p>
            </div>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm btn-circle"
            @click="themeStore.customizerOpen = false"
          >
            <X class="h-4 w-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-6 space-y-6">
          <!-- 1. Theme Presets -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-[var(--text-muted)]">
                Theme Presets
              </span>
              <span class="badge badge-sm badge-soft badge-primary">{{ themeStore.presets.length }} Presets</span>
            </div>

            <div class="grid grid-cols-2 gap-2.5">
              <button
                v-for="preset in themeStore.presets"
                :key="preset.id"
                type="button"
                class="group flex flex-col gap-2 rounded-btn border p-3 text-left transition-colors cursor-pointer"
                :class="
                  themeStore.activeTheme === preset.id
                    ? 'border-[rgb(var(--p))] bg-[var(--surface-raised)]'
                    : 'border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]'
                "
                :aria-pressed="themeStore.activeTheme === preset.id"
                @click="themeStore.setTheme(preset.id)"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="min-w-0 truncate text-xs font-bold text-[var(--text)]">
                    {{ preset.name }}
                  </span>
                  <span
                    v-if="themeStore.activeTheme === preset.id"
                    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-content"
                    aria-hidden="true"
                  >
                    <Check class="h-3.5 w-3.5" />
                  </span>
                  <span v-else class="text-[11px] font-medium text-[var(--text-muted)]">
                    {{ themeStore.themeMode }}
                  </span>
                </div>

                <!-- Color Swatch Bar -->
                <div
                  class="flex items-center gap-1.5 rounded-md border border-[var(--border)] p-1.5"
                  :style="{ backgroundColor: themeStore.isDark ? preset.preview.bg : preset.lightPreview.bg }"
                >
                  <span
                    class="h-4 flex-1 rounded-xs"
                    :style="{ backgroundColor: themeStore.isDark ? preset.preview.primary : preset.lightPreview.primary }"
                  />
                  <span
                    class="h-4 flex-1 rounded-xs"
                    :style="{ backgroundColor: themeStore.isDark ? preset.preview.secondary : preset.lightPreview.secondary }"
                  />
                  <span
                    class="h-4 flex-1 rounded-xs"
                    :style="{ backgroundColor: themeStore.isDark ? preset.preview.accent : preset.lightPreview.accent }"
                  />
                </div>
              </button>
            </div>
          </div>

          <!-- 2. Live Custom Color Overrides -->
          <div class="border-t border-base-300/70 pt-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-[var(--text-muted)]">
                Custom Brand Colors
              </span>
              <span
                v-if="themeStore.customColors.enabled"
                class="badge badge-sm badge-soft badge-secondary"
              >
                Custom Aktif
              </span>
            </div>

            <p class="text-sm text-[var(--text-muted)] mb-3">
              Ubah variabel CSS <code class="font-mono text-primary-ink">--p</code>,
              <code class="font-mono text-secondary-ink">--s</code>, dan
              <code class="font-mono text-accent-ink">--a</code> secara langsung:
            </p>

            <div class="grid grid-cols-3 gap-2.5">
              <!-- Primary Picker -->
              <label
                class="flex flex-col items-center gap-1.5 rounded-btn border border-base-300 p-2.5 cursor-pointer hover:border-primary/50"
              >
                <input
                  type="color"
                  :value="themeStore.customColors.primary"
                  class="h-8 w-full cursor-pointer rounded border-0 bg-transparent"
                  @input="
                    themeStore.setCustomColor(
                      'primary',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
                <span class="text-[11px] font-bold text-base-content">Primary</span>
                <span class="font-mono text-[11px] text-[var(--text-muted)]">
                  {{ themeStore.customColors.primary }}
                </span>
              </label>

              <!-- Secondary Picker -->
              <label
                class="flex flex-col items-center gap-1.5 rounded-btn border border-base-300 p-2.5 cursor-pointer hover:border-secondary/50"
              >
                <input
                  type="color"
                  :value="themeStore.customColors.secondary"
                  class="h-8 w-full cursor-pointer rounded border-0 bg-transparent"
                  @input="
                    themeStore.setCustomColor(
                      'secondary',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
                <span class="text-[11px] font-bold text-base-content">Secondary</span>
                <span class="font-mono text-[11px] text-[var(--text-muted)]">
                  {{ themeStore.customColors.secondary }}
                </span>
              </label>

              <!-- Accent Picker -->
              <label
                class="flex flex-col items-center gap-1.5 rounded-btn border border-base-300 p-2.5 cursor-pointer hover:border-accent/50"
              >
                <input
                  type="color"
                  :value="themeStore.customColors.accent"
                  class="h-8 w-full cursor-pointer rounded border-0 bg-transparent"
                  @input="
                    themeStore.setCustomColor(
                      'accent',
                      ($event.target as HTMLInputElement).value
                    )
                  "
                />
                <span class="text-[11px] font-bold text-base-content">Accent</span>
                <span class="font-mono text-[11px] text-[var(--text-muted)]">
                  {{ themeStore.customColors.accent }}
                </span>
              </label>
            </div>
          </div>

          <!-- 3. Adjustable Border Radius -->
          <div class="border-t border-base-300/70 pt-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-[var(--text-muted)]">
                Corner Radius
              </span>
              <span class="text-sm font-semibold text-primary-ink">
                {{ themeStore.radiusOptions[themeStore.radiusScale].label }}
              </span>
            </div>

            <div class="grid grid-cols-5 gap-1.5">
              <button
                v-for="scale in radiusKeys"
                :key="scale"
                type="button"
                class="btn btn-sm"
                :title="themeStore.radiusOptions[scale].label"
                :class="themeStore.radiusScale === scale ? 'btn-active' : 'btn-ghost border border-[var(--border)]'"
                :aria-pressed="themeStore.radiusScale === scale"
                @click="themeStore.setRadius(scale)"
              >
                {{ scale }}
              </button>
            </div>
          </div>

          <div class="border-t border-[var(--border)] pt-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-[var(--text-muted)]">Typography</span>
              <span class="text-sm font-semibold text-primary-ink">
                {{ themeStore.fontOptions[themeStore.fontFamily].label }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="fontId in fontKeys"
                :key="fontId"
                type="button"
                class="btn btn-sm"
                :class="themeStore.fontFamily === fontId ? 'btn-active' : 'btn-ghost border border-[var(--border)]'"
                :aria-pressed="themeStore.fontFamily === fontId"
                @click="themeStore.setFontFamily(fontId)"
              >
                {{ themeStore.fontOptions[fontId].label }}
              </button>
            </div>
          </div>

          <!-- Content Width -->
          <div class="border-t border-base-300/70 pt-5">
            <div class="flex items-center justify-between mb-3">
              <span class="text-sm font-semibold text-[var(--text-muted)]">
                Content Width
              </span>
              <span class="text-sm font-semibold text-primary-ink">
                {{ contentWidthLabel }}
              </span>
            </div>

            <div class="grid grid-cols-3 gap-2">
              <button
                v-for="opt in contentWidthOptions"
                :key="opt.id"
                type="button"
                class="btn flex-col items-center justify-center gap-1 p-2.5 text-center"
                :class="themeStore.contentWidth === opt.id ? 'btn-active' : 'btn-outline'"
                :aria-pressed="themeStore.contentWidth === opt.id"
                @click="themeStore.setContentWidth(opt.id)"
              >
                <div class="flex items-center justify-center mb-1.5">
                  <div
                    class="h-3.5 rounded-xs border border-current transition-all"
                    :class="
                      opt.id === 'compact'
                        ? 'w-6'
                        : opt.id === 'wide'
                          ? 'w-9'
                          : 'w-11'
                    "
                  />
                </div>
                <span class="text-xs font-bold leading-tight">{{ opt.label }}</span>
                <span class="text-[11px] leading-tight opacity-80">{{ opt.desc }}</span>
              </button>
            </div>
          </div>

          <!-- 5. Live Component Preview & CSS Export -->
          <div class="border-t border-base-300/70 pt-5 space-y-3">
            <span class="text-sm font-semibold text-[var(--text-muted)] block">
              Export CSS Variables
            </span>
            <pre
              class="rounded-box bg-[var(--surface-input)] border border-[var(--border)] p-3 font-mono text-[11px] text-[var(--text)] overflow-x-auto leading-relaxed"
            >{{ themeStore.exportThemeCSS() }}</pre>

            <button
              type="button"
              class="btn btn-primary btn-sm btn-block"
              @click="copyCssConfig"
            >
              <Check v-if="copied" class="h-4 w-4 text-success" />
              <Copy v-else class="h-4 w-4" />
              <span>{{ copied ? 'Berhasil Disalin ke Clipboard!' : 'Salin CSS Variabel Tema' }}</span>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-base-300/80 p-4 flex items-center gap-2 bg-base-200/40">
          <button
            type="button"
            class="btn btn-outline btn-sm flex-1"
            @click="themeStore.resetCustomizations"
          >
            <RotateCcw class="h-3.5 w-3.5" />
            Reset Default
          </button>
          <button
            type="button"
            class="btn btn-primary btn-sm flex-1"
            @click="themeStore.customizerOpen = false"
          >
            <Sparkles class="h-3.5 w-3.5" />
            Selesai
          </button>
        </div>
      </aside>
    </Transition>
  </Teleport>
</template>
