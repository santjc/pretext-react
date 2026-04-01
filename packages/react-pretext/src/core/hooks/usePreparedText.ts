import { prepare, profilePrepare, type PreparedText } from '@chenglou/pretext'
import { useMemo } from 'react'

type PrepareOptions = {
  whiteSpace?: 'normal' | 'pre-wrap'
}

type UsePreparedTextInput = {
  text: string
  font: string
  options?: PrepareOptions
  enableProfiling?: boolean
  enabled?: boolean
}

type UsePreparedTextResult = {
  prepared: PreparedText | null
  prepareMs?: number
  isReady: boolean
}

function usePreparedText({ text, font, options, enableProfiling = false, enabled = true }: UsePreparedTextInput): UsePreparedTextResult {
  const whiteSpace = options?.whiteSpace

  return useMemo(() => {
    if (!enabled || text.length === 0 || font.length === 0) {
      return {
        prepared: null,
        isReady: false,
      }
    }

    const normalizedOptions = whiteSpace === undefined ? undefined : { whiteSpace }

    return {
      prepared: prepare(text, font, normalizedOptions),
      ...(enableProfiling ? { prepareMs: profilePrepare(text, font, normalizedOptions).totalMs } : {}),
      isReady: true,
    }
  }, [enableProfiling, enabled, font, text, whiteSpace])
}

export { usePreparedText }
export type { UsePreparedTextInput, UsePreparedTextResult, PrepareOptions }
