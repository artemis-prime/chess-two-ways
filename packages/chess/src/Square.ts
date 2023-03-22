import type { Rank, File } from './RankAndFile'

interface Square {
  readonly rank: Rank
  readonly file: File
}

export { type Square as default }
