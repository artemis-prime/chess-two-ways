import type { Action, Piece, Position, Move, Resolution } from '../..';
import type Board from '../Board';
declare const _default: {
    resolve: (board: Board, move: Move, messageFn?: ((s: string) => void) | undefined) => Action | null;
    resolvableMoves: (board: Board, piece: Piece, from: Position, ignoreCastling?: boolean | undefined) => Resolution[];
};
export default _default;
