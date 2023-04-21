import { makeObservable, observable } from 'mobx'

import type ObsPieceRef from '../ObsPieceRef'
import type ObsPositionStateRef  from '../ObsPositionStateRef'

import type Piece from '../Piece'
import type Position from '../Position'
import type { File, Rank } from '../Position'
import type PositionState from '../PositionState'

class Square implements 
  Position, 
  ObsPieceRef,
  ObsPositionStateRef
{

  readonly rank: Rank
  readonly file: File
  piece: Piece | null 
  state: PositionState

  constructor(
    rank: Rank, 
    file: File, 
    piece: Piece | null, 
    state: PositionState, 
    observePiece?: boolean
  ) {
    this.rank = rank
    this.file = file
    this.piece = piece
    this.state = state
    
    if (observePiece) {
      makeObservable(this, { 
        piece: observable.shallow,
        state: observable
      })
    }
  }

  static copy(s: Square): Square {
    return new Square(
      s.rank,
      s.file,
      s.piece ? {...s.piece} : null,
      s.state
    )
  }
}

export default Square
