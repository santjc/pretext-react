import { prepareWithSegments } from '@chenglou/pretext'
import { describe, expect, it } from 'vitest'
import { annotateEditorialLines } from './editorialLineAnnotation'
import { flowText } from './flowText'
import { createLineSlotResolver, getCircleBlockedLineRangeForRow } from './lineSlots'

describe('editorial integration', () => {
  it('flows real pretext lines across sequential tracks and preserves reading order', () => {
    const prepared = prepareWithSegments(
      'Alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu xi omicron.',
      '400 16px Georgia',
    )

    const getLineSlotAtY = createLineSlotResolver({
      baseLineSlot: { left: 0, right: 120 },
      lineHeight: 24,
    })

    const firstTrack = flowText({
      prepared,
      lineHeight: 24,
      getLineSlotAtY,
      maxLines: 2,
    })

    const secondTrack = flowText({
      prepared,
      lineHeight: 24,
      getLineSlotAtY,
      startCursor: firstTrack.endCursor,
      maxLines: 2,
    })

    expect(firstTrack.lines).toHaveLength(2)
    expect(secondTrack.lines.length).toBeGreaterThan(0)
    expect(firstTrack.exhausted).toBe(false)
    expect(secondTrack.endCursor.segmentIndex).toBeGreaterThanOrEqual(firstTrack.endCursor.segmentIndex)

    const combined = [...firstTrack.lines, ...secondTrack.lines]
      .map((line) => line.text)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim()

    expect(combined.startsWith('Alpha beta gamma')).toBe(true)
    expect(combined.includes('theta iota')).toBe(true)
  })

  it('annotates real flowed lines and leaves the terminal line natural', () => {
    const prepared = prepareWithSegments(
      'Alpha beta gamma delta epsilon zeta eta theta iota kappa lambda.',
      '400 16px Georgia',
    )

    const flow = flowText({
      prepared,
      lineHeight: 24,
      getLineSlotAtY: createLineSlotResolver({
        baseLineSlot: { left: 0, right: 132 },
        lineHeight: 24,
      }),
      maxLines: 3,
    })

    const realLines = flow.lines.map((line, index) =>
      index === 0
        ? {
            ...line,
            slotRight: line.slotRight + 8,
            slotWidth: line.slotWidth + 8,
          }
        : line,
    )

    const annotated = annotateEditorialLines(prepared, realLines, false)

    expect(annotated.length).toBeGreaterThan(1)
    expect(annotated[0]?.text.length).toBeGreaterThan(0)
    expect(annotated[0]?.isTerminal).toBe(false)
    expect(annotated.at(-1)?.justifyWordSpacing).toBeNull()
    expect(annotated.at(-1)?.isTerminal).toBe(true)
  })

  it('uses obstacle carving to shift and shorten real flowed lines', () => {
    const prepared = prepareWithSegments(
      'Alpha beta gamma delta epsilon zeta eta theta iota kappa lambda mu nu.',
      '400 16px Georgia',
    )

    const unobstructed = flowText({
      prepared,
      lineHeight: 24,
      getLineSlotAtY: createLineSlotResolver({
        baseLineSlot: { left: 0, right: 180 },
        lineHeight: 24,
      }),
      maxLines: 1,
    })

    const obstructed = flowText({
      prepared,
      lineHeight: 24,
      getLineSlotAtY: createLineSlotResolver({
        baseLineSlot: { left: 0, right: 180 },
        lineHeight: 24,
        getBlockedLineRanges: (lineTop, lineBottom) => {
          const blocked = getCircleBlockedLineRangeForRow({
            cx: 44,
            cy: 12,
            radius: 26,
            lineTop,
            lineBottom,
            horizontalPadding: 6,
          })

          return blocked === null ? [] : [blocked]
        },
      }),
      maxLines: 1,
    })

    expect(unobstructed.lines[0]).toBeDefined()
    expect(obstructed.lines[0]).toBeDefined()
    expect(obstructed.lines[0]!.slotLeft).toBeGreaterThan(unobstructed.lines[0]!.slotLeft)
    expect(obstructed.lines[0]!.slotWidth).toBeLessThan(unobstructed.lines[0]!.slotWidth)
    expect(obstructed.lines[0]!.text.length).toBeLessThanOrEqual(unobstructed.lines[0]!.text.length)
  })
})
