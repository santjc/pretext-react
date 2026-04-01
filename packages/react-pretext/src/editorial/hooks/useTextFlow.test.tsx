import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTextFlow } from './useTextFlow'

const flowTextMock = vi.fn()

vi.mock('../lib/flowText', () => ({
  flowText: (...args: unknown[]) => flowTextMock(...args),
  initialCursor: { segmentIndex: 0, graphemeIndex: 0 },
}))

describe('useTextFlow', () => {
  beforeEach(() => {
    flowTextMock.mockReset()
    flowTextMock.mockReturnValue({ lines: [], height: 120, exhausted: true, truncated: false, endCursor: { segmentIndex: 0, graphemeIndex: 5 } })
  })

  it('wraps flowText for prepared segmented text', () => {
    const getLineSlotAtY = vi.fn(() => ({ left: 0, right: 200 }))
    const { result } = renderHook(() =>
      useTextFlow({ prepared: { id: 'prepared' } as never, lineHeight: 24, getLineSlotAtY }),
    )

    expect(flowTextMock).toHaveBeenCalledWith({ prepared: { id: 'prepared' }, lineHeight: 24, getLineSlotAtY })
    expect(result.current.height).toBe(120)
    expect(result.current.isReady).toBe(true)
    expect(result.current.endCursor).toEqual({ segmentIndex: 0, graphemeIndex: 5 })
  })

  it('does not recompute when rerendered with the same inputs', () => {
    const getLineSlotAtY = vi.fn(() => ({ left: 0, right: 200 }))
    const prepared = { id: 'prepared' } as never
    const { rerender } = renderHook(() => useTextFlow({ prepared, lineHeight: 24, getLineSlotAtY }))

    rerender()

    expect(flowTextMock).toHaveBeenCalledTimes(1)
  })
})
