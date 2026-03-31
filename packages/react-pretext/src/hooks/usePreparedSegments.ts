import { prepareWithSegments, type PreparedTextWithSegments } from '@chenglou/pretext'
import { useMemo } from 'react'
import type { PrepareOptions } from './usePreparedText'

type UsePreparedSegmentsInput = {
  text: string
  font: string
  options?: PrepareOptions
  enabled?: boolean
}

type UsePreparedSegmentsResult = {
  prepared: PreparedTextWithSegments | null
  isReady: boolean
}

function usePreparedSegments({ text, font, options, enabled = true }: UsePreparedSegmentsInput): UsePreparedSegmentsResult {
  return useMemo(() => {
    if (!enabled || text.length === 0 || font.length === 0) {
      return {
        prepared: null,
        isReady: false,
      }
    }

    return {
      prepared: prepareWithSegments(text, font, options),
      isReady: true,
    }
  }, [enabled, font, options, text])
}

export { usePreparedSegments }
export type { UsePreparedSegmentsInput, UsePreparedSegmentsResult }
