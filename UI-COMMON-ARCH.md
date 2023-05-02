# UI Architecture (common)

We can have a document like this precisely because an effort was made to keep the UI *architecture* similar if not the same.  Ultimately React is React, whether Native or Web, so organizing an app shouldn't have to differ from one to the other.

## Main Organization

* `app`: the specific implementation of the app UI itself, including the layout, domain-specific feature components, special widgets, etc.
* `primatives`: common components that are not domain-specific and likely reused in many places in the app. These would include general UI elements like `Button`, `Dialog`, `Drawer` etc. 
* `services`: all cross-cutting concerns, React `Context`s / `Provider`s, hooks, etc.
* `styles`: anything style or theming realated.

We've found that this kind of organization is a clean, simple, and easily understood way to organize UI code.  **In an app where the domain code is in the same tree (a non-monorepo), there would also be a `domain` directory.** It would contain the equivalent of what `just-the-chess` has in our repo.  (See the [Core Architecture documentation](./just-the-chess/CORE_ARCH.md) for more on that)

## Stitches: Look Ma, no framework.

Over time, we've found that the use of heavy, "complete" frameworks like [Material UI](https://mui.com/) can be a double-edged sword. If we want a UI that is in line with the basic design concepts of a framework, its use can ease things dramatically.  On the other hand, if want something more custom or only have a few common variants of components we need to use, we can spend a lot of time fighting (aka, "customizing") the framework just to achieve simple goals. This is often made less obvious by the mere fact of gaining of a theming mechanism, which on first approach seems like such a huge advantage. But over time, this may not be how the tradeoffs actually playing out!

