import type Action from './Action';
type SquareState = Action | // current square resolves to the Action
'origin' | // origin of the drag
'invalid' | // over this square, but no valid move
'castleRookFrom' | // action is 'castle' and this square is the rook's origin
'castleRookTo' | // action is 'castle' and this square is the rook's destination
'none' | // not involved in the current drag
'kingInCheck' | 'inCheckFrom';
export { type SquareState as default };
