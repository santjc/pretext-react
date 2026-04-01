import { describe, expect, it } from 'vitest'
import { carveLineSlots, createLineSlotResolver, getCircleBlockedLineRangeForRow, pickWidestLineSlot } from './lineSlots'

describe('lineSlots', () => {
  it('carves blocked ranges out of a base line slot', () => {
    expect(
      carveLineSlots(
        { left: 20, right: 300 },
        [{ left: 120, right: 180 }],
        24,
      ),
    ).toEqual([
      { left: 20, right: 120 },
      { left: 180, right: 300 },
    ])
  })

  it('computes the blocked range for a circle on a line row', () => {
    const blocked = getCircleBlockedLineRangeForRow({
      cx: 200,
      cy: 200,
      radius: 60,
      lineTop: 180,
      lineBottom: 210,
      horizontalPadding: 10,
    })

    expect(blocked).not.toBeNull()
    expect(blocked!.left).toBeLessThan(200)
    expect(blocked!.right).toBeGreaterThan(200)
  })

  it('picks the widest line slot by default', () => {
    expect(
      pickWidestLineSlot([
        { left: 20, right: 90 },
        { left: 120, right: 260 },
      ]),
    ).toEqual({ left: 120, right: 260 })
  })

  it('creates a line slot resolver from blocked ranges', () => {
    const getLineSlotAtY = createLineSlotResolver({
      baseLineSlot: { left: 20, right: 320 },
      lineHeight: 24,
      minWidth: 60,
      getBlockedLineRanges: (top) => (top < 24 ? [{ left: 120, right: 220 }] : []),
    })

    expect(getLineSlotAtY(0)).toEqual({ left: 20, right: 120 })
    expect(getLineSlotAtY(24)).toEqual({ left: 20, right: 320 })
  })
})
