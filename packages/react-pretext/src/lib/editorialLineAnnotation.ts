import type { PreparedTextWithSegments } from '@chenglou/pretext'
import { getEditorialJustification } from './editorialJustify'
import type { PositionedLine } from './flowText'

type EditorialPositionedLine = PositionedLine & {
  justifyWordSpacing: number | null
  isTerminal: boolean
  isParagraphTerminal: boolean
}

function annotateEditorialLines(
  prepared: PreparedTextWithSegments,
  lines: PositionedLine[],
  preserveParagraphBreaks: boolean,
): EditorialPositionedLine[] {
  return lines.map((line, index) => {
    const isTerminal = index === lines.length - 1
    const isParagraphTerminal = preserveParagraphBreaks && /\n\s*$/.test(line.text)
    const justifyWordSpacing = !isTerminal && !isParagraphTerminal
      ? getEditorialJustification({ prepared, line })
      : null

    return {
      ...line,
      justifyWordSpacing,
      isTerminal,
      isParagraphTerminal,
    }
  })
}

export { annotateEditorialLines }
export type { EditorialPositionedLine }
