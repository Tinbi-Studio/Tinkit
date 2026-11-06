export type FloatingAlign = 'start' | 'end'
export type FloatingSide = 'bottom' | 'top' | 'left' | 'right' | 'auto'
export type FloatingPlacement = 'bottom' | 'top' | 'left' | 'right'

export interface FloatingAnchorRect {
  top: number
  left: number
  width: number
  height: number
}

export interface FloatingPanelSize {
  width: number
  height: number
}

export interface FloatingViewport {
  width: number
  height: number
}

export interface FloatingOptions {
  align?: FloatingAlign
  side?: FloatingSide
  offset?: number
  padding?: number
  matchWidth?: boolean
}

export interface FloatingResult {
  top: number
  left: number
  width: number | null
  maxHeight: number | null
  placement: FloatingPlacement
}

const MIN_PANEL_HEIGHT = 120

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function computeFloatingPosition(
  anchor: FloatingAnchorRect,
  panel: FloatingPanelSize,
  viewport: FloatingViewport,
  options: FloatingOptions = {},
): FloatingResult {
  const align = options.align ?? 'start'
  const side = options.side ?? 'auto'
  const offset = options.offset ?? 6
  const padding = options.padding ?? 8

  const spaceBelow = viewport.height - (anchor.top + anchor.height) - offset - padding
  const spaceAbove = anchor.top - offset - padding

  let placement: FloatingPlacement
  if (side === 'top' || side === 'bottom' || side === 'left' || side === 'right') {
    placement = side
  } else {
    const shouldFlip = panel.height > spaceBelow && spaceAbove > spaceBelow
    placement = shouldFlip ? 'top' : 'bottom'
  }

  const isVertical = placement === 'top' || placement === 'bottom'
  const space = isVertical
    ? Math.max(placement === 'bottom' ? spaceBelow : spaceAbove, 0)
    : Math.max(viewport.height - padding * 2, 0)

  const maxHeight = panel.height > space ? Math.max(space, MIN_PANEL_HEIGHT) : null
  const effectiveHeight = Math.min(panel.height, maxHeight ?? panel.height)
  const width = options.matchWidth && isVertical ? anchor.width : null
  const effectiveWidth = width ?? panel.width

  let top: number
  let left: number

  if (placement === 'bottom') {
    top = anchor.top + anchor.height + offset
    left = align === 'start' ? anchor.left : anchor.left + anchor.width - effectiveWidth
  } else if (placement === 'top') {
    top = anchor.top - offset - effectiveHeight
    left = align === 'start' ? anchor.left : anchor.left + anchor.width - effectiveWidth
  } else if (placement === 'right') {
    top = anchor.top + anchor.height / 2 - effectiveHeight / 2
    left = anchor.left + anchor.width + offset
  } else {
    top = anchor.top + anchor.height / 2 - effectiveHeight / 2
    left = anchor.left - effectiveWidth - offset
  }

  top = clamp(top, padding, Math.max(viewport.height - effectiveHeight - padding, padding))
  left = clamp(left, padding, Math.max(viewport.width - effectiveWidth - padding, padding))

  return {
    top: Math.round(top),
    left: Math.round(left),
    width: width === null ? null : Math.round(width),
    maxHeight: maxHeight === null ? null : Math.round(maxHeight),
    placement,
  }
}