Enter [Stitches](https://stitches.dev/). Stitches (and it's excellent [React Native port](https://github.com/Temzasse/stitches-native)) has truly managed to find a sweetspot between utter simplicity and necessary power. With it, we can quickly create useful styled components while not burdening our project with design assumptions we don't need, or layers of styling code to learn. And in the time saved, we can easily develop the `primatives` we actually need!

It has many features, but truly shines in two areas:

### **theming**
 Stitches theming provides a way to create *any set of desired design tokens* **and** a simple way to apply them to any styled component (via the '$' notation below)

```typescript
const { styled } = createStitches({
  theme: {
    colors: {
      hiContrast: 'hsl(206,10%,5%)',
      loContrast: 'white',

      gray100: 'hsl(206,22%,99%)',
      gray200: 'hsl(206,12%,97%)',
      gray300: 'hsl(206,11%,92%)',
    },
  },
  space: {
    sm: '4px',
    md: '8px'
    lg: '12px,
  },
  fonts: {},
  // etc
})

export { styled }

~~~~~~~~

import { styled } from 'styles/stitches.config'

const MyComponent = styled('div', {
  backgroundColor: '$gray300'
  padding: '$sm'
})

```

### **style / prop variants**
This is a unique and powerful way of specifying component level props right from within a style block. 

```typescript
const Button = styled('button', {

  // other common styles
  variants: {
    type: {
      alert: {
        backgroundColor: '$orange11',
        color: 'white',
        '&:hover': {
          backgroundColor: '$orange5',
        },
      },
      common: {
        backgroundColor: '$gray11',
        color: '#111',
        '&:hover': {
          backgroundColor: '$gray4',
        },
      },
      // other types
    },
  },
})

() => <Button type='alert'>an orange button</Button>
```

This has proven to be a very powerful and convenient mechanism when dealing with UI variants that respond to domain-specific states or types.  For example, in our [core architecture](./just-the-chess/CORE_ARCH.md), `Action`s such as `'move'` or `'capture'` can have corresponding prop variants that say, determine the appearance of a square.

## Key Implementation and Use of Domain

### **Square and Piece components**
As mentioned in the [core architecture doc](./just-the-chess/CORE_ARCH.md), the core provides observable state for a `Square` which enables the UI to render their state. These are `occupant` and `squareState`

This allows for a `SquareComponent` component to provide feedback based on `squareState`, by translating it into internal effects variants, some of which correspond directly to `Action`s and some of which are variants of them:

```typescript
// edited for clarity

const SquareComponent: React.FC<{
  square: Square 
}> = observer(({
  square
}) => {

  const pulse = usePulse() // alternating ticks from a setInterval() for pulsing effects

  const getEffectFromState = (state: SquareState): EffectVariant  => {
    if (state === 'castleRookFrom') {
      return pulse.on ? state : 'castleRookFromPulse' 
    }
    else if (state === 'castleRookTo') {
      return !pulse.on ? state : 'castleRookToPulse' 
    }
    else if (state.includes('romote')) {
      if (pulse.on) {
        return undefined
      }
    }
    else if ([
      'origin',
      'invalid',
      'none',
      'kingInCheck',
      'inCheckFrom',
      'capture'
    ].includes(state as string)) {
      return undefined
    }
      // pass others through as they are
    return state as EffectVariant 
  }

  return (
    <SquareEffectsView effect={getEffectFromState(square.squareState)} >
      <PieceComponent square={square} />  
    </SquareEffectsView>
  )
})

```

SquareEffectsView implements the square's state effects:

```typescript
const SquareEffectsView = styled('div', {
    // common styles
  variants: {
    effect: {
      move: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promote: {
        border: '1px yellow solid'
      },
      castle: {
        borderRadius: '50%',
        border: '2px green solid'
      },
      promoteCapture: {
        border: '1px yellow solid'
      },
      castleRookFrom: {
        border: '1px darkgreen solid' 
      },
      castleRookTo: {
        border: '1px darkgreen solid' 
      },
      castleRookFromPulse: {
        border: '3px darkgreen solid' 
      },
      castleRookToPulse: {
        border: '3px darkgreen solid' 
      },
    }
  }
})

```

`PieceComponent` follows a similar pattern:

```typescript
// edited for clarity
const PieceComponent: React.FC<{
  square: Square 
}> = observer(({
  square
}) => {

  const game = useGame()
  const pulse = usePulse()

  const canDrag = square.occupant && game.currentTurn === square.occupant.color

  const getEffectFromState = (state: SquareState): EffectVariant => {
    if (state.includes('capture')) {
      return pulse.on ? 'capture' : 'capturePulse' 
    }
      // These next two should alternate their pulse effect 
    else if (state === 'kingInCheck') {
      return pulse.on ? 'kingInCheck' : 'kingInCheckPulse' 
    }
    else if (state === 'inCheckFrom') {
      return !pulse.on ? 'inCheckFrom' : 'inCheckFromPulse' 
    }
    return undefined 
  }

    // get specific renderer by piece type
  const SpecificPiece = registry.get(square.occupant.type) 

    // dim me if I'm the origin of the drag
    // set cursor based on dragability and state
  return (
    <PieceEffectsView 
      side={square.occupant.side}
      effect={getEffectFromState(square.squareState)}
      css={{
        opacity: (square.squareState === 'origin' ? 0.5 : 1), 
        cursor: canDrag ? (square.squareState === 'origin' ? 'move' : 'pointer') : 'default',
      }}
    >
      <SpecificPiece />
    </PieceEffectsView>
  )
})
```

The `PieceEffectsView` in this case contains Stitches *compound variants* that vary the size and drop shadow of the piece. For example, these represent the pulsing effect of the black King when its in check. 

Pulsing between:

normalish <--> slightly larger with a bigger reddish drop shadow

(Note that here, `color: 'black'` means the `Piece`'s color, not a css color value)

```typescript
    {
      color: 'black', 
      effect: 'kingInCheck',
      css: {
        '& svg': {
          filter: 'drop-shadow(1px 4px 2px rgb(0 0 0 / 0.2))'
        }  
      }
    },
    {
      color: 'black',
      effect: 'kingInCheckPulse',
      css: {
        '& svg': {
          filter: 'drop-shadow(2px 4px 8px rgb(145, 23, 2))',
          transform: 'scale(1.1)'
        }  
      }
    },
 ```

### **Drag and Drop and the Core**

Because of how we have [architected the core](./just-the-chess/CORE_ARCH.md), the DnD code's only job is to ask to resolve `Action`s as a square is hovered over, and take the `Action` on drop.

<image src='./ui-core-interaction-dnd.png' width='70%'/>

There is a very similar module called `ChessDnDShell` that wraps the `Board` component **on both the web and React Native**, each with a corresponding `Context` / `Provider`, `useDragState` hook, etc.  On web, it's implemented using [dnd-kit](https://dndkit.com/), whereas on RN, it uses [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler/). But the implementations present an **almost identical** structure and interface to the rest of the system.  

In fact, one of the only real differences is the RN version has to do it's own hit testing to determine what square is being dragged over. Otherwise, the logic is intentionally kept the same.

Web: 
```typescript
  const stateRef = useRef<DnDState>(getDnDState())


  const onDragUpdate = (event: DragMoveEvent) => {

    const pos = (event.over && event.over.data.current) ? event.over.data.current.position : null
    if (pos && stateRef.current.piece) {
          // We've entered a new square
      if (!positionsEqual(pos, stateRef.current.squareOver!)) {
        game.resolveAction({
          piece: stateRef.current.piece, 
          from: stateRef.current.from!, // will be set if piece is
          to: pos
        })
        stateRef.current.setSquareOver(pos)
      }
    }
  }
```

RN:
```typescript
  const stateRef = useRef<DnDState>(getDnDState())


  const onDragUpdate = (e: PanGestureHandlerEventPayload) => {
    if (stateRef.current.piece) {
      const { x, y } = e 
      const pos = squareFromTouchOffset({x, y})
      if (pos) {
          // We've entered a new square
        if (!positionsEqual(pos, stateRef.current.squareOver!)) {
          game.resolveAction({
            piece: stateRef.current.piece, 
            from: stateRef.current.from,  
            to: pos
          })
          stateRef.current.setSquareOver(pos)
        }
      }
    }
  }
```

[return to main doc](./README.md)
