import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreparedText } from './usePreparedText'

const prepareMock = vi.fn()
const profilePrepareMock = vi.fn()

vi.mock('@chenglou/pretext', () => ({
  prepare: (...args: unknown[]) => prepareMock(...args),
  profilePrepare: (...args: unknown[]) => profilePrepareMock(...args),
}))

describe('usePreparedText', () => {
  beforeEach(() => {
    prepareMock.mockReset()
    profilePrepareMock.mockReset()
    prepareMock.mockReturnValue({ id: 'prepared' })
    profilePrepareMock.mockReturnValue({ totalMs: 1.5 })
  })

  it('prepares text when inputs are valid', () => {
    const { result } = renderHook(() => usePreparedText({ text: 'hello', font: '400 16px Georgia' }))

    expect(prepareMock).toHaveBeenCalledWith('hello', '400 16px Georgia', undefined)
    expect(result.current.prepared).toEqual({ id: 'prepared' })
    expect(result.current.prepareMs).toBeUndefined()
    expect(result.current.isReady).toBe(true)
    expect(profilePrepareMock).not.toHaveBeenCalled()
  })

  it('profiles preparation only when enabled explicitly', () => {
    const { result } = renderHook(() =>
      usePreparedText({ text: 'hello', font: '400 16px Georgia', enableProfiling: true }),
    )

    expect(prepareMock).toHaveBeenCalledWith('hello', '400 16px Georgia', undefined)
    expect(profilePrepareMock).toHaveBeenCalledWith('hello', '400 16px Georgia', undefined)
    expect(result.current.prepareMs).toBe(1.5)
  })

  it('returns empty state when disabled', () => {
    const { result } = renderHook(() => usePreparedText({ text: 'hello', font: '400 16px Georgia', enabled: false }))

    expect(prepareMock).not.toHaveBeenCalled()
    expect(result.current.prepared).toBeNull()
    expect(result.current.prepareMs).toBeUndefined()
    expect(result.current.isReady).toBe(false)
  })

  it('does not recompute for equivalent inline options across rerenders', () => {
    const { rerender } = renderHook(() =>
      usePreparedText({ text: 'hello', font: '400 16px Georgia', options: { whiteSpace: 'pre-wrap' } }),
    )

    rerender()

    expect(prepareMock).toHaveBeenCalledTimes(1)
    expect(profilePrepareMock).not.toHaveBeenCalled()
  })
})
