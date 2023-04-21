import {type Side} from './Piece'

  // https://www.britannica.com/topic/chess
  // For our purposes, 'draw' covers anything but 'stalemate', 
  // and is set by user action (not calculated) 
type GameState = 'new' | 'restored' |'resumed' | 'conceded' | 'checkmate' | 'stalemate' | 'draw'

const STATUS_IN_PLAY = ['new', 'restored', 'resumed'] as GameState[]
const STATUS_NOT_IN_PLAY = ['conceded', 'checkmate', 'stalemate', 'draw'] as GameState[]
const STATUS_CAN_UNDO = [...STATUS_IN_PLAY, 'checkmate', 'stalemate'] as GameState[]

interface GameStatus {

  readonly state: GameState
    // 'none' if 'stalemate' or 'draw'; undefined if 'playing'
  readonly victor: Side | 'none' | undefined 
}

export { 
  type GameStatus as default,
  STATUS_IN_PLAY,
  STATUS_NOT_IN_PLAY,
  STATUS_CAN_UNDO
} 