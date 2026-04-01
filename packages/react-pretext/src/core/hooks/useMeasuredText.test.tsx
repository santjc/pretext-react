import { renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPretextTypography } from '../lib/typography'
import { useMeasuredText } from './useMeasuredText'

const prepareMock = vi.fn()
const profilePrepareMock = vi.fn()
const layoutMock = vi.fn()

vi.mock('@chenglou/pretext', () => ({
  prepare: (...args: unknown[]) => prepareMock(...args),
  profilePrepare: (...args: unknown[]) => profilePrepareMock(...args),
  layout: (...args: unknown[]) => layoutMock(...args),
}))

describe('useMeasuredText', () => {
  beforeEach(() => {
    prepareMock.mockReset()
    profilePrepareMock.mockReset()
    layoutMock.mockReset()

    prepareMock.mockReturnValue({ id: 'prepared' })
    profilePrepareMock.mockReturnValue({ totalMs: 1.5 })
    layoutMock.mockReturnValue({ height: 72, lineCount: 3 })
  })

  it('returns empty state for empty text', () => {
    const { result } = renderHook(() =>
      useMeasuredText({
        text: '',
        font: '400 16px Georgia',
        lineHeight: 24,
        width: 320,
      }),
    )

    expect(prepareMock).not.toHaveBeenCalled()
    expect(layoutMock).not.toHaveBeenCalled()
    expect(result.current).toEqual({
      prepared: null,
      height: 0,
      lineCount: 0,
      prepareMs: undefined,
      isReady: false,
    })
  })

  it('returns empty state when disabled', () => {
    const { result } = renderHook(() =>
      useMeasuredText({
        text: 'hello world',
        font: '400 16px Georgia',
        lineHeight: 24,
        width: 320,
        enabled: false,
      }),
    )

    expect(prepareMock).not.toHaveBeenCalled()
    expect(layoutMock).not.toHaveBeenCalled()
    expect(result.current).toEqual({
      prepared: null,
      height: 0,
      lineCount: 0,
      prepareMs: undefined,
      isReady: false,
    })
  })

  it('returns measured output for the normal happy path', () => {
    const typography = createPretextTypography({
      font: '500 18px Georgia',
      lineHeight: 28,
      width: 300,
    })

    const { result } = renderHook(() =>
      useMeasuredText({
        text: 'hello world',
        typography,
      }),
    )

    expect(prepareMock).toHaveBeenCalledWith('hello world', '500 18px Georgia', undefined)
    expect(layoutMock).toHaveBeenCalledWith({ id: 'prepared' }, 300, 28)
    expect(result.current).toEqual({
      prepared: { id: 'prepared' },
      height: 72,
      lineCount: 3,
      prepareMs: undefined,
      isReady: true,
    })
  })

  it('relayouts when width changes without recomputing preparation', () => {
    const { rerender } = renderHook(
      ({ width }) =>
        useMeasuredText({
          text: 'hello world',
          font: '400 16px Georgia',
          lineHeight: 24,
          width,
        }),
      { initialProps: { width: 320 } },
    )

    rerender({ width: 420 })

    expect(prepareMock).toHaveBeenCalledTimes(1)
    expect(layoutMock).toHaveBeenCalledTimes(2)
    expect(layoutMock).toHaveBeenNthCalledWith(1, { id: 'prepared' }, 320, 24)
    expect(layoutMock).toHaveBeenNthCalledWith(2, { id: 'prepared' }, 420, 24)
  })

  it('passes profiling and prepare options through to text preparation', () => {
    const { result } = renderHook(() =>
      useMeasuredText({
        text: 'hello world',
        font: '400 16px Georgia',
        lineHeight: 24,
        width: 320,
        enableProfiling: true,
        prepareOptions: { whiteSpace: 'pre-wrap' },
      }),
    )

    expect(prepareMock).toHaveBeenCalledWith('hello world', '400 16px Georgia', { whiteSpace: 'pre-wrap' })
    expect(profilePrepareMock).toHaveBeenCalledWith('hello world', '400 16px Georgia', { whiteSpace: 'pre-wrap' })
    expect(result.current.prepareMs).toBe(1.5)
  })

  it('lets explicit props override typography values', () => {
    const typography = createPretextTypography({
      font: '400 16px Georgia',
      lineHeight: 24,
      width: 300,
    })

    renderHook(() =>
      useMeasuredText({
        text: 'hello world',
        typography,
        font: '700 20px Georgia',
        lineHeight: 30,
        width: 360,
      }),
    )

    expect(prepareMock).toHaveBeenCalledWith('hello world', '700 20px Georgia', undefined)
    expect(layoutMock).toHaveBeenCalledWith({ id: 'prepared' }, 360, 30)
  })
})
