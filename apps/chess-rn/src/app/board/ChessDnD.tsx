import React, { 
  useContext, 
  useRef 
} from 'react'
import { LayoutChangeEvent } from 'react-native'

import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
  GestureHandlerRootView 
} from 'react-native-gesture-handler'

import { 
  type Position, 
  RANKS,
  FILES,
  positionsEqual, 
  positionToString,
  layoutPositionToBoardPosition, 
} from '@artemis-prime/chess-core'

import { useGame } from '~/service'

import type Point from './Point'
import {
  type DragState,
  type DnDStateInternal, 
  getDnDStateSingleton
} from './DnDState' 


interface ConfigChessDnD {
  layoutListener:(e: LayoutChangeEvent) => void
  setWhiteOnBottom: (b: boolean) => void 
}

const ConfigChessDnDContext = React.createContext<ConfigChessDnD | undefined>(undefined) 
const ChessDnDContext = React.createContext<DnDStateInternal | undefined>(undefined) 

const useConfigChessDnD = (): ConfigChessDnD => (
  useContext(ConfigChessDnDContext) as ConfigChessDnD
)

const useDragState = (): DragState => (
  useContext(ChessDnDContext) as DragState
)

const ChessDnDShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  
  const dimensionsRef = useRef<Point | null>(null)
  const stateRef = useRef<DnDStateInternal>(getDnDStateSingleton())

  const whiteOnBottomRef = useRef<boolean>(true)
  const setWhiteOnBottom = (b: boolean): void => { 
    whiteOnBottomRef.current = b 
  }
  const game = useGame()

  const squareFromTouchOffset = (pt: Point): Position | null => {

    if (!dimensionsRef.current 
      || 
      (pt.x < 0 && pt.x > dimensionsRef.current.x) 
      || 
      (pt.y < 0 && pt.y > dimensionsRef.current.y)
    ) {
      return null
    }

    const columnWidth = dimensionsRef.current.x / FILES.length
    const rowHeight = dimensionsRef.current.y / RANKS.length
    const column = Math.floor(pt.x / columnWidth) 
    const row = Math.floor(pt.y / rowHeight)
    return layoutPositionToBoardPosition(row, column, !(whiteOnBottomRef.current))
  }

  const layoutListener = (
    {nativeEvent: { layout: { width, height }}}: LayoutChangeEvent
  ): void  => {
    dimensionsRef.current = { x: width, y: height }
  }

  const onDragStart = (e: PanGestureHandlerEventPayload) => {

    const { x, y } = e
    const p = squareFromTouchOffset({x, y})
    if (!p) {
      return 
    }

    const piece = game.pieceAt(p)
    if (piece) {
      if (game.currentTurn === piece.color) {
        stateRef.current.setPiece(piece)
        stateRef.current.setFrom(p)
      }
    }
    else {
      console.warn('onStartDragging: no piece in ' + positionToString(p))
    }
  }

  const onDragUpdate = (e: PanGestureHandlerEventPayload) => {
    if (stateRef.current.piece) {
      const { x, y } = e 
      stateRef.current.setOffset({x, y})
      const p = squareFromTouchOffset({x, y})
      if (p) {
        if (!positionsEqual(p, stateRef.current.squareOver!)) {
          game.resolveAction({
            piece: stateRef.current.piece!, 
            from: stateRef.current.from!,  // from is there if piece is
            to: p
          })
          stateRef.current.setSquareOver(p)
        }
      }
    }
  }

  const onDragEnd = (e: PanGestureHandlerEventPayload, succeeded: boolean) => {

    if (succeeded) {
      game.takeResolvedAction()
    }
    else {
      game.endResolution()
    }
    stateRef.current.clear()
  }

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(onDragStart)
    .onUpdate(onDragUpdate)
    .onEnd(onDragEnd);

    // Need GestureHandlerRootView due to a bug.
    // Not documented
  return (
    <GestureHandlerRootView >
    <ConfigChessDnDContext.Provider value={{
      layoutListener,
      setWhiteOnBottom
    }}>
    <ChessDnDContext.Provider value={stateRef.current}>
      <GestureDetector gesture={dragGesture}>
        {children}
      </GestureDetector>
    </ChessDnDContext.Provider>
    </ConfigChessDnDContext.Provider>
    </GestureHandlerRootView>
  )
}

export {
  ChessDnDShell,
  useDragState,
  useConfigChessDnD,
}