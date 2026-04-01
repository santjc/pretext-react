import { layout, type PreparedText } from '@chenglou/pretext'
import { useMemo } from 'react'

type UsePretextLayoutInput = {
  prepared: PreparedText | null
  width: number
  lineHeight: number
  enabled?: boolean
}

type UsePretextLayoutResult = {
  height: number
  lineCount: number
  isReady: boolean
}

function usePretextLayout({ prepared, width, lineHeight, enabled = true }: UsePretextLayoutInput): UsePretextLayoutResult {
  return useMemo(() => {
    if (!enabled || prepared === null || width <= 0) {
      return {
        height: 0,
        lineCount: 0,
        isReady: false,
      }
    }

    const result = layout(prepared, width, lineHeight)
    return {
      height: result.height,
      lineCount: result.lineCount,
      isReady: true,
    }
  }, [enabled, lineHeight, prepared, width])
}

export { usePretextLayout }
export type { UsePretextLayoutInput, UsePretextLayoutResult }
