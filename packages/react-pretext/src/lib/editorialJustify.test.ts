import { describe, expect, it } from 'vitest'
import { getEditorialJustification } from './editorialJustify'

describe('editorialJustify', () => {
  it('computes word spacing for ordinary prose lines', () => {
    const result = getEditorialJustification({
      prepared: {
        segments: ['Alpha', ' ', 'beta'],
        kinds: ['text', 'space', 'text'],
      } as never,
      line: {
        text: 'Alpha beta',
        x: 0,
        y: 0,
        width: 88,
        slotLeft: 0,
        slotRight: 100,
        slotWidth: 100,
        start: { segmentIndex: 0, graphemeIndex: 0 },
        end: { segmentIndex: 2, graphemeIndex: 4 },
      },
    })

    expect(result).toBe(12)
  })

  it('does not justify lines with leading whitespace', () => {
    const result = getEditorialJustification({
      prepared: {
        segments: [' ', 'Alpha', ' ', 'beta'],
        kinds: ['preserved-space', 'text', 'space', 'text'],
      } as never,
      line: {
        text: ' Alpha beta',
        x: 0,
        y: 0,
        width: 88,
        slotLeft: 0,
        slotRight: 100,
        slotWidth: 100,
        start: { segmentIndex: 0, graphemeIndex: 1 },
        end: { segmentIndex: 3, graphemeIndex: 4 },
      },
    })

    expect(result).toBeNull()
  })

  it('can justify lines with trailing hanging whitespace', () => {
    const result = getEditorialJustification({
      prepared: {
        segments: ['Alpha', ' ', 'beta', ' '],
        kinds: ['text', 'space', 'text', 'preserved-space'],
      } as never,
      line: {
        text: 'Alpha beta ',
        x: 0,
        y: 0,
        width: 88,
        slotLeft: 0,
        slotRight: 100,
        slotWidth: 100,
        start: { segmentIndex: 0, graphemeIndex: 0 },
        end: { segmentIndex: 3, graphemeIndex: 1 },
      },
    })

    expect(result).toBe(12)
  })

  it('does not justify repeated preserved spaces', () => {
    const result = getEditorialJustification({
      prepared: {
        segments: ['Alpha', ' ', ' ', 'beta'],
        kinds: ['text', 'preserved-space', 'preserved-space', 'text'],
      } as never,
      line: {
        text: 'Alpha  beta',
        x: 0,
        y: 0,
        width: 88,
        slotLeft: 0,
        slotRight: 100,
        slotWidth: 100,
        start: { segmentIndex: 0, graphemeIndex: 0 },
        end: { segmentIndex: 3, graphemeIndex: 4 },
      },
    })

    expect(result).toBeNull()
  })

  it('caps excessive word spacing', () => {
    const result = getEditorialJustification({
      prepared: {
        segments: ['Alpha', ' ', 'beta'],
        kinds: ['text', 'space', 'text'],
      } as never,
      line: {
        text: 'Alpha beta',
        x: 0,
        y: 0,
        width: 88,
        slotLeft: 0,
        slotRight: 120,
        slotWidth: 120,
        start: { segmentIndex: 0, graphemeIndex: 0 },
        end: { segmentIndex: 2, graphemeIndex: 4 },
      },
      maxWordSpacing: 12,
    })

    expect(result).toBeNull()
  })
})
