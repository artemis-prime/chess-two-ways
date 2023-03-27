type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8]
const RANKS_REVERSE: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1]
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 

interface Square {
  readonly rank: Rank
  readonly file: File
}

const squaresEqual = (s1: Square, s2: Square) => (
  !!s1 && !!s2 && (s1.file === s2.file) && (s1.rank === s2.rank)
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

export { 
  type Square as default, 
  type Rank,
  type File,
  RANKS,
  RANKS_REVERSE,
  FILES,
  squaresEqual, 
  copySquare, 
  squareToString
}
