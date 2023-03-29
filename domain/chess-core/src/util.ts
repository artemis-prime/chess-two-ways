import { positionToString } from './Position'
import { pieceToString, PIECE_TYPE_NAMES } from './Piece'
import type ActionRecord from './ActionRecord'

// Something like "long algebraic notation" cf: https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
const actionRecordToLAN = (r: ActionRecord, verbose?: boolean): string => {

  if (r.action === 'castle') {
    return verbose ? 
      `${r.piece.color} castles ${r.to.file === 'g' ? 'kingside' : 'queenside'}`
      :
      `${r.piece.color === 'white' ? 'w' : 'b'}${r.to.file === 'g' ? '0-0' : '0-0-0'}`
  }

  let str = verbose ? 
    `${pieceToString(r.piece, 'color Type')} (${positionToString(r.to)}) `
    :
    pieceToString(r.piece, 'cT') + positionToString(r.from)

  switch (r.action) {
    case 'capture':
      str += verbose ?
        `captures ${r.captured!.type} (${positionToString(r.to)})`
        :
        `x${positionToString(r.to)}`
    break
    case 'move':
      str += verbose ?
        `moves to ${positionToString(r.to)}`
        :
        positionToString(r.to)
    break
    case 'promote':
      str += verbose ?
        `is promoted to a ${r.promotedTo} at (${positionToString(r.to)})`
        :
        `${positionToString(r.to)}=${PIECE_TYPE_NAMES[r.promotedTo!].short}`
    break
    case 'capture-promote':
      str += verbose ?
        `captures ${r.captured!.type} and is promoted to a ${r.promotedTo} at (${positionToString(r.to)})`
        :
        `x${positionToString(r.to)}=${PIECE_TYPE_NAMES[r.promotedTo!].short}`
    break
  } 
  return str
}


export {
  actionRecordToLAN,
}