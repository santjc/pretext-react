import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { usePreparedSegments } from './usePreparedSegments'

const prepareWithSegmentsMock = vi.fn()

vi.mock('@chenglou/pretext', () => ({
  prepareWithSegments: (...args: unknown[]) => prepareWithSegmentsMock(...args),
}))

describe('usePreparedSegments', () => {
  beforeEach(() => {
    prepareWithSegmentsMock.mockReset()
    prepareWithSegmentsMock.mockReturnValue({ id: 'segmented' })
  })

  it('prepares segmented text when inputs are valid', () => {
    const { result } = renderHook(() => usePreparedSegments({ text: 'hello', font: '400 16px Georgia' }))

    expect(prepareWithSegmentsMock).toHaveBeenCalledWith('hello', '400 16px Georgia', undefined)
    expect(result.current.prepared).toEqual({ id: 'segmented' })
    expect(result.current.isReady).toBe(true)
  })
})
