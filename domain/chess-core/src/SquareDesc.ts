import type ObsPieceRef from './ObsPieceRef'
import type ObsStatusRef from './ObsStatusRef'
import type Position from './Position'

interface SquareDesc {
  position: Position
  pieceRef: ObsPieceRef
  statusRef: ObsStatusRef 
}

export { type SquareDesc as default }