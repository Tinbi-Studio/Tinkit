import { describe, expect, it } from 'vitest'
import { computeFloatingPosition } from '@/utils/floating'

const viewport = { width: 1000, height: 800 }

describe('computeFloatingPosition', () => {
  it('places the panel below the anchor when there is room', () => {
    const result = computeFloatingPosition(
      { top: 100, left: 100, width: 200, height: 40 },
      { width: 260, height: 300 },
      viewport,
    )
    expect(result).toEqual({
      top: 146,
      left: 100,
      width: null,
      maxHeight: null,
      placement: 'bottom',
    })
  })

  it('flips above the anchor when space below is insufficient', () => {
    const result = computeFloatingPosition(
      { top: 700, left: 100, width: 200, height: 40 },
      { width: 260, height: 300 },
      viewport,
    )
    expect(result.placement).toBe('top')
    expect(result.top).toBe(394)
  })

  it('clamps left to the right viewport edge', () => {
    const result = computeFloatingPosition(
      { top: 100, left: 900, width: 80, height: 40 },
      { width: 300, height: 200 },
      viewport,
    )
    expect(result.left).toBe(692)
  })

  it('aligns the panel to the end edge of the anchor', () => {
    const result = computeFloatingPosition(
      { top: 100, left: 100, width: 200, height: 40 },
      { width: 120, height: 200 },
      viewport,
      { align: 'end' },
    )
    expect(result.left).toBe(180)
  })

  it('matches the anchor width when requested', () => {
    const result = computeFloatingPosition(
      { top: 100, left: 100, width: 320, height: 40 },
      { width: 200, height: 200 },
      viewport,
      { matchWidth: true },
    )
    expect(result.width).toBe(320)
  })

  it('caps the panel height to the viewport when it cannot fit', () => {
    const result = computeFloatingPosition(
      { top: 500, left: 100, width: 200, height: 40 },
      { width: 260, height: 900 },
      viewport,
    )
    expect(result.placement).toBe('top')
    expect(result.maxHeight).toBe(784)
    expect(result.top).toBe(8)
  })

  it('places panels to the right of the anchor', () => {
    const result = computeFloatingPosition(
      { top: 100, left: 100, width: 40, height: 40 },
      { width: 200, height: 100 },
      viewport,
      { side: 'right' },
    )
    expect(result).toEqual({
      top: 70,
      left: 146,
      width: null,
      maxHeight: null,
      placement: 'right',
    })
  })
})
