import React, { 
  useContext, 
  useRef 
} from 'react'

import { 
  DndContext, 
  DragStartEvent,
  DragEndEvent,
  DragCancelEvent,
  DragMoveEvent,
} from '@dnd-kit/core'

import { positionsEqual, ObsPieceRef } from '@artemis-prime/chess-core'

import { useGame } from '~/service'

import {type DnDStateInternal, getDnDStateSingleton} from './DnDState' 
import type DnDPayload from './DnDPayload'

const ChessDnDContext = React.createContext<DnDStateInternal | undefined>(undefined) 

const useDraggingPiece = (): ObsPieceRef => (
  useContext(ChessDnDContext) as ObsPieceRef
)

const ChessDnDShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  
  const stateRef = useRef<DnDStateInternal>(getDnDStateSingleton())
  const game = useGame()

  const onDragStart = (event: DragStartEvent) => {
    stateRef.current.setPayload(event.active.data.current as DnDPayload)
    //console.log('drag started: ' + event.active.data.current?.piece.type)
  }

  const onDragEnd = (event: DragEndEvent) => {
    const taken = game.takeResolvedAction()
    stateRef.current.clear()
    //console.log(`drag ended: ${!taken ? 'NO ' : ''}action taken`)
  }

  const onDragMove = (event: DragMoveEvent) => {

    const pos = (event.over && event.over.data.current) ? event.over.data.current.position : null
    if (pos && stateRef.current.piece) {
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

  const onDragCancel = (event: DragCancelEvent) => {
    game.endResolution()
    stateRef.current.clear()
    //console.log('drag cancelled, NO action taken')
  }

  return (
    <ChessDnDContext.Provider value={stateRef.current}>
    <DndContext
      onDragStart={onDragStart}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
    >
      {children}
    </DndContext>
    </ChessDnDContext.Provider>
  )
}

export {
  ChessDnDShell,
  useDraggingPiece,
}