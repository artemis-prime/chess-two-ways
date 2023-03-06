import { File, Rank } from './RankAndFile'
import BoardSquare from './BoardSquare'

type RankSquares = {
  [key in File]: BoardSquare
}

type Board = {
  [key in Rank]: RankSquares
} 

export default Board