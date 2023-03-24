import { makeObservable, observable } from 'mobx'

import type Square from './Square'
import { squareToString, type Rank, type File } from './Square'
import type Piece from './Piece'
import { pieceToString } from './Piece'

class BoardSquare implements Square {

  rank: Rank
  file: File
  piece: Piece | null 

  constructor(rank: Rank, file: File, piece: Piece | null, observePiece?: boolean) {
    this.rank = rank
    this.file = file
    this.piece = piece
    
    if (observePiece) {
      makeObservable(this, { piece: observable})
    }
  }

  static copy(s: BoardSquare): BoardSquare {
    return new BoardSquare(
      s.rank,
      s.file,
      s.piece ? {...s.piece} : null
    )
  }

  toString = (specifyColor?: boolean): string => {
    const formatForPiece = (specifyColor) ? 'cT' : 'T'
    return (this.piece ? pieceToString(this.piece, formatForPiece) : '') + squareToString(this)
  }
}

export default BoardSquare   
