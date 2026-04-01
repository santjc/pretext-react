import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

class MockResizeObserver {
  static instances: MockResizeObserver[] = []

  callback: ResizeObserverCallback
  disconnected = false

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback
    MockResizeObserver.instances.push(this)
  }

  observe() {}

  disconnect() {
    this.disconnected = true
  }
}

Object.defineProperty(globalThis, 'ResizeObserver', {
  configurable: true,
  value: MockResizeObserver,
})

const mockMeasureContext = {
  font: '',
  measureText(text: string) {
    let width = 0

    for (let index = 0; index < text.length; index += 1) {
      const character = text[index]

      if (character === ' ') {
        width += 4
        continue
      }

      if (character === '	') {
        width += 16
        continue
      }

      if (character !== undefined && /[A-Z]/.test(character)) {
        width += 10
        continue
      }

      width += 8
    }

    return { width }
  },
}

Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
  configurable: true,
  value: () => mockMeasureContext,
})

export { MockResizeObserver }
