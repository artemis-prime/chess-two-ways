type Side = 'black' | 'white';
type PieceType = 'pawn' | 'queen' | 'bishop' | 'rook' | 'knight' | 'king';
type RookSide = 'kingside' | 'queenside';
interface Piece {
    readonly type: PieceType;
    readonly side: Side;
}
type SideCode = 'w' | 'b';
declare const SIDE_FROM_CODE: {
    w: Side;
    b: Side;
};
declare const PRIMARY_PIECETYPES: readonly ["queen", "rook", "bishop", "knight"];
type PrimaryPieceType = (typeof PRIMARY_PIECETYPES)[number];
declare const isPrimaryType: (t: PieceType) => boolean;
declare const PIECETYPE_NAMES: {
    pawn: {
        short: string;
        long: string;
    };
    queen: {
        short: string;
        long: string;
    };
    bishop: {
        short: string;
        long: string;
    };
    rook: {
        short: string;
        long: string;
    };
    knight: {
        short: string;
        long: string;
    };
    king: {
        short: string;
        long: string;
    };
};
declare const PIECETYPE_FROM_CODE: {
    P: string;
    Q: string;
    B: string;
    R: string;
    N: string;
    K: string;
};
type PieceTypeCode = keyof typeof PIECETYPE_FROM_CODE;
type PieceCode = `${SideCode}${PieceTypeCode}`;
declare const isOpponent: (p: Piece | null, side: Side, type?: PieceType | PieceType[]) => boolean;
declare const piecesEqual: (p1: Piece | null, p2: Piece | null) => boolean;
type PieceFormat = 'T' | 'Type' | 'sT' | 's-Type' | 'side Type';
declare const pieceToString: (p: Piece, format?: PieceFormat) => string;
declare const pieceFromCodeString: (s: string) => Piece | undefined;
declare const otherSide: (side: Side) => Side;
export { type Piece as default, type Side, type PieceType, type PrimaryPieceType, type PieceFormat, type PieceTypeCode, type PieceCode, type SideCode, type RookSide, PRIMARY_PIECETYPES, isPrimaryType, SIDE_FROM_CODE, PIECETYPE_NAMES, PIECETYPE_FROM_CODE, piecesEqual, pieceToString, isOpponent, otherSide, pieceFromCodeString };
