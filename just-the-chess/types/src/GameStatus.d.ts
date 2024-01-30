import { type Side } from './Piece';
import { type AnnotatedResult } from './ActionRecord';
declare const GAMERESULT_SYMBOLS: {
    victor: {
        white: string;
        black: string;
        draw: string;
    };
    offer: string;
    concession: string;
};
type GameState = 'new' | 'restored' | 'resumed' | 'draw' | 'conceded' | Omit<AnnotatedResult, 'check'>;
declare const STATUS_IN_PLAY: GameState[];
declare const STATUS_ENDED: GameState[];
declare const STATUS_AGREED: GameState[];
declare const STATUS_CAN_UNDO: GameState[];
interface GameStatus {
    readonly state: GameState;
    readonly victor: Side | 'none' | undefined;
}
declare const gameEndingToString: (s: GameStatus) => string | undefined;
declare const gameEndingFromString: (str: string) => GameStatus;
export { type GameStatus as default, gameEndingToString, gameEndingFromString, GAMERESULT_SYMBOLS, STATUS_IN_PLAY, STATUS_ENDED, STATUS_AGREED, STATUS_CAN_UNDO };
