import { afterEach, describe, expect, it, vi } from 'vitest'
import { PEditorialTrack, getEditorialTracksFromChildren, getEditorialTracksWidth, resolveEditorialTracks } from './editorialTracks'

describe('editorialTracks', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('collects only editorial track children', () => {
    const tracks = getEditorialTracksFromChildren([
      <PEditorialTrack key="a" width={320} />,
      <div key="b">ignore</div>,
    ])

    expect(tracks).toHaveLength(1)
  })

  it('warns when non-track children are ignored', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    getEditorialTracksFromChildren([
      <PEditorialTrack key="a" width={320} />,
      <div key="b">ignore</div>,
    ])

    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('resolves tracks horizontally with gap', () => {
    const trackElements = getEditorialTracksFromChildren([
      <PEditorialTrack key="a" width={300} />,
      <PEditorialTrack key="b" width={280} />,
    ])

    expect(resolveEditorialTracks(trackElements, 24, 604)).toEqual([
      expect.objectContaining({ width: 300, x: 0 }),
      expect.objectContaining({ width: 280, x: 324 }),
    ])
  })

  it('distributes remaining width with fr tracks', () => {
    const trackElements = getEditorialTracksFromChildren([
      <PEditorialTrack key="a" fr={2} />,
      <PEditorialTrack key="b" fr={1} />,
    ])

    const tracks = resolveEditorialTracks(trackElements, 24, 624)

    expect(tracks[0]!.width).toBeCloseTo(400)
    expect(tracks[1]!.width).toBeCloseTo(200)
    expect(tracks[1]!.x).toBeCloseTo(424)
  })

  it('computes total tracks width including gaps', () => {
    expect(
      getEditorialTracksWidth(
        [
          { width: 300, x: 0 },
          { width: 280, x: 324 },
        ] as never,
        24,
      ),
    ).toBe(604)
  })
})
