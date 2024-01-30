import type Piece from './Piece';
interface ObsPieceRef {
    get piece(): Piece | null;
}
export { type ObsPieceRef as default };
