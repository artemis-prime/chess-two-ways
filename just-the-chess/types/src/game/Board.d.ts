import ActionRecord, { type ActionMode } from '../ActionRecord';
import type Check from '../Check';
import { type default as Piece, type PrimaryPieceType, type Side, type RookSide } from '../Piece';
import type Position from '../Position';
import type Snapshotable from '../Snapshotable';
import Square from './Square';
import type ObsSquare from '../ObsSquare';
import type IsCaptureFn from './IsCaptureFn';
import { type TrackingSnapshot } from './board/Tracking';
import { type SquaresSnapshot } from './board/BoardSquares';
interface Board {
    getOccupant(pos: Position): Piece | null;
    getOccupantSide(pos: Position): Side | null;
    positionCanBeCaptured(pos: Position, captured: Side): boolean;
    eligableToCastle(side: Side, castleSide: RookSide): boolean;
    cannotCastleBecause(side: Side, castleSide: RookSide): string | null;
    isClearAlongRank(from: Position, to: Position): boolean;
    isClearAlongFile(from: Position, to: Position): boolean;
    isClearAlongDiagonal(from: Position, to: Position): boolean;
}
interface BoardSnapshot {
    squares: SquaresSnapshot;
    tracking: TrackingSnapshot | null;
}
interface BoardInternal extends Board, Snapshotable<BoardSnapshot> {
    applyAction(r: ActionRecord, mode: ActionMode): void;
    takeSnapshot(): BoardSnapshot;
    restoreFromSnapshot(board: BoardSnapshot): void;
    syncTo(other: BoardInternal): void;
    primaryPositions(side: Side, type: PrimaryPieceType): Position[];
    pawnPositions(side: Side): Position[];
    get check(): Check | null;
    kingPosition(side: Side): Position;
    reset(isObservable?: boolean): void;
    get asSquares(): Square[];
    get asSquareDescs(): ObsSquare[];
}
declare const createBoard: (f: IsCaptureFn, isObservable?: boolean) => BoardInternal;
export { type Board as default, type BoardInternal, type BoardSnapshot, createBoard };
