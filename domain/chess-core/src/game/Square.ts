import { makeObservable, observable } from 'mobx'

import type ObsPieceRef from '../ObsPieceRef'
import type ObsStatusRef  from '../ObsStatusRef'

import type Piece from '../Piece'
import type Position from '../Position'
import type { File, Rank } from '../Position'
import type PositionStatus from '../PositionStatus'

class Square implements 
  Position, 
  ObsPieceRef,
  ObsStatusRef
{

  readonly rank: Rank
  readonly file: File
  piece: Piece | null 
  status: PositionStatus

  constructor(
    rank: Rank, 
    file: File, 
    piece: Piece | null, 
    status: PositionStatus, 
    observePiece?: boolean
  ) {
    this.rank = rank
    this.file = file
    this.piece = piece
    this.status = status
    
    if (observePiece) {
      makeObservable(this, { 
        piece: observable.shallow,
        status: observable
      })
    }
  }

  static copy(s: Square): Square {
    return new Square(
      s.rank,
      s.file,
      s.piece ? {...s.piece} : null,
      s.status
    )
  }
}

export default Square
