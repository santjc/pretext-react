import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePretextLayout } from './usePretextLayout'

const layoutMock = vi.fn()

vi.mock('@chenglou/pretext', () => ({
  layout: (...args: unknown[]) => layoutMock(...args),
}))

describe('usePretextLayout', () => {
  beforeEach(() => {
    layoutMock.mockReset()
    layoutMock.mockReturnValue({ height: 72, lineCount: 3 })
  })

  it('layouts prepared text when width is valid', () => {
    const { result } = renderHook(() =>
      usePretextLayout({ prepared: { id: 'prepared' } as never, width: 320, lineHeight: 24 }),
    )

    expect(layoutMock).toHaveBeenCalledWith({ id: 'prepared' }, 320, 24)
    expect(result.current.height).toBe(72)
    expect(result.current.lineCount).toBe(3)
    expect(result.current.isReady).toBe(true)
  })

  it('returns empty state for zero width', () => {
    const { result } = renderHook(() =>
      usePretextLayout({ prepared: { id: 'prepared' } as never, width: 0, lineHeight: 24 }),
    )

    expect(layoutMock).not.toHaveBeenCalled()
    expect(result.current.isReady).toBe(false)
  })
})
