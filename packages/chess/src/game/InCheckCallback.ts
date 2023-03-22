import type BoardSquare from '../BoardSquare'
import type Square from '../Square'

interface InCheckCallback {
  (kingInCheck: BoardSquare | undefined, inCheckFrom: Square[]): void
} 

export { type InCheckCallback as default }

