import type Square from '../Square'

interface InCheckCallback {
  (kingInCheck: Square | undefined, inCheckFrom: Square[]): void
} 

export { type InCheckCallback as default }

