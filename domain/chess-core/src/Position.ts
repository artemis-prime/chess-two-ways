type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8]
const RANKS_REVERSE: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1]
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 

interface Position {
  readonly rank: Rank
  readonly file: File
}

const positionsEqual = (s1: Position, s2: Position) => (
  !!s1 && !!s2 && (s1.file === s2.file) && (s1.rank === s2.rank)
)

const copyPosition = (toCopy: Position) => ({
  rank: toCopy.rank,
  file: toCopy.file
})

const positionToString = (pos: Position) => (
  `${pos.file}${pos.rank}`  
)

export { 
  type Position as default, 
  type Rank,
  type File,
  RANKS,
  RANKS_REVERSE,
  FILES,
  positionsEqual, 
  copyPosition, 
  positionToString
}
