import type ChessListener from '../ChessListener';
import type Action from '../Action';
import type { Side } from '../Piece';
import type Move from '../Move';
import ActionRecord, { type ActionMode } from '../ActionRecord';
import type GameStatus from '../GameStatus';
import type Check from '../Check';
declare class Notifier implements ChessListener {
    private _listeners;
    constructor();
    registerListener(l: ChessListener, uniqueId: string): void;
    unregisterListener(uniqueId: string): void;
    actionResolved(move: Move, action: Action | null): void;
    actionTaken(r: ActionRecord, mode: ActionMode): void;
    actionsRestored(recs: readonly ActionRecord[]): void;
    messageSent(s: string, type?: string): void;
    inCheck(c: Check): void;
    notInCheck(side: Side): void;
    gameStatusChanged(s: GameStatus): void;
}
export { Notifier as default };
