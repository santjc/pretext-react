import { layoutNextLine, type LayoutCursor, type PreparedTextWithSegments } from '@chenglou/pretext'

type LineSlot = {
  left: number
  right: number
}

type PositionedLine = {
  text: string
  x: number
  y: number
  width: number
  start: LayoutCursor
  end: LayoutCursor
}

type TextFlowInput = {
  prepared: PreparedTextWithSegments
  lineHeight: number
  getLineSlotAtY: (y: number) => LineSlot | null
  startY?: number
  maxLines?: number
  maxY?: number
  maxSteps?: number
}

type TextFlowResult = {
  lines: PositionedLine[]
  height: number
  lineCount: number
  exhausted: boolean
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
  maxLines,
  maxY,
  maxSteps = 2000,
}: TextFlowInput): TextFlowResult {
  const lines: PositionedLine[] = []
  let y = startY
  let cursor = initialCursor
  let exhausted = false

  for (let step = 0; step < maxSteps; step += 1) {
    if (maxLines !== undefined && lines.length >= maxLines) {
      break
    }

    if (maxY !== undefined && y >= maxY) {
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
      start: line.start,
      end: line.end,
    })

    cursor = line.end
    y += lineHeight
  }

  return {
    lines,
    height: Math.max(0, y - startY),
    lineCount: lines.length,
    exhausted,
  }
}

export { flowText }
export type { LineSlot, PositionedLine, TextFlowInput, TextFlowResult }
