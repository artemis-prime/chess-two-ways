import { squareToString } from '../Square'
import { pieceToString, PIECE_TYPE_NAMES } from '../Piece'
import type ActionDescriptor from './ActionDescriptor'

// Something like "long algebraic notation" cf: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
const actionDescToString = (r: ActionDescriptor, verbose?: boolean): string => {

  if (r.action === 'castle') {
    return verbose ? 
      `${r.piece.color} castles ${r.to.file === 'g' ? 'kingside' : 'queenside'}`
      :
      `${r.piece.color === 'white' ? 'w' : 'b'}${r.to.file === 'g' ? '0-0' : '0-0-0'}`
  }

  let str = verbose ? 
    `${pieceToString(r.piece, 'color Type')} (${squareToString(r.to)}) `
    :
    pieceToString(r.piece, 'cT') + squareToString(r.from)

  switch (r.action) {
    case 'capture':
      str += verbose ?
        `captures ${r.captured!.type} (${squareToString(r.to)})`
        :
        `x${squareToString(r.to)}`
    break
    case 'move':
      str += verbose ?
        `moves to ${squareToString(r.to)}`
        :
        squareToString(r.to)
    break
    case 'promote':
      str += verbose ?
        `is promoted to a ${r.promotedTo} at (${squareToString(r.to)})`
        :
        `${squareToString(r.to)}=${PIECE_TYPE_NAMES[r.promotedTo].short}`
    break
    case 'capture-promote':
      str += verbose ?
        `captures ${r.captured!.type} and is promoted to a ${r.promotedTo} at (${squareToString(r.to)})`
        :
        `x${squareToString(r.to)}=${PIECE_TYPE_NAMES[r.promotedTo].short}`
    break
  } 
  return str
}


export {
  actionDescToString,
}