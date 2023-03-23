import type Square from '../Square'
import type Action from '../Action'

interface ActionResolvedCallback {
  (action: Action | null, from: Square, to: Square): void
} 

export { type ActionResolvedCallback as default }

