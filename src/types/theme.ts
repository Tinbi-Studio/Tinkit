export type ThemeId =
  | 'tinkit'
  | 'daybreak'
  | 'midnight'
  | 'aurora'
  | 'nebula'
  | 'sunset'
  | 'ocean'
  | 'matcha'
  | 'berry'

export type ThemeMode = 'light' | 'dark'

export type RadiusScale = 'none' | 'sm' | 'md' | 'lg' | 'full'

export type ContentWidth = 'compact' | 'wide' | 'full'

export type FontFamilyId = 'inter' | 'plus-jakarta-sans' | 'system'

export type ColorVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'neutral'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'

export interface ThemePalettePreview {
  bg: string
  card: string
  primary: string
  secondary: string
  accent: string
}

export interface ThemePreset {
  id: ThemeId
  name: string
  tagline: string
  mode: ThemeMode
  preview: ThemePalettePreview
  lightPreview: ThemePalettePreview
}

export interface CustomColorOverrides {
  enabled: boolean
  primary: string
  secondary: string
  accent: string
}

