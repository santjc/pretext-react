import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flowText } from './flowText'

const layoutNextLineMock = vi.fn()

vi.mock('@chenglou/pretext', () => ({
  layoutNextLine: (...args: unknown[]) => layoutNextLineMock(...args),
}))

describe('flowText', () => {
  beforeEach(() => {
    layoutNextLineMock.mockReset()
  })

  it('lays out lines using line slots at each row', () => {
    layoutNextLineMock
      .mockReturnValueOnce({
        text: 'First',
        width: 120,
        start: { segmentIndex: 0, graphemeIndex: 0 },
        end: { segmentIndex: 0, graphemeIndex: 5 },
      })
      .mockReturnValueOnce(null)

    const result = flowText({
      prepared: {} as never,
      lineHeight: 24,
      getLineSlotAtY: () => ({ left: 28, right: 248 }),
    })

    expect(result.lines).toEqual([
      expect.objectContaining({ text: 'First', x: 28, y: 0, width: 120, slotLeft: 28, slotRight: 248, slotWidth: 220 }),
    ])
    expect(result.exhausted).toBe(true)
    expect(result.truncated).toBe(false)
    expect(result.endCursor).toEqual({ segmentIndex: 0, graphemeIndex: 5 })
  })

  it('skips rows with no line slot', () => {
    layoutNextLineMock
      .mockReturnValueOnce({
        text: 'Visible',
        width: 100,
        start: { segmentIndex: 0, graphemeIndex: 0 },
        end: { segmentIndex: 0, graphemeIndex: 7 },
      })
      .mockReturnValueOnce(null)

    const result = flowText({
      prepared: {} as never,
      lineHeight: 20,
      getLineSlotAtY: (y) => (y < 20 ? null : { left: 40, right: 220 }),
    })

    expect(result.lines[0]).toEqual(expect.objectContaining({ text: 'Visible', x: 40, y: 20, slotWidth: 180 }))
  })

  it('supports a start cursor for continuation', () => {
    layoutNextLineMock
      .mockReturnValueOnce({
        text: 'Continued',
        width: 110,
        start: { segmentIndex: 0, graphemeIndex: 5 },
        end: { segmentIndex: 0, graphemeIndex: 14 },
      })
      .mockReturnValueOnce(null)

    const result = flowText({
      prepared: {} as never,
      lineHeight: 24,
      startCursor: { segmentIndex: 0, graphemeIndex: 5 },
      getLineSlotAtY: () => ({ left: 0, right: 200 }),
    })

    expect(layoutNextLineMock).toHaveBeenNthCalledWith(1, {}, { segmentIndex: 0, graphemeIndex: 5 }, 200)
    expect(result.endCursor).toEqual({ segmentIndex: 0, graphemeIndex: 14 })
  })

  it('marks the final line exhausted after an exact-fit maxY exit', () => {
    layoutNextLineMock
      .mockReturnValueOnce({
        text: 'Exact fit',
        width: 120,
        start: { segmentIndex: 0, graphemeIndex: 0 },
        end: { segmentIndex: 0, graphemeIndex: 8 },
      })
      .mockReturnValueOnce(null)

    const result = flowText({
      prepared: {} as never,
      lineHeight: 24,
      maxY: 24,
      getLineSlotAtY: () => ({ left: 0, right: 200 }),
    })

    expect(result.exhausted).toBe(true)
    expect(result.truncated).toBe(false)
    expect(result.endCursor).toEqual({ segmentIndex: 0, graphemeIndex: 8 })
  })

  it('does not place a line if its bottom would exceed maxY', () => {
    layoutNextLineMock.mockReturnValueOnce({
      text: 'Too low',
      width: 90,
      start: { segmentIndex: 0, graphemeIndex: 0 },
      end: { segmentIndex: 0, graphemeIndex: 7 },
    })

    const result = flowText({
      prepared: {} as never,
      lineHeight: 24,
      startY: 20,
      maxY: 40,
      getLineSlotAtY: () => ({ left: 0, right: 220 }),
    })

    expect(result.lines).toHaveLength(0)
  })

  it('flags step-limit exits as truncated', () => {
    layoutNextLineMock.mockReturnValue({
      text: 'Blocked',
      width: 90,
      start: { segmentIndex: 0, graphemeIndex: 0 },
      end: { segmentIndex: 0, graphemeIndex: 7 },
    })

    const result = flowText({
      prepared: {} as never,
      lineHeight: 24,
      maxSteps: 2,
      getLineSlotAtY: () => null,
    })

    expect(result.lines).toHaveLength(0)
    expect(result.exhausted).toBe(false)
    expect(result.truncated).toBe(true)
  })
})
