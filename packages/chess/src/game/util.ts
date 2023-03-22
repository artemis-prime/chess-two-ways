import type BoardSquare from '../BoardSquare'
import type Square from '../Square'
import type ActionDescriptor from './ActionDescriptor'

const actionRecordToLogString = (r: ActionDescriptor): string => {

  if (r.action === 'castle') {
    return `${r.piece.color} castles ${r.to.file === 'g' ? 'kingside' : 'queenside'}`
  }
  let log = `${r.piece.color} ${r.piece.type} (${r.from.rank}${r.from.file}) `
  switch (r.action) {
    case 'capture':
      log += `captures ${r.captured!.type} (${r.to.rank}${r.to.file})`
    break
    case 'move':
      log += `moves to ${r.to.rank}${r.to.file}`
    break
    case 'promote':
      log += `is promoted to a ${r.promotedTo!} at ${r.to.rank}${r.to.file}`
    break
    case 'capture-promote':
      log += `captures ${r.captured!.type} and is promoted to a ${r.promotedTo!} at ${r.to.rank}${r.to.file}`
    break
  } 
  return log
}

const _boardSquareToString = (sq: any /* cheating */ ): string => (
  `(${sq.piece ? ((sq.piece.color === 'white' ? 'w-' : 'b-') + sq.piece.type.slice(0, 2)) + ': ' : ''}${sq.file}, ${sq.rank})`  
)

const boardSquareToString = (s: Square | Square[]): string => {
  let result = ''
  if (Array.isArray(s)) {
    result += '['
    for (let sq of s) {
      result += _boardSquareToString(sq)
    }
    result += ']'
  }
  else {
    result = _boardSquareToString(s)
  }
  return result
}



export {
  actionRecordToLogString,
  boardSquareToString
}