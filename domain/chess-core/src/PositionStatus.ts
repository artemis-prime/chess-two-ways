import type Action from './Action'
  
  // Should be enough for the UI to give feedback based on these values.
  // (TODO: Consider making this an array of possibly coincident statuses)
type PositionStatus = 
   Action |               // current square resolves to the Action
  'origin' |              // origin of the drag
  'invalid' |             // over this square, but no valid move
  'castleRookFrom' |    // action is 'castle' and this square is the rook's origin in the castle
  'castleRookTo' |      // action is 'castle' and this square is the rook's destination in the castle
  'none' |                // not under in the current drag or involved
  'kingInCheck' | 
  'inCheckFrom'


export { type PositionStatus as default }
