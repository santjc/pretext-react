import { useCallback, useEffect, useState } from 'react'

type ElementWidthResult<T extends HTMLElement> = {
  ref: (node: T | null) => void
  width: number
  node: T | null
}

function useElementWidth<T extends HTMLElement = HTMLDivElement>(): ElementWidthResult<T> {
  const [node, setNode] = useState<T | null>(null)
  const [width, setWidth] = useState(0)

  const ref = useCallback((nextNode: T | null) => {
    setWidth(nextNode?.getBoundingClientRect().width ?? 0)
    setNode(nextNode)
  }, [])

  useEffect(() => {
    if (node === null) {
      return
    }

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (entry === undefined) {
        return
      }

      setWidth((currentWidth) => (currentWidth === entry.contentRect.width ? currentWidth : entry.contentRect.width))
    })

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [node])

  return { ref, width, node }
}

export { useElementWidth }
export type { ElementWidthResult }
