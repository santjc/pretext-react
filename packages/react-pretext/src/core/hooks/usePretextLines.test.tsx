import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePretextLines } from './usePretextLines'

const layoutWithLinesMock = vi.fn()

vi.mock('@chenglou/pretext', () => ({
  layoutWithLines: (...args: unknown[]) => layoutWithLinesMock(...args),
}))

describe('usePretextLines', () => {
  beforeEach(() => {
    layoutWithLinesMock.mockReset()
    layoutWithLinesMock.mockReturnValue({
      height: 72,
      lineCount: 3,
      lines: [{ text: 'hello', width: 100, start: { segmentIndex: 0, graphemeIndex: 0 }, end: { segmentIndex: 0, graphemeIndex: 5 } }],
    })
  })

  it('returns lines for segmented prepared text', () => {
    const { result } = renderHook(() =>
      usePretextLines({ prepared: { id: 'prepared' } as never, width: 320, lineHeight: 24 }),
    )

    expect(layoutWithLinesMock).toHaveBeenCalledWith({ id: 'prepared' }, 320, 24)
    expect(result.current.lines).toHaveLength(1)
    expect(result.current.isReady).toBe(true)
  })
})
