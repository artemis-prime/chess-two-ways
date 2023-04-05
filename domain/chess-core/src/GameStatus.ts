import {type Side} from './Piece'

interface GameStatus {

    // https://www.britannica.com/topic/chess
    // For our purposes, 'draw' covers anything but 'stalemate', 
    // and is set by user action (not calculated) 
  readonly status: 'new' | 'playing' | 'concession' | 'checkmate' | 'stalemate' | 'draw'
    // 'none' if 'stalemate' or 'draw'; undefined if 'playing'
  readonly victor: Side | 'none' | undefined 
}

export { type GameStatus as default } 