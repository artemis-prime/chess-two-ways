import { type IReactionDisposer } from 'mobx';
import type Action from './Action';
import ActionRecord from './ActionRecord';
import type { BoardSnapshot } from './game/Board';
import type Check from './Check';
import type ChessListener from './ChessListener';
import type GameStatus from './GameStatus';
import type Move from './Move';
import type Piece from './Piece';
import { type Side, type SideCode } from './Piece';
import type Position from './Position';
import type ObsSquare from './ObsSquare';
import type Snapshotable from './Snapshotable';
interface GameSnapshot {
    artemisPrimeChessGame: any;
    board: BoardSnapshot;
    actions?: string[];
    currentTurn: SideCode;
    gameEnding?: string;
}
interface Game extends Snapshotable<GameSnapshot> {
    resolveAction(m: Move): Action | null;
    takeResolvedAction(): boolean;
    abandonResolution(): void;
    get canUndo(): boolean;
    get canRedo(): boolean;
    undo(): void;
    redo(): void;
    reset(): void;
    offerADraw(): void;
    concede(): void;
    takeSnapshot(): GameSnapshot;
    restoreFromSnapshot(g: GameSnapshot): void;
    getOccupant(p: Position): Piece | null;
    get gameStatus(): GameStatus;
    get playing(): boolean;
    get currentTurn(): Side;
    get check(): Check | null;
    get actions(): ActionRecord[];
    get actionIndex(): number;
    registerListener(l: ChessListener, uniqueId: string): void;
    unregisterListener(uniqueId: string): void;
    getBoardAsArray(reverse: boolean): ObsSquare[];
}
declare class GameImpl implements Game {
    static currentInstance: GameImpl;
    private _board;
    private _scratchBoard;
    private _currentTurn;
    private _gameStatus;
    private _resolvers;
    private _actions;
    private _stateIndex;
    private _resolution;
    private _notifier;
    constructor();
    registerReactions(): IReactionDisposer[];
    get gameStatus(): GameStatus;
    get actions(): ActionRecord[];
    get actionIndex(): number;
    get playing(): boolean;
    private get statusAllowsUndoRedo();
    getOccupant(p: Position): Piece | null;
    getBoardAsArray: (whiteOnBottom: boolean) => ObsSquare[];
    offerADraw(): void;
    concede(): void;
    reset(): void;
    restoreFromSnapshot(g: GameSnapshot): Promise<void>;
    takeSnapshot(): GameSnapshot;
    get check(): Check | null;
    get currentTurn(): Side;
    registerListener(l: ChessListener, uniqueId: string): void;
    unregisterListener(uniqueId: string): void;
    private _isCapture;
    resolveAction(move: Move): Action | null;
    abandonResolution(): void;
    takeResolvedAction(): boolean;
    get canUndo(): boolean;
    undo(): void;
    get canRedo(): boolean;
    redo(): void;
    private _applyResolution;
    private _applyInCheck;
    private _getCaptured;
    private _resolvableMovesDontAllResultInCheck;
    private _kingCanMove;
    private _primariesCanMove;
    private _pawnsCanMove;
    private _notifyCheckForSide;
    private _notifyCheck;
    private _checkForCheckmate;
    private _checkStalemate;
    private _toggleTurn;
}
declare const getGameSingleton: () => GameImpl;
export { getGameSingleton, type Game as default, type GameSnapshot };
