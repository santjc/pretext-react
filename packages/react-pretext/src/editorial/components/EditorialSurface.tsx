import type { CSSProperties } from 'react'
import { useMemo } from 'react'
import { useElementWidth } from '../../core/hooks/useElementWidth'
import { usePreparedSegments } from '../../core/hooks/usePreparedSegments'
import type { PrepareOptions } from '../../core/hooks/usePreparedText'
import type { EditorialFigure } from '../lib/editorialFigures'
import { layoutEditorialTrack } from '../lib/layoutEditorialTrack'
import { FlowLines } from './FlowLines'
import { renderResolvedEditorialFigure } from './renderResolvedEditorialFigure'

type EditorialSurfaceProps = {
  text: string
  font: string
  lineHeight: number
  startY?: number
  maxY?: number
  minHeight?: number
  lineRenderMode?: 'natural' | 'justify'
  prepareOptions?: PrepareOptions
  className?: string
  style?: CSSProperties
  figures?: EditorialFigure[]
}

function EditorialSurface({
  text,
  font,
  lineHeight,
  startY = 0,
  maxY,
  minHeight = 320,
  lineRenderMode = 'natural',
  prepareOptions,
  className,
  style,
  figures,
}: EditorialSurfaceProps) {
  const { ref, width } = useElementWidth<HTMLDivElement>()
  const { prepared } = usePreparedSegments({ text, font, options: prepareOptions })

  const baseHeight = Math.max(minHeight, maxY ?? startY + 320)
  const preserveParagraphBreaks = prepareOptions?.whiteSpace === 'pre-wrap'

  const layout = useMemo(() => {
    if (prepared === null || width <= 0) {
      return {
        figures: [],
        body: {
          lines: [],
          height: 0,
        },
      }
    }

    return layoutEditorialTrack({
      prepared,
      figures,
      width,
      height: baseHeight,
      lineHeight,
      startY,
      maxY,
      preserveParagraphBreaks,
    })
  }, [baseHeight, figures, lineHeight, maxY, preserveParagraphBreaks, prepared, startY, width])

  const height = Math.max(baseHeight, startY + layout.body.height)

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: 'relative',
        minHeight: `${height}px`,
        ...style,
      }}
    >
      {layout.figures.map(renderResolvedEditorialFigure)}
      <FlowLines lines={layout.body.lines} font={font} lineHeight={lineHeight} lineRenderMode={lineRenderMode} />
    </div>
  )
}

export { EditorialSurface }
export type { EditorialSurfaceProps }
