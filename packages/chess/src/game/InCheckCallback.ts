import type Square from '../Square'

interface InCheckCallback {
  (kingInCheck: Square | null, inCheckFrom: Square[]): void
} 

export { type InCheckCallback as default }

