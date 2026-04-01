import type { CSSProperties, ReactNode } from 'react'
import type { EditorialPositionedLine } from '../lib/editorialLineAnnotation'
import type { PositionedLine } from '../lib/flowText'

type FlowRenderableLine = PositionedLine & Partial<Pick<EditorialPositionedLine, 'justifyWordSpacing'>>

type FlowLineRenderInput<TLine extends FlowRenderableLine = FlowRenderableLine> = {
  key: string
  line: TLine
  text: string
  style: CSSProperties
}

type FlowLinesProps<TLine extends FlowRenderableLine = FlowRenderableLine> = {
  lines: TLine[]
  font: string
  lineHeight: number
  lineClassName?: string
  lineRenderMode?: 'natural' | 'justify'
  renderLine?: (input: FlowLineRenderInput<TLine>) => ReactNode
}

function getFlowLineText(line: FlowRenderableLine, lineRenderMode: 'natural' | 'justify') {
  if (lineRenderMode === 'justify' && line.justifyWordSpacing !== null && line.justifyWordSpacing !== undefined) {
    return line.text.trimEnd()
  }

  return line.text
}

function getFlowLineStyle(
  line: FlowRenderableLine,
  font: string,
  lineHeight: number,
  lineRenderMode: 'natural' | 'justify',
): CSSProperties {
  return {
    position: 'absolute',
    left: `${line.slotLeft}px`,
    top: `${line.y}px`,
    width: `${Math.ceil(line.slotWidth)}px`,
    font,
    lineHeight: `${lineHeight}px`,
    whiteSpace: 'pre',
    textAlign: 'left',
    wordSpacing: lineRenderMode === 'justify' && line.justifyWordSpacing !== null && line.justifyWordSpacing !== undefined
      ? `${line.justifyWordSpacing}px`
      : undefined,
  }
}

function getFlowLineKey(line: FlowRenderableLine, index: number) {
  return `${line.start.segmentIndex}-${line.start.graphemeIndex}-${index}`
}

function FlowLines<TLine extends FlowRenderableLine = FlowRenderableLine>({
  lines,
  font,
  lineHeight,
  lineClassName,
  lineRenderMode = 'natural',
  renderLine,
}: FlowLinesProps<TLine>) {
  return (
    <>
      {lines.map((line, index) => {
        const key = getFlowLineKey(line, index)
        const text = getFlowLineText(line, lineRenderMode)
        const style = getFlowLineStyle(line, font, lineHeight, lineRenderMode)

        if (renderLine !== undefined) {
          return renderLine({ key, line, text, style })
        }

        return (
          <div key={key} className={lineClassName} style={style}>
            {text}
          </div>
        )
      })}
    </>
  )
}

export { FlowLines }
export type { FlowLineRenderInput, FlowLinesProps, FlowRenderableLine }
