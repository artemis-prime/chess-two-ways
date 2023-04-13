import React, { useState, useContext, useEffect, useRef } from 'react'
import { LayoutChangeEvent } from 'react-native'

import {
  Gesture,
  GestureDetector,
  PanGestureHandlerEventPayload,
  GestureHandlerRootView // must have this due to bug
} from 'react-native-gesture-handler'

import { 
  type Position, 
  type Piece, 
  type Action,
  positionsEqual, 
  positionToString 
} from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'

interface DnDPayload {
  piece: Piece
  from: Position
}

interface Point {
  x: number,
  y: number
}

interface DnDConfig {
  numRows: number 
  numColumns: number
  rowAndColumnToPosition: (row: number, column: number) => Position
}

  // Should be enough for the UI to give feedback based on these values.
  // (TODO: Consider making this an array of possibly coincident statuses)
  // * Action means the square resolves to that Action. 
  // * 'invalid' means a drag is over a square but there's no valid Action.
  // * 'none' means there is no drag or it's not over this square
type SquaresDndStatus = Action | 'origin' | 'invalid' | 'none'

interface ChessDragAndDrop {
  onLayout:(e: LayoutChangeEvent) => void
  getSquaresDnDStatus: (p: Position) => SquaresDndStatus
  payload: DnDPayload | null
  touchOffest: Point | null
}

interface DragAndDropInteral extends ChessDragAndDrop {
  config: (c: DnDConfig) => void
}

const DragAndDropContext = React.createContext<DragAndDropInteral | undefined>(undefined) 

const useChessDnD = (c: DnDConfig): ChessDragAndDrop =>  {
  const dnd = useContext(DragAndDropContext) as DragAndDropInteral
  useEffect(() => {
    dnd?.config(c)
  }, [c.numColumns, c.numRows, c.rowAndColumnToPosition])
  return dnd as ChessDragAndDrop
}

const ChessDnD: React.FC<React.PropsWithChildren> = ({ children }) => {
  
  const [payload, setPayload] = useState<DnDPayload | null>(null)
  const [boardDimensions, setBoardDimensions] = useState<Point | null>(null)
  const [squareOver, setSquareOver] = useState<Position | null>(null)
  const [resolvedAction, setResolvedAction] = useState<Action | null>(null)
  const [touchOffest, setTouchOffest] = useState<Point | null>(null)

  const configRef = useRef<DnDConfig>()

  const config = (c: DnDConfig): void => {
    configRef.current = c
  }

  const game = useGame()

  const squareFromTouchOffset = (pt: Point): Position | null => {

    if (!configRef.current) {
      throw new Error('DragAndDropProvider.squareFromTouchOffset(): Must call config() before use!')
    }
    if (!boardDimensions 
      || 
      (pt.x < 0 && pt.x > boardDimensions.x) 
      || 
      (pt.y < 0 && pt.y > boardDimensions.y)
    ) {
      return null
    }

    const {numRows, numColumns, rowAndColumnToPosition} = configRef.current

    const columnWidth = boardDimensions.x / numColumns
    const rowHeight = boardDimensions.y / numRows
    const column = Math.floor(pt.x / columnWidth) 
    const row = Math.floor(pt.y / rowHeight)
    return rowAndColumnToPosition(row, column)
  }

  const onLayout = ({nativeEvent: { layout: {width, height}}}: LayoutChangeEvent): void  => {
    setBoardDimensions({ x: width, y: height })
  }

  const onStartDragging = (e: PanGestureHandlerEventPayload) => {

    const { x, y } = e
    const p = squareFromTouchOffset({x, y})
    if (!p) return 

    const piece = game.pieceAt(p)
    if (piece) {
      if (game.currentTurn === piece.color) {
        setPayload({
          piece,
          from: p
        })
      }
    }
    else {
      console.warn('onStartDragging: no piece in ' + positionToString(p))
    }
  }

  const onDragging = (e: PanGestureHandlerEventPayload) => {
    if (payload) {
      const { x, y } = e 
      const p = squareFromTouchOffset({x, y})
      if (p) {
        if (!positionsEqual(p, squareOver!)) {
          setResolvedAction(game.resolveAction({piece: payload.piece, from: payload.from, to: p}))
          setSquareOver(p)
        }
      }
      setTouchOffest({x, y})
    }
  }

  const onDragEnd = (e: PanGestureHandlerEventPayload) => {
    if (resolvedAction) {
      game.takeResolvedAction()
    }
    else {
      game.endResolution()
    }
    setResolvedAction(null)
    setPayload(null)
    setSquareOver(null)
  }

  const dragGesture = Gesture.Pan()
    .runOnJS(true)
    .onStart(onStartDragging)
    .onUpdate(onDragging)
    .onEnd(onDragEnd);

  const getSquaresDnDStatus = (p: Position): SquaresDndStatus => {

    if (payload && positionsEqual(payload.from, p)) {
      return 'origin'
    }
    if (payload && squareOver && positionsEqual(squareOver, p)) {
      if (resolvedAction) {
        return resolvedAction
      }
      else {
        return 'invalid'
      }
    }
    return 'none'
  }

  return (
    <GestureHandlerRootView >
    <DragAndDropContext.Provider value={{
      onLayout,
      getSquaresDnDStatus,
      payload,
      touchOffest,
      config
    }}>
      <GestureDetector gesture={dragGesture}>
        {children}
      </GestureDetector>
    </DragAndDropContext.Provider>
    </GestureHandlerRootView>
  )
}

export {
  ChessDnD,
  useChessDnD,
  type ChessDragAndDrop,
  type DnDPayload,
  type SquaresDndStatus,
  type Point,
}