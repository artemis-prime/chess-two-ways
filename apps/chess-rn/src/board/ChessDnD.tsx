import React, { 
  useContext, 
//  useEffect, 
  useRef 
} from 'react'
import { LayoutChangeEvent } from 'react-native'
//import { autorun } from 'mobx'

import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
  GestureHandlerRootView // must have this due to bug
} from 'react-native-gesture-handler'

import { 
  type Position, 
  RANKS,
  FILES,
  positionsEqual, 
  positionToString,
  layoutPositionToBoardPosition, 
//  pieceToString
} from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'

import type Point from './Point'
import {type DnDState, type DnDStateInternal, getDnDStateSingleton} from './DnDState' 


interface ConfigChessDnD {
  layoutListener:(e: LayoutChangeEvent) => void
  setWhiteOnBottom: (b: boolean) => void 
}

const ConfigChessDnDContext = React.createContext<ConfigChessDnD | undefined>(undefined) 
const ChessDnDContext = React.createContext<DnDStateInternal | undefined>(undefined) 

const useConfigChessDnD = (): ConfigChessDnD => (
  useContext(ConfigChessDnDContext) as ConfigChessDnD
)

const useChessDnD = (): DnDState => (
  useContext(ChessDnDContext) as DnDState
)

const ChessDnDShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  
  const dimensionsRef = useRef<Point | null>(null)
  const stateRef = useRef<DnDStateInternal>(getDnDStateSingleton())

  const whiteOnBottomRef = useRef<boolean>(true)
  const setWhiteOnBottom = (b: boolean): void => { 
    //console.warn("WHITE ON BOTTOM: " + b)
    whiteOnBottomRef.current = b 
  }
  const game = useGame()

  /*
  useEffect(() => {
    return autorun(() => {
      console.warn('offset: ' + stateRef.current.offset?.y)
    })
  })
  */

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

  const onStartDragging = (e: PanGestureHandlerEventPayload) => {
    //console.warn("START DRAG")

    const { x, y } = e
    const p = squareFromTouchOffset({x, y})
    if (!p) {
      //console.warn("CANNOT DETERMINE SQUARE")
      return 
    }

    const piece = game.pieceAt(p)
    if (piece) {
      //console.warn("FOUND PIECE: " + pieceToString(piece))
      if (game.currentTurn === piece.color) {
        //console.warn("SETTING PAYLOAD")
        stateRef.current.setPayload(piece, p)
      }
    }
    else {
      console.warn('onStartDragging: no piece in ' + positionToString(p))
    }
  }

  const onDragging = (e: PanGestureHandlerEventPayload) => {
    if (stateRef.current.payload) {
      const { x, y } = e 
      stateRef.current.setOffset({x, y})
      //console.warn("DRAG: " + y)
      const p = squareFromTouchOffset({x, y})
      if (p) {
        if (!positionsEqual(p, stateRef.current.squareOver!)) {
          stateRef.current.setResolvedAction(
            game.resolveAction({
              piece: stateRef.current.payload.piece, 
              from: stateRef.current.payload.from, 
              to: p
            })
          )
          stateRef.current.setSquareOver(p)
        }
      }
    }
  }

  const onDragEnd = (e: PanGestureHandlerEventPayload) => {
    if (stateRef.current.resolvedAction) {
      game.takeResolvedAction()
    }
    else {
      game.endResolution()
    }
    stateRef.current.clear()
  }

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(onStartDragging)
    .onUpdate(onDragging)
    .onEnd(onDragEnd);

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
  useChessDnD,
  useConfigChessDnD,
}