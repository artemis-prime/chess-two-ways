import type Piece from './Piece';
import type Position from './Position';
interface Move {
    readonly piece: Piece;
    readonly from: Position;
    readonly to: Position;
}
declare const movesEqual: (m1: Move, m2: Move) => boolean;
export { type Move as default, movesEqual };
