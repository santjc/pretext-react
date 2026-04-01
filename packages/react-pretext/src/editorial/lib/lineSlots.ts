type LineSlot = {
  left: number
  right: number
}

type BlockedLineRange = {
  left: number
  right: number
}

type GetBlockedLineRanges = (lineTop: number, lineBottom: number) => BlockedLineRange[]

type LineSlotResolver = (y: number) => LineSlot | null

type CreateLineSlotResolverInput = {
  baseLineSlot: LineSlot
  lineHeight: number
  minWidth?: number
  getBlockedLineRanges?: GetBlockedLineRanges
}

type CircleLineRangeInput = {
  cx: number
  cy: number
  radius: number
  lineTop: number
  lineBottom: number
  horizontalPadding?: number
  verticalPadding?: number
}

function carveLineSlots(baseLineSlot: LineSlot, blockedLineRanges: BlockedLineRange[], minWidth = 24): LineSlot[] {
  let lineSlots = [baseLineSlot]

  for (let blockedIndex = 0; blockedIndex < blockedLineRanges.length; blockedIndex += 1) {
    const blockedLineRange = blockedLineRanges[blockedIndex]!
    const nextLineSlots: LineSlot[] = []

    for (let slotIndex = 0; slotIndex < lineSlots.length; slotIndex += 1) {
      const lineSlot = lineSlots[slotIndex]!
      if (blockedLineRange.right <= lineSlot.left || blockedLineRange.left >= lineSlot.right) {
        nextLineSlots.push(lineSlot)
        continue
      }

      if (blockedLineRange.left > lineSlot.left) {
        nextLineSlots.push({ left: lineSlot.left, right: blockedLineRange.left })
      }

      if (blockedLineRange.right < lineSlot.right) {
        nextLineSlots.push({ left: blockedLineRange.right, right: lineSlot.right })
      }
    }

    lineSlots = nextLineSlots
  }

  return lineSlots.filter((lineSlot) => lineSlot.right - lineSlot.left >= minWidth)
}

function getCircleBlockedLineRangeForRow({
  cx,
  cy,
  radius,
  lineTop,
  lineBottom,
  horizontalPadding = 0,
  verticalPadding = 0,
}: CircleLineRangeInput): BlockedLineRange | null {
  const top = lineTop - verticalPadding
  const bottom = lineBottom + verticalPadding

  if (bottom <= cy - radius || top >= cy + radius) {
    return null
  }

  const minDy = cy >= top && cy <= bottom ? 0 : cy < top ? top - cy : cy - bottom
  if (minDy >= radius) {
    return null
  }

  const maxDx = Math.sqrt(radius * radius - minDy * minDy)
  return {
    left: cx - maxDx - horizontalPadding,
    right: cx + maxDx + horizontalPadding,
  }
}

function pickWidestLineSlot(lineSlots: LineSlot[]): LineSlot | null {
  if (lineSlots.length === 0) {
    return null
  }

  let widestLineSlot = lineSlots[0]!

  for (let index = 1; index < lineSlots.length; index += 1) {
    const lineSlot = lineSlots[index]!
    if (lineSlot.right - lineSlot.left > widestLineSlot.right - widestLineSlot.left) {
      widestLineSlot = lineSlot
    }
  }

  return widestLineSlot
}

function createLineSlotResolver({
  baseLineSlot,
  lineHeight,
  minWidth = 24,
  getBlockedLineRanges = () => [],
}: CreateLineSlotResolverInput): LineSlotResolver {
  return (y: number) => {
    const lineTop = y
    const lineBottom = y + lineHeight
    const blockedLineRanges = getBlockedLineRanges(lineTop, lineBottom)
    const lineSlots = carveLineSlots(baseLineSlot, blockedLineRanges, minWidth)

    return pickWidestLineSlot(lineSlots)
  }
}

export { carveLineSlots, createLineSlotResolver, getCircleBlockedLineRangeForRow, pickWidestLineSlot }
export type { LineSlot, BlockedLineRange, GetBlockedLineRanges, LineSlotResolver, CreateLineSlotResolverInput, CircleLineRangeInput }
