import React, { useEffect, useState } from 'react'
import { observer } from 'mobx-react'
import { useDrop } from 'react-dnd'

import type { Square, Piece } from '@artemis-prime/chess-domain'
import { FILES, squaresEqual } from '@artemis-prime/chess-domain'

import { useGame } from './GameProvider'
import PieceComponent from './Piece'
import { useVisualFeedback } from './VisualFeedback'
import { type DnDPiece, DND_ITEM_NAME } from './DnDPiece'

const SquareComponent: React.FC<{ 
  square: Square
  piece?: Piece | null
}> = observer(({ 
  square,
  piece
}) => {

  const game = useGame()
  const feedback = useVisualFeedback()
  const [rookSquareCastling, setRookSquareCastling] = useState<'from' | 'to' | null>(null)
  const [inCheckFromHere, setInCheckFromHere] = useState<boolean>(false)
  const [kingInCheckHere, setKingInCheckHere] = useState<boolean>(false)
  const [dimPiece, setDimPiece] = useState<boolean>(false)

  const [props, drop] = useDrop(
    () => ({
      accept: DND_ITEM_NAME,
      drop: (item: DnDPiece, monitor) => { game.takeAction(item.piece, item.from, square)},
      canDrop: (item: DnDPiece, monitor) => {
        return !!game.resolveAction(item.piece, item.from, square); 
      },
      //collect: (monitor) => ({isOver: (!!monitor.isOver())})
    }),
    [square]
  )

  useEffect(() => {
    let imACastlingRookSquare: ('from' | 'to' | null) = null
    if (feedback.action === 'castle') {

      const homeRank = (feedback.note.from.piece?.color === 'white') ? 1 : 8
        // Which pair of Files (['from', 'to']), correspond to the rook involved?
      const rookFilesInvolved = (feedback.note.to.file === 'g') ? ['h', 'f'] : ['a', 'd']  
      
      if ((square.rank === homeRank) && rookFilesInvolved.includes(square.file)) {
        imACastlingRookSquare = (square.file === rookFilesInvolved[0]) ? 'from' : 'to'  
      } 
    } 
    setRookSquareCastling(imACastlingRookSquare) 
  }, [feedback.action, square] )

  useEffect(() => {
    const kingInCheckHere_ = !!feedback.kingInCheck && (feedback.kingInCheck.file === square.file && feedback.kingInCheck.rank === square.rank)
    if (kingInCheckHere_ !== kingInCheckHere) {
      setKingInCheckHere(kingInCheckHere_)
    }
    const inCheckFromMe = !!feedback.inCheckFrom.find((e) => (e.file === square.file && e.rank === square.rank)) 
    if (inCheckFromHere != inCheckFromMe) {
      setInCheckFromHere(inCheckFromMe) 
    }
  },[feedback.inCheckFrom, feedback.kingInCheck])

  let effectClass = ''

  if (feedback.action && squaresEqual(feedback.note.to, square)) {
    if (feedback.action === 'capture') {
      effectClass = 'capture' 
    }
    else if (feedback.action && feedback.action.includes('promote')) {
      effectClass = 'promote' 
    }
      // castle in this case means we're the king's square (not the rooks')
    else if (feedback.action === 'move' || (feedback.action === 'castle' && !rookSquareCastling)) {
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
      style={{
        position: 'relative'
      }}
      className={`square rank-${square.rank} rank-${(square.rank % 2) ? 'odd' : 'even'} ` +
        `file-${square.file} file-${(FILES.indexOf(square.file) % 2) ? 'even' : 'odd'}` 
      }
    >
      <div  style={{
        position: 'absolute', 
        top: 0, 
        bottom: 0, 
        left: 0, 
        right: 0,
        //backgroundColor: 'grey'
        //border: '1px orange solid',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems: 'center', 
      }} 
      className={`effects ${effectClass}`}
      >

      {(!!piece) && (
        <PieceComponent square={square} piece={piece} />  
      )}
      </div>
    </div>  
  )
})

export default SquareComponent
