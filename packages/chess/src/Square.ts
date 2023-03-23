import type { Rank, File } from './RankAndFile'

interface Square {
  readonly rank: Rank
  readonly file: File
}

const squaresEqual = (s1: Square, s2: Square) => (
  (s1.file === s2.file) && (s1.rank === s2.rank)
)

  // some are instance of BoardSquare in certain case. 
  // we don't want strays.
const copySquare = (toCopy: Square) => ({
  rank: toCopy.rank,
  file: toCopy.file
})

const squareToString = (sq: Square) => (
  `${sq.file}${sq.rank}`  
)

export { type Square as default, squaresEqual, copySquare, squareToString}
