import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useElementWidth } from './useElementWidth'
import { MockResizeObserver } from '../test/setup'

describe('useElementWidth', () => {
  it('tracks width updates from ResizeObserver', () => {
    const element = document.createElement('div')
    element.getBoundingClientRect = () => ({ width: 240 }) as DOMRect

    const { result } = renderHook(() => useElementWidth<HTMLDivElement>())

    act(() => {
      result.current.ref(element)
    })

    expect(result.current.width).toBe(240)

    const observer = MockResizeObserver.instances.at(-1)
    act(() => {
      observer?.callback([{ contentRect: { width: 360 } } as ResizeObserverEntry], observer as unknown as ResizeObserver)
    })

    expect(result.current.width).toBe(360)
  })
})
