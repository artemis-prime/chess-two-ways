import type { PrimaryPieceType } from '../Piece'
import type Square from '../Square'

interface TrackingForSide {
  primaries: Map<PrimaryPieceType, Square[]>
  king: Square
  castling: {
    hasCastled: boolean,
    kingHasMoved: boolean
    rookHasMoved: {
      kingside: boolean
      queenside: boolean
    }
  }
}


class Tracking {

  white: TrackingForSide = {
    primaries: new Map<PrimaryPieceType, Square[]>(),
    king: {rank: 1, file: 'e'},
    castling: {
      hasCastled: false,
      kingHasMoved: false,
      rookHasMoved: {
        kingside: false,
        queenside: false
      } 
    }
  }

  black: TrackingForSide = {
    primaries: new Map<PrimaryPieceType, Square[]>(),
    king: {rank: 8, file: 'e'},
    castling: {
      hasCastled: false,
      kingHasMoved: false,
      rookHasMoved: {
        kingside: false,
        queenside: false
      } 
    }
  }
}

const newTracking = () => {
  return new Tracking()
}

export { type Tracking, newTracking }