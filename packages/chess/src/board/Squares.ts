import type { File, Rank } from '../RankAndFile'
import type BoardSquare from '../BoardSquare'

type RankSquares = {
  [key in File]: BoardSquare
}

type Squares = {
  [key in Rank]: RankSquares
} 

export { type Squares as default }
