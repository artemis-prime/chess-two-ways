import type ObsSquare from '../ObsSquare';
import type Piece from '../Piece';
import type { File, Rank } from '../Position';
import type SquareState from '../SquareState';
declare class Square implements ObsSquare {
    readonly rank: Rank;
    readonly file: File;
    occupant: Piece | null;
    state: SquareState;
    constructor(rank: Rank, file: File, occupant: Piece | null, squareState: SquareState, observeState?: boolean);
    setOccupant(p: Piece | null): void;
    setSquareState(s: SquareState): void;
    get piece(): Piece | null;
    get squareState(): SquareState;
    clone(): Square;
}
export default Square;
