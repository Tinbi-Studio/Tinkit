import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'
import type {
  ThemeId,
  ThemeMode,
  RadiusScale,
  ContentWidth,
  FontFamilyId,
  ThemePreset,
  CustomColorOverrides,
} from '@/types/theme'

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'tinkit',
    name: 'Tinkit Studio',
    tagline: 'Neutral ink dengan aksen pale blue yang tenang dan nyaman',
    mode: 'dark',
    preview: {
      bg: '#111318',
      card: '#20252E',
      primary: '#C9DEFF',
      secondary: '#9CB0CD',
      accent: '#C9DEFF',
    },
    lightPreview: {
      bg: '#F3F5F8',
      card: '#FFFFFF',
      primary: '#222831',
      secondary: '#52657A',
      accent: '#222831',
    },
  },
  {
    id: 'daybreak',
    name: 'Daybreak Indigo',
    tagline: 'Neutral indigo slate dengan aksen Royal Indigo yang tenang & tajam',
    mode: 'dark',
    preview: {
      bg: '#0C0E18',
      card: '#121526',
      primary: '#5E61F0',
      secondary: '#818CF8',
      accent: '#38BDF8',
    },
    lightPreview: {
      bg: '#f7f7f9',
      card: '#ffffff',
      primary: '#5156D6',
      secondary: '#e83e8c',
      accent: '#20c997',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight Navy',
    tagline: 'Deep navy neutral dengan aksen Sapphire Blue & Sky Cyan',
    mode: 'dark',
    preview: {
      bg: '#0B0F17',
      card: '#111826',
      primary: '#5B8DEF',
      secondary: '#7AA5F5',
      accent: '#38BDF8',
    },
    lightPreview: {
      bg: '#f4f7fc',
      card: '#ffffff',
      primary: '#2563EB',
      secondary: '#0ea5e9',
      accent: '#4F46E5',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora Emerald',
    tagline: 'Botanical charcoal tenang dengan aksen Mint Emerald & Lagoon',
    mode: 'dark',
    preview: {
      bg: '#0A100E',
      card: '#0F1816',
      primary: '#2DD4A0',
      secondary: '#5EEAC0',
      accent: '#10B981',
    },
    lightPreview: {
      bg: '#f5faf8',
      card: '#ffffff',
      primary: '#047857',
      secondary: '#06b6d4',
      accent: '#14b8a6',
    },
  },
  {
    id: 'nebula',
    name: 'Cosmic Nebula',
    tagline: 'Deep obsidian plum dengan aksen Soft Electric Violet',
    mode: 'dark',
    preview: {
      bg: '#0D0B14',
      card: '#14111E',
      primary: '#8B7CF6',
      secondary: '#A399FA',
      accent: '#C084FC',
    },
    lightPreview: {
      bg: '#f8f7fc',
      card: '#ffffff',
      primary: '#7c3aed',
      secondary: '#a855f7',
      accent: '#ec4899',
    },
  },
  {
    id: 'sunset',
    name: 'Tropical Sunset',
    tagline: 'Warm espresso neutral dengan aksen Sunset Amber & Tangerine',
    mode: 'dark',
    preview: {
      bg: '#120D0B',
      card: '#1A1411',
      primary: '#FB8C4A',
      secondary: '#FDA574',
      accent: '#F43F5E',
    },
    lightPreview: {
      bg: '#f9f7f6',
      card: '#ffffff',
      primary: '#C2410C',
      secondary: '#e11d48',
      accent: '#8b5cf6',
    },
  },
  {
    id: 'ocean',
    name: 'Ocean Breeze',
    tagline: 'Deep oceanic slate dengan aksen Cerulean Sky & Aqua',
    mode: 'dark',
    preview: {
      bg: '#090F14',
      card: '#0F1820',
      primary: '#2AA9E0',
      secondary: '#5CC8F5',
      accent: '#06B6D4',
    },
    lightPreview: {
      bg: '#f5f8fb',
      card: '#ffffff',
      primary: '#0369A1',
      secondary: '#06b6d4',
      accent: '#f43f5e',
    },
  },
  {
    id: 'matcha',
    name: 'Matcha Forest',
    tagline: 'Earthy forest neutral dengan aksen Matcha Sage & Leaf Green',
    mode: 'dark',
    preview: {
      bg: '#0C100B',
      card: '#121811',
      primary: '#8FBF6A',
      secondary: '#A9D488',
      accent: '#4ADE80',
    },
    lightPreview: {
      bg: '#f6f9f7',
      card: '#ffffff',
      primary: '#047857',
      secondary: '#0d9488',
      accent: '#d97706',
    },
  },
  {
    id: 'berry',
    name: 'Berry Violet',
    tagline: 'Plum nocturnal neutral dengan aksen Berry Orchid & Lavender',
    mode: 'dark',
    preview: {
      bg: '#100A12',
      card: '#181019',
      primary: '#C26BE8',
      secondary: '#D38DF0',
      accent: '#E879F9',
    },
    lightPreview: {
      bg: '#f8f7fb',
      card: '#ffffff',
      primary: '#7c3aed',
      secondary: '#d946ef',
      accent: '#f59e0b',
    },
  },
]

const RADIUS_MAP: Record<RadiusScale, { box: string; btn: string; badge: string; label: string }> = {
  none: { box: '0rem', btn: '0rem', badge: '0.25rem', label: 'Sharp (0px)' },
  sm: { box: '0.375rem', btn: '0.25rem', badge: '0.375rem', label: 'Small' },
  md: { box: '0.625rem', btn: '0.5rem', badge: '0.5rem', label: 'Medium (Default)' },
  lg: { box: '1rem', btn: '0.625rem', badge: '0.625rem', label: 'Large' },
  full: { box: '1.5rem', btn: '9999px', badge: '9999px', label: 'Pill / Full' },
}

export const FONT_FAMILY_OPTIONS: Record<FontFamilyId, { label: string; stack: string }> = {
  inter: {
    label: 'Inter',
    stack: "'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  'plus-jakarta-sans': {
    label: 'Plus Jakarta Sans',
    stack: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
  system: {
    label: 'System UI',
    stack: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
}

const MONO_STACK = "'JetBrains Mono', ui-monospace, SFMono-Regular, Consolas, monospace"
const RADIUS_DERIVED = {
  field: 'min(var(--rounded-btn), 0.75rem)',
  panel: 'min(var(--rounded-box), 0.875rem)',
} as const

const THEME_IDS = THEME_PRESETS.map((preset) => preset.id)
const THEME_MODES: ThemeMode[] = ['light', 'dark']
const RADIUS_IDS = Object.keys(RADIUS_MAP) as RadiusScale[]
const CONTENT_WIDTHS: ContentWidth[] = ['compact', 'wide', 'full']
const FONT_IDS = Object.keys(FONT_FAMILY_OPTIONS) as FontFamilyId[]
const HEX_PATTERN = /^#[0-9a-fA-F]{6}$/

function isOneOf<T extends string>(value: string | null, values: readonly T[]): value is T {
  return value !== null && values.includes(value as T)
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    return
  }
}

export function hexToRgbChannels(hex: string): string {
  const clean = HEX_PATTERN.test(hex) ? hex.slice(1) : '222831'
  return `${parseInt(clean.slice(0, 2), 16)} ${parseInt(clean.slice(2, 4), 16)} ${parseInt(clean.slice(4, 6), 16)}`
}

function hexToHsl(hex: string): [number, number, number] {
  const clean = HEX_PATTERN.test(hex) ? hex.slice(1) : '222831'
  const r = parseInt(clean.slice(0, 2), 16) / 255
  const g = parseInt(clean.slice(2, 4), 16) / 255
  const b = parseInt(clean.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max - min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      default:
        h = (r - g) / d + 4
    }
    h /= 6
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToHex(h: number, s: number, l: number): string {
  const sNorm = Math.min(100, Math.max(0, s)) / 100
  const lNorm = Math.min(100, Math.max(0, l)) / 100
  const c = (1 - Math.abs(2 * lNorm - 1)) * sNorm
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lNorm - c / 2
  let r = 0
  let g = 0
  let b = 0

  if (h >= 0 && h < 60) [r, g, b] = [c, x, 0]
  else if (h < 120) [r, g, b] = [x, c, 0]
  else if (h < 180) [r, g, b] = [0, c, x]
  else if (h < 240) [r, g, b] = [0, x, c]
  else if (h < 300) [r, g, b] = [x, 0, c]
  else [r, g, b] = [c, 0, x]

  const toHex = (value: number) => Math.round((value + m) * 255).toString(16).padStart(2, '0')
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase()
}

function relativeLuminance(hex: string): number {
  const channels = hexToRgbChannels(hex).split(' ').map((value) => Number(value) / 255)
  const [r, g, b] = channels.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4),
  )
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrastRatio(first: string, second: string): number {
  const lighter = Math.max(relativeLuminance(first), relativeLuminance(second))
  const darker = Math.min(relativeLuminance(first), relativeLuminance(second))
  return (lighter + 0.05) / (darker + 0.05)
}

function readableContent(fill: string): string {
  return contrastRatio(fill, '#111318') >= contrastRatio(fill, '#FFFFFF') ? '#111318' : '#FFFFFF'
}

function readableInk(color: string, surface: string, mode: ThemeMode): string {
  if (contrastRatio(color, surface) >= 4.5) return color.toUpperCase()
  const [h, s, initialLightness] = hexToHsl(color)
  for (let step = 1; step <= 20; step += 1) {
    const lightness = mode === 'dark'
      ? Math.min(100, initialLightness + step * 4)
      : Math.max(0, initialLightness - step * 4)
    const candidate = hslToHex(h, s, lightness)
    if (contrastRatio(candidate, surface) >= 4.5) return candidate
  }
  return mode === 'dark' ? '#FFFFFF' : '#111318'
}

function hoverColor(color: string, mode: ThemeMode): string {
  const [h, s, lightness] = hexToHsl(color)
  return hslToHex(h, Math.min(100, s + 4), lightness + (mode === 'dark' ? 10 : -10))
}

function softColor(color: string, opacity: number): string {
  return `rgba(${hexToRgbChannels(color).split(' ').join(', ')}, ${opacity})`
}

export function deriveDarkTokensFromAccent(primaryHex: string) {
  const [h] = hexToHsl(primaryHex)
  const bg = hslToHex(h, 12, 6)
  const surface1 = hslToHex(h, 13, 8)
  const surface2 = hslToHex(h, 14, 10)
  const surfaceCard = hslToHex(h, 14, 12)
  const surfaceRaised = hslToHex(h, 14, 16)
  const surfaceInput = hslToHex(h, 13, 8)
  const hover = hoverColor(primaryHex, 'dark')

  return {
    bg,
    surface1,
    surface2,
    surfaceCard,
    surfaceRaised,
    surfaceInput,
    surfaceOverlay: surfaceRaised,
    hover,
    pc: readableContent(primaryHex),
    pInk: readableInk(primaryHex, surfaceCard, 'dark'),
    accent: primaryHex,
    accentHover: hover,
    accentSoft: softColor(primaryHex, 0.15),
    ring: softColor(primaryHex, 0.3),
  }
}

const CUSTOM_VARS = [
  '--p', '--p-hover', '--pc', '--p-ink',
  '--s', '--sc', '--s-ink',
  '--a', '--ac', '--a-ink',
  '--bg', '--surface-1', '--surface-2', '--surface-card', '--surface-raised',
  '--surface-input', '--surface-overlay',
  '--accent', '--accent-hover', '--accent-soft', '--ring',
  '--b1', '--b2', '--b3', '--bc',
] as const

const EXPORT_VARS = [
  '--font-sans', '--font-mono',
  '--bg', '--surface-1', '--surface-2', '--surface-card', '--surface-raised',
  '--surface-input', '--surface-overlay', '--border', '--border-strong',
  '--text', '--text-muted', '--text-faint',
  '--accent', '--accent-hover', '--accent-soft', '--ring',
  '--p', '--p-hover', '--pc', '--p-ink',
  '--s', '--sc', '--s-ink', '--a', '--ac', '--a-ink', '--n', '--nc',
  '--b1', '--b2', '--b3', '--bc',
  '--in', '--inc', '--su', '--suc', '--wa', '--wac', '--er', '--erc',
  '--rounded-box', '--rounded-btn', '--rounded-badge', '--rounded-field', '--rounded-panel',
] as const

export const useThemeStore = defineStore('tinkit-theme', () => {
  const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const themeParam = urlParams?.get('theme') ?? null
  const modeParam = urlParams?.get('mode') ?? null
  const storedTheme = readStorage('tinkit:theme')
  const storedMode = readStorage('tinkit:mode')
  const storedRadius = readStorage('tinkit:radius')
  const storedWidth = readStorage('tinkit:content-width')
  const storedFont = readStorage('tinkit:font-family')

  const activeTheme = ref<ThemeId>(
    isOneOf(themeParam, THEME_IDS) ? themeParam
      : isOneOf(storedTheme, THEME_IDS) ? storedTheme
        : 'tinkit',
  )
  const themeMode = ref<ThemeMode>(
    isOneOf(modeParam, THEME_MODES) ? modeParam
      : isOneOf(storedMode, THEME_MODES) ? storedMode
        : 'dark',
  )
  const radiusScale = ref<RadiusScale>(isOneOf(storedRadius, RADIUS_IDS) ? storedRadius : 'md')
  const contentWidth = ref<ContentWidth>(isOneOf(storedWidth, CONTENT_WIDTHS) ? storedWidth : 'compact')
  const fontFamily = ref<FontFamilyId>(isOneOf(storedFont, FONT_IDS) ? storedFont : 'inter')
  const sidebarCollapsed = ref<boolean>(readStorage('tinkit:sidebar-collapsed') === 'true')
  const mobileSidebarOpen = ref<boolean>(false)
  const customizerOpen = ref<boolean>(false)

  const customColors = ref<CustomColorOverrides>({
    enabled: false,
    primary: '#C9DEFF',
    secondary: '#9CB0CD',
    accent: '#C9DEFF',
  })

  const savedCustom = readStorage('tinkit:custom-colors')
  if (savedCustom) {
    try {
      const parsed = JSON.parse(savedCustom) as Partial<CustomColorOverrides>
      customColors.value = {
        enabled: parsed.enabled === true,
        primary: typeof parsed.primary === 'string' && HEX_PATTERN.test(parsed.primary) ? parsed.primary : '#C9DEFF',
        secondary: typeof parsed.secondary === 'string' && HEX_PATTERN.test(parsed.secondary) ? parsed.secondary : '#9CB0CD',
        accent: typeof parsed.accent === 'string' && HEX_PATTERN.test(parsed.accent) ? parsed.accent : '#C9DEFF',
      }
    } catch {
      customColors.value.enabled = false
    }
  }

  const currentPreset = computed<ThemePreset>(() => {
    const base = THEME_PRESETS.find((theme) => theme.id === activeTheme.value) ?? THEME_PRESETS[0]
    return {
      ...base,
      mode: themeMode.value,
      preview: themeMode.value === 'dark' ? base.preview : base.lightPreview,
    }
  })
  const isDark = computed(() => themeMode.value === 'dark')

  function applyThemeToDom() {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.setAttribute('data-theme', activeTheme.value)
    root.classList.toggle('dark', isDark.value)
    root.setAttribute('data-font-family', fontFamily.value)
    root.style.setProperty('--font-sans', FONT_FAMILY_OPTIONS[fontFamily.value].stack)
    root.style.setProperty('--font-mono', MONO_STACK)

    const radius = RADIUS_MAP[radiusScale.value]
    root.style.setProperty('--rounded-box', radius.box)
    root.style.setProperty('--rounded-btn', radius.btn)
    root.style.setProperty('--rounded-badge', radius.badge)
    root.style.setProperty('--rounded-field', RADIUS_DERIVED.field)
    root.style.setProperty('--rounded-panel', RADIUS_DERIVED.panel)

    for (const property of CUSTOM_VARS) root.style.removeProperty(property)
    if (!customColors.value.enabled) return

    const primary = customColors.value.primary
    const secondary = customColors.value.secondary
    const accent = customColors.value.accent
    const mode = themeMode.value
    const darkTokens = deriveDarkTokensFromAccent(primary)
    const surfaceForInk = isDark.value ? darkTokens.surfaceCard : '#FFFFFF'

    root.style.setProperty('--p', hexToRgbChannels(primary))
    root.style.setProperty('--p-hover', hexToRgbChannels(hoverColor(primary, mode)))
    root.style.setProperty('--pc', hexToRgbChannels(readableContent(primary)))
    root.style.setProperty('--p-ink', hexToRgbChannels(readableInk(primary, surfaceForInk, mode)))
    root.style.setProperty('--s', hexToRgbChannels(secondary))
    root.style.setProperty('--sc', hexToRgbChannels(readableContent(secondary)))
    root.style.setProperty('--s-ink', hexToRgbChannels(readableInk(secondary, surfaceForInk, mode)))
    root.style.setProperty('--a', hexToRgbChannels(accent))
    root.style.setProperty('--ac', hexToRgbChannels(readableContent(accent)))
    root.style.setProperty('--a-ink', hexToRgbChannels(readableInk(accent, surfaceForInk, mode)))
    root.style.setProperty('--accent', primary)
    root.style.setProperty('--accent-hover', hoverColor(primary, mode))
    root.style.setProperty('--accent-soft', softColor(primary, isDark.value ? 0.15 : 0.12))
    root.style.setProperty('--ring', softColor(primary, isDark.value ? 0.3 : 0.25))

    if (isDark.value) {
      root.style.setProperty('--bg', darkTokens.bg)
      root.style.setProperty('--surface-1', darkTokens.surface1)
      root.style.setProperty('--surface-2', darkTokens.surface2)
      root.style.setProperty('--surface-card', darkTokens.surfaceCard)
      root.style.setProperty('--surface-raised', darkTokens.surfaceRaised)
      root.style.setProperty('--surface-input', darkTokens.surfaceInput)
      root.style.setProperty('--surface-overlay', darkTokens.surfaceOverlay)
      root.style.setProperty('--b1', hexToRgbChannels(darkTokens.surface2))
      root.style.setProperty('--b2', hexToRgbChannels(darkTokens.bg))
      root.style.setProperty('--b3', hexToRgbChannels(darkTokens.surfaceRaised))
      root.style.setProperty('--bc', '232 234 240')
    }
  }

  function setTheme(themeId: ThemeId) {
    if (!THEME_IDS.includes(themeId)) return
    activeTheme.value = themeId
    const preset = THEME_PRESETS.find((theme) => theme.id === themeId)
    if (preset && !customColors.value.enabled) {
      const palette = isDark.value ? preset.preview : preset.lightPreview
      customColors.value.primary = palette.primary
      customColors.value.secondary = palette.secondary
      customColors.value.accent = palette.accent
    }
  }

  function setMode(mode: ThemeMode) {
    if (THEME_MODES.includes(mode)) themeMode.value = mode
  }

  function toggleDarkLight() {
    themeMode.value = isDark.value ? 'light' : 'dark'
  }

  function setRadius(scale: RadiusScale) {
    if (RADIUS_IDS.includes(scale)) radiusScale.value = scale
  }

  function setContentWidth(width: ContentWidth) {
    if (CONTENT_WIDTHS.includes(width)) contentWidth.value = width
  }

  function setFontFamily(font: FontFamilyId) {
    if (FONT_IDS.includes(font)) fontFamily.value = font
  }

  function setCustomColor(key: 'primary' | 'secondary' | 'accent', hex: string) {
    if (!HEX_PATTERN.test(hex)) return
    customColors.value.enabled = true
    customColors.value[key] = hex
  }

  function resetCustomizations() {
    customColors.value.enabled = false
    const palette = currentPreset.value.preview
    customColors.value.primary = palette.primary
    customColors.value.secondary = palette.secondary
    customColors.value.accent = palette.accent
    radiusScale.value = 'md'
    contentWidth.value = 'compact'
    fontFamily.value = 'inter'
    applyThemeToDom()
  }

  function exportThemeCSS(): string {
    applyThemeToDom()
    if (typeof document === 'undefined') return ''
    const styles = getComputedStyle(document.documentElement)
    const declarations = EXPORT_VARS
      .map((property) => {
        const value = styles.getPropertyValue(property).trim()
        return value ? `  ${property}: ${value};` : ''
      })
      .filter(Boolean)
      .join('\n')
    return `[data-theme="${activeTheme.value}-custom"] {\n  color-scheme: ${themeMode.value};\n${declarations}\n}`
  }

  watch(
    [activeTheme, themeMode, radiusScale, contentWidth, fontFamily, customColors],
    () => {
      writeStorage('tinkit:theme', activeTheme.value)
      writeStorage('tinkit:mode', themeMode.value)
      writeStorage('tinkit:radius', radiusScale.value)
      writeStorage('tinkit:content-width', contentWidth.value)
      writeStorage('tinkit:font-family', fontFamily.value)
      writeStorage('tinkit:custom-colors', JSON.stringify(customColors.value))
      applyThemeToDom()
    },
    { deep: true, immediate: true },
  )

  watch(sidebarCollapsed, (value) => {
    writeStorage('tinkit:sidebar-collapsed', String(value))
  })

  return {
    activeTheme,
    themeMode,
    radiusScale,
    contentWidth,
    fontFamily,
    sidebarCollapsed,
    mobileSidebarOpen,
    customizerOpen,
    customColors,
    currentPreset,
    isDark,
    presets: THEME_PRESETS,
    radiusOptions: RADIUS_MAP,
    fontOptions: FONT_FAMILY_OPTIONS,
    setTheme,
    setMode,
    toggleDarkLight,
    setRadius,
    setContentWidth,
    setFontFamily,
    setCustomColor,
    resetCustomizations,
    exportThemeCSS,
    applyThemeToDom,
  }
})
