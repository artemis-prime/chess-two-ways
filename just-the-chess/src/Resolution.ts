import type Action from './Action'
import type Move from './Move'

  // Used to represent two notions:
  // 1) a resolved move - action could be null 
  // 2) a resolvable move - action will *not* be null
interface Resolution {
  readonly move: Move
  readonly action: Action | null
}

export { type Resolution as default }