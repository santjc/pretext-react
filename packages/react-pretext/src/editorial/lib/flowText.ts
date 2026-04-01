import { layoutNextLine, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext'
import type { LineSlot } from './lineSlots'

type PositionedLine = {
  text: string
  x: number
  y: number
  width: number
  slotLeft: number
  slotRight: number
  slotWidth: number
  start: LayoutCursor
  end: LayoutCursor
}

type TextFlowInput = {
  prepared: PreparedTextWithSegments
  lineHeight: number
  getLineSlotAtY: (y: number) => LineSlot | null
  startY?: number
  startCursor?: LayoutCursor
  maxLines?: number
  maxY?: number
  maxSteps?: number
}

type TextFlowResult = {
  lines: PositionedLine[]
  height: number
  exhausted: boolean
  truncated: boolean
  endCursor: LayoutCursor
}

const initialCursor: LayoutCursor = {
  segmentIndex: 0,
  graphemeIndex: 0,
}

function flowText({
  prepared,
  lineHeight,
  getLineSlotAtY,
  startY = 0,
  startCursor = initialCursor,
  maxLines,
  maxY,
  maxSteps = 2000,
}: TextFlowInput): TextFlowResult {
  const lines: PositionedLine[] = []
  let y = startY
  let cursor = startCursor
  let exhausted = false
  let truncated = false
  let step = 0

  for (; step < maxSteps; step += 1) {
    if (maxLines !== undefined && lines.length >= maxLines) {
      break
    }

    if (maxY !== undefined && y + lineHeight > maxY) {
      break
    }

    const lineSlot = getLineSlotAtY(y)
    if (lineSlot === null || lineSlot.right <= lineSlot.left) {
      y += lineHeight
      continue
    }

    const line = layoutNextLine(prepared, cursor, Math.max(1, Math.floor(lineSlot.right - lineSlot.left)))
    if (line === null) {
      exhausted = true
      break
    }

    lines.push({
      text: line.text,
      x: lineSlot.left,
      y,
      width: line.width,
      slotLeft: lineSlot.left,
      slotRight: lineSlot.right,
      slotWidth: lineSlot.right - lineSlot.left,
      start: line.start,
      end: line.end,
    })

    cursor = line.end
    y += lineHeight
  }

  if (!exhausted && step >= maxSteps) {
    truncated = true
  }

  if (!exhausted && !truncated && layoutNextLine(prepared, cursor, 1) === null) {
    exhausted = true
  }

  return {
    lines,
    height: Math.max(0, y - startY),
    exhausted,
    truncated,
    endCursor: cursor,
  }
}

export { flowText }
export { initialCursor }
export type { PositionedLine, TextFlowInput, TextFlowResult }
