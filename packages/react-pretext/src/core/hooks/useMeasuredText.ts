import { usePreparedText, type PrepareOptions } from './usePreparedText'
import { usePretextLayout } from './usePretextLayout'
import type { PretextTypography } from '../lib/typography'

type UseMeasuredTextInput = {
  text: string
  width?: number
  font?: string
  lineHeight?: number
  typography?: PretextTypography
  prepareOptions?: PrepareOptions
  enableProfiling?: boolean
  enabled?: boolean
}

type UseMeasuredTextResult = {
  prepared: ReturnType<typeof usePreparedText>['prepared']
  height: number
  lineCount: number
  prepareMs?: number
  isReady: boolean
}

function useMeasuredText({
  text,
  width,
  font,
  lineHeight,
  typography,
  prepareOptions,
  enableProfiling = false,
  enabled = true,
}: UseMeasuredTextInput): UseMeasuredTextResult {
  const resolvedFont = font ?? typography?.font
  const resolvedLineHeight = lineHeight ?? typography?.lineHeight
  const resolvedWidth = width ?? typography?.width

  if (resolvedFont === undefined || resolvedLineHeight === undefined) {
    throw new Error('useMeasuredText requires `font` and `lineHeight`, either directly or via `typography`.')
  }

  if (resolvedWidth === undefined) {
    throw new Error('useMeasuredText requires `width`, either directly or via `typography`.')
  }

  const prepared = usePreparedText({
    text,
    font: resolvedFont,
    options: prepareOptions,
    enableProfiling,
    enabled,
  })
  const layout = usePretextLayout({
    prepared: prepared.prepared,
    width: resolvedWidth,
    lineHeight: resolvedLineHeight,
    enabled,
  })

  return {
    prepared: prepared.prepared,
    height: layout.height,
    lineCount: layout.lineCount,
    prepareMs: prepared.prepareMs,
    isReady: layout.isReady,
  }
}

export { useMeasuredText }
export type { UseMeasuredTextInput, UseMeasuredTextResult }
