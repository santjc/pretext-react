import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { FlowLines } from './FlowLines'

describe('FlowLines', () => {
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
    expect((line as HTMLElement).style.lineHeight).toBe('28px')
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
    expect((line as HTMLElement).style.lineHeight).toBe('26px')
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
})
