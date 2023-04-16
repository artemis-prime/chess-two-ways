import { type Action } from '@artemis-prime/chess-core'

  // Should be enough for the UI to give feedback based on these values.
  // (TODO: Consider making this an array of possibly coincident statuses)
type SquaresDndStatus = 
  Action |                // current square resolves to the Action
  'origin' |              // origin of the drag
  'invalid' |             // over this square, but no valid move
  'castle-rook-from' |    // action is 'castle' and this square is the rook's origin in the castle
  'castle-rook-to' |      // action is 'castle' and this square is the rook's destination in the castle
  'none'                  // not under in the current drag or involved

export { type SquaresDndStatus as default }
