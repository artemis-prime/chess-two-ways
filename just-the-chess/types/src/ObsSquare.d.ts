import type ObsPieceRef from './ObsPieceRef';
import type ObsSquareStateRef from './ObsSquareStateRef';
import type Position from './Position';
interface ObsSquare extends Position, ObsPieceRef, ObsSquareStateRef {
}
export { type ObsSquare as default };
