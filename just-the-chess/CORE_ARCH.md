# The Game of Chess


## **Structural domain:** Board, Squares, and Pieces


* The `Game` (the interface to client code) owns a `Board` which wraps a `BoardSquares`. 
* `BoardSquares` is a basically an 8x8 matrix of `Square`s. 
* A `Square` is a `Position`, with a nullable `Piece`, and a `SquareState` 
    * `SquareState`: More on this in the "behavioral" section, but basically the current role of the Square in a move. eg, if its `origin`, the UI can show it slighly dimmed during a drag operation.

* A `Position` is a location on the board (a Rank and a File), whereas a `Square` is the actual holder of state of that slot in `BoardSquares`.
* A `Piece` is a `Side` and a `PieceType`

So, something like this...

```
type Side =
  'black' | 
  'white'

type PieceType =
  'pawn' |
  'queen' |
  'bishop' |
  'rook' |
  'knight' | 
  'king'

interface Piece {
  type: PieceType
  side: Side
} 


interface Position {
  rank: Rank // 1 - 8
  file: File // a - h
}

// within BoardSquares / Board
class Square implements Position {
  readonly rank: Rank 
  readonly file: File 
  occupant: Piece | null  // observable state, if null, Square is empty
  state: SquareState      // observable state ('origin', 'possible move', 'possible capture', etc)
}

```

This should be enough for a UI to render the state of the Chess game at any time

## **Behavior Domain:** Moves, Actions, and Resolutions

The architecture centers around the notion of `Move`s and resolvable `Action`s.  If a pawn moves forward a row (or sometimes two) into an empty square, its "resolved action" is `'move'`.  If it moves forward diagonally into a square occupied by an opponent, it's resolved action is `'capture'`. If it does something else, there is no resolution.

`Resolution` refers to the process of determining an allowable action for a give move by a given piece.  In practice, this might would be determined as a piece is dragged over a new square.  During a drag operation, we're constantly asking,

"Is there an allowable move for this piece to this square?" 

codewise...

```
  // in app code

  onDrag({x, y, payload: {draggingPiece, originSquare}}) {

    const newSquare = squareIfChanged(x, y)
    if (newSquare) {
      game.resolveAction({draggingPiece, originSquare, newSquare})
    }
  }
```

```
  // in core

  interface Move {
    piece: Piece
    from: Position
    to: Position
  }

  type Action = 'move' | 'capture' | 'promote' | 'castle' |  'capturePromote'

  ~~~

  class Game {

    //...
    resolveAction(move: Move): Action | null {
      const resolver = getResolverForType(piece)
      const action = resolver.resolve(move) // returns an allowable Action or null

      this.applyResolution(move, action)
    }
  }

```

`applyResolution` eventually sets `squareState` for this square and other internal state. (And possibly not only for this square. If `Action` is `'castle'`, it involves 4 squares changing state: King's `from` and `to`, and Rook's `from` and `to`!)

Based on `squareState`, the UI can do things like draw a green circle in an allowable empty square being dragged over, or make the opponent's piece thicken and tint its drop shadow, indicating the possible capture. 


## **Reactive UI**

