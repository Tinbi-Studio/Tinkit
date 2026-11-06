import gsap from 'gsap'

/**
 * Polished GSAP 3 Animation System for Tinkit Enterprise UI
 * Uses custom cubic/expo/back curves and automatic reduced-motion safety.
 */

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 1. Page / Route View Entrance
 * Animates top-level sections/cards inside a newly mounted view with a silky
 * exponential stagger and zero layout shift.
 */
export function animatePageEnter(container: HTMLElement | null) {
  if (!container || prefersReducedMotion()) return

  const children = Array.from(container.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  )
  const targets = children.length > 0 ? children : [container]

  gsap.killTweensOf(targets)
  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: 14,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.52,
      stagger: 0.055,
      ease: 'expo.out',
      clearProps: 'transform,opacity',
    },
  )
}

/**
 * 2. Staggered Card / Grid Entrance
 * Smoothly reveals cards, KPI widgets, or table rows in sequence.
 * Uses gentle translateY & opacity with power2.out for natural enterprise feel.
 */
export function animateStaggerIn(
  targets: string | Element | Element[] | NodeListOf<Element>,
  options?: {
    stagger?: number
    duration?: number
    y?: number
    ease?: string
    delay?: number
  },
) {
  if (prefersReducedMotion()) return
  gsap.killTweensOf(targets)
  return gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: options?.y ?? 12,
    },
    {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.42,
      stagger: options?.stagger ?? 0.04,
      ease: options?.ease ?? 'power2.out',
      delay: options?.delay ?? 0.02,
      clearProps: 'all',
    },
  )
}

/**
 * 3. Animated Bars & Progress Fill (Vertical or Horizontal)
 */
export function animateBarsVertical(
  targets: string | Element | Element[] | NodeListOf<Element>,
  options?: { stagger?: number; duration?: number; delay?: number },
) {
  if (prefersReducedMotion()) return
  gsap.killTweensOf(targets)
  return gsap.from(targets, {
    scaleY: 0,
    transformOrigin: 'bottom center',
    duration: options?.duration ?? 0.5,
    stagger: options?.stagger ?? 0.03,
    ease: 'power2.out',
    delay: options?.delay ?? 0.08,
    clearProps: 'transform',
  })
}

export function animateBarsHorizontal(
  targets: string | Element | Element[] | NodeListOf<Element>,
  options?: { stagger?: number; duration?: number; delay?: number },
) {
  if (prefersReducedMotion()) return
  gsap.killTweensOf(targets)
  return gsap.from(targets, {
    scaleX: 0,
    opacity: 0,
    transformOrigin: 'left center',
    duration: options?.duration ?? 0.55,
    stagger: options?.stagger ?? 0.04,
    ease: 'power2.out',
    delay: options?.delay ?? 0.1,
    clearProps: 'transform,opacity',
  })
}

/**
 * 4. Tactile Micro-Press Bounce (Buttons, Pills, Chips)
 */
export function animateTap(el: Element | null) {
  if (!el || prefersReducedMotion()) return
  gsap.killTweensOf(el)
  gsap
    .timeline()
    .to(el, { scale: 0.95, duration: 0.08, ease: 'power2.out' })
    .to(el, {
      scale: 1,
      duration: 0.32,
      ease: 'elastic.out(1.2, 0.5)',
      clearProps: 'transform',
    })
}

/**
 * 5. Modal Dialog Entrance & Exit
 */
export function animateModalIn(el: Element | null, onComplete?: () => void) {
  if (!el) {
    onComplete?.()
    return
  }
  gsap.killTweensOf(el)
  gsap.fromTo(
    el,
    { opacity: 0, scale: 0.94, y: 12 },
    {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.34,
      ease: 'expo.out',
      clearProps: 'transform',
      onComplete,
    },
  )
}

export function animateModalOut(el: Element | null, onComplete?: () => void) {
  if (!el) {
    onComplete?.()
    return
  }
  gsap.killTweensOf(el)
  gsap.to(el, {
    opacity: 0,
    scale: 0.96,
    y: 8,
    duration: 0.18,
    ease: 'power2.in',
    onComplete,
  })
}

/**
 * 6. Floating Popover / Dropdown / DatePicker Entrance & Exit
 */
export function animateDropdownIn(el: Element | null, onComplete?: () => void) {
  if (!el) {
    onComplete?.()
    return
  }
  gsap.killTweensOf(el)
  gsap.fromTo(
    el,
    { opacity: 0, y: -8, scale: 0.96, transformOrigin: 'top center' },
    {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.24,
      ease: 'expo.out',
      clearProps: 'transform',
      onComplete,
    },
  )
}

export function animateDropdownOut(el: Element | null, onComplete?: () => void) {
  if (!el) {
    onComplete?.()
    return
  }
  gsap.killTweensOf(el)
  gsap.to(el, {
    opacity: 0,
    y: -6,
    scale: 0.97,
    duration: 0.15,
    ease: 'power2.in',
    onComplete,
  })
}

/**
 * 7. Number Counter Tween
 */
export function animateCounter(
  target: { value: number },
  endValue: number,
  options?: { duration?: number; onUpdate?: () => void },
) {
  return gsap.to(target, {
    value: endValue,
    duration: options?.duration ?? 1.1,
    ease: 'expo.out',
    onUpdate: options?.onUpdate,
  })
}

export default gsap
