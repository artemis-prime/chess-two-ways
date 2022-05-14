import React from 'react'

import { useDrag } from 'react-dnd'

import { useGameService } from '../domain/GameServiceProvider'
import { SquareState } from '../domain/SquareState'
import type DnDPawn from './DnDPawn'

const Pawn: React.FC<{
  row: number,
  col: number, 
  state: SquareState,
  height: number,
  color: string,
  visible: boolean,
}> = ({
  row,
  col, 
  state,
  height,
  color,
  visible
}) => {
  const game = useGameService()
  const [{ isDragging, canDrag }, drag] = useDrag(() => ({
    type: 'Pawn',
    item: {
      row,
      col,
      state
    } as DnDPawn,
    canDrag: (monitor) => (
      game.currentTurn() === state
    ),
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
      item: monitor.getItem(),
      canDrag: monitor.canDrag()
    }),
  }))

  return (
    <div 
      ref={drag}
      style={{
        opacity: (visible) ? (isDragging ? 0.5 : 1) : 0.3, 
        cursor: canDrag ? (isDragging ? 'move' : 'pointer') : 'default', 
      }}
    >
      <svg

        width={`${height}px`}
        height={`${height}px`}
        viewBox="0 0 700 700"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path fill={color} d="M467.6 446.32h-14c-15.121-50.961-34.16-122.64-47.039-198.24h31.359c20.16 0 36.398-16.238 36.398-36.398s-16.238-36.398-36.398-36.398h-28c19.602-16.801 31.922-41.441 31.922-69.441 0-50.961-41.441-91.84-91.84-91.84-50.402-.004-91.844 41.438-91.844 91.836 0 28 12.879 52.641 31.922 69.441h-28c-20.16 0-36.398 16.238-36.398 36.398 0 20.16 16.238 36.398 36.398 36.398h31.918c-12.879 75.602-31.922 147.28-47.039 198.24h-14c-26.879 0-48.719 21.84-48.719 48.719v35.281c0 8.398 6.719 15.68 15.68 15.68h300.72c8.398 0 15.68-6.719 15.68-15.68v-35.281c-.559-26.875-22.398-48.715-48.719-48.715z" />
      </svg>
  </div>
)
  }
export default Pawn
