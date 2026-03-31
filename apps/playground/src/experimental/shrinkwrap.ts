import { walkLineRanges, type PreparedTextWithSegments } from '@santjc/react-pretext'

type ShrinkwrapMetrics = {
  targetLineCount: number
  cssWidth: number
  shrinkwrapWidth: number
  cssWastedPixels: number
  shrinkwrapWastedPixels: number
}

function summarize(prepared: PreparedTextWithSegments, maxWidth: number) {
  let lineCount = 0
  let widest = 0
  const lineWidths: number[] = []

  walkLineRanges(prepared, maxWidth, (line) => {
    lineCount += 1
    lineWidths.push(line.width)
    widest = Math.max(widest, line.width)
  })

  return { lineCount, widest, lineWidths }
}

function wasted(lineWidths: number[], width: number) {
  return Math.round(lineWidths.reduce((total, current) => total + Math.max(width - current, 0), 0))
}

function findShrinkwrapWidth(prepared: PreparedTextWithSegments, maxWidth: number, lineCount: number) {
  let left = 1
  let right = Math.max(1, Math.floor(maxWidth))

  while (left < right) {
    const middle = Math.floor((left + right) / 2)
    const result = summarize(prepared, middle)
    if (result.lineCount > lineCount) {
      left = middle + 1
    } else {
      right = middle
    }
  }

  return left
}

function getShrinkwrapMetrics(prepared: PreparedTextWithSegments, maxWidth: number): ShrinkwrapMetrics {
  const css = summarize(prepared, maxWidth)
  const cssWidth = Math.ceil(css.widest)
  const candidate = findShrinkwrapWidth(prepared, maxWidth, css.lineCount)
  const shrink = summarize(prepared, candidate)
  const shrinkwrapWidth = Math.max(candidate, Math.ceil(shrink.widest))

  return {
    targetLineCount: css.lineCount,
    cssWidth,
    shrinkwrapWidth,
    cssWastedPixels: wasted(css.lineWidths, cssWidth),
    shrinkwrapWastedPixels: wasted(shrink.lineWidths, shrinkwrapWidth),
  }
}

export { getShrinkwrapMetrics }
