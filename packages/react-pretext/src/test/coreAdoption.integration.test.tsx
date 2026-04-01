import { act, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { PText, createPretextTypography, useMeasuredText } from '../index'
import { MockResizeObserver } from './setup'

function CoreAdoptionExample({ text }: { text: string }) {
  const [measure, setMeasure] = useState<{ width: number; height: number; lineCount: number } | null>(null)
  const typography = createPretextTypography({
    font: '400 16px Georgia',
    lineHeight: 24,
    width: 220,
  })
  const layout = useMeasuredText({ text, typography })

  return (
    <>
      <output data-testid="metrics">{`${layout.height}/${layout.lineCount}`}</output>
      <output data-testid="measure">{measure === null ? 'pending' : `${measure.width}/${measure.height}/${measure.lineCount}`}</output>
      <PText as="p" typography={typography} onMeasure={setMeasure}>
        {text}
      </PText>
    </>
  )
}

function ResponsivePTextExample({ text }: { text: string }) {
  const [measure, setMeasure] = useState<{ width: number; height: number; lineCount: number } | null>(null)
  const typography = createPretextTypography({
    font: '400 16px Georgia',
    lineHeight: 24,
  })

  return (
    <>
      <output data-testid="measure">{measure === null ? 'pending' : `${measure.width}/${measure.height}/${measure.lineCount}`}</output>
      <div style={{ width: '320px' }}>
        <PText as="p" typography={typography} onMeasure={setMeasure}>
          {text}
        </PText>
      </div>
    </>
  )
}

describe('core adoption path', () => {
  it('lets one typography object drive both measurement and rendered output from the root API', () => {
    render(<CoreAdoptionExample text="Alpha beta gamma delta epsilon zeta." />)

    expect(screen.getByTestId('metrics').textContent).toBe('48/2')
    expect(screen.getByTestId('measure').textContent).toBe('220/48/2')

    const paragraph = screen.getByText('Alpha beta gamma delta epsilon zeta.')
    expect(paragraph.tagName).toBe('P')
    expect((paragraph as HTMLElement).style.fontFamily).toBe('Georgia')
    expect((paragraph as HTMLElement).style.fontSize).toBe('16px')
    expect((paragraph as HTMLElement).style.lineHeight).toBe('24px')
    expect((paragraph as HTMLElement).style.width).toBe('220px')
  })

  it('keeps responsive width observation inside PText without promoting helper-only playground wiring', () => {
    const { container } = render(<ResponsivePTextExample text="Alpha beta gamma delta epsilon zeta eta theta." />)
    const paragraph = container.querySelector('p')

    expect(paragraph).toBeTruthy()
    expect(screen.getByTestId('measure').textContent).toBe('0/0/0')

    act(() => {
      paragraph!.getBoundingClientRect = () => ({ width: 180 }) as DOMRect
      const observer = MockResizeObserver.instances.at(-1)
      observer?.callback([{ contentRect: { width: 180 } } as ResizeObserverEntry], observer as unknown as ResizeObserver)
    })

    expect(screen.getByTestId('measure').textContent).toBe('180/48/2')
    expect((paragraph as HTMLElement).style.width).toBe('')
    expect((paragraph as HTMLElement).style.fontFamily).toBe('Georgia')
  })
})
