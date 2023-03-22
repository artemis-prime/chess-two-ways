import type Square from '../Square'
import type Action from '../Action'

interface ActionTakenCallback {
  (action: Action, from: Square, to: Square): void
} 

export { type ActionTakenCallback as default }

