import { makeObservable, observable } from 'mobx'

import type Position from './Position'
import { positionToString, type Rank, type File } from './Position'
import type Piece from './Piece'
import { pieceToString } from './Piece'

class Square implements Position {

  readonly rank: Rank
  readonly file: File
  piece: Piece | null 

  constructor(rank: Rank, file: File, piece: Piece | null, observePiece?: boolean) {
    this.rank = rank
    this.file = file
    this.piece = piece
    
    if (observePiece) {
      makeObservable(this, { piece: observable.shallow})
    }
  }

  static copy(s: Square): Square {
    return new Square(
      s.rank,
      s.file,
      s.piece ? {...s.piece} : null
    )
  }

  toString = (specifyColor?: boolean): string => {
    const formatForPiece = (specifyColor) ? 'cT' : 'T'
    return (this.piece ? pieceToString(this.piece, formatForPiece) : '') + positionToString(this)
  }
}

export default Square   
