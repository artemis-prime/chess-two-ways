import type Action from '../Action'
import type Move from '../Move'

class Resolution {
  readonly move: Move
  readonly action: Action | null

  constructor(
    move: Move,
    action: Action | null
  ) {
    this.move = move
    this.action = action
  }
}

export { Resolution as default }