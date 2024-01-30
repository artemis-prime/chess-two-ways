type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
declare const RANKS: Rank[];
declare const RANKS_REVERSED: Rank[];
type File = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h';
declare const FILES: File[];
interface Position {
    readonly rank: Rank;
    readonly file: File;
}
type PositionCode = `${File}${Rank}`;
declare const layoutPositionToBoardPosition: (row: number, column: number, reverse?: boolean) => Position;
declare const positionsEqual: (s1: Position, s2: Position) => boolean;
declare const positionToString: (pos: Position) => PositionCode;
declare const positionFromString: (s: string | null) => Position | null | undefined;
export { type Position as default, type Rank, type File, type PositionCode, RANKS, RANKS_REVERSED, FILES, positionsEqual, positionToString, positionFromString, layoutPositionToBoardPosition };
