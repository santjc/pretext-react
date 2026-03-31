import { forwardRef, useCallback, useEffect } from 'react'
import { useElementWidth } from '../hooks/useElementWidth'
import { usePreparedText, type PrepareOptions } from '../hooks/usePreparedText'
import { usePretextLayout } from '../hooks/usePretextLayout'

type PTextTag = 'p' | 'div' | 'span' | 'h1' | 'h2' | 'h3'

type PTextMeasure = {
  width: number
  height: number
  lineCount: number
}

type PTextOwnProps = {
  as?: PTextTag
  children: string
  font: string
  lineHeight: number
  prepareOptions?: PrepareOptions
  width?: number
  onMeasure?: (result: PTextMeasure) => void
}

type PTextProps = PTextOwnProps & React.HTMLAttributes<HTMLElement>

type PTextElement = HTMLParagraphElement | HTMLDivElement | HTMLSpanElement | HTMLHeadingElement

function assignRef<T>(ref: React.Ref<T> | undefined, value: T) {
  if (typeof ref === 'function') {
    ref(value)
    return
  }

  if (ref) {
    ref.current = value
  }
}

function PTextInner(
  { as, children, font, lineHeight, prepareOptions, width, onMeasure, ...rest }: PTextProps,
  forwardedRef: React.ForwardedRef<PTextElement>,
) {
  const { ref: observedRef, width: observedWidth } = useElementWidth<HTMLElement>()
  const resolvedWidth = width ?? observedWidth
  const { prepared } = usePreparedText({ text: children, font, options: prepareOptions })
  const result = usePretextLayout({ prepared, width: resolvedWidth, lineHeight })

  const composedRef = useCallback(
    (node: HTMLElement | null) => {
      if (width === undefined) {
        observedRef(node)
      }
      assignRef(forwardedRef, node as PTextElement | null)
    },
    [forwardedRef, observedRef, width],
  )

  useEffect(() => {
    if (onMeasure === undefined) {
      return
    }

    onMeasure({
      width: resolvedWidth,
      height: result.height,
      lineCount: result.lineCount,
    })
  }, [onMeasure, resolvedWidth, result.height, result.lineCount])

  const Tag: React.ElementType = as ?? 'p'

  return (
    <Tag ref={composedRef} {...rest}>
      {children}
    </Tag>
  )
}

const PText = forwardRef(PTextInner)

export { PText }
export type { PTextProps, PTextMeasure, PTextTag }
