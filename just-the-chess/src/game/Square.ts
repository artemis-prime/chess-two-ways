import { makeObservable, observable, action } from 'mobx'

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
        piece: observable,
        state: observable,
        setPiece: action,
        setPositionState: action
      })
    }
  }

  setPiece(p: Piece | null): void {
    this.piece = p
  }

  setPositionState(s: PositionState): void {
    this.state = s 
  }

  clone(): Square {
    return new Square(
      this.rank,
      this.file,
      this.piece ? {...this.piece} : null,
      this.state
    )
  }
}

export default Square
