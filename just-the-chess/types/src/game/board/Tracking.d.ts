import type { ActionMode } from '../../ActionRecord';
import type CastlingTracking from '../../CastlingTracking';
import type Move from '../../Move';
import type Position from '../../Position';
import type Piece from '../../Piece';
import { type PrimaryPieceType, type Side, type RookSide } from '../../Piece';
import { type PositionCode } from '../../Position';
import type Snapshotable from '../../Snapshotable';
interface TrackingForSideSnapshot {
    king: PositionCode;
    primaries: {
        queen: PositionCode[];
        bishop: PositionCode[];
        knight: PositionCode[];
        rook: {
            kingside: {
                position: PositionCode | null;
                capturePos: PositionCode | null;
            };
            queenside: {
                position: PositionCode | null;
                capturePos: PositionCode | null;
            };
        };
    };
    inCheckFrom: PositionCode[];
    castling: CastlingTracking;
}
interface TrackingSnapshot {
    white: TrackingForSideSnapshot;
    black: TrackingForSideSnapshot;
}
declare class CastlingTrackingInternal implements CastlingTracking, Snapshotable<CastlingTracking> {
    hasCastled: boolean;
    kingMoveCount: number;
    rookMoveCounts: {
        kingside: number;
        queenside: number;
    };
    constructor();
    reset(): void;
    syncTo(source: CastlingTrackingInternal): void;
    restoreFromSnapshot(snapshot: CastlingTracking): void;
    takeSnapshot(): CastlingTracking;
}
type RookTracking = {
    position: Position | null;
    capturePos: Position | undefined;
};
declare class TrackingForSide implements Snapshotable<TrackingForSideSnapshot> {
    king: Position;
    private primaries;
    inCheckFrom: Position[];
    castling: CastlingTrackingInternal;
    constructor(side: Side, _observable?: boolean);
    reset(side: Side): void;
    clearRookTracking(): void;
    takeSnapshot(): TrackingForSideSnapshot;
    restoreFromSnapshot(snapshot: TrackingForSideSnapshot): void;
    syncTo(source: TrackingForSide): void;
    private _rookSideFromPosition;
    private _rookSideFromCapturePos;
    getPrimaryTypePositions(t: PrimaryPieceType): Position[];
    getRookTracking(rookSide: RookSide): RookTracking;
    trackPositionChange(m: Move, mode: ActionMode): void;
    trackCapture(piece: Piece, pos: Position, mode: ActionMode): void;
    trackPromotion(pos: Position, mode: ActionMode): void;
    trackCastle(m: Move, mode: ActionMode): void;
    trackAsReset(piece: Piece, pos: Position): void;
    trackAsRestore(piece: Piece, pos: Position): void;
}
declare class Tracking implements Snapshotable<TrackingSnapshot> {
    white: TrackingForSide;
    black: TrackingForSide;
    constructor(observeMe?: boolean);
    reset(): void;
    syncTo(source: Tracking): void;
    takeSnapshot(): TrackingSnapshot;
    restoreFromSnapshot(snapshot: TrackingSnapshot): void;
}
export { Tracking as default, type TrackingSnapshot };
