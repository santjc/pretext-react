import { useMemo } from 'react'
import { flowText, type LineSlot, type PositionedLine, type TextFlowResult } from '../lib/flowText'
import type { PreparedTextWithSegments } from '@chenglou/pretext'

type UseTextFlowInput = {
  prepared: PreparedTextWithSegments | null
  lineHeight: number
  getLineSlotAtY: (y: number) => LineSlot | null
  startY?: number
  maxLines?: number
  maxY?: number
  maxSteps?: number
  enabled?: boolean
}

type UseTextFlowResult = {
  lines: PositionedLine[]
  height: number
  lineCount: number
  exhausted: boolean
  isReady: boolean
}

function useTextFlow({ prepared, enabled = true, ...input }: UseTextFlowInput): UseTextFlowResult {
  return useMemo(() => {
    if (!enabled || prepared === null) {
      return {
        lines: [],
        height: 0,
        lineCount: 0,
        exhausted: false,
        isReady: false,
      }
    }

    const result: TextFlowResult = flowText({
      prepared,
      ...input,
    })

    return {
      ...result,
      isReady: true,
    }
  }, [enabled, input, prepared])
}

export { useTextFlow }
export type { UseTextFlowInput, UseTextFlowResult }
