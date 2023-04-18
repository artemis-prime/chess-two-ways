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

import { positionsEqual } from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'

import {type DnDState, type DnDStateInternal, getDnDStateSingleton} from './DnDState' 
import type DnDPayload from './DnDPayload'

const ChessDnDContext = React.createContext<DnDStateInternal | undefined>(undefined) 

const useChessDnD = (): DnDState => (
  useContext(ChessDnDContext) as DnDState
)

const ChessDnDShell: React.FC<React.PropsWithChildren> = ({ children }) => {
  
  const stateRef = useRef<DnDStateInternal>(getDnDStateSingleton())
  const game = useGame()

  const onDragStart = (event: DragStartEvent) => {
    stateRef.current.setPayload(event.active.data.current as DnDPayload)
    console.log('drag started: ' + event.active.data.current?.piece.type)
  }

  const onDragEnd = (event: DragEndEvent) => {
    if (stateRef.current.resolvedAction) {
      game.takeResolvedAction()
      console.log('drag ended, action taken')
    }
    else {
      console.log('drag ended, NO action taken')
      game.endResolution()
    }
    stateRef.current.clear()
  }

  const onDragMove = (event: DragMoveEvent) => {

    const pos = (event.over && event.over.data.current) ? event.over.data.current.position : null
    if (pos && stateRef.current.payload) {
      if (!positionsEqual(pos, stateRef.current.squareOver!)) {
        stateRef.current.setResolvedAction(
          game.resolveAction({
            piece: stateRef.current.payload.piece, 
            from: stateRef.current.payload.from, 
            to: pos
          })
        )
        stateRef.current.setSquareOver(pos)
      }
    }
  }

  const onDragCancel = (event: DragCancelEvent) => {
    console.log('drag cancelled, NO action taken')
    game.endResolution()
    stateRef.current.clear()
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
  useChessDnD,
}