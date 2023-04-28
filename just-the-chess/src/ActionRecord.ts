import type Piece from './Piece'
import { 
  type PrimaryPieceType, 
  pieceToString, 
  pieceFromString,
  PIECE_TYPE_NAMES,
  PIECETYPE_FROM_LETTER, 
  type PieceTypeCode,
  type PieceType,
  opponent
} from './Piece'
import type Move from './Move'
import type Action from './Action'
import { positionToString, positionFromString } from './Position'

  // Describes a change of state.
  // Must contain enough info to undo and redo the state change
interface ActionRecord extends Move {
  action: Action
    // Both are needed to 'undo' or 'redo' a 'capturePromote' Action.
    // Required if action is 'capture'. Needed for 'undo' 
  captured?: Piece
    // Required if action is 'promote'. Needed for 'redo' 
  promotedTo?: PrimaryPieceType 
}


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
        `x${PIECE_TYPE_NAMES[r.captured!.type].short}${positionToString(r.to)}`
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
    case 'capturePromote':
      str += verbose ?
        `captures ${r.captured!.type} and is promoted to a ${r.promotedTo} at (${positionToString(r.to)})`
        :
        `x${PIECE_TYPE_NAMES[r.captured!.type].short}${positionToString(r.to)}=${PIECE_TYPE_NAMES[r.promotedTo!].short}`
    break
  } 
  return str
}

const lanToActionRecord = (lan: string, note?: any): ActionRecord => {

  const castleRecordIfCastle = (): ActionRecord | undefined => {
    if (!lan.includes('0-0')) return undefined

    const toFile = lan.includes('0-0-0') ? 'c' : 'g'
    const color = (lan.charAt(0) === 'w') ? 'white' : 'black'
    const rank = (color === 'white') ? 1 : 8
    return {
      piece: {type: 'king', color},
      to: {rank, file: toFile},  
      from: {rank, file: 'e'},
      action: 'castle'
    }
  }

  const castleRecord = castleRecordIfCastle()
  if (castleRecord) return castleRecord

  const piece = pieceFromString(lan.slice(0,2))
  const from = positionFromString(lan.slice(2,4))
  const isCapture = lan.charAt(4) === 'x'
  const captured = isCapture ? {type: PIECETYPE_FROM_LETTER[lan.charAt(5) as PieceTypeCode] as PieceType, color: opponent(piece!.color)} : undefined
  const toPositionIndex = (isCapture) ? 6 : 4
  const to = positionFromString(lan.slice(toPositionIndex,toPositionIndex + 2))
  const isPromote = lan.charAt(toPositionIndex + 2) === '='
  const promotedTo = (isPromote) ? PIECETYPE_FROM_LETTER[lan.charAt(toPositionIndex + 3) as PieceTypeCode] as PrimaryPieceType : undefined

  if (!piece) throw new Error('lanToActionRecord(): error parsing piece! (note: ' + note.toString() + ')')
  if (!from) throw new Error('lanToActionRecord(): error parsing from poistion! (note: ' + note.toString() + ')')
  if (!to) throw new Error('lanToActionRecord(): error parsing to poistion! (note: ' + note.toString() + ')')

  let action: Action
  if (isCapture) {
    action = isPromote ? 'capturePromote' : 'capture' 
  }
  else {
    action = isPromote ? 'promote' : 'move'
  }

  return {piece, to, from, action, captured, promotedTo}
}

export { type ActionRecord as default, actionRecordToLAN, lanToActionRecord }
