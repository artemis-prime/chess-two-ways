import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import type { Position, Piece } from '@artemis-prime/chess-core'
import { FILES, positionsEqual } from '@artemis-prime/chess-core'

import { useGame } from './GameProvider'
import PieceComponent from './Piece'
import { useUIState } from './UIState'
import { type DraggingPiece, DRAGGING_PIECE } from './DraggingPiece'

const SquareComponent: React.FC<{ 
  position: Position
  piece?: Piece | null
}> = observer(({ 
  position : pos,
  piece
}) => {

  const game = useGame()
  const uiState = useUIState()
  const [rookSquareCastling, setRookSquareCastling] = useState<'from' | 'to' | null>(null)
  const [inCheckFromHere, setInCheckFromHere] = useState<boolean>(false)
  const [kingInCheckHere, setKingInCheckHere] = useState<boolean>(false)

  const [props, drop] = useDrop(
    () => ({
      accept: DRAGGING_PIECE,
      drop: (item: DraggingPiece, monitor) => { game.takeResolvedAction()},
      canDrop: (item: DraggingPiece, monitor) => {
        return !!game.resolveAction({piece: item.piece, from: item.from, to: pos}); 
      },
    }),
    [pos]
  )

  useEffect(() => {
    let imACastlingRookSquare: 'from' | 'to' | null = null
    if (uiState.action === 'castle') {

      if (positionsEqual(pos, uiState.note.rooks.from)) {
        imACastlingRookSquare = 'from'  
      } 
      else if (positionsEqual(pos, uiState.note.rooks.to)) {
        imACastlingRookSquare = 'to'  
      }
    } 
    setRookSquareCastling(imACastlingRookSquare) 
  }, [uiState.action, pos] )

  useEffect(() => {
    const kingInCheckHere_ = !!uiState.kingInCheck && (uiState.kingInCheck.file === pos.file && uiState.kingInCheck.rank === pos.rank)
    if (kingInCheckHere_ !== kingInCheckHere) {
      setKingInCheckHere(kingInCheckHere_)
    }
    const inCheckFromMe = !!uiState.inCheckFrom.find((e) => (e.file === pos.file && e.rank === pos.rank)) 
    if (inCheckFromHere != inCheckFromMe) {
      setInCheckFromHere(inCheckFromMe) 
    }
  },[uiState.inCheckFrom, uiState.kingInCheck])

  let effectClass = ''

  if (uiState.action && positionsEqual(uiState.note.to, pos)) {
    if (uiState.action === 'capture') {
      effectClass = 'capture' 
    }
    else if (uiState.action && uiState.action.includes('promote')) {
      effectClass = 'promote' 
    }
      // castle in this case means we're the king's pos (not the rooks')
    else if (uiState.action === 'move' || (uiState.action === 'castle' && !rookSquareCastling)) {
      effectClass = 'move-or-castle'
    }
  }
  else if (rookSquareCastling) {
    effectClass = `castling-rook ${rookSquareCastling}`
  } 

  if (kingInCheckHere) {
    effectClass = 'in-check in-check-king'
  }
  else if (inCheckFromHere) {
    effectClass = 'in-check in-check-from'
  }

  return (
    <div 
      ref={drop}
      style={{ position: 'relative' }}
      className={`square rank-${pos.rank} rank-${(pos.rank % 2) ? 'odd' : 'even'} ` +
        `file-${pos.file} file-${(FILES.indexOf(pos.file) % 2) ? 'even' : 'odd'}` 
      }
    >
      <div  
        style={{
          position: 'absolute', 
          top: 0, 
          bottom: 0, 
          left: 0, 
          right: 0,
          display: 'flex',
          justifyContent: 'center', 
          alignItems: 'center', 
        }} 
        className={`effects ${effectClass}`}
      >
      {(!!piece) && (
        <PieceComponent position={pos} piece={piece} />  
      )}
      </div>
    </div>  
  )
})

export default SquareComponent
