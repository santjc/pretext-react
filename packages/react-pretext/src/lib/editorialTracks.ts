import type { CSSProperties, ReactElement, ReactNode } from 'react'
import { Children, isValidElement } from 'react'

type PEditorialTrackProps = {
  width?: number
  fr?: number
  minHeight?: number
  paddingInline?: number
  paddingBlock?: number
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

type ResolvedEditorialTrack = Omit<PEditorialTrackProps, 'width'> & {
  width: number
  x: number
}

function PEditorialTrack(props: PEditorialTrackProps) {
  void props
  return null
}

PEditorialTrack.displayName = 'PEditorialTrack'

function isPEditorialTrackElement(child: ReactNode): child is ReactElement<PEditorialTrackProps> {
  return isValidElement(child) && child.type === PEditorialTrack
}

function getEditorialTracksFromChildren(children: ReactNode): ReactElement<PEditorialTrackProps>[] {
  const tracks: ReactElement<PEditorialTrackProps>[] = []

  Children.forEach(children, (child) => {
    if (isPEditorialTrackElement(child)) {
      tracks.push(child)
      return
    }

    if (child !== null && child !== undefined && child !== false && process.env.NODE_ENV !== 'production') {
      console.warn('PEditorialColumns only supports direct PEditorialTrack children. Ignored child:', child)
    }
  })

  return tracks
}

function resolveEditorialTracks(
  trackElements: ReactElement<PEditorialTrackProps>[],
  gap: number,
  availableWidth: number,
): ResolvedEditorialTrack[] {
  const fixedWidth = trackElements.reduce((total, trackElement) => total + (trackElement.props.width ?? 0), 0)
  const totalGap = Math.max(0, trackElements.length - 1) * gap
  const flexibleTracks = trackElements.filter((trackElement) => trackElement.props.width === undefined)
  const totalFr = flexibleTracks.reduce((total, trackElement) => total + (trackElement.props.fr ?? 1), 0)
  const remainingWidth = Math.max(0, availableWidth - fixedWidth - totalGap)

  let x = 0

  return trackElements.map((trackElement) => {
    const track = trackElement.props
    const resolvedWidth = track.width ?? (totalFr === 0 ? 0 : (remainingWidth * (track.fr ?? 1)) / totalFr)
    const resolved: ResolvedEditorialTrack = {
      ...track,
      width: resolvedWidth,
      x,
    }

    x += resolvedWidth + gap
    return resolved
  })
}

function getEditorialTracksWidth(tracks: ResolvedEditorialTrack[], gap: number): number {
  if (tracks.length === 0) {
    return 0
  }

  return tracks.reduce((total, track) => total + track.width, 0) + gap * (tracks.length - 1)
}

export { PEditorialTrack, getEditorialTracksFromChildren, resolveEditorialTracks, getEditorialTracksWidth }
export type { PEditorialTrackProps, ResolvedEditorialTrack }
