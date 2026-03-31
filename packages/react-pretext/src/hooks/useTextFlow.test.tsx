import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTextFlow } from './useTextFlow'

const flowTextMock = vi.fn()

vi.mock('../lib/flowText', () => ({
  flowText: (...args: unknown[]) => flowTextMock(...args),
}))

describe('useTextFlow', () => {
  beforeEach(() => {
    flowTextMock.mockReset()
    flowTextMock.mockReturnValue({ lines: [], height: 120, lineCount: 4, exhausted: true })
  })

  it('wraps flowText for prepared segmented text', () => {
    const getLineSlotAtY = vi.fn(() => ({ left: 0, right: 200 }))
    const { result } = renderHook(() =>
      useTextFlow({ prepared: { id: 'prepared' } as never, lineHeight: 24, getLineSlotAtY }),
    )

    expect(flowTextMock).toHaveBeenCalledWith({ prepared: { id: 'prepared' }, lineHeight: 24, getLineSlotAtY })
    expect(result.current.height).toBe(120)
    expect(result.current.isReady).toBe(true)
  })
})
