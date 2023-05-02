# The Game of Chess


## **Structural domain:** Board, Squares, and Pieces


* The `Game` (the interface to client code) owns a `Board` which wraps a `BoardSquares`. 
* `BoardSquares` is a basically an 8x8 matrix of `Square`s. 
* A `Square` is a `Position`, with a nullable `Piece`, and a `SquareState` 
    * `SquareState`: More on this in the "behavioral" section, but basically the current role of the Square in a move. eg, if its `origin`, the UI can show it slighly dimmed during a drag operation.

* A `Position` is a location on the board (a Rank and a File), whereas a `Square` is the actual holder of state of that slot in `BoardSquares`.
* A `Piece` is a `Color` and a `PieceType`

So, something like this...

```typescript
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
  color: Color
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

```typescript
  // in app code

  onDrag({x, y, payload: {draggingPiece, originSquare}}) {

    const newSquare = squareIfChanged(x, y)
    if (newSquare) {
      game.resolveAction({draggingPiece, originSquare, newSquare})
    }
  }
```

```typescript
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

`applyResolution` changes `observable` state, likely including `squareState` for this square. (And possibly others, if `Action` is say, `'castle'`. This involves four squares changing: King's `from` and `to`, and Rook's `from` and `to`!)

Reacting to changes in `squareState`, the UI can do things like draw a green circle in an allowable empty square being dragged over, or make the opponent's piece pulse larger with a thicker drop shadow indicating a possible `capture`. 


## **Reactive UI**

To implement such responses, as well render state generally, we use the fantastic [`mobx`](https://mobx.js.org/) library. Among other great qualities, it's very conducive to Domain Driven Design since it doesn't impose itself on the architecture.  Unlike with other state management solutions, its whole approach is simplyemphasizes simplicity and transparency. There is not notion of a 'Store' per se: any objects or even individual fields of objects can be tracked as `observable`. Just implement the domain, making relevant things `observable`, and the UI will render properly. 

And this involves wonderfully little code. We just wrap a component in `observer`, dereference our `observable`s, and things just work. No store, no reducers, (...well, yes 'actions', but they're simpler and make more sense)

A `Square` above has two `observable` fields, `occupant` and `squareState`. When either of them is changed by the core, the `SquareComponent` that dereferences them gets rerendered.

```typescript
import { observer } from 'mobx-react'

const SquareComponent: React.FC<{ square: Square }> = observer(({ square }) => 
{
  return (
    <div style={{
      border: (square.squareState === 'move' ? '1px solid green' : 'none') 
    }}>
      {square.occupant && (<PieceComponent piece={square.occupant} state={square.squareState})} />)}
    </div>
  )
})

```

Hopefully this has illustrated the key structural and behavioral patterns in the domain, as well as how the UI responds to and renders them. For more insight, see the [UI Architecture doc here](../UI-COMMON-ARCH.md)

## **Notable Features and Implementation Choices**

### **Undo / Redo support**
There is a stack of `ActionRecord`'s that can be traversed back and forth. An `ActionRecord` can be "applied" to the Game in three modes: `'do' | 'undo' | 'redo'`.  This contains and encapsulates state transitions simply and intuitively.

### **Action Resolution System**
This has been partially discussed above. With Drag and Drop in mind, a move is conceived as follows:

  * A call to `resolveAction()` provides a resolution.
  * **This is cached** for the same `Move`, until:
  * either `takeResolvedAction()` or `abandonResolution()` are called
  * Note that this is a form of debouncing that avoids running complex piece-specific logic on in response to say, mouse events


```typescript
resolveAction(m: Move): Action | null // result is cached and returned to caller
takeResolvedAction(): boolean         // true if action was taken
abandonResolution(): void             // call if drag was abandoned or finished on an invalid drop target 
```
### **'Put yourself in Check' support via a 'scratch' `Board`** 
Since a given resolvable `Action` could result in a player putting themselves or staying 'in check', we have to check every desired `Action` for this outcome before it's actually resolved. (The other approach would have been each piece being responsible for this on their own in their `resolve()` function, which would have been needlessly complicated.)

So we chose to have a 'scratch' `Board` in addition to the 'real' `Board` specifically for this check. On every attempted resolution,

  1) The scratch `Board` is quickly synced to the exact state of the main `Board`
  2) The same `ActionRecord` that would be "applied" when the action is actually taken, is applied to the scratch `Board`.
  3) Depending on its 'in check' status, the resolution is either allowed or rejected.
  
This may seem cumbersome, but it actually ensures that game state is kept pure, and that core logic isn't needlessly complex. It's just simply rerun on the 'scratch' `Board`. 

### **Resolver Registry**
There is a registry of `ActionResolver`'s based on piece type.  They live in `game/resolvers`  And are initialized to a `Map` in `game/resolverRegistry.ts`....

```typescript
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

```typescript
// game/resolvers/bishop.ts

const resolve = (
  board: Board,
  move: Move
): Action | null => {
  
  if (board.isClearAlongDiagonal(move.from, move.to)) {
    const fromColor = board.colorAt(move.from)
    const toColor = board.colorAt(move.to)
    if (!toColor) {
      return 'move'
    }
    else if (fromColor && toColor && (fromColor !== toColor)) {
      return 'capture'
    }
  }
  return null
}

export { resolve }
```

This is a clean way to encapsulate the behavioral pattern per type of piece. 

(There are actually two methods in the interface: `resolve(board: Board, m: Move): Action | null` and also `resolvableMoves(board: Board, piece: Piece, from: Position): Position[]`. The latter is used internally to check for checkmate and stalemate.

### **Tracking of Primaries**
 In order to optimize the "self in check" process discussed above, as well as "checkmate", and "stalemate", the positions of "Primary Types" --all except 'pawn' and 'king', are tracked and updated with every move. This lives in `game/board/Tracking.ts`.

### **Persistence**
 The entire Game, including pieces on the board, tracking, undo / redo stack, castling eligability, etc., can be converted to a condensed representation, and easily persisted to JSON files. Each type involved, from `Game` on down, has a pair of `takeSnapshot(): FooSnapshot` and `restoreFromSnapshot(s: FooSnapshot)` funtions that constitute the persistence system.  The JSON is quite human readable since we use a modified version of [LAN (Long Algebraic Notation)](https://en.wikipedia.org/wiki/Algebraic_notation_(chess)) to represent actions, locations, etc.

### **Notification System** 
In addition to observing `mobx` state changes, client code can also subscribe to common events and messages by registering a `ChessListener`.  This is convenient for implementing a visual history of standard chess move strings (like "wPh2h3"), or outputing messages from the core, like "That's not possible because you'd be in check". 

```typescript
interface Check {
  side: Side,
  from: Position[],
  kingPosition: Position 
}

interface ActionRecord extends Move {
  action: Action
}

~~~~~~~~~

interface ChessListener {

  actionResolved(move: Move, action: Action | null): void
  actionTaken(r: ActionRecord): void
  actionUndone(r: ActionRecord): void
  actionRedone(r: ActionRecord): void

    // eg, "You can't castle because your king has moved!"
  message(s: string): void 

  inCheck(c: Check): void
  notInCheck(side: Side): void
}
```

[return to main doc](../README.md)