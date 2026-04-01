import type { PreparedTextWithSegments } from '@chenglou/pretext'
import type { PositionedLine } from './flowText'

type GetEditorialJustificationInput = {
  prepared: PreparedTextWithSegments
  line: PositionedLine
  maxWordSpacing?: number
}

const supportedGapKinds = new Set(['space', 'preserved-space'])
const unsupportedKinds = new Set(['tab', 'soft-hyphen', 'hard-break', 'zero-width-break'])

function getEditorialJustification({
  prepared,
  line,
  maxWordSpacing = 24,
}: GetEditorialJustificationInput): number | null {
  if (line.text.trimStart() !== line.text) {
    return null
  }

  let lastSegmentIndex = line.end.graphemeIndex > 0 ? line.end.segmentIndex : line.end.segmentIndex - 1
  while (lastSegmentIndex >= line.start.segmentIndex) {
    const trailingKind = prepared.kinds[lastSegmentIndex]
    const trailingSegment = prepared.segments[lastSegmentIndex]

    if ((trailingKind === 'space' || trailingKind === 'preserved-space') && trailingSegment === ' ') {
      lastSegmentIndex -= 1
      continue
    }

    break
  }

  if (lastSegmentIndex < line.start.segmentIndex) {
    return null
  }

  let gapCount = 0

  for (let segmentIndex = line.start.segmentIndex; segmentIndex <= lastSegmentIndex; segmentIndex += 1) {
    const kind = prepared.kinds[segmentIndex]
    const segment = prepared.segments[segmentIndex]

    if (kind === undefined || segment === undefined) {
      return null
    }

    const isPartialStart = segmentIndex === line.start.segmentIndex && line.start.graphemeIndex > 0
    const isPartialEnd = segmentIndex === line.end.segmentIndex && line.end.graphemeIndex > 0
    if ((isPartialStart || isPartialEnd) && kind !== 'text') {
      return null
    }

    if (unsupportedKinds.has(kind)) {
      return null
    }

    if (!supportedGapKinds.has(kind)) {
      continue
    }

    if (segment !== ' ') {
      return null
    }

    const previousKind = prepared.kinds[segmentIndex - 1]
    const nextKind = prepared.kinds[segmentIndex + 1]
    if (supportedGapKinds.has(previousKind ?? '') || supportedGapKinds.has(nextKind ?? '')) {
      return null
    }

    gapCount += 1
  }

  if (gapCount === 0) {
    return null
  }

  const extraWidth = line.slotWidth - line.width
  if (extraWidth <= 0) {
    return null
  }

  const wordSpacing = extraWidth / gapCount
  if (wordSpacing > maxWordSpacing) {
    return null
  }

  return wordSpacing
}

export { getEditorialJustification }
export type { GetEditorialJustificationInput }
