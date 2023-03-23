import type { File, Rank } from '../RankAndFile'
import type BoardSquare from '../BoardSquare'
import { copyBoardSquare } from '../BoardSquare'

type RankSquares = {
  [key in File]: BoardSquare
}

type Squares = {
  [key in Rank]: RankSquares
} 

const deepCopyRankSquares = (rs: RankSquares): RankSquares => {
  const result = {}
  for (const key in rs) {
    result[key] = copyBoardSquare(rs[key])
  }
  return result as RankSquares
}

const syncSquares = (target: Squares, source: Squares): void => {
  for (const key in source) {
    target[key] = deepCopyRankSquares(source[key])
  }
}

export { type Squares as default, syncSquares}
