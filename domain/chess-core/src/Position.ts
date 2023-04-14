type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8]
const RANKS_REVERSE: Rank[] = [8, 7, 6, 5, 4, 3, 2, 1]
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h'
const FILES: File[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] 
const FILES_REVERSE: File[] = ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] 

interface Position {
  readonly rank: Rank
  readonly file: File
}

const layoutPositionToBoardPosition = (row: number, column: number, reverse = false): Position => {
  return reverse ? 
  {
    rank: RANKS[row],
    file: FILES_REVERSE[column]
  }
  :
  {
    rank: RANKS_REVERSE[row],
    file: FILES[column]
  }
}

const positionsEqual = (s1: Position, s2: Position): boolean => (
  !!s1 && !!s2 && (s1.file === s2.file) && (s1.rank === s2.rank)
)

const copyPosition = (toCopy: Position): Position => ({
  rank: toCopy.rank,
  file: toCopy.file
})

const positionToString = (pos: Position): string => (
  `${pos.file}${pos.rank}`  
)

const positionFromString = (s: string): Position | undefined => {
  if (s.length === 2) {
    const f = s.slice(0, 1)
    const r = +s.slice(1, 2)

    if (!(RANKS as number[]).includes(r) || !(FILES as string[]).includes(f)) {
      return undefined
    }
    return {
      file: f as File,
      rank: r as Rank,
    }
  }
  return undefined
}

export { 
  type Position as default, 
  type Rank,
  type File,
  RANKS,
  RANKS_REVERSE,
  FILES,
  positionsEqual, 
  copyPosition, 
  positionToString,
  positionFromString,
  layoutPositionToBoardPosition
}