To implement such responses, and render state changes generally, we use the fantastic [`mobx`](https://mobx.js.org/) library. Among other great qualities, it's very conducive to Domain Driven Design since it doesn't impose itself on the architecture.  Unlike with other state management solutions, the thing is handled simply and transparently. For example, there is not notion of a 'Store' per se: any objects or even individual fields of objects can be tracked as `observable`. Just implement the domain, making relevant things `observable`, and the UI will rerender properly. 

This involves beautifully little code. We just wrap a component in `observer`, dereference our `observable`s, and things just work. No store, no reducers, (...well, yes actions, but they're simpler and make more sense)
  

For example, a `Square` above has two `observable` fields, `occupant` and `squareState`. When either of them is changed by the Core, any `SquareComponent` that dereferences them gets rerendered.



```
// in UI's Square.tsx
import { observer } from 'mobx-react'

const SquareComponent: React.FC<{ square: Square }> = observer(({ square }) => 
{
  return (
    <div style={{
      border: (square.squareState === 'move' ? '1px solid green' : 'none') 
      // other styles
    }}>
      {square.occupant && (<PieceComponent piece={square.occupant} state={square.squareState})} />)}
    </div>
  )
})

````

Hopefully this has illustrated the core structural and behavioral patterns in the domain, and how the UI responds to and renders them. For more info, see the [UI Architecture doc here](../UI-COMMON-ARCH.md)

## **Notable Features and Implementation Notes**

### **Undo / Redo support**
There is a stack of `ActionRecord`'s that can be traversed back and forth. An `ActionRecord` can be "applied" to the Game in three modes: `'do' | 'undo' | 'redo'`.  This contains and encapsulates state transitions simply and intuitively.

### **Action Resolution System**
This has been partially discussed above. With Drag and Drop in mind, a move is conceived as follows:

  ```
  // Resolution resulting from resolveAction() for the
  // same move *will be cached* internally until:
  //  1) takeResolvedAction() is called 
  //  2) endResolution() is called 
  // Note that this is a form of debouncing

resolveAction(m: Move): Action | null

takeResolvedAction(): boolean  // action was taken successfully

endResolution(): void  // drag release didnt' happen over a valid target 
```
### **'In Check' Support via a 'scratch' Board** 
Since a given resolvable action may result in the current player putting themselves in check, (or staying in check if they already are), an *in check* check has to be performed on every move.  

  This is done via a 'scratch' `Board"`.  
  1) It's synced to the state of the main `Board`
  2) An `ActionRecord` is applied to it
  3) 'In Check' is tested for. 
  
  This way, game state is kept pure, and the logic are not contaminated with convoluted "if this move..." code.  This seems to be the best way to reuse the same the behavioral mechanisms to determine "would this put / keep you in check?". 

### **Resolver Registry**
There is a registry of `ActionResolver`'s based on piece type.  They live in `game/resolvers`  And are initialized to a `Map` in `game/resolverRegistry.ts`....

```
import pawn from './resolvers/pawn'
import queen from './resolvers/queen' 
import bishop from './resolvers/bishop'
import rook from './resolvers/rook' 
import knight from './resolvers/knight' 
import king from './resolvers/king' 

export default new Map<PieceType, ActionResolver>([
  ['pawn', pawn],
  ['queen', queen],
  ['bishop', bishop],
  ['rook', rook],
  ['knight', knight],
  ['king', king]
])
```

For example, Bishop's resolver looks like this:

```
// game/resolvers/bishop.ts

const resolve = (
  board: Board,
  move: Move
): Action | null => {
  
  if (board.isClearAlongDiagonal(move.from, move.to)) {
    const fromSide = board.getOccupantSide(move.from)
    const toSide = board.getOccupantSide(move.to)
    if (!toSide) {
      return 'move'
    }
    else if (fromSide && toSide && (fromSide !== toSide)) {
      return 'capture'
    }
  }
  return null
}
```

This is a clean way to encapsulate the behavioral pattern per piece type. 

(There are actually two methods in the interface: `resolve(board: Board, m: Move): Action | null` and also `resolvableMoves(board: Board, piece: Piece, from: Position): Position[]`. The latter is used internally to check for checkmate, stalemate, etc.

### **Tracking of Primaries**
 In order to optimize checks for "in check", "checkmate", and "stalemate" the positions of Primary Types (all except 'pawn' and 'king'), are tracked and updated with every move. This lives in `game/board/Tracking.ts`.

### **Persistence**
 The entire Game, including pieces on the board, tracking, undo / redo stack, etc can be stored in a compressed representation, and easily written to / read from JSON files. Each type involved, from `Game` on down, has a pair of `takeSnapshot(): FooSnapshot` and `restoreFromSnapshot(s: FooSnapshot)` funtions that constitute the persistence system.  The JSON is quite human readable since we use a modified version of [LAN (Long Algebraic Notation)](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) to represent actions, locations, etc.

### **Notification System** 
In addition to observing `mobx` state changes, client code can also subscribe to common events and messages by registering a `ChessListener`.  This is convenient for implementing running output of move strings, "you can't do that because you'd be in check" type messages, etc. in the UI.  It looks like this:

```
interface Check {
  side: Side,
  from: Position[],
  kingPosition: Position 
}


interface ChessListener {

  actionResolved(move: Move, action: Action | null): void
  actionTaken(r: ActionRecord): void
  actionUndon(r: ActionRecord): void
  actionRedon(r: ActionRecord): void

    // eg, "You can't castle because your king has moved!"
  message(s: string, type?: string): void 

  inCheck(c: Check): void       
  notInCheck(side: Side): void

}
```

[return to main doc](../README.md)