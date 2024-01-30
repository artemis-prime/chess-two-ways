import Square from '../Square';
import { type PieceCode } from '../../Piece';
import { type File, type PositionCode } from '../../Position';
import type Snapshotable from '../../Snapshotable';
import type Tracking from './Tracking';
type RankSquares = {
    [key in File]: Square;
};
type SquaresSnapshot = {
    [key in PositionCode]?: PieceCode;
};
declare class BoardSquares implements Snapshotable<SquaresSnapshot> {
    1: RankSquares;
    2: RankSquares;
    3: RankSquares;
    4: RankSquares;
    5: RankSquares;
    6: RankSquares;
    7: RankSquares;
    8: RankSquares;
    static visitAsNewGame(sq: Square, tr: Tracking, assignState?: boolean): void;
    static visitWithSnapshot(sq: Square, snapshot: SquaresSnapshot, tracking?: Tracking): void;
    constructor(tr: Tracking, observePieces?: boolean);
    reset(tr: Tracking): void;
    takeSnapshot(): SquaresSnapshot;
    restoreFromSnapshot(snapshot: SquaresSnapshot, tracking?: Tracking): void;
    syncTo(source: BoardSquares): void;
}
export { BoardSquares as default, type SquaresSnapshot };
