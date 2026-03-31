import { prepare, profilePrepare, type PreparedText } from '@chenglou/pretext'
import { useMemo } from 'react'

type PrepareOptions = {
  whiteSpace?: 'normal' | 'pre-wrap'
}

type UsePreparedTextInput = {
  text: string
  font: string
  options?: PrepareOptions
  enabled?: boolean
}

type UsePreparedTextResult = {
  prepared: PreparedText | null
  prepareMs: number
  isReady: boolean
}

function usePreparedText({ text, font, options, enabled = true }: UsePreparedTextInput): UsePreparedTextResult {
  return useMemo(() => {
    if (!enabled || text.length === 0 || font.length === 0) {
      return {
        prepared: null,
        prepareMs: 0,
        isReady: false,
      }
    }

    const profile = profilePrepare(text, font, options)

    return {
      prepared: prepare(text, font, options),
      prepareMs: profile.totalMs,
      isReady: true,
    }
  }, [enabled, font, options, text])
}

export { usePreparedText }
export type { UsePreparedTextInput, UsePreparedTextResult, PrepareOptions }
