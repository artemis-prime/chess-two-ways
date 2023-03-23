import type { File, Rank } from '../RankAndFile'
import BoardSquare from '../BoardSquare'

type RankSquares = {
  [key in File]: BoardSquare
}

type Squares = {
  [key in Rank]: RankSquares
} 

const deepCopyRankSquares = (rs: RankSquares): RankSquares => {
    const result = {}
    for (const key in rs) {
      result[key] = rs[key] ? BoardSquare.copy(rs[key]) : null // just for shits and giggles. 
    }
    return result as RankSquares
}

const syncSquares = (target: Squares, source: Squares): void => {
  for (const key in source) {
    target[key] = deepCopyRankSquares(source[key])
  }
}

export { type Squares as default, syncSquares}
