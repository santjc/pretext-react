import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { Children, isValidElement } from 'react'
import { getCircleBlockedLineRangeForRow, type BlockedLineRange } from './lineSlots'

type EditorialPlacement =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'

type PEditorialFigureProps = {
  children: ReactNode
  shape: 'circle' | 'rect'
  width: number
  height: number
  placement?: EditorialPlacement
  x?: number
  y?: number
  linePadding?: number
  className?: string
  style?: CSSProperties
}

type ResolvedEditorialFigure = PEditorialFigureProps & {
  x: number
  y: number
}

type EditorialBounds = {
  width: number
  height: number
}

function PEditorialFigure(props: PEditorialFigureProps) {
  void props
  return null
}

PEditorialFigure.displayName = 'PEditorialFigure'

function resolveEditorialPlacement(
  figure: Omit<PEditorialFigureProps, 'children'>,
  bounds: EditorialBounds,
): { x: number; y: number } {
  const placement = figure.placement ?? 'top-right'
  const freeWidth = Math.max(0, bounds.width - figure.width)
  const freeHeight = Math.max(0, bounds.height - figure.height)

  const horizontal = (() => {
    switch (placement) {
      case 'top-left':
      case 'center-left':
      case 'bottom-left':
        return 0
      case 'top-center':
      case 'center':
      case 'bottom-center':
        return freeWidth / 2
      case 'top-right':
      case 'center-right':
      case 'bottom-right':
        return freeWidth
    }
  })()

  const vertical = (() => {
    switch (placement) {
      case 'top-left':
      case 'top-center':
      case 'top-right':
        return 0
      case 'center-left':
      case 'center':
      case 'center-right':
        return freeHeight / 2
      case 'bottom-left':
      case 'bottom-center':
      case 'bottom-right':
        return freeHeight
    }
  })()

  return {
    x: Math.min(Math.max(figure.x ?? horizontal, 0), freeWidth),
    y: Math.min(Math.max(figure.y ?? vertical, 0), freeHeight),
  }
}

function getRectBlockedLineRangeForRow({
  x,
  y,
  width,
  height,
  lineTop,
  lineBottom,
  horizontalPadding = 0,
  verticalPadding = 0,
}: {
  x: number
  y: number
  width: number
  height: number
  lineTop: number
  lineBottom: number
  horizontalPadding?: number
  verticalPadding?: number
}): BlockedLineRange | null {
  const top = y - verticalPadding
  const bottom = y + height + verticalPadding
  if (lineBottom <= top || lineTop >= bottom) {
    return null
  }

  return {
    left: x - horizontalPadding,
    right: x + width + horizontalPadding,
  }
}

function getBlockedLineRangesForEditorialFigures(
  figures: ResolvedEditorialFigure[],
  lineTop: number,
  lineBottom: number,
): BlockedLineRange[] {
  const blocked: BlockedLineRange[] = []

  for (let index = 0; index < figures.length; index += 1) {
    const figure = figures[index]!
    if (figure.shape === 'circle') {
      const range = getCircleBlockedLineRangeForRow({
        cx: figure.x + figure.width / 2,
        cy: figure.y + figure.height / 2,
        radius: Math.min(figure.width, figure.height) / 2,
        lineTop,
        lineBottom,
        horizontalPadding: figure.linePadding ?? 0,
      })

      if (range !== null) {
        blocked.push(range)
      }
      continue
    }

    const range = getRectBlockedLineRangeForRow({
      x: figure.x,
      y: figure.y,
      width: figure.width,
      height: figure.height,
      lineTop,
      lineBottom,
      horizontalPadding: figure.linePadding ?? 0,
    })

    if (range !== null) {
      blocked.push(range)
    }
  }

  return blocked
}

function isPEditorialFigureElement(child: ReactNode): child is ReactElement<PEditorialFigureProps> {
  return isValidElement(child) && child.type === PEditorialFigure
}

function getEditorialFiguresFromChildren(children: ReactNode): ReactElement<PEditorialFigureProps>[] {
  const figures: ReactElement<PEditorialFigureProps>[] = []

  Children.forEach(children, (child) => {
    if (isPEditorialFigureElement(child)) {
      figures.push(child)
      return
    }

    if (child !== null && child !== undefined && child !== false && process.env.NODE_ENV !== 'production') {
      console.warn('Editorial tracks only support direct PEditorialFigure children. Ignored child:', child)
    }
  })

  return figures
}

export {
  PEditorialFigure,
  getEditorialFiguresFromChildren,
  getBlockedLineRangesForEditorialFigures,
  getRectBlockedLineRangeForRow,
  resolveEditorialPlacement,
}
export type { EditorialPlacement, PEditorialFigureProps, ResolvedEditorialFigure, EditorialBounds }
