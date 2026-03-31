import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PText } from './PText'

const useElementWidthMock = vi.fn()
const usePreparedTextMock = vi.fn()
const usePretextLayoutMock = vi.fn()

vi.mock('../hooks/useElementWidth', () => ({
  useElementWidth: (...args: unknown[]) => useElementWidthMock(...args),
}))

vi.mock('../hooks/usePreparedText', () => ({
  usePreparedText: (...args: unknown[]) => usePreparedTextMock(...args),
}))

vi.mock('../hooks/usePretextLayout', () => ({
  usePretextLayout: (...args: unknown[]) => usePretextLayoutMock(...args),
}))

describe('PText', () => {
  beforeEach(() => {
    useElementWidthMock.mockReset()
    usePreparedTextMock.mockReset()
    usePretextLayoutMock.mockReset()

    useElementWidthMock.mockReturnValue({ ref: vi.fn(), width: 260, node: null })
    usePreparedTextMock.mockReturnValue({ prepared: { id: 'prepared' }, prepareMs: 0.5, isReady: true })
    usePretextLayoutMock.mockReturnValue({ height: 72, lineCount: 3, isReady: true })
  })

  it('renders a paragraph by default', () => {
    const { container } = render(
      <PText font="400 16px Georgia" lineHeight={24}>
        hello world
      </PText>,
    )

    expect(container.querySelector('p')?.textContent).toBe('hello world')
  })

  it('passes explicit width to the layout hook when provided', () => {
    render(
      <PText width={320} font="400 16px Georgia" lineHeight={24}>
        hello world
      </PText>,
    )

    expect(usePretextLayoutMock).toHaveBeenCalledWith({
      prepared: { id: 'prepared' },
      width: 320,
      lineHeight: 24,
    })
  })

  it('notifies measurement results', () => {
    const onMeasure = vi.fn()

    render(
      <PText onMeasure={onMeasure} font="400 16px Georgia" lineHeight={24}>
        hello world
      </PText>,
    )

    expect(onMeasure).toHaveBeenCalledWith({ width: 260, height: 72, lineCount: 3 })
  })

  it('passes prepareOptions to usePreparedText', () => {
    render(
      <PText font="400 16px Georgia" lineHeight={24} prepareOptions={{ whiteSpace: 'pre-wrap' }}>
        hello world
      </PText>,
    )

    expect(usePreparedTextMock).toHaveBeenCalledWith({
      text: 'hello world',
      font: '400 16px Georgia',
      options: { whiteSpace: 'pre-wrap' },
    })
  })
})
