import { layoutWithLines, type PreparedTextWithSegments } from '@chenglou/pretext'
import { useMemo } from 'react'

type UsePretextLinesInput = {
  prepared: PreparedTextWithSegments | null
  width: number
  lineHeight: number
  enabled?: boolean
}

type UsePretextLinesResult = {
  height: number
  lineCount: number
  lines: Array<{ text: string; width: number; start: { segmentIndex: number; graphemeIndex: number }; end: { segmentIndex: number; graphemeIndex: number } }>
  isReady: boolean
}

function usePretextLines({ prepared, width, lineHeight, enabled = true }: UsePretextLinesInput): UsePretextLinesResult {
  return useMemo(() => {
    if (!enabled || prepared === null || width <= 0) {
      return {
        height: 0,
        lineCount: 0,
        lines: [],
        isReady: false,
      }
    }

    const result = layoutWithLines(prepared, width, lineHeight)
    return {
      height: result.height,
      lineCount: result.lineCount,
      lines: result.lines,
      isReady: true,
    }
  }, [enabled, lineHeight, prepared, width])
}

export { usePretextLines }
export type { UsePretextLinesInput, UsePretextLinesResult }
