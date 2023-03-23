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

const syncTrackingForSide = (target: TrackingForSide, source: TrackingForSide) => {
  const sourceMapAsArray = Array.from(source.primaries)
  const deepArrayCopy = sourceMapAsArray.map(([key, value]) => (
    [key, [...value]]
  ))
  //console.log(deepArrayCopy)
  target.primaries = new Map<PrimaryPieceType, Square[]>(deepArrayCopy as typeof sourceMapAsArray)

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