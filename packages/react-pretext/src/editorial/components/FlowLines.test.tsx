import { render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { FlowLines } from './FlowLines'

describe('FlowLines', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders default positioned lines', () => {
    const { getByText } = render(
      <FlowLines
        lines={[
          {
            text: 'hello world',
            x: 0,
            y: 24,
            width: 90,
            slotLeft: 12,
            slotRight: 132,
            slotWidth: 119.2,
            start: { segmentIndex: 0, graphemeIndex: 0 },
            end: { segmentIndex: 0, graphemeIndex: 11 },
          },
        ]}
        font="400 18px GeistVariable, sans-serif"
        lineHeight={28}
        lineClassName="flow-line"
      />,
    )

    const line = getByText('hello world')
    expect(line.className).toBe('flow-line')
    expect(line.getAttribute('style')).toContain('position: absolute')
    expect(line.getAttribute('style')).toContain('left: 12px')
    expect(line.getAttribute('style')).toContain('top: 24px')
    expect(line.getAttribute('style')).toContain('width: 120px')
    expect(line.getAttribute('style')).toContain('white-space: pre')
    expect((line as HTMLElement).style.font).toContain('18px / 28px')
    expect(line.getAttribute('style')).not.toContain('line-height:')
  })

  it('passes computed text, style, and line metadata to custom rendering', () => {
    const { getByText } = render(
      <FlowLines
        lines={[
          {
            text: 'annotated line',
            x: 0,
            y: 48,
            width: 100,
            slotLeft: 20,
            slotRight: 180,
            slotWidth: 160,
            start: { segmentIndex: 1, graphemeIndex: 3 },
            end: { segmentIndex: 1, graphemeIndex: 17 },
          },
        ]}
        font="400 16px GeistVariable, sans-serif"
        lineHeight={26}
        renderLine={({ key, line, text, style }) => (
          <p key={key} data-start={line.start.graphemeIndex} style={style}>
            <span>note:</span>
            {text}
          </p>
        )}
      />,
    )

    const line = getByText((_, element) => element?.tagName === 'P' && element.textContent === 'note:annotated line')
    expect(line.tagName).toBe('P')
    expect(line.getAttribute('data-start')).toBe('3')
    expect(line.getAttribute('style')).toContain('left: 20px')
    expect((line as HTMLElement).style.font).toContain('16px / 26px')
    expect(line.getAttribute('style')).not.toContain('line-height:')
  })

  it('applies justify spacing and trims justified text by default', () => {
    const { queryByText, getByText } = render(
      <FlowLines
        lines={[
          {
            text: 'justify me   ',
            x: 0,
            y: 0,
            width: 100,
            slotLeft: 8,
            slotRight: 180,
            slotWidth: 172,
            start: { segmentIndex: 0, graphemeIndex: 0 },
            end: { segmentIndex: 0, graphemeIndex: 12 },
            justifyWordSpacing: 6,
          },
        ]}
        font="400 16px GeistVariable, sans-serif"
        lineHeight={24}
        lineRenderMode="justify"
      />,
    )

    expect(queryByText('justify me   ')).toBeNull()
    const line = getByText('justify me')
    expect(line.getAttribute('style')).toContain('word-spacing: 6px')
  })

  it('replaces an existing shorthand line-height during rerender without mixing styles', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const { getByText, rerender } = render(
      <FlowLines
        lines={[
          {
            text: 'weight change',
            x: 0,
            y: 0,
            width: 120,
            slotLeft: 8,
            slotRight: 180,
            slotWidth: 172,
            start: { segmentIndex: 0, graphemeIndex: 0 },
            end: { segmentIndex: 0, graphemeIndex: 13 },
          },
        ]}
        font="400 16px GeistVariable, sans-serif"
        lineHeight={24}
      />,
    )

    rerender(
      <FlowLines
        lines={[
          {
            text: 'weight change',
            x: 0,
            y: 0,
            width: 120,
            slotLeft: 8,
            slotRight: 180,
            slotWidth: 172,
            start: { segmentIndex: 0, graphemeIndex: 0 },
            end: { segmentIndex: 0, graphemeIndex: 13 },
          },
        ]}
        font="500 16px GeistVariable, sans-serif"
        lineHeight={24}
      />,
    )

    const line = getByText('weight change')
    expect((line as HTMLElement).style.font).toContain('500 16px / 24px')
    expect(line.getAttribute('style')).not.toContain('line-height:')
    expect(consoleErrorSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Updating a style property during rerender (font) when a conflicting property is set (lineHeight)'),
    )
  })

  it('warns in development when font shorthand has no parsable size token', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    render(
      <FlowLines
        lines={[
          {
            text: 'keyword size',
            x: 0,
            y: 0,
            width: 120,
            slotLeft: 8,
            slotRight: 180,
            slotWidth: 172,
            start: { segmentIndex: 0, graphemeIndex: 0 },
            end: { segmentIndex: 0, graphemeIndex: 12 },
          },
        ]}
        font="italic small-caps serif"
        lineHeight={24}
      />,
    )

    expect(consoleWarnSpy).toHaveBeenCalledWith(
      '[react-pretext] FlowLines expected `font` to be a CSS font shorthand with an explicit size. Received:',
      'italic small-caps serif',
    )
  })
})
