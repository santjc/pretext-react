import { useMemo } from 'react'
import { flowText, initialCursor, type PositionedLine, type TextFlowResult } from '../lib/flowText'
import type { LineSlot } from '../lib/lineSlots'
import type { LayoutCursor, PreparedTextWithSegments } from '@chenglou/pretext'

type UseTextFlowInput = {
  prepared: PreparedTextWithSegments | null
  lineHeight: number
  getLineSlotAtY: (y: number) => LineSlot | null
  startY?: number
  startCursor?: LayoutCursor
  maxLines?: number
  maxY?: number
  maxSteps?: number
  enabled?: boolean
}

type UseTextFlowResult = {
  lines: PositionedLine[]
  height: number
  exhausted: boolean
  truncated: boolean
  isReady: boolean
  endCursor: LayoutCursor
}

function useTextFlow({
  prepared,
  lineHeight,
  getLineSlotAtY,
  startY,
  startCursor,
  maxLines,
  maxY,
  maxSteps,
  enabled = true,
}: UseTextFlowInput): UseTextFlowResult {
  return useMemo(() => {
    if (!enabled || prepared === null) {
      return {
        lines: [],
        height: 0,
        exhausted: false,
        truncated: false,
        isReady: false,
        endCursor: initialCursor,
      }
    }

    const result: TextFlowResult = flowText({
      prepared,
      lineHeight,
      getLineSlotAtY,
      startY,
      startCursor,
      maxLines,
      maxY,
      maxSteps,
    })

    return {
      ...result,
      isReady: true,
    }
  }, [enabled, getLineSlotAtY, lineHeight, maxLines, maxSteps, maxY, prepared, startCursor, startY])
}

export { useTextFlow }
export type { UseTextFlowInput, UseTextFlowResult }
