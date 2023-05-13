import {type Side} from './Piece'

type MoveResult =  'checkmate' | 'stalemate' |  'check'

const MOVERESULT_FROM_SYMBOL = {
  check: '+',
  checkmate: '#',
  stalemate: '==',
} as {[key in MoveResult]: string}

const MOVERESULT_SYMBOLS = Object.values(MOVERESULT_FROM_SYMBOL)
const MOVERESULTS = Object.keys(MOVERESULT_FROM_SYMBOL) as MoveResult[]

const GAMERESULT_SYMBOLS = {
  victor: {
    white: '0-1',
    black: '1-0',
    draw: '='
  },
  agreement: ' (agr.)'
}

  // https://www.britannica.com/topic/chess
  // For our purposes, 'draw' covers anything but 'stalemate', 
  // and is set by user action (not calculated) 
type GameState = 'new' | 'restored' |'resumed' | 'draw' | 'conceded' | Omit<MoveResult, 'check'>

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
  type MoveResult,
  MOVERESULT_FROM_SYMBOL,
  MOVERESULT_SYMBOLS,
  MOVERESULTS,
  GAMERESULT_SYMBOLS,
  STATUS_IN_PLAY,
  STATUS_NOT_IN_PLAY,
  STATUS_CAN_UNDO
} 