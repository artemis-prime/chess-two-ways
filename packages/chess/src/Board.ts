import type { File, Rank } from './RankAndFile'
import type BoardSquare from './BoardSquare'

type RankSquares = {
  [key in File]: BoardSquare
}

type Board = {
  [key in Rank]: RankSquares
} 

export default Board