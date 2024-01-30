import type Position from '../Position';
import type SquareState from '../SquareState';
import type Resolution from '../Resolution';
import type Check from '../Check';
declare const getResolutionStateForPosition: (p: Position, res: Resolution | null) => SquareState;
declare const getCheckStateForPosition: (p: Position, check: Check | null) => SquareState;
export { getResolutionStateForPosition, getCheckStateForPosition };
