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
      expect.objectContaining({ text: 'First', x: 28, y: 0, width: 120 }),
    ])
    expect(result.exhausted).toBe(true)
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

    expect(result.lines[0]).toEqual(expect.objectContaining({ text: 'Visible', x: 40, y: 20 }))
  })
})
