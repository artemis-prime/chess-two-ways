import type { PrimaryPieceType } from '../Piece'
import type BoardSquare from '../BoardSquare'

interface TrackingForSide {
  primaries: Map<PrimaryPieceType, BoardSquare[]>
  king: BoardSquare
  kingHasMoved: boolean
  rookHasMoved: {
    kingside: boolean
    queenside: boolean
  }
}


class Tracking {

  white: TrackingForSide = {
    primaries: new Map<PrimaryPieceType, BoardSquare[]>(),
    king: {rank: 1, file: 'e', piece: { type: 'king', color: 'white'}},
    kingHasMoved: false,
    rookHasMoved: {
      kingside: false,
      queenside: false
    } 
  }

  black: TrackingForSide = {
    primaries: new Map<PrimaryPieceType, BoardSquare[]>(),
    king: {rank: 8, file: 'e', piece: { type: 'king', color: 'black'}},
    kingHasMoved: false,
    rookHasMoved: {
      kingside: false,
      queenside: false
    } 
  }

}

const newTracking = () => {
  return new Tracking()
}

export { type Tracking, newTracking }