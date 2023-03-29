import type { PrimaryPieceType } from '../Piece'
import type Position from '../Position'

interface TrackingForSide {
  primaries: Map<PrimaryPieceType, Position[]>
  king: Position,
  inCheck: boolean,
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
    primaries: new Map<PrimaryPieceType, Position[]>(),
    king: {rank: 1, file: 'e'},
    inCheck: false,
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
    primaries: new Map<PrimaryPieceType, Position[]>(),
    king: {rank: 8, file: 'e'},
    inCheck: false,
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

const syncTrackingForSide = (target: TrackingForSide, source: TrackingForSide) => {
  const sourceMapAsArray = Array.from(source.primaries)
  const deepArrayCopy = sourceMapAsArray.map(([key, value]) => (
    [key, [...value]]
  ))
  target.primaries = new Map<PrimaryPieceType, Position[]>(deepArrayCopy as typeof sourceMapAsArray)
  target.inCheck = source.inCheck
  target.king = source.king
  target.castling.hasCastled = source.castling.hasCastled 
  target.castling.kingHasMoved = source.castling.kingHasMoved 
  Object.assign(target.castling.rookHasMoved, source.castling.rookHasMoved)
}

const syncTracking = (target: Tracking, source: Tracking) => {
  syncTrackingForSide(target.white, source.white)
  syncTrackingForSide(target.black, source.black)
}

export { type Tracking, newTracking, syncTracking }