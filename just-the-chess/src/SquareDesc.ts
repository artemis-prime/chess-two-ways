import type ObsPieceRef from './ObsPieceRef'
import type ObsPositionStateRef from './ObsPositionStateRef'
import type Position from './Position'

  // Piece and Square rendering components are passed a SquareDesc.
  // This has the (immutable) Position plus two observable references:
  // one for Piece and one for PositionState.  
  // That way, impl of board state stays hidden and encapsulated, 
  // while dereferencing of observables is encouraged to be 
  // inside the correct observer.
interface SquareDesc {
  position: Position
  pieceRef: ObsPieceRef
  posStateRef: ObsPositionStateRef 
}

export { type SquareDesc as default }